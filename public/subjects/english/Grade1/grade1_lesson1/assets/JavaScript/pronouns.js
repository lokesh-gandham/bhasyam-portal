function shouldSkipFinalCorrectPopup() {
  try {
    if (typeof answered !== "undefined" && Array.isArray(answered) && answered.length && answered.every(a => a !== null && a !== false)) return true;
    if (typeof answeredQuestions !== "undefined" && Array.isArray(answeredQuestions) && answeredQuestions.length && answeredQuestions.every(Boolean)) return true;
    const leftItems = [...document.querySelectorAll(".left-item")];
    if (leftItems.length && leftItems.every(item => item.classList.contains("matched"))) return true;
    const meanSlots = [...document.querySelectorAll(".mean-slot")];
    if (meanSlots.length && meanSlots.every(slot => slot.classList.contains("correct") || slot.classList.contains("filled"))) return true;
    const droppedWords = [...document.querySelectorAll(".dropped-word")];
    if (droppedWords.length && droppedWords.every(word => word.classList.contains("correct"))) return true;
  } catch (error) {}
  return false;
}
/*
const familyMembers = [
  { icon: "👨", name: "Father" },
  { icon: "👩", name: "Mother" },
  { icon: "👦", name: "Son" },
  { icon: "👧", name: "Daughter" },
  { icon: "👴", name: "Grandpa" },
  { icon: "👵", name: "Grandma" },
];

const gridEl = document.getElementById("familyGrid");
familyMembers.forEach((m) => {
  const card = document.createElement("div");
  card.className = "fg-card";
  card.innerHTML = `<span class="fg-icon">${m.icon}</span><span class="fg-name">${m.name}</span>`;
  gridEl.appendChild(card);
});

const quizData = [
  {
    q: "Q1. Who is the father in the family?",
    img: "../assets/images/hansfather.png",
    options: ["|👨 Father", "|👩 Mother", "|👴 Grandpa", "|👦 Son"],
    a: 0,
  },
  {
    q: "Q2. This is Hans. He is the ___.",
    img: "../assets/images/hansbg.png",
    options: ["|👧 Daughter", "|👦 Son", "|👨 Father", "|👵 Grandma"],
    a: 1,
  },
  {
    q: "Q3. Who takes care of the family with the father?",
    img: "",
    options: ["|👴 Grandpa", "|👦 Son", "|👩 Mother", "|👧 Daughter"],
    a: 2,
  },
  {
    q: "Q4. A ___ is a group of people who love and care for each other.",
    img: "",
    options: ["|School", "|Family", "|Park", "|Market"],
    a: 1,
  },
  {
    q: "Q5. Hans' father is a ___.",
    img: "../assets/images/hansfather1.png",
    options: ["|Teacher", "|Pilot", "|Doctor", "|Farmer"],
    a: 2,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = "block";
    imgEl.parentElement.style.display = "flex";
  } else {
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
    imgEl.parentElement.style.display = "none";
  }
  optEl.innerHTML = "";
  nextBtn.disabled = current === quizData.length - 1 || answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option";

    const parts = t.split("|");
    const img = parts[0];
    const text = parts[1] || parts[0];
    const isImage = img && (img.includes("/") || img.includes("."));

    if (isImage) {
      d.innerHTML = `<div class="option-img"><img src="${img}"></div><span>${text}</span>`;
    } else {
      d.innerHTML = `<span>${text}</span>`;
    }

    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        playSound("correctSound");
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = current === quizData.length - 1;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1700);
      } else {
        speak("Try again");
        playSound("wrongSound");
        showPopup(false);
        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  if (current >= quizData.length - 1) return;
  current++;
  loadQuestion();
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  document.querySelectorAll(".sparkle").forEach(el => el.remove());

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
    const sparks = ["⭐", "✨", "🌟", "💫", "✨"];
    sparks.forEach((s, i) => {
      const el = document.createElement("div");
      el.className = "sparkle";
      el.textContent = s;
      el.style.left = (15 + i * 18) + "%";
      el.style.top = "20%";
      el.style.animationDelay = (i * 0.12) + "s";
      icon.parentElement.appendChild(el);
    });
  } else {
    icon.textContent = "😕";
    title.textContent = "Not quite!";
    msg.textContent = "Keep trying, you'll get it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
*/

const gridRows = [
  ["g", "r", "a", "n", "d", "p", "a", "b"],
  ["m", "o", "t", "h", "e", "r", "f", "r"],
  ["g", "r", "a", "n", "d", "m", "a", "o"],
  ["m", "o", "u", "j", "k", "u", "t", "t"],
  ["s", "p", "x", "c", "l", "y", "h", "h"],
  ["a", "b", "t", "q", "r", "y", "e", "e"],
  ["c", "s", "i", "s", "t", "e", "r", "r"],
];

const targetWords = {
  grandpa: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]],
  mother: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
  grandma: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
  father: [[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]],
  brother: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  sister: [[6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]],
};

const REQUIRED_WORDS = 6;
const longestTargetLength = Math.max(...Object.values(targetWords).map((path) => path.length));
const shortestTargetLength = Math.min(...Object.values(targetWords).map((path) => path.length));
const gridEl = document.getElementById("familyGrid");
const foundCountEl = document.getElementById("foundCount");
const clueCards = [...document.querySelectorAll(".clue-card[data-word]")];

const wordImages = {
  grandpa: { img: "../assets/images/grandpaaimage.png", emoji: "👴", label: "Grandpa", bg: "#e8d5b7" },
  grandma: { img: "../assets/images/grandmaa-removebg-preview.png", emoji: "👵", label: "Grandma", bg: "#f0d9d9" },
  mother:  { img: "../assets/images/mother-removebg-preview.png", emoji: "👩", label: "Mother", bg: "#d4e6f1" },
  father:  { img: "../assets/images/father-removebg-preview.png", emoji: "👨", label: "Father", bg: "#d5f0e8" },
  brother: { img: "../assets/images/brother-removebg-preview.png", emoji: "👦", label: "Brother", bg: "#e8e0f0" },
  sister:  { img: "../assets/images/sister-removebg-preview.png", emoji: "👧", label: "Sister", bg: "#f0d9e8" },
  aunt:    { img: "../assets/images/aunt-removebg-preview.png", emoji: "👩", label: "Aunt", bg: "#f5e6d0" },
  uncle:   { img: "../assets/images/uncle-removebg-preview.png", emoji: "👨", label: "Uncle", bg: "#d0e8f0" },
};

let selectedCells = [];
let isSelecting = false;
let wasDragged = false;
let pointerStartPos = null;
let pointerStartCell = null;
let foundWords = new Set();
let lastFoundWord = null;
let completed = false;

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function playSound(correct) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.frequency.setValueAtTime(correct ? 660 : 330, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(correct ? 880 : 220, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch(e) {}
}

function smallConfetti() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 90, spread: 90, origin: { y: 0.68 } });
}

function updateClueStates() {
  clueCards.forEach((card) => {
    const word = card.dataset.word;
    const isSolved = foundWords.has(word);
    card.classList.toggle("solved", isSolved);
    card.classList.toggle(`solved-${word}`, isSolved);
  });
}

function cellKey(row, col) {
  return `${row},${col}`;
}

function pathKey(path) {
  return path.map(([row, col]) => cellKey(row, col)).join("|");
}

function reversePath(path) {
  return [...path].reverse();
}

function cellSetKey(path) {
  return path
    .map(([row, col]) => cellKey(row, col))
    .sort()
    .join("|");
}

function sameCellSet(a, b) {
  return a.length === b.length && cellSetKey(a) === cellSetKey(b);
}

function getCell(row, col) {
  return gridEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function updateFoundCount() {
  if (foundCountEl) {
    foundCountEl.textContent = `Found: ${Math.min(foundWords.size, REQUIRED_WORDS)} / ${REQUIRED_WORDS}`;
  }
  updateClueStates();
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  if (!popup || !icon || !title || !msg) return;

  popup.className = `kid-popup ${isCorrect ? "kid-correct" : "kid-wrong"}`;
  popup.style.display = "flex";
  icon.textContent = isCorrect ? "\u2713" : "\u00d7";
  title.textContent = isCorrect ? "Right!" : "Wrong!";
  msg.textContent = isCorrect ? "Good selection." : "Try again.";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1100);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  const title = popup?.querySelector("h2");
  if (title) title.textContent = "\u{1F389} Congratulations!";
  document.getElementById("finalScore").textContent =
    `You found ${REQUIRED_WORDS} family words.`;
  document.getElementById("stars").textContent = "\u2B50".repeat(3);
  popup.style.display = "flex";
  bigConfetti();
}

function markPath(path, className) {
  path.forEach(([row, col]) => {
    getCell(row, col)?.classList.add(className);
  });
}

function clearActive() {
  document.querySelectorAll(".letter-cell.active").forEach((cell) => {
    cell.classList.remove("active");
  });
}

function clearWrong() {
  document.querySelectorAll(".letter-cell.wrong").forEach((cell) => {
    cell.classList.remove("wrong");
  });
}

function addCellToSelection(cell) {
  if (!cell || completed) return;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const key = cellKey(row, col);

  if (selectedCells.some(([r, c]) => cellKey(r, c) === key)) return;

  selectedCells.push([row, col]);
  cell.classList.add("active");
}

function handleCellClick(cell) {
  if (!cell || completed) return;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const key = cellKey(row, col);

  const idx = selectedCells.findIndex(([r, c]) => cellKey(r, c) === key);

  if (idx >= 0) {
    selectedCells.splice(idx, 1);
    cell.classList.remove("active");
    return;
  }

  addCellToSelection(cell);
  evaluateClickSelection();
}

function findSelectedWord() {
  return Object.entries(targetWords).find(([word, path]) => {
    if (foundWords.has(word)) return false;
    return sameCellSet(selectedCells, path) || sameCellSet(selectedCells, reversePath(path));
  });
}

function canStillBecomeLongWord() {
  if (selectedCells.length >= longestTargetLength) return false;
  return Object.entries(targetWords).some(([word, path]) => {
    if (foundWords.has(word) || path.length <= selectedCells.length) return false;
    return selectedCells.every(([row, col]) =>
      path.some(([targetRow, targetCol]) => targetRow === row && targetCol === col)
    );
  });
}

function evaluateClickSelection() {
  if (!selectedCells.length || completed) return;
  if (findSelectedWord()) {
    finishSelection();
    return;
  }
  if (selectedCells.length >= shortestTargetLength && !canStillBecomeLongWord()) {
    finishSelection();
  }
}

function finishSelection() {
  if (!selectedCells.length || completed) return;

  const match = findSelectedWord();
  if (match) {
    const [word, path] = match;
    foundWords.add(word);
    lastFoundWord = word;
    clearActive();
    markPath(path, "found");
    markPath(path, `found-${word}`);
    updateFoundCount();
    speak("Correct");
    smallConfetti();
    showPopup(true, word);

    if (foundWords.size >= REQUIRED_WORDS) {
      completed = true;
      setTimeout(showFinal, 1700);
    }
  } else if (selectedCells.length < shortestTargetLength || canStillBecomeLongWord()) {
    isSelecting = false;
    wasDragged = false;
    pointerStartPos = null;
    pointerStartCell = null;
    return;
  } else {
    selectedCells.forEach(([row, col]) => getCell(row, col)?.classList.add("wrong"));
    speak("Wrong");
    showPopup(false);
    setTimeout(clearWrong, 550);
    clearActive();
  }

  selectedCells = [];
  isSelecting = false;
  wasDragged = false;
  pointerStartPos = null;
  pointerStartCell = null;
}

function renderGrid() {
  gridEl.innerHTML = "";

  gridRows.forEach((rowLetters, row) => {
    rowLetters.forEach((letter, col) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "letter-cell";
      cell.textContent = letter;
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("aria-label", `Letter ${letter}`);

      cell.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        wasDragged = false;
        pointerStartPos = { x: event.clientX, y: event.clientY };
        pointerStartCell = cell;
        clearWrong();
        isSelecting = true;
      });

      cell.addEventListener("pointerenter", () => {
        if (isSelecting && wasDragged) {
          addCellToSelection(cell);
        }
      });

      cell.addEventListener("pointerup", (event) => {
        if (!isSelecting) return;

        if (!wasDragged && pointerStartPos) {
          isSelecting = false;
          const dx = Math.abs(event.clientX - pointerStartPos.x);
          const dy = Math.abs(event.clientY - pointerStartPos.y);
          if (dx < 6 && dy < 6) {
            handleCellClick(cell);
          }
          return;
        }

        if (wasDragged) {
          finishSelection();
        } else {
          isSelecting = false;
        }
      });

      gridEl.appendChild(cell);
    });
  });
}

function handlePointerMove(event) {
  if (!isSelecting) return;
  if (!wasDragged && pointerStartPos) {
    const dx = Math.abs(event.clientX - pointerStartPos.x);
    const dy = Math.abs(event.clientY - pointerStartPos.y);
    if (dx >= 6 || dy >= 6) {
      clearActive();
      selectedCells = [];
      wasDragged = true;
      addCellToSelection(pointerStartCell);
    }
  }
  if (!wasDragged) return;
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const cell = target?.closest?.(".letter-cell");
  if (cell && gridEl.contains(cell)) addCellToSelection(cell);
}

function resetFamilyGrid() {
  selectedCells = [];
  isSelecting = false;
  wasDragged = false;
  pointerStartPos = null;
  pointerStartCell = null;
  foundWords = new Set();
  lastFoundWord = null;
  completed = false;
  renderGrid();
  updateFoundCount();
  const answerPopup = document.getElementById("answerPopup");
  if (answerPopup) answerPopup.style.display = "none";
  document.getElementById("finalPopup").style.display = "none";
}

window.resetFamilyGrid = resetFamilyGrid;

document.addEventListener("pointermove", handlePointerMove);
document.addEventListener("pointerup", (event) => {
  if (isSelecting) {
    if (wasDragged) {
      finishSelection();
      return;
    }
    isSelecting = false;
    if (!wasDragged && pointerStartPos) {
      const target = event.target?.closest?.(".letter-cell");
      if (!target) {
        selectedCells = [];
        clearActive();
        pointerStartCell = null;
      }
    }
  }
});

resetFamilyGrid();
