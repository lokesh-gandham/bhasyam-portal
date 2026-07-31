// =============================================
//  MATCH DATA
//  Each pair:
//    id   – unique id linking left & right
//    left – text (and/or optional img) for left column
//    right– text (and/or optional img) for right column
//  Add `img:"path.png"` on either side to show a picture instead of/with text.
// =============================================
const matchData = [
  { id: 1, left: "Tuaregs",   right: "Nomads",               limg: "../images/tuaregs.png" },
  { id: 2, left: "Arctic fox", right: "Cold desert",          limg: "../images/arctic.png" },
  { id: 3, left: "Springs",   right: "Source of water",       limg: "../images/spring.png" },
  { id: 4, left: "Pathogens", right: "Respiratory problems",  limg: "../images/pathogens.png" },
  { id: 5, left: "Scorpions", right: "Hot desert",            limg: "../images/mcq1-3.png" },
];

// =============================================
//  STATE
// =============================================
const n = matchData.length;
const leftOrder = matchData.map(d => d.id);           // fixed row -> id
let rightRowContent = [];                              // row -> id (or null while animating)
let lockedRows = new Set();                             // rows permanently matched
let matchedIds = new Set();
let selectedLeftRow = null;
let mistakes = 0;
let busy = false; // true while a re-shuffle animation is running

// =============================================
//  DOM REFS
// =============================================
const leftColEl  = document.getElementById("leftCol");
const rightColEl = document.getElementById("rightCol");
const screenEl   = document.querySelector(".screen");
const questionEl = document.getElementById("qText");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// =============================================
//  UTIL
// =============================================
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dataById(id) {
  return matchData.find(d => d.id === id);
}
// function speak(text) {
//   if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

//   window.speechSynthesis.cancel();

//   const msg = new SpeechSynthesisUtterance(text);
//   msg.lang = "en-GB";
//   msg.volume = 1;
//   msg.rate = 1;
//   msg.pitch = 1;

//   window.speechSynthesis.speak(msg);
// }

// function playFeedback(isCorrect) {
//   speak(isCorrect ? "Correct" : "Wrong");

//   const sound = isCorrect ? correctSound : wrongSound;
//   if (sound) {
//     sound.currentTime = 0;
//     const playPromise = sound.play();
//     if (playPromise) playPromise.catch(() => {});
//   }

// }
function playFeedback(isCorrect) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(
    isCorrect ? "Correct!" : "Try again"
  );

  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = isCorrect ? 1.2 : 0.9;

  window.speechSynthesis.speak(msg);
}
speechSynthesis.getVoices();

speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

// =============================================
//  AUDIO — created and played entirely in JS,
//  no <audio> elements needed in the HTML
// =============================================


    function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-US";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }

function rowVar(name) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
}

// =============================================
//  FIT LAYOUT — computes --row-h / --row-gap so
//  everything fits the viewport with no scroll,
//  regardless of screen size or item count
// =============================================
function fitLayout() {
  const availableH = screenEl.clientHeight - questionEl.offsetHeight - 24;
  const minRow = 40, maxRow = 92;
  const gap = Math.max(8, Math.min(20, availableH * 0.035));
  let rowH = (availableH - gap * (n - 1)) / n;
  rowH = Math.max(minRow, Math.min(maxRow, rowH));

  document.documentElement.style.setProperty("--row-h", rowH + "px");
  document.documentElement.style.setProperty("--row-gap", gap + "px");

  const wrapH = n * rowH + (n - 1) * gap;
  document.querySelector(".match-wrap").style.minHeight = wrapH + "px";

  positionAll();
}

function rowTop(row) {
  const rowH = rowVar("--row-h");
  const gap = rowVar("--row-gap");
  return row * (rowH + gap);
}

function positionAll() {
  leftColEl.querySelectorAll(".match-item").forEach(el => {
    el.style.top = rowTop(+el.dataset.row) + "px";
  });
  rightColEl.querySelectorAll(".match-item").forEach(el => {
    el.style.top = rowTop(+el.dataset.row) + "px";
  });
}

// =============================================
//  RENDER
// =============================================
function renderCard(colEl, row, itemData, side) {
  let el = colEl.querySelector(`.match-item[data-row="${row}"]`);
  if (!el) {
    el = document.createElement("div");
    el.className = "match-item";
    el.dataset.row = row;
    colEl.appendChild(el);
  }
  el.dataset.id = itemData.id;
  el.innerHTML = "";

  if (side === "left") {
 const label = document.createElement("span");
label.className = "match-label";
label.textContent = String.fromCharCode(65 + row); // Always A, B, C, D, E

el.appendChild(label);

    const imgEl = document.createElement("img");
    imgEl.src = itemData.limg;
    imgEl.alt = itemData.left || "";

    const span = document.createElement("span");
    span.textContent = itemData.left;

    el.appendChild(imgEl);
    el.appendChild(span);
} else {
    const label = document.createElement("span");
label.className = "match-label";
label.textContent = "";

el.appendChild(label);

    const span = document.createElement("span");
    span.textContent = itemData.right;
    el.appendChild(span);
  }

  el.style.top = rowTop(row) + "px";
  return el;
}

function renderLeft() {
  leftOrder.forEach((id, row) => {
    const el = renderCard(leftColEl, row, dataById(id), "left");
    el.classList.toggle("locked", lockedRows.has(row));
    el.onclick = () => onLeftClick(row);
  });
}

function renderRight() {
  rightRowContent.forEach((id, row) => {
    if (id === null) return;
    const el = renderCard(rightColEl, row, dataById(id), "right");
    el.classList.toggle("locked", lockedRows.has(row));
    el.onclick = () => onRightClick(row);
  });
}

// =============================================
//  INIT
// =============================================
function init() {
  rightRowContent = shuffle(leftOrder);
  renderLeft();
  renderRight();
  fitLayout();
}

window.addEventListener("resize", fitLayout);

// =============================================
//  CLICK HANDLERS
// =============================================
function onLeftClick(row) {
  if (busy || lockedRows.has(row)) return;
  leftColEl.querySelectorAll(".match-item").forEach(el => el.classList.remove("selected"));
  selectedLeftRow = row;
  leftColEl.querySelector(`.match-item[data-row="${row}"]`).classList.add("selected");
}

function onRightClick(row) {
  if (busy || lockedRows.has(row) || selectedLeftRow === null) return;

  const leftId  = leftOrder[selectedLeftRow];
  const rightId = rightRowContent[row];
  const leftEl  = leftColEl.querySelector(`.match-item[data-row="${selectedLeftRow}"]`);
  const rightEl = rightColEl.querySelector(`.match-item[data-row="${row}"]`);

  if (leftId === rightId) {
    handleCorrect(selectedLeftRow, row, leftEl, rightEl, leftId);
  } else {
    handleWrong(leftEl, rightEl);
  }
}

// =============================================
//  CORRECT MATCH
// =============================================
function handleCorrect(leftRow, rightRow, leftEl, rightEl, id) {
  busy = true;
  selectedLeftRow = null;
  leftEl.classList.remove("selected");

  matchedIds.add(id);
  lockedRows.add(leftRow);

  // move the matched right card into the left row's position, lock + attach both,
  // and reveal the same image that was on the left card
  rightEl.dataset.row = leftRow;
  rightEl.style.top = rowTop(leftRow) + "px";
  leftEl.classList.add("locked");
  rightEl.classList.add("locked", "attached");
  rightEl.querySelector(".match-label").textContent =
    String.fromCharCode(65 + leftRow);

  const revealImg = document.createElement("img");
  revealImg.src = dataById(id).limg;
  revealImg.alt = dataById(id).left || "";
  rightEl.insertBefore(revealImg, rightEl.firstChild);

speak("Correct");
  if (window.confetti) {
    confetti({ particleCount: 60, spread: 65, startVelocity: 35, origin: { x: 0.5, y: 0.5 }, scalar: 0.9 });
  }

  // reshuffle the remaining (still unmatched) right cards into the
  // remaining open rows ("other places shuffle")
  const openRows = [];
  for (let r = 0; r < n; r++) if (!lockedRows.has(r)) openRows.push(r);

  const remainingIds = shuffle(rightRowContent.filter(rid => rid !== null && !matchedIds.has(rid)));

  setTimeout(() => {
    const newContent = new Array(n).fill(null);
    newContent[leftRow] = id; // stays docked
    openRows.forEach((r, i) => { newContent[r] = remainingIds[i]; });
    rightRowContent = newContent;

    // re-render right column rows cleanly to match new mapping
    rightColEl.querySelectorAll(".match-item").forEach(el => {
      const elId = +el.dataset.id;
      const newRow = rightRowContent.findIndex(rid => rid === elId);
      if (newRow !== -1) {
        el.dataset.row = newRow;
        el.style.top = rowTop(newRow) + "px";
        el.onclick = () => onRightClick(newRow);
      }
    });

    busy = false;

    if (matchedIds.size === n) {
      setTimeout(showFinal, 900);
    }
  }, 550);
}

// =============================================
//  WRONG MATCH
// =============================================
function handleWrong(leftEl, rightEl) {
  mistakes++;
 speak("Try again");  [leftEl, rightEl].forEach(el => {
    el.classList.add("wrong");
    setTimeout(() => el.classList.remove("wrong"), 450);
  });
  leftEl.classList.remove("selected");
  selectedLeftRow = null;
}

// =============================================
//  FINAL POPUP + CONFETTI
// =============================================
function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `You scored ${matchData.length} out of ${matchData.length}`;

  let stars = 5;
  if (mistakes > 0) stars = 4;
  if (mistakes > 2) stars = 3;
  if (mistakes > 4) stars = 2;
  if (mistakes > 6) stars = 1;
 document.getElementById("stars").textContent = "⭐⭐⭐⭐⭐";

  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// =============================================
//  START
// =============================================
init();
