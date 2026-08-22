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
    q: "Q1. A vegetarian food.",
    correct: "Vegetables",
    options: ["Vegetables", "Meat"],
  },
  {
    q: "Q2. A body-building food.",
    correct: "Eggs",
    options: ["Eggs", "Roti"],
  },
  {
    q: "Q3. A Protective food.",
    correct: "Fruits",
    options: ["Fruits","Junkfood"],
  }
];

const optionImages = {
  Vegetables: "../assets/images/vegetables.png",
  Meat: "../assets/images/meat.png",
  Eggs: "../assets/images/E.png",
  Roti: "../assets/images/roti.png",
  Fruits: "../assets/images/fruits.png",
  Junkfood: "../assets/images/junkfood.png",
  
  
};

let current = 0,
  score = 0;
// const state = quizData.map(() => ({ selected: [], done: false }));
const state = quizData.map(() => ({ answered: false }));
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
  const q = quizData[current];
  const s = state[current];

  // set question
  qEl.textContent = q.q;

  // clear old options
  optEl.innerHTML = "";

  // navigation buttons
  prevBtn.disabled = current === 0;
  nextBtn.disabled = !s.answered;

  updateProgress();

  // create options
  q.options.forEach((opt) => {
    const d = document.createElement("div");
    d.className = "option";

    d.innerHTML = `
      <img src="${optionImages[opt]}" alt="${opt}">
      <span>${opt}</span>
    `;

    // disable options if already answered
   if (s.answered) {

  d.classList.add("disabled");

  /* KEEP CORRECT ANSWER LOCKED */

  if(opt === q.correct){
    d.classList.add("correct");
  }

}

    d.onclick = () => selectOption(d, opt);

    optEl.appendChild(d);
  });
}
function selectOption(el, ans) {
  const q = quizData[current];
  const s = state[current];

  if (s.answered) return;

  addTempBorder(el, ans === q.correct);

  if (ans === q.correct) {
    // ✅ CORRECT
    s.answered = true;

    el.classList.add("correct");
    speak("Correct");
    showPopup(true);
    score++;

    // lock all options
    document.querySelectorAll(".option").forEach((o) =>
      o.classList.add("disabled")
    );

    // ✅ enable next ONLY here
    nextBtn.disabled = false;

    // 🎉 confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // last question
    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1500);
    }

  } else {
    // ❌ WRONG
    el.classList.add("wrong");
    speak("Wrong");
    showPopup(false);

    // 🚫 keep next disabled
    nextBtn.disabled = true;

    // allow retry
    setTimeout(() => {
      el.classList.remove("wrong");
    }, 500);
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

  document.getElementById("finalScore").textContent = `Score: ${score}/3`;
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
