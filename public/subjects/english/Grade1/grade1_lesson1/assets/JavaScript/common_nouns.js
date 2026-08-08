function shouldSkipFinalCorrectPopup() {
  try {
    if (typeof answered !== "undefined" && Array.isArray(answered) && answered.length && answered.every(a => a !== null && a !== false)) return true;
    if (typeof answeredQuestions !== "undefined" && Array.isArray(answeredQuestions) && answeredQuestions.length && answeredQuestions.every(Boolean)) return true;
    const leftItems = [...document.querySelectorAll(".left-item")];
    if (leftItems.length && leftItems.every(item => item.classList.contains("matched"))) return true;
    const meanSlots = [...document.querySelectorAll(".mean-slot")];
    if (meanSlots.length && meanSlots.every(slot => slot.classList.contains("correct") || slot.classList.contains("filled"))) return true;
    const droppedWords = [...document.querySelectorAll(".dropped-word")];
    const expectedDrops = typeof nouns !== "undefined" && Array.isArray(nouns) ? nouns.length : 0;
    if (expectedDrops && droppedWords.length >= expectedDrops && droppedWords.every(word => word.classList.contains("correct"))) return true;
  } catch (error) {}
  return false;
}
/*
const quizData = [
  {
    q: "Q1. Which word is a common noun?",
    img: "",
    options: ["Christmas|Christmas", "festival|festival", "Vikas|Vikas", "Sikkim|Sikkim"],
    a: 1,
  },
  {
    q: "Q2. Which word is a common noun?",
    img: "",
    options: ["Paris|Paris", "Vikas|Vikas", "river|river", "Christmas|Christmas"],
    a: 2,
  },
  {
    q: "Q3. Which word is a common noun?",
    img: "",
    options: ["cat|cat", "Sikkim|Sikkim", "Paris|Paris", "Vikas|Vikas"],
    a: 0,
  },
  {
    q: "Q4. Which word is a common noun?",
    img: "",
    options: ["flower|flower", "Bhavya|Bhavya", "Tom|Tom", "Chennai|Chennai"],
    a: 0,
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
    d.className = "option o" + ((i % 4) + 1);

    const parts = t.split("|");
    const img = parts[0];
    const text = parts[1] || parts[0];
    const isImage = img && (img.includes("/") || img.includes("."));

    if (isImage) {
      d.innerHTML = `<div class="option-img"><img src="${img}"></div><span>${text}</span>`;
    } else {
      d.textContent = text;
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
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = current === quizData.length - 1;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1700);
      } else {
        speak("Try again");
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

const nouns = [
  { id: "festival", text: "Festival", category: "common" },
  { id: "christmas", text: "Christmas", category: "proper" },
  { id: "river", text: "River", category: "common" },
  { id: "vikas", text: "Vikas", category: "proper" },
  { id: "cat", text: "Cat", category: "common" },
  { id: "flower", text: "Flower", category: "common" },
  { id: "sikkim", text: "Sikkim", category: "proper" },
  { id: "paris", text: "Paris", category: "proper" },
];

const sourceWords = document.getElementById("sourceWords");
const dropZones = document.querySelectorAll(".drop-zone");

let selectedWordId = null;

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

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
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

function celebrate() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 70, spread: 90, origin: { y: 0.72 } });
}

function makeWordChip(noun) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "draggable-word";
  chip.textContent = noun.text;
  chip.draggable = true;
  chip.dataset.id = noun.id;
  chip.dataset.category = noun.category;
  chip.setAttribute("aria-label", `Move ${noun.text}`);

  chip.addEventListener("dragstart", (event) => {
    selectedWordId = noun.id;
    chip.classList.add("dragging");
    event.dataTransfer.setData("text/plain", noun.id);
  });

  chip.addEventListener("dragend", () => {
    chip.classList.remove("dragging");
  });

  chip.addEventListener("click", () => {
    document.querySelectorAll(".draggable-word.selected").forEach((word) => {
      word.classList.remove("selected");
    });
    selectedWordId = noun.id;
    chip.classList.add("selected");
  });

  return chip;
}

function makeDroppedWord(noun) {
  const word = document.createElement("div");
  word.className = "dropped-word";
  word.dataset.id = noun.id;
  word.dataset.category = noun.category;

  const text = document.createElement("span");
  text.textContent = noun.text;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-btn";
  remove.innerHTML = "&times;";
  remove.setAttribute("aria-label", `Remove ${noun.text}`);
  remove.addEventListener("click", () => returnToSource(noun.id));

  word.append(text, remove);
  return word;
}

function getNoun(id) {
  return nouns.find((noun) => noun.id === id);
}

function findPlacedWord(id) {
  return document.querySelector(`.dropped-word[data-id="${id}"]`);
}

function clearFeedback() {
  document.querySelectorAll(".dropped-word").forEach((word) => {
    word.classList.remove("incorrect");
  });
}

function updateSubmitState() {
  const placedCount = document.querySelectorAll(".dropped-word").length;
}

function placeWord(id, zone) {
  const noun = getNoun(id);
  if (!noun || !zone) return;

  findPlacedWord(id)?.remove();
  sourceWords.querySelector(`[data-id="${id}"]`)?.remove();

  const wordEl = makeDroppedWord(noun);
  zone.appendChild(wordEl);

  const isCorrect = noun.category === zone.dataset.category;

  if (isCorrect) {
    wordEl.classList.add("correct");
    zone.classList.remove("bucket-splash");
    void zone.offsetWidth;
    zone.classList.add("bucket-splash");
    setTimeout(() => zone.classList.remove("bucket-splash"), 900);
    speak("Correct");
    celebrate();
    showPopupSingle(true);
  } else {
    speak("Try again");
    showPopupSingle(false);
    setTimeout(() => {
      wordEl.remove();
      if (!sourceWords.querySelector(`[data-id="${id}"]`)) {
        sourceWords.appendChild(makeWordChip(noun));
      }
      clearFeedback();
      updateSubmitState();
    }, 700);
    return;
  }

  selectedWordId = null;
  document.querySelectorAll(".draggable-word.selected").forEach((word) => {
    word.classList.remove("selected");
  });
  clearFeedback();
  updateSubmitState();

  const placedWords = document.querySelectorAll(".dropped-word");
  const correctCount = [...placedWords].filter(w => w.classList.contains("correct")).length;
  if (placedWords.length === nouns.length && correctCount === nouns.length) {
    celebrate();
    setTimeout(showFinal, 1700);
  }
}

function returnToSource(id) {
  const noun = getNoun(id);
  if (!noun) return;

  findPlacedWord(id)?.remove();
  if (!sourceWords.querySelector(`[data-id="${id}"]`)) {
    sourceWords.appendChild(makeWordChip(noun));
  }

  clearFeedback();
  updateSubmitState();
}

function resetExercise() {
  selectedWordId = null;
  sourceWords.innerHTML = "";
  dropZones.forEach((zone) => {
    zone.innerHTML = "";
    zone.classList.remove("dragover", "bucket-splash");
  });
  nouns.forEach((noun) => sourceWords.appendChild(makeWordChip(noun)));
  updateSubmitState();
}

function showPopupSingle(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = `kid-popup ${isCorrect ? "kid-correct" : "kid-wrong"}`;
  popup.style.display = "flex";
  icon.textContent = isCorrect ? "\u{1F389}" : "\u{1F615}";
  title.textContent = isCorrect ? "Great Job!" : "Not quite!";
  msg.textContent = isCorrect
    ? "You got it right!"
    : "Keep trying, you'll get it!";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = `kid-popup ${isCorrect ? "kid-correct" : "kid-wrong"}`;
  popup.style.display = "flex";
  icon.textContent = isCorrect ? "\u{1F389}" : "\u{1F615}";
  title.textContent = isCorrect ? "Great Job!" : "Not quite!";
  msg.textContent = isCorrect
    ? "You got it right!"
    : "Keep trying, you'll get it!";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent =
    "All 8 nouns are in the correct columns.";
  document.getElementById("stars").textContent = "\u2B50".repeat(3);
  popup.style.display = "flex";
  celebrate();
}

dropZones.forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("dragover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("dragover");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("dragover");
    const id = event.dataTransfer.getData("text/plain") || selectedWordId;
    placeWord(id, zone);
  });

  zone.addEventListener("click", () => {
    if (selectedWordId) placeWord(selectedWordId, zone);
  });
});

window.resetExercise = resetExercise;

resetExercise();
