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
const PAIR_COLORS = [
  { bg: "#e8f5e9", border: "#43a047", text: "#1b5e20", check: "#43a047" },
  { bg: "#fce4ec", border: "#e91e63", text: "#880e4f", check: "#e91e63" },
  { bg: "#fff8e1", border: "#ffa000", text: "#e65100", check: "#ffa000" },
  { bg: "#e0f2f1", border: "#00897b", text: "#004d40", check: "#00897b" },
  { bg: "#f3e5f5", border: "#9c27b0", text: "#4a148c", check: "#9c27b0" },
  { bg: "#e3f2fd", border: "#1e88e5", text: "#0d47a1", check: "#1e88e5" },
];

const quizData = [
  {
    q: "Match the following",
    img: "",
    pairs: [
      { left: "Sun ☀️", right: "Star ⭐" },
      { left: "Moon 🌙", right: "Satellite 🛰️" },
      { left: "Earth 🌍", right: "Planet 🌎" },
      { left: "Sky ☁️", right: "Clouds ☁️" },
    ],
  },
  {
    q: "Match the following",
    img: "",
    pairs: [
      { left: "Teacher 👩‍🏫", right: "School 🏫" },
      { left: "Doctor 🩺", right: "Hospital 🏥" },
      { left: "Pilot ✈️", right: "Airplane 🛩️" },
      { left: "Farmer 🧑‍🌾", right: "Field 🌾" },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let matches = [];
let answeredQuestions = Array(quizData.length).fill(false);

const questionEl = document.getElementById("question");
const board = document.getElementById("matchBoard");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let selectedItem = null;

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

function hexToRgb(hex) {
  const v = parseInt(hex.replace("#", ""), 16);
  return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`;
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getHintEl() {
  let el = document.querySelector(".hint");
  if (!el) {
    el = document.createElement("p");
    el.className = "hint";
    document.querySelector(".match-header").appendChild(el);
  }
  return el;
}

function loadQuestion() {
  const q = quizData[currentQuestionIndex];
  questionEl.textContent = q.q;
  const imgEl = document.getElementById("questionImg");
  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = "inline";
  } else {
    imgEl.style.display = "none";
  }
  getHintEl().textContent = "👆 Tap an item from Column A, then tap its match in Column B";
  board.innerHTML = "";

  const leftItems = q.pairs.map(p => ({ text: p.left, matched: false, pairIndex: -1 }));
  const rightItems = shuffleArray(q.pairs.map((p, i) => ({ text: p.right, originalIndex: i, matched: false })));

  matches = [];
  selectedItem = null;

  const leftCol = document.createElement("div");
  leftCol.className = "match-column";
  const leftTitle = document.createElement("h3");
  leftTitle.textContent = "📌 Column A";
  leftCol.appendChild(leftTitle);

  const rightCol = document.createElement("div");
  rightCol.className = "match-column";
  const rightTitle = document.createElement("h3");
  rightTitle.textContent = "📌 Column B";
  rightCol.appendChild(rightTitle);

  leftItems.forEach((item, idx) => {
    const el = document.createElement("div");
    el.className = "match-item left-item";
    el.textContent = item.text;
    el.dataset.index = idx;
    el.onclick = () => selectLeft(el, idx);
    leftCol.appendChild(el);
  });

  rightItems.forEach((item) => {
    const el = document.createElement("div");
    el.className = "match-item right-item";
    el.textContent = item.text;
    el.dataset.originalIndex = item.originalIndex;
    el.onclick = () => selectRight(el, item.originalIndex);
    rightCol.appendChild(el);
  });

  if (answeredQuestions[currentQuestionIndex]) {
    const leftEls = leftCol.querySelectorAll(".left-item");
    const rightEls = rightCol.querySelectorAll(".right-item");
    const qPairs = q.pairs;

    qPairs.forEach((pair, i) => {
      const colorIdx = i % PAIR_COLORS.length;
      const c = PAIR_COLORS[colorIdx];
      leftEls[i].classList.add("matched");
      leftEls[i].onclick = null;
      leftEls[i].style.setProperty("--check-color", c.check);
      leftEls[i].style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
      leftEls[i].style.background = c.bg;
      leftEls[i].style.borderColor = c.border;
      leftEls[i].style.color = c.text;
      rightEls.forEach(el => {
        if (parseInt(el.dataset.originalIndex) === i) {
          el.classList.add("matched");
          el.onclick = null;
          el.style.setProperty("--check-color", c.check);
          el.style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
          el.style.background = c.bg;
          el.style.borderColor = c.border;
          el.style.color = c.text;
        }
      });
    });
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  board.appendChild(leftCol);
  board.appendChild(rightCol);

  prevBtn.disabled = currentQuestionIndex === 0;
}

function selectLeft(el, idx) {
  if (el.classList.contains("matched")) return;
  selectedItem = { type: "left", el, idx };
  document.querySelectorAll(".left-item").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");
}

function selectRight(el, originalIndex) {
  if (el.classList.contains("matched") || !selectedItem || selectedItem.type !== "left") return;

  const q = quizData[currentQuestionIndex];
  const leftIdx = selectedItem.idx;
  const isCorrect = leftIdx === originalIndex;

  if (isCorrect) {
    matches.push({ left: leftIdx, right: originalIndex });

    const colorIdx = leftIdx % PAIR_COLORS.length;
    const c = PAIR_COLORS[colorIdx];

    selectedItem.el.classList.add("matched");
    selectedItem.el.onclick = null;
    selectedItem.el.classList.remove("selected");
    selectedItem.el.style.setProperty("--check-color", c.check);
    selectedItem.el.style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
    selectedItem.el.style.background = c.bg;
    selectedItem.el.style.borderColor = c.border;
    selectedItem.el.style.color = c.text;

    el.classList.add("matched");
    el.onclick = null;
    el.style.setProperty("--check-color", c.check);
    el.style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
    el.style.background = c.bg;
    el.style.borderColor = c.border;
    el.style.color = c.text;

    speak("Correct");
    smallConfetti();
    showPopup(true);

    selectedItem = null;

    const allLeft = document.querySelectorAll(".left-item");
    const allMatched = [...allLeft].every(e => e.classList.contains("matched"));

    if (allMatched) {
      score += q.pairs.length;
      answeredQuestions[currentQuestionIndex] = true;
      nextBtn.disabled = false;

      if (answeredQuestions.every(a => a)) {
        setTimeout(showFinal, 1700);
      }
    }
  } else {
    el.classList.add("wrong");
    speak("Try again");
    showPopup(false);

    setTimeout(() => {
      el.classList.remove("wrong");
    }, 600);
  }
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  document.querySelectorAll(".sparkle").forEach(el => el.remove());

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";
  icon.innerHTML = isCorrect ? "&#10003;" : "&#10007;";
  title.textContent = isCorrect ? "Right!" : "Try Again!";
  msg.textContent = isCorrect ? "Great job!" : "Have another go.";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${quizData.reduce((s, q) => s + q.pairs.length, 0)}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

prevBtn.onclick = () => {
  currentQuestionIndex--;
  loadQuestion();
};

nextBtn.onclick = () => {
  currentQuestionIndex++;
  loadQuestion();
};

loadQuestion();
