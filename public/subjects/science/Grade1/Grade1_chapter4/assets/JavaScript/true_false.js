const quizData = [
  {
    q: "Q1. We should eat food at proper time.",
    a: true,
    img: "../assets/images/Boyeatt.png",
    answered: false,
  },
  {
    q: "Q2. We should not chew our food.",
    a: false,
    img: "../assets/images/BoyChewak.png",
    answered: false,
  },
  {
    q: "Q3. We should drink at least four glasses of water daily.",
    a: false, 
    img: "../assets/images/BoyDrink.png",
    answered: false,
  },
  {
    q: "Q4. We should exercise regularly.",
    a: true,
    img: "../assets/images/BoyExercise.png",
    answered: false,
  },
  {
    q: "Q5. We should play outdoor games.",
    a: true,
    img: "../assets/images/BoyPlay.png",
    answered: false,
  },
];

let index = 0;
let score = 0;

const questionEl = document.getElementById("question");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imgEl = document.getElementById("questionImg");

prevBtn.disabled = true;
nextBtn.disabled = true;

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function loadQuestion() {
  const q = quizData[index];

  imgEl.src = q.img;
  imgEl.style.display = "block";

  questionEl.textContent = q.q;

  trueBtn.className = "true";
  falseBtn.className = "false";

  trueBtn.classList.remove("correct", "disabled");
  falseBtn.classList.remove("correct", "disabled");

  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);

  if (q.answered) {
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;
}

function answer(user) {
  const q = quizData[index];
  if (q.answered) return;

  const correct = q.a === user;

  speak(correct ? "Correct" : "Wrong");

  if (correct) {
    q.answered = true;

    if (!q.scored) {
      score++;
      q.scored = true;
    }
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("wrong", "disabled");

    showPopup(true);
    fireConfetti();

    nextBtn.disabled = false;

    if (index === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    const clickedBtn = user ? trueBtn : falseBtn;

    clickedBtn.classList.add("wrong");

    setTimeout(() => {
      clickedBtn.classList.remove("wrong");
    }, 600);
    showPopup(false);
  }
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "????";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "????";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quizData.length}`;
  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";

  fireConfettif();
}

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};

nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

loadQuestion();
