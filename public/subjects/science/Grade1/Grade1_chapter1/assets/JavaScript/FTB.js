const questions = [
  {
    question: "Q1. People who belong to a family are called ______.",
    answer: "family members",
    image: "../assets/images/uncles.png",
  },
  {
    question: "Q2. Father, mother and ______ live in a small family.",
    answer: "children",
    image: "../assets/images/small-family.png",
  },
  {
    question: "Q3. We brush our teeth and take a bath in the ______.",
    answer: "bathroom",
    image: "../assets/images/bath.png",
  },
  {
    question: "Q4. We find ______ houses mostly in villages.",
    answer: "kutcha",
    image: "../assets/images/kutcha.png",
  },
  {
    question: "Q5. We cook food in the ______.",
    answer: "kitchen",
    image: "../assets/images/cook.png",
  },
];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const input = document.getElementById("answerInput");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  image.src = q.image;

  input.value = answers[currentQuestion] || "";
  input.disabled = answers[currentQuestion] !== null;
  submitBtn.disabled = answers[currentQuestion] !== null || !input.value.trim();

  input.classList.remove("input-wrong", "input-correct");

  if (answers[currentQuestion] !== null) {
    input.classList.add("input-correct");
  }

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
}

input.addEventListener("input", () => {
  if (answers[currentQuestion] === null) {
    submitBtn.disabled = !input.value.trim();
  }
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

submitBtn.onclick = function () {
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    answers[currentQuestion] = userAnswer;
    score++;

    input.classList.remove("input-wrong");
    input.classList.add("input-correct");

    speak("Correct");
    smallConfetti();
    showPopup(true);

    loadQuestion();

    if (answers.every((a) => a !== null)) {
      setTimeout(showFinal, 1600);
    }
  } else {
    input.classList.remove("input-correct");
    input.classList.add("input-wrong");

    showPopup(false);
    speak("Wrong");

    setTimeout(() => {
      input.classList.remove("input-wrong");
    }, 600);

    input.value = "";
    submitBtn.disabled = true;
  }
};

nextBtn.onclick = function () {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
};

prevBtn.onclick = function () {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
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
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
