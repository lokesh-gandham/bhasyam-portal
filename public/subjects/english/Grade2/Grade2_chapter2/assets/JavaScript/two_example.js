let popupTimer = null;

function addTempBorder(el, isCorrect) {
  const cls = isCorrect ? "temp-correct" : "temp-wrong";
  el.classList.add(cls);

  setTimeout(() => {
    el.classList.remove(cls);
  }, 500); // blink duration
}
const quizData = [
  {
    q: "Q1. Submerged plants",
    correct: ["Hydrilla", "Tape Grass"],
    options: ["Hydrilla", "Mango", "Rose", "Tape Grass"],
  },
  {
    q: "Q2. Deciduous trees",
    correct: ["Cheery", "Beech"],
    options: ["Teak", "Sal", "Cheery", "Beech"],
  },
  {
    q: "Q3. Coastal plants",
    correct: ["Palm", "Coconut"],
    options: ["Palm", "Tulsi", "Coconut", "Rose"],
  },
  {
    q: "Q4. Coniferous trees",
    correct: ["Deodar", "Fir"],
    options: ["Neem", "Banyan", "Deodar", "Fir"],
  },
  {
    q: "Q5. Desert plants",
    correct: ["Cactus", "Date Palm"],
    options: ["Cactus", "Lotus", "Rice", "Date Palm"],
  },
];

const optionImages = {
  Hydrilla: "../assets/images/hydrilla-plant.png",
  "Tape Grass": "../assets/images/tape-grass.png",
  Rose: "../assets/images/rose-plant.png",
  Mango: "../assets/images/mango-tree.png",
  Teak: "../assets/images/teak-img.png",
  Sal: "../assets/images/Sal.png",
  Cheery: "../assets/images/cheery-plant.png",
  Beech: "../assets/images/Beech-plant.png",
  Deodar: "../assets/images/pine-tree.png",
  Fir: "../assets/images/evergreen-plant.png",
  Palm: "../assets/images/Palm.png",
  Coconut: "../assets/images/coconut-tree.png",
  Tulsi: "../assets/images/Tulsi.png",
  Neem: "../assets/images/neem-img.png",
  Banyan: "../assets/images/Banyan.png",
  Cactus: "../assets/images/Cactus1.png",
  "Date Palm": "../assets/images/palm-img.png",
  Lotus: "../assets/images/lotus-img.png",
  Rice: "../assets/images/rice-plant.png",
};

let current = 0,
  score = 0;
const state = quizData.map(() => ({ selected: [], done: false }));

const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", state[i].done);
  });
}

function loadQuestion() {
  const q = quizData[current],
    s = state[current];
  qEl.textContent = q.q + " – choose two";
  optEl.innerHTML = "";
  prevBtn.disabled = current === 0;
  nextBtn.disabled = !s.done;
  updateProgress();

  q.options.forEach((opt) => {
    const d = document.createElement("div");
    d.className = "option";
    d.innerHTML = `
  <img src="${optionImages[opt]}" alt="${opt}">
  <span>${opt}</span>
`;

    if (s.selected.includes(opt)) d.classList.add("correct");
    if (s.done && !s.selected.includes(opt)) d.classList.add("disabled");
    d.onclick = () => selectOption(d, opt);
    optEl.appendChild(d);
  });
}

function selectOption(el, ans) {
  const q = quizData[current],
    s = state[current];
  if (s.done) return;

  addTempBorder(el, q.correct.includes(ans));

  if (q.correct.includes(ans)) {
    el.classList.add("correct");
    s.selected.push(ans);
    speak("Correct");
    showPopup(true);

    if (s.selected.length === 2) {
      s.done = true;
      score++;
      updateProgress();
      document
        .querySelectorAll(".option:not(.correct)")
        .forEach((o) => o.classList.add("disabled"));

      /* ✅ LAST QUESTION → FINAL SCORE (STAYS ON SCREEN) */
      if (current === quizData.length - 1) {
        setTimeout(showFinal, 1600);
      } else {
        nextBtn.disabled = false;
      }
    }
  } else {
    el.classList.add("wrong");
    speak("Wrong");
    showPopup(false);
  }
}

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

// buildGlowSteps();
loadQuestion();
