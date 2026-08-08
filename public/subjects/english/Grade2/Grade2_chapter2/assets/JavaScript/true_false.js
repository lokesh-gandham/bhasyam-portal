let popupTimer = null;
let finalPopupShown = false;

const quizData = [
  {
    q: "Q1. Hydrilla and tape grass are floating plants.",
    a: false,
    img: "../assets/images/tf1.png",
    answered: false,
  },
  {
    q: "Q2. Cacti plants grow in coastal regions",
    a: false,
    img: "../assets/images/Cactus1.png",
    answered: false,
  },
  {
    q: "Q3. Terrestrial plants have flat leaves to trap sunlight.",
    a: true,
    img: "../assets/images/tf3.png",
    answered: false,
  },
  {
    q: "Q4. Deciduous trees lose their leaves once in a year.",
    a: true,
    img: "../assets/images/tf4.png",
    answered: false,
  },
  {
    q: "Q5. Coniferous trees bear flowers.",
    a: false,
    img: "../assets/images/evergreen-plant.png",
    answered: false,
  },
];

let index = 0,
  score = 0;
const questionEl = document.getElementById("question");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionImg = document.getElementById("questionImg");

// const partsProgress = document.getElementById("partsProgress");
// partsProgress.style.gridTemplateColumns = `repeat(${quizData.length}, 1fr)`;

// quizData.forEach(() => {
//   const part = document.createElement("div");
//   part.className = "part";
//   partsProgress.appendChild(part);
// });

function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", quizData[i].answered);
  });
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function loadQuestion() {
  const q = quizData[index];

  questionEl.textContent = q.q;
  questionImg.src = q.img;

  // reset button states
  trueBtn.className = "true";
  falseBtn.className = "false";
  trueBtn.disabled = false;
  falseBtn.disabled = false;

  if (q.answered) {
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
    trueBtn.disabled = true;
    falseBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;

  updateProgress();
}

function answer(user) {
  const q = quizData[index];
  if (q.answered) return;

  const correct = q.a === user;

  speak(correct ? "Correct" : "Wrong");

  if (correct) {
    q.answered = true;
    score++;

    const correctBtn = user ? trueBtn : falseBtn;
    const wrongBtn = user ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");

    showPopup(true);

    nextBtn.disabled = false;

    if (index === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
  }
}

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
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

loadQuestion();
