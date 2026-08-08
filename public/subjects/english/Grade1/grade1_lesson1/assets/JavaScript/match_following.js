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
  { bg: "#f5f0ff", border: "#7c5cbf", text: "#4a2a7a", check: "#7c5cbf" },
  { bg: "#fce4ec", border: "#e91e63", text: "#880e4f", check: "#e91e63" },
  { bg: "#fff8e1", border: "#ffa000", text: "#e65100", check: "#ffa000" },
  { bg: "#e0f2f1", border: "#00897b", text: "#004d40", check: "#00897b" },
  { bg: "#f3e5f5", border: "#9c27b0", text: "#4a148c", check: "#9c27b0" },
  { bg: "#e3f2fd", border: "#1e88e5", text: "#0d47a1", check: "#1e88e5" },
];

const quizData = [
  {
    q: "Match the common nouns with proper nouns",
    img: "",
    pairs: [
      { left: "Cat", leftImg: "../assets/images/cat.png", right: "Tom", rightImg: "../assets/images/tom-removebg-preview.png" },
      { left: "Cartoon", leftImg: "../assets/images/cartoon-removebg-preview.png", right: "Mickey Mouse", rightImg: "../assets/images/mickeymouse-removebg-preview.png" },
      { left: "City", leftImg: "../assets/images/city-removebg-preview.png", right: "Chennai", rightImg: "../assets/images/chennai-removebg-preview.png" },
      { left: "Girl", leftImg: "../assets/images/girl-removebg-preview.png", right: "Bhavya", rightImg: "../assets/images/bhavya-removebg-preview.png" },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let matches = [];
let answeredQuestions = Array(quizData.length).fill(false);

const questionEl = document.getElementById("question");
const board = document.getElementById("matchBoard");
const prevBtn = { disabled: false, onclick: null };
const nextBtn = { disabled: false, onclick: null };

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

function playSound(id) {
  const sound = document.getElementById(id);
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function drawLines() {
  const existing = board.querySelector(".match-lines");
  if (existing) existing.remove();

  const boardRect = board.getBoundingClientRect();
  const width = boardRect.width;
  const height = boardRect.height;
  if (width <= 0 || height <= 0) return;

  let svgContent = `<svg class="match-lines" xmlns="http://www.w3.org/2000/svg"
    width="${width}" height="${height}"
    viewBox="0 0 ${width} ${height}"
    style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;pointer-events:none;z-index:10;overflow:visible">`;

  matches.forEach((match) => {
    const leftEl = document.querySelectorAll(".left-item")[match.left];
    let rightEl = null;

    document.querySelectorAll(".right-item").forEach((el) => {
      if (parseInt(el.dataset.originalIndex, 10) === match.right) rightEl = el;
    });

    if (!leftEl || !rightEl) return;

    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();
    const x1 = leftRect.right - boardRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - boardRect.top;
    const x2 = rightRect.left - boardRect.left;
    const y2 = rightRect.top + rightRect.height / 2 - boardRect.top;
    const curve = Math.max(70, Math.abs(x2 - x1) * 0.45);

    svgContent += `<path d="M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}" fill="none"/>`;
    svgContent += `<circle cx="${x1}" cy="${y1}" r="6"/>`;
    svgContent += `<circle cx="${x2}" cy="${y2}" r="6"/>`;
  });

  svgContent += "</svg>";

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgContent.trim();
  board.appendChild(wrapper.firstElementChild);
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
  getHintEl().textContent = "Tap an item from Column A, then tap its match in Column B.";
  board.innerHTML = "";

  const leftItems = q.pairs.map(p => ({
    text: p.left,
    img: p.leftImg || "",
    matched: false,
    pairIndex: -1,
  }));
  const rightItems = shuffleArray(q.pairs.map((p, i) => ({
    text: p.right,
    img: p.rightImg || "",
    originalIndex: i,
    matched: false,
  })));

  matches = [];
  selectedItem = null;

  const leftCol = document.createElement("div");
  leftCol.className = "match-column";

  const rightCol = document.createElement("div");
  rightCol.className = "match-column";

  leftItems.forEach((item, idx) => {
    const el = document.createElement("div");
    el.className = "match-item left-item";
    el.innerHTML = `<div class="match-item-img">${item.img ? `<img src="${item.img}" alt="${item.text}">` : ""}</div><span>${item.text}</span>`;
    el.dataset.index = idx;
    el.onclick = () => selectLeft(el, idx);
    leftCol.appendChild(el);
  });

  rightItems.forEach((item) => {
    const el = document.createElement("div");
    el.className = "match-item right-item";
    el.innerHTML = `<span>${item.text}</span><div class="match-item-img">${item.img ? `<img src="${item.img}" alt="${item.text}">` : ""}</div>`;
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
      leftEls[i].style.color = c.text;
      rightEls.forEach(el => {
        if (parseInt(el.dataset.originalIndex) === i) {
          el.classList.add("matched");
          el.onclick = null;
          el.style.setProperty("--check-color", c.check);
          el.style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
          el.style.color = c.text;
        }
      });
      matches.push({ left: i, right: i });
    });
    nextBtn.disabled = currentQuestionIndex === quizData.length - 1;
  } else {
    nextBtn.disabled = true;
  }

  board.appendChild(leftCol);
  board.appendChild(rightCol);

  if (answeredQuestions[currentQuestionIndex]) {
    requestAnimationFrame(drawLines);
  }

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
    selectedItem.el.style.color = c.text;

    el.classList.add("matched");
    el.onclick = null;
    el.style.setProperty("--check-color", c.check);
    el.style.setProperty("--check-shadow", `rgba(${hexToRgb(c.check)}, 0.4)`);
    el.style.color = c.text;

    drawLines();
    speak("Correct");
    playSound("correctSound");
    smallConfetti();
    showPopup(true);

    selectedItem = null;

    const allLeft = document.querySelectorAll(".left-item");
    const allMatched = [...allLeft].every(e => e.classList.contains("matched"));

    if (allMatched) {
      score += q.pairs.length;
      answeredQuestions[currentQuestionIndex] = true;
      nextBtn.disabled = currentQuestionIndex === quizData.length - 1;

      if (answeredQuestions.every(a => a)) {
        setTimeout(showFinal, 1700);
      }
    }
  } else {
    el.classList.add("wrong");
    speak("Try again");
    playSound("wrongSound");
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
    `Your Score: ${score} / ${quizData.reduce((s, q) => s + q.pairs.length, 0)}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

prevBtn.onclick = () => {
  currentQuestionIndex--;
  loadQuestion();
};

nextBtn.onclick = () => {
  if (currentQuestionIndex >= quizData.length - 1) return;
  currentQuestionIndex++;
  loadQuestion();
};

loadQuestion();

window.addEventListener("resize", () => {
  if (matches.length) drawLines();
});
