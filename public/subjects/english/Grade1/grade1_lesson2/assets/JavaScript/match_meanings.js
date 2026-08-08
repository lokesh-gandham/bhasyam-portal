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
const quizData = [
  { label: "many times", answer: "frequent", img: "../assets/images/manytimes-removebg-preview.png" },
  { label: "ice cream with fruits, nuts and syrup", answer: "sundae", img: "../assets/images/sundea-removebg-preview.png" },
  { label: "woman who serves food in a restaurant", answer: "waitress", img: "../assets/images/restaurant-removebg-preview.png" },
  { label: "a rectangular-shaped layer", answer: "slab", img: "../assets/images/rectangle-removebg-preview.png" },
];

const allWords = ["frequent", "sundae", "waitress", "slab"];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);
let selectedWord = null;
let draggedWord = null;
let pointerDrag = null;
let suppressNextClick = false;

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const sourceEl = document.getElementById("sourceWords");
const slotsEl = document.getElementById("slots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

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

function smallConfetti() {
  try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } }); } catch(e) {}
}

function bigConfetti() {
  try { confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } }); } catch(e) {}
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function lesson2LabelFontSize() {
  return window.innerWidth >= 1441 ? "40px" : "30px";
}

function applyLesson2LabelFont(root = document) {
  root.querySelectorAll(".slot-number, .slot-meaning").forEach(el => {
    el.style.setProperty("font-size", lesson2LabelFontSize(), "important");
    el.style.setProperty("line-height", "1.15", "important");
  });
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = "Match the word with its meaning (" + (current + 1) + "/" + quizData.length + ")";
  imgEl.removeAttribute("src");
  imgEl.parentElement.style.display = "none";
  selectedWord = null;
  sourceEl.innerHTML = "";
  slotsEl.innerHTML = "";

  const shuffled = shuffleArray([...allWords]);
  shuffled.forEach(w => {
    const el = document.createElement("div");
    el.className = "mean-word";
    const usedIdx = quizData.findIndex(item => item.answer === w);
    if (answered[usedIdx]) el.classList.add("placed");
    el.textContent = cap(w);
    el.dataset.word = w;
    el.draggable = !answered[usedIdx];
    el.addEventListener("dragstart", (event) => startDrag(event, el, w));
    el.addEventListener("dragend", () => endDrag(el));
    el.addEventListener("pointerdown", (event) => startPointerDrag(event, el, w));
    el.onclick = () => selectWord(el, w);
    sourceEl.appendChild(el);
  });

  const slot = document.createElement("div");
  slot.className = "mean-slot";
  slot.dataset.answer = q.answer;
  slot.innerHTML = `
    <div class="slot-image">${q.img ? `<img src="${q.img}" alt="">` : ''}</div>
    <div class="slot-body">
      <div class="slot-label-row">
        <span class="slot-number">${current + 1}.</span>
        <span class="slot-meaning">${cap(q.label)}</span>
      </div>
      <span class="slot-dash">-</span>
      <span class="slot-answer"></span>
    </div>
  `;
  slot.onclick = () => placeWord(slot);
  slot.addEventListener("dragover", allowDrop);
  slot.addEventListener("dragenter", allowDrop);
  slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
  slot.addEventListener("drop", (event) => dropWord(event, slot));
  slotsEl.appendChild(slot);
  applyLesson2LabelFont(slot);

  if (answered[current]) {
    slot.classList.add("filled", "correct");
    slot.querySelector(".slot-answer").textContent = cap(q.answer);
  }

  nextBtn.disabled = !answered[current];
  nextBtn.innerHTML = 'Next <i style="margin-left:5px" class="fa-solid fa-angles-right"></i>';
  prevBtn.disabled = current === 0;
}

function selectWord(el, word) {
  if (suppressNextClick) {
    suppressNextClick = false;
    return;
  }
  if (el.classList.contains("placed")) return;
  const openSlot = slotsEl.querySelector(".mean-slot:not(.filled)");
  if (openSlot) {
    placeWord(openSlot, word);
    return;
  }
  sourceEl.querySelectorAll(".mean-word").forEach(e => e.classList.remove("selected"));
  if (selectedWord === word) {
    selectedWord = null;
    return;
  }
  el.classList.add("selected");
  selectedWord = word;
}

function startDrag(event, el, word) {
  if (el.classList.contains("placed")) {
    event.preventDefault();
    return;
  }
  draggedWord = word;
  selectedWord = word;
  el.classList.add("dragging");
  event.dataTransfer.setData("text/plain", word);
  event.dataTransfer.effectAllowed = "move";
}

function endDrag(el) {
  draggedWord = null;
  el.classList.remove("dragging");
  document.querySelectorAll(".mean-slot.drag-over").forEach(slot => slot.classList.remove("drag-over"));
}

function allowDrop(event) {
  const slot = event.currentTarget;
  if (slot.classList.contains("filled")) return;
  event.preventDefault();
  slot.classList.add("drag-over");
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
}

function dropWord(event, slot) {
  event.preventDefault();
  slot.classList.remove("drag-over");
  const word = event.dataTransfer.getData("text/plain") || draggedWord;
  placeWord(slot, word);
}

function startPointerDrag(event, el, word) {
  if (event.pointerType === "mouse") return;
  if (el.classList.contains("placed") || (event.button !== undefined && event.button !== 0)) return;
  pointerDrag = {
    word,
    el,
    startX: event.clientX,
    startY: event.clientY,
    clone: null,
    moved: false,
  };
}

function movePointerDrag(event) {
  if (!pointerDrag) return;
  const dx = event.clientX - pointerDrag.startX;
  const dy = event.clientY - pointerDrag.startY;
  if (!pointerDrag.moved && Math.hypot(dx, dy) < 8) return;

  if (!pointerDrag.clone) {
    pointerDrag.moved = true;
    selectedWord = pointerDrag.word;
    pointerDrag.el.classList.add("dragging");
    pointerDrag.clone = pointerDrag.el.cloneNode(true);
    pointerDrag.clone.className = "mean-word drag-clone";
    pointerDrag.clone.style.width = `${pointerDrag.el.offsetWidth}px`;
    document.body.appendChild(pointerDrag.clone);
  }

  event.preventDefault();
  pointerDrag.clone.style.left = `${event.clientX}px`;
  pointerDrag.clone.style.top = `${event.clientY}px`;
  document.querySelectorAll(".mean-slot.drag-over").forEach(slot => slot.classList.remove("drag-over"));
  const targetSlot = document.elementFromPoint(event.clientX, event.clientY)?.closest(".mean-slot");
  if (targetSlot && !targetSlot.classList.contains("filled")) targetSlot.classList.add("drag-over");
}

function endPointerDrag(event) {
  if (!pointerDrag) return;
  const drag = pointerDrag;
  pointerDrag = null;
  drag.el.classList.remove("dragging");
  document.querySelectorAll(".mean-slot.drag-over").forEach(slot => slot.classList.remove("drag-over"));

  if (drag.clone) {
    drag.clone.remove();
    suppressNextClick = true;
    const targetSlot = document.elementFromPoint(event.clientX, event.clientY)?.closest(".mean-slot");
    if (targetSlot) placeWord(targetSlot, drag.word);
  }
}

function placeWord(slot, word = selectedWord) {
  if (!word || slot.classList.contains("filled")) return;
  const q = quizData[current];
  const isCorrect = q.answer === word;
  const wordEl = sourceEl.querySelector(`.mean-word[data-word="${word}"]`);

  wordEl?.classList.add("placed");
  sourceEl.querySelectorAll(".mean-word").forEach(e => e.classList.remove("selected"));

  if (isCorrect) {
    slot.classList.add("filled", "correct");
    slot.querySelector(".slot-answer").textContent = cap(word);
    speak("Correct");
    smallConfetti();
    showPopup(true);
    score++;
    answered[current] = true;
    nextBtn.disabled = current === quizData.length - 1;
    selectedWord = null;

    if (answered.every(a => a)) setTimeout(showFinal, 1700);
  } else {
    slot.classList.add("wrong");
    speak("Try again");
    showPopup(false);
    setTimeout(() => {
      slot.classList.remove("wrong");
      wordEl?.classList.remove("placed");
      if (selectedWord === word) selectedWord = null;
    }, 700);
  }
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";
  icon.innerHTML = isCorrect ? "&#10003;" : "&#10007;";
  title.textContent = isCorrect ? "Right!" : "Try Again!";
  msg.textContent = isCorrect ? "Great job!" : "Have another go.";
  setTimeout(() => { popup.style.display = "none"; }, 1200);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent = "Score: " + score + " / " + quizData.length;
  document.getElementById("stars").innerHTML = "&#11088;".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

prevBtn.onclick = () => {
  if (current <= 0) return;
  current--;
  loadQuestion();
};
nextBtn.onclick = () => {
  if (current === quizData.length - 1 && answered[current]) {
    showFinal();
    return;
  }
  if (current >= quizData.length - 1) return;
  current++;
  loadQuestion();
};

loadQuestion();

window.addEventListener("pointermove", movePointerDrag, { passive: false });
window.addEventListener("pointerup", endPointerDrag);
window.addEventListener("pointercancel", endPointerDrag);

window.addEventListener("resize", () => applyLesson2LabelFont());
