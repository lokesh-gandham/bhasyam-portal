/* ============================================================
   SHARED HELPERS (audio / confetti / final popup)
   ============================================================ */
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const finalPopup = document.getElementById("finalPopup");
const finalTitle = document.getElementById("finalTitle");
const finalScoreEl = document.getElementById("finalScore");
const starsEl = document.getElementById("stars");
const playAgainBtn = document.getElementById("playAgainBtn");


function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}


function smallConfetti(colors) {
    confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        scalar: 0.8,
        colors: colors || undefined
    });
}

function bigConfetti() {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 300);
}

function showFinalPopup(title, score, total) {
    finalTitle.textContent = title;
    finalScoreEl.textContent = `Your Score: ${score} / ${total}`;
    starsEl.textContent = "⭐".repeat(score);
    finalPopup.style.display = "flex";
    playCorrect();
    // Big confetti celebration
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 300);
}

playAgainBtn.onclick = () => location.reload();

/* ============================================================
   OPPOSITES CROSSWORD
   ============================================================ */
/* Grid coordinates are 0-indexed [row, col] */
const cwWords = [
    {
        id: "young",
        dir: "down",
        row: 0,
        col: 5,
        answer: "YOUNG",
        clue: "Old",
        number: 1,
        prefilled: [0, 2]          // Y,U
    },

    {
        id: "careful",
        dir: "across",
        row: 2,
        col: 0,
        answer: "CAREFUL",
        clue: "Careless",
        number: 2,
        prefilled: [0, 1, 5, 6]      // C,A,U,L
    },

    {
        id: "start",
        dir: "down",
        row: 0,
        col: 1,
        answer: "START",
        clue: "Finish",
        number: 3,
        prefilled: [0, 4]          // S,T
    },

    {
        id: "ugly",
        dir: "across",
        row: 4,
        col: 4,
        answer: "UGLY",
        clue: " Beautiful",
        number: 4,
        prefilled: [1, 3]          // G,Y
    }
];

const ROWS = 5, COLS = 8;
const cwCells = {}; // key "r,c" -> { row, col, letter, wordIds:[], number, el, input }
const cellInputs = new Map(); // key "r,c" -> input element (used for focus movement)

function cellKey(r, c) { return `${r},${c}`; }

function wordCells(word) {
    const cells = [];
    for (let i = 0; i < word.answer.length; i++) {
        const r = word.dir === "down" ? word.row + i : word.row;
        const c = word.dir === "across" ? word.col + i : word.col;
        cells.push({
            r,
            c,
            letter: word.answer[i],
            prefilled: word.prefilled?.includes(i)
        });
    }
    return cells;
}

// Build cell map
cwWords.forEach(word => {
    wordCells(word).forEach(({ r, c, letter }) => {
        const key = cellKey(r, c);
        if (!cwCells[key]) {
            cwCells[key] = { row: r, col: c, letter, wordIds: [] };
        }
        cwCells[key].wordIds.push(word.id);
    });
});

// Assign numbers to starting cells
cwWords.forEach(word => {
    const key = cellKey(word.row, word.col);
    cwCells[key].number = word.number;
});

// primary word per cell: prefer "across" word if present, else the single (down) word
function primaryWordId(key) {
    const cell = cwCells[key];
    const across = cwWords.find(w => w.dir === "across" && cell.wordIds.includes(w.id));
    return across ? across.id : cell.wordIds[0];
}

// Given a word id, returns the first cell in that word that is both
// editable (not pre-filled) and currently empty — or null if none exists
// (e.g. the word is fully filled/locked).
function firstEditableEmptyCell(wordId) {
    const word = cwWords.find(w => w.id === wordId);
    if (!word) return null;
    const cells = wordCells(word);
    return cells.find(cell => {
        const ci = cwCells[cellKey(cell.r, cell.c)];
        return ci.input.dataset.prefilled !== "true" && !ci.input.value;
    }) || null;
}

const cwGridEl = document.getElementById("cwGrid");
cwGridEl.style.gridTemplateColumns = `repeat(${COLS}, auto)`;
cwGridEl.style.gridTemplateRows = `repeat(${ROWS}, auto)`;

let activeWordId = null;
const solvedWords = new Set();

for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const key = cellKey(r, c);
        const cellData = cwCells[key];
        const cellDiv = document.createElement("div");

        if (!cellData) {
            cellDiv.className = "cw-cell empty";
            cwGridEl.appendChild(cellDiv);
            continue;
        }

        cellDiv.className = "cw-cell";
        cellDiv.style.gridRow = r + 1;
        cellDiv.style.gridColumn = c + 1;

        if (cellData.number) {
            const num = document.createElement("span");
            num.className = "cw-number";
            num.textContent = cellData.number;
            cellDiv.appendChild(num);
        }

        // Direction arrow(s) for any word(s) that start at this cell,
        // mirroring the little "enter here" arrows from the reference image.
        cwWords.forEach(w => {
            if (w.row === r && w.col === c) {
                const arrow = document.createElement("span");
                arrow.className = `cw-arrow cw-arrow-${w.dir === "down" ? "down" : "across"}`;
                arrow.textContent = w.dir === "down" ? "↓" : "→";
                cellDiv.appendChild(arrow);
            }
        });

        const input = document.createElement("input");
        const currentWord = cwWords.find(w =>
            w.id === primaryWordId(key)
        );

        const cellInfo = wordCells(currentWord).find(
            x => x.r === r && x.c === c
        );

        if (cellInfo?.prefilled) {
            input.value = cellInfo.letter;
            input.dataset.prefilled = "true";
            input.classList.add("prefilled");
            input.readOnly = true;
            // Remove pre-filled boxes from the tab order too, so keyboard
            // navigation can never land focus on them either.
            input.tabIndex = -1;
        }
        input.maxLength = 1;
        input.autocomplete = "off";
        input.dataset.row = r;
        input.dataset.col = c;

        // ---- Flicker-free redirect for pre-filled / already-filled cells ----
        // This runs on mousedown, BEFORE the browser assigns focus to the
        // clicked element. If the clicked cell isn't the word's first
        // editable empty box, we preventDefault() so the browser never
        // focuses the clicked cell at all, and focus the correct target
        // directly instead. Result: the clicked (pre-filled/filled) cell
        // never receives the active background, focus ring, or caret —
        // not even for a single frame.
        input.addEventListener("mousedown", (e) => {
            const wordId = primaryWordId(key);

            // If the whole word is already solved/locked, do nothing special —
            // let the default click/focus behavior happen as normal.
            if (solvedWords.has(wordId)) return;

            const target = firstEditableEmptyCell(wordId);

            // No editable empty cell left in this word (fully filled but not
            // yet validated as solved) — don't redirect, just let it focus.
            if (!target) return;

            const targetInput = cellInputs.get(cellKey(target.r, target.c));
            if (targetInput && targetInput !== input) {
                e.preventDefault();
                activeWordId = wordId;
                targetInput.focus();
                targetInput.select();
            }
            // else: the clicked cell IS the target — let default focus proceed.
        });

      input.addEventListener("focus", () => {
    const candidate = primaryWordId(key);

    if (!(activeWordId && cellData.wordIds.includes(activeWordId))) {
        activeWordId = candidate;
    }

    // Give the newly-active box a little pop/bounce.
    input.classList.remove("cw-active-pop");
    // Force reflow so the animation can be re-triggered on repeated focuses.
    void input.offsetWidth;
    input.classList.add("cw-active-pop");

    // Don't select prefilled letters
    if (input.dataset.prefilled === "true") return;

    // Fallback safety net for any focus that lands here programmatically
    // (e.g. via moveInWord) on a box that's already filled but not solved —
    // jump ahead to the first empty box in that word.
    if (input.value && !solvedWords.has(activeWordId)) {
        const target = firstEditableEmptyCell(activeWordId);
        if (target && !(target.r === r && target.c === c)) {
            cellInputs.get(cellKey(target.r, target.c)).focus();
            return;
        }
    }

    input.select();
});
input.addEventListener("keydown", (e) => {
    if (input.dataset.prefilled === "true") return;

    if (e.key === "Backspace") {
        e.preventDefault();

        // If current box has a letter, remove it and stay here
        if (input.value) {
            input.value = "";
            return;
        }

        // Current box is empty -> move backwards until a user-editable box is found
        const word = cwWords.find(w => w.id === activeWordId);
        if (!word) return;

        const cells = wordCells(word);
        let idx = cells.findIndex(cell => cell.r === r && cell.c === c);

        for (let i = idx - 1; i >= 0; i--) {
            const prevInput = cellInputs.get(cellKey(cells[i].r, cells[i].c));

            // Skip prefilled letters
            if (prevInput.dataset.prefilled === "true") continue;

            prevInput.focus();
            prevInput.select();

            // Remove previous typed letter
            if (prevInput.value) {
                prevInput.value = "";
            }
            break;
        }

        return;
    }

    if (e.key === "ArrowRight") {
        e.preventDefault();
        moveInWord(activeWordId, r, c, 1);
    }

    if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveInWord(activeWordId, r, c, -1);
    }
});

input.addEventListener("animationend", (e) => {
    if (e.animationName === "activePop") {
        input.classList.remove("cw-active-pop");
    }
});

input.addEventListener("input", () => {
    input.value = input.value.toUpperCase().slice(0, 1);

    // Validate
    checkWordsForCell(cellKey(r, c));

    // Immediately jump to the next editable empty box
    if (input.value) {
        moveInWord(activeWordId, r, c, 1);
    }
});

        cellDiv.appendChild(input);
        cellData.el = cellDiv;
        cellData.input = input;
        cwGridEl.appendChild(cellDiv);
        cellInputs.set(key, input);
    }
}

function activateWord(wordId) {
    activeWordId = wordId;
}

// Moves focus to the next editable cell in the given direction along the
// active word, automatically skipping over pre-filled (readOnly) cells so
// typing never gets stuck on them.
function moveInWord(wordId, r, c, step) {
    const word = cwWords.find(w => w.id === wordId);
    if (!word) return;

    const cells = wordCells(word);
    let idx = cells.findIndex(cell => cell.r === r && cell.c === c);

    if (idx === -1) return;

    activateWord(wordId);

    let next = idx + step;

    while (next >= 0 && next < cells.length) {
        const cell = cells[next];
        const input = cellInputs.get(cellKey(cell.r, cell.c));

        if (!input) {
            next += step;
            continue;
        }

        // Skip prefilled letters
        if (input.dataset.prefilled === "true") {
            next += step;
            continue;
        }

        input.focus();
        input.select();
        return;
    }
}

function checkWordsForCell(key) {
    const cellData = cwCells[key];
    cellData.wordIds.forEach(wid => {
        if (solvedWords.has(wid)) return;
        const word = cwWords.find(w => w.id === wid);
        const cells = wordCells(word);
        const filled = cells.every(cell => cwCells[cellKey(cell.r, cell.c)].input.value);
        if (!filled) return;

        const guess = cells.map(cell => cwCells[cellKey(cell.r, cell.c)].input.value).join("");
        if (guess === word.answer) {
            solvedWords.add(wid);
            cells.forEach(cell => {
                const cd = cwCells[cellKey(cell.r, cell.c)];
if (word.number === 1 || word.number === 3) {
    cd.el.classList.add("correct-blue");
} else {
    cd.el.classList.add("correct");
}
                cd.input.readOnly = true;
            });
           const clue = document.getElementById(`clue-${wid}`);

if (word.dir === "down") {
    clue.classList.add("solved-down");
} else {
    clue.classList.add("solved-across");
}
            speak("Correct");       
            smallConfetti();

            if (solvedWords.size === cwWords.length) {
                setTimeout(() => {
                    showFinalPopup("🎉 Congratulations!", cwWords.length, cwWords.length);
                }, 800);
            }
        } else {
            cells.forEach(cell => {
                const cd = cwCells[cellKey(cell.r, cell.c)];
                cd.el.classList.add("shake");
                setTimeout(() => cd.el.classList.remove("shake"), 500);
            });
            speak("try again");

            // Clear the wrong word (keeping pre-filled letters) and send
            // focus back to the first editable cell so the player isn't
            // stuck and can immediately retype.
            setTimeout(() => {
                let firstEditable = null;
                cells.forEach(cell => {
                    const cd = cwCells[cellKey(cell.r, cell.c)];
                    if (cd.input.dataset.prefilled !== "true") {
                        cd.input.value = "";
                        if (!firstEditable) firstEditable = cd.input;
                    }
                });
                activeWordId = word.id;
                if (firstEditable) {
                    firstEditable.focus();
                    firstEditable.select();
                }
            }, 500);
        }
    });
}

// Render clues, grouped into DOWN / ACROSS sections (colors + layout mirror
// the reference image) while keeping each clue item's own card style.
const cwCluesEl = document.getElementById("cwClues");

function buildClueGroup(dirLabel, dirClass, headerIcon, words) {
    const group = document.createElement("div");
    group.className = "clue-group";

    const header = document.createElement("div");
    header.className = `clue-group-header ${dirClass}`;
    header.innerHTML = `<span>${headerIcon} ${dirLabel}</span>`;
    group.appendChild(header);

    words.forEach(word => {
        const item = document.createElement("div");
        item.className = "clue-item";
        item.id = `clue-${word.id}`;
        item.innerHTML = `
            <span class="num ${dirClass}">${word.number}</span>
            <span>${word.clue}</span>
            <span class="check"><i class="fa-solid fa-circle-check"></i></span>
        `;
        item.onclick = () => {
            if (solvedWords.has(word.id)) return;
            const cells = wordCells(word);
            const firstEmpty = cells.find(cell => !cwCells[cellKey(cell.r, cell.c)].input.value)
                || cells[0];
            activeWordId = word.id;
            cwCells[cellKey(firstEmpty.r, firstEmpty.c)].input.focus();
        };
        group.appendChild(item);
    });

    return group;
}

const cwDownWords = cwWords.filter(w => w.dir === "down");
const cwAcrossWords = cwWords.filter(w => w.dir === "across");

if (cwDownWords.length) {
    cwCluesEl.appendChild(buildClueGroup("DOWN", "down", "↓", cwDownWords));
}
if (cwAcrossWords.length) {
    cwCluesEl.appendChild(buildClueGroup("ACROSS", "across", "↔", cwAcrossWords));
}