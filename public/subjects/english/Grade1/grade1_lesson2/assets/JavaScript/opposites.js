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
  {
    q: "Match the words with their opposites.",
    img: "",
    pairs: [
      { left: "ask", right: "reply", leftImg: "../assets/images/ask-removebg-preview.png", rightImg: "../assets/images/reply1.png" },
      { left: "many", right: "few", leftImg: "../assets/images/many-removebg-preview.png", rightImg: "../assets/images/few-removebg-preview.png" },
      { left: "give", right: "take", leftImg: "../assets/images/give-removebg-preview.png", rightImg: "../assets/images/take-removebg-preview.png" },
      { left: "happy", right: "sad", leftImg: "../assets/images/happy1-removebg-preview.png", rightImg: "../assets/images/sad-removebg-preview.png" },
      { left: "kind", right: "cruel", leftImg: "../assets/images/kind-removebg-preview.png", rightImg: "../assets/images/cruel-removebg-preview.png" },
    ],
    rightOrder: [1, 0, 3, 4, 2],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let matches = [];
let answeredQuestions = Array(quizData.length).fill(false);

const questionEl = document.getElementById("question");
const board = document.getElementById("matchBoard");


let selectedItem = null;

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

function loadQuestion() {
  const q = quizData[currentQuestionIndex];
  questionEl.textContent = q.q;
  board.innerHTML = "";

  const leftItems = q.pairs.map(p => ({ text: p.left, matched: false }));
  const rightItems = (q.rightOrder || q.pairs.map((_, i) => i))
    .map(i => ({ text: q.pairs[i].right, originalIndex: i, matched: false }));

  matches = [];
  selectedItem = null;

  const leftCol = document.createElement("div");
  leftCol.className = "match-row top-row";

  const rightCol = document.createElement("div");
  rightCol.className = "match-row bottom-row";

  const labels = "abcdefghij";

  leftItems.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "match-item-wrapper";
    const pair = q.pairs[idx];
    if (pair.leftImg) {
      const img = document.createElement("img");
      img.src = pair.leftImg;
      img.alt = "";
      wrapper.appendChild(img);
    }
    const el = document.createElement("div");
    el.className = "match-item left-item";
    const span = document.createElement("span");
    span.textContent = (idx + 1) + ". " + cap(item.text);
    el.appendChild(span);
    el.dataset.index = idx;
    wrapper.appendChild(el);
    wrapper.onclick = () => selectLeft(el, idx);
    leftCol.appendChild(wrapper);
  });

  rightItems.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "match-item-wrapper";
    const el = document.createElement("div");
    el.className = "match-item right-item";
    const pair = q.pairs[item.originalIndex];
    const span = document.createElement("span");
    span.textContent = labels[idx] + ". " + cap(item.text);
    el.appendChild(span);
    el.dataset.originalIndex = item.originalIndex;
    wrapper.appendChild(el);
    wrapper.onclick = () => selectRight(el, item.originalIndex);
    if (pair.rightImg) {
      const img = document.createElement("img");
      img.src = pair.rightImg;
      img.alt = "";
      wrapper.appendChild(img);
    }
    rightCol.appendChild(wrapper);
  });

  if (answeredQuestions[currentQuestionIndex]) {
    const leftEls = leftCol.querySelectorAll(".left-item");
    const rightEls = rightCol.querySelectorAll(".right-item");
    q.pairs.forEach((pair, i) => {
      leftEls[i].classList.add("matched");
      leftEls[i].parentElement.onclick = null;
      rightEls.forEach(el => {
        if (parseInt(el.dataset.originalIndex) === i) {
          el.classList.add("matched");
          el.parentElement.onclick = null;
        }
      });
      matches.push({ left: i, right: i });
    });
  }

  board.appendChild(leftCol);
  board.appendChild(rightCol);
  if (answeredQuestions[currentQuestionIndex]) drawLines();
}

function drawLines() {
  const existing = board.querySelector(".opposite-lines");
  if (existing) existing.remove();

  const boardRect = board.getBoundingClientRect();
  const width = boardRect.width;
  const height = boardRect.height;
  if (width <= 0 || height <= 0) return;

  let svgContent = `<svg class="opposite-lines" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;inset:0;width:${width}px;height:${height}px;pointer-events:none;z-index:1;overflow:visible">`;

  matches.forEach(match => {
    const leftEl = board.querySelector(`.left-item[data-index="${match.left}"]`);
    const rightEl = [...board.querySelectorAll(".right-item")]
      .find(el => Number(el.dataset.originalIndex) === match.right);
    if (!leftEl || !rightEl) return;

    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();
    const x1 = leftRect.left + leftRect.width / 2 - boardRect.left;
    const y1 = leftRect.bottom - boardRect.top;
    const x2 = rightRect.left + rightRect.width / 2 - boardRect.left;
    const y2 = rightRect.top - boardRect.top;

    svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    svgContent += `<circle cx="${x1}" cy="${y1}" r="4" />`;
    svgContent += `<circle cx="${x2}" cy="${y2}" r="4" />`;
  });

  svgContent += "</svg>";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgContent;
  board.appendChild(wrapper.firstElementChild);
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
    selectedItem.el.classList.add("matched");
    selectedItem.el.parentElement.onclick = null;
    selectedItem.el.classList.remove("selected");
    el.classList.add("matched");
    el.parentElement.onclick = null;
    drawLines();
    speak("Correct");
    smallConfetti();
    showPopup(true);
    selectedItem = null;

    const allLeft = document.querySelectorAll(".left-item");
    const allMatched = [...allLeft].every(e => e.classList.contains("matched"));

    if (allMatched) {
      score += q.pairs.length;
      answeredQuestions[currentQuestionIndex] = true;
      if (answeredQuestions.every(a => a)) setTimeout(showFinal, 1700);
    }
  } else {
    el.classList.add("wrong");
    speak("Try again");
    showPopup(false);
    setTimeout(() => { el.classList.remove("wrong"); }, 600);
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
  const total = quizData.reduce((s, q) => s + q.pairs.length, 0);
  document.getElementById("finalScore").textContent = `Score: ${score} / ${total}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

window.addEventListener("resize", () => {
  if (matches.length) drawLines();
});

loadQuestion();
