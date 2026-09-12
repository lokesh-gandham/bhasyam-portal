// ===== QUESTION DATA (matches the worksheet: a-f) =====
// Add more questions here any time - just follow the same shape.
const quizData = [
  { tens: 2, ones: 4, answer: 24, options: [23, 25, 24], answered: false }, // a) 2 tens 4 ones
  { tens: 6, ones: 0, answer: 60, options: [59, 60, 61], answered: false }, // b) 6 tens
  { tens: 1, ones: 8, answer: 18, options: [18, 17, 19], answered: false }, // c) 1 ten 8 ones
  { tens: 9, ones: 1, answer: 91, options: [91, 90, 92], answered: false }, // d) 9 tens 1 one
  { tens: 8, ones: 3, answer: 83, options: [82, 83, 84], answered: false }, // e) 8 tens 3 ones
  { tens: 7, ones: 2, answer: 72, options: [71, 73, 72], answered: false }, // f) 7 tens 2 ones
];

// ===== IMAGE PATHS (replace these files with your own art) =====
const IMG = {
  bundle: "../assets/images/10.png",
  one: "../assets/images/one.png",
  leftMagnet: "../assets/images/lm.png",
  rightMagnet: "../assets/images/rightMagnet.png",
};


let index = 0;
let score = 0;

// ===== DOM =====
const progressEl = document.getElementById("progress");
const bundlesContainer = document.getElementById("bundlesContainer");
const onesContainer = document.getElementById("onesContainer");
const tensLabel = document.getElementById("tensLabel");
const onesLabel = document.getElementById("onesLabel");
const answersContainer = document.getElementById("answersContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// ===== SOUND =====
function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
 function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-US";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }

// ===== CONFETTI =====
function fireConfettiAt(el) {
  if (window.innerWidth < 769 || !window.confetti) return;
  const rect = el.getBoundingClientRect();
  confetti({
    particleCount: 26,
    spread: 55,
    startVelocity: 28,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: ["#e6473f", "#3a6fd8", "#f7b733", "#8bba8a", "#c9a8e0"],
  });
}

function fireBigConfetti() {
  if (window.innerWidth < 769 || !window.confetti) return;
  const duration = 2000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ===== SPARKLES (only around the correct option) =====
function spawnSparkles(el) {
  const icons = ["✨", "⭐", "🌟"];
  const count = 3;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = (i / count) * Math.PI * 2;
    const radius = 60;
    s.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
    s.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
    s.style.animationDelay = `${i * 0.04}s`;
    el.appendChild(s);
    setTimeout(() => s.remove(), 750);
  }
}

// ===== BUILD VISUALS (image-based) =====
function createBundle(imagePath) {
  const slot = document.createElement("div");
  slot.className = "bundle-slot";

  const img = document.createElement("img");
  img.src = imagePath || IMG.bundle;
  img.alt = "Bundle of 10 magnets";
  img.className = "bundle-img";

  slot.appendChild(img);
  return slot;
}

function createOneBar(imagePath) {
  const slot = document.createElement("div");
  slot.className = "one-slot";

  const img = document.createElement("img");
  img.src = imagePath || IMG.one;
  img.alt = "One magnet";
  img.className = "magnet-img";

  slot.appendChild(img);
  return slot;
}

function renderVisuals(q) {
  const images = q.images || {};

  // ===== TENS =====
  bundlesContainer.innerHTML = "";

  for (let i = 0; i < q.tens; i++) {
    bundlesContainer.appendChild(createBundle(images.bundle));
  }

  // ===== ONES =====
  onesContainer.innerHTML = "";
  onesContainer.classList.toggle("large-one", q.tens > 5);

  for (let i = 0; i < q.ones; i++) {
    onesContainer.appendChild(createOneBar(images.one));
  }

  tensLabel.textContent =
    `There are ${q.tens} ten${q.tens === 1 ? "" : "s"}`;

  onesLabel.textContent =
    `There are ${q.ones} one${q.ones === 1 ? "" : "s"}`;
}

// ===== BUILD ANSWER OPTIONS (image-based horseshoe magnets) =====
function createOption(value, imagePath) {
  const opt = document.createElement("div");
  opt.className = "magnet-option";
  opt.dataset.value = value;

  opt.innerHTML = `
    <img src="${IMG.leftMagnet}" alt="" class="option-magnet option-magnet-left">
    <span class="hs-number">${value}</span>
    <img src="${IMG.rightMagnet}" alt="" class="option-magnet option-magnet-right">
  `;

  opt.addEventListener("click", () => selectAnswer(value, opt));
  return opt;
}

function renderAnswers(q) {
  answersContainer.innerHTML = "";
  answersContainer.classList.toggle("later-questions", index >= 3);
  const imagePath = q.images && q.images.horseshoe;
  q.options.forEach((value) => {
    const opt = createOption(value, imagePath);
    if (q.answered) {
      opt.classList.add("disabled-all");
      if (value === q.answer) {
        opt.classList.add("correct", "locked");
      }
    }
    answersContainer.appendChild(opt);
  });
}

// ===== LOAD QUESTION =====
function loadQuestion() {
  const q = quizData[index];

  progressEl.textContent = `Q${index + 1}`;
  renderVisuals(q);
  renderAnswers(q);

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;

  const isLast = index === quizData.length - 1;
  nextBtn.textContent = isLast ? "Finish" : "Next →";
}

// ===== ANSWER LOGIC =====
function selectAnswer(value, el) {
  const q = quizData[index];
  if (q.answered) return;

  if (value === q.answer) {
    q.answered = true;
    score++;

    el.classList.add("correct", "locked");
    document.querySelectorAll(".magnet-option").forEach((o) => o.classList.add("disabled-all"));

    spawnSparkles(el);
    speak("correct");
    // playSound(correctSound);
    showPopup(true, q);
    nextBtn.disabled = false;

    const isLast = index === quizData.length - 1;
    if (isLast) {
      setTimeout(() => {
        fireBigConfetti();
        showFinal();
      }, 1600);
    } else {
      fireConfettiAt(el);
    }
  } else {
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 450);
    speak("wrong");
    // playSound(wrongSound);
    showPopup(false, q);
  }
}

// ===== NAVIGATION =====
prevBtn.onclick = () => {
  if (index === 0) return;
  index--;
  loadQuestion();
};

nextBtn.onclick = () => {
  const q = quizData[index];
  if (!q.answered) return;

  const isLast = index === quizData.length - 1;
  if (isLast) {
    showFinal();
    return;
  }
  index++;
  loadQuestion();
};

// ===== POPUPS =====
function showPopup(isCorrect, q) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = `${q.tens} tens and ${q.ones} ones make ${q.answer}.`;
  } else {
    icon.textContent = "❌";
    title.textContent = "Try Again!";
    msg.textContent = "Think about the tens and ones.";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  const total = quizData.length;
  document.getElementById("finalScore").textContent = `${score} / ${total} Correct`;

  const starCount = Math.max(1, Math.round((score / total) * 3));
  document.getElementById("stars").textContent = "⭐".repeat(starCount);
}

// ===== START =====
loadQuestion();