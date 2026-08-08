/**************** QUIZ DATA ****************/
const quizData = [
  {
    title: "Q1. The ________ is green in the morning dew.",
    image: "../assets/images/morningdew1.png",
    options: [
      { text: "Sky", img: "../assets/images/sky-removebg-preview.png" },
      { text: "Grass", img: "../assets/images/grass5 (1).png" },
      { text: "World", img: "../assets/images/world-removebg-preview.png" },
      { text: "Dove", img: "../assets/images/dove-removebg-preview.png" },
    ],
    answer: "Grass",
  },
  {
    title: "Q2. The dove is __________.",
    image: "../assets/images/dove1-removebg-preview.png",
    options: [
      { text: "Beautiful", img: "../assets/images/beautiful-removebg-preview.png" },
      { text: "Flying", img: "../assets/images/flying-removebg-preview.png" },
      { text: "Musical", img: "../assets/images/singing-removebg-preview.png" },
      { text: "Dancing", img: "../assets/images/dancing-removebg-preview.png" },
    ],
    answer: "Musical",
  },
  {
    title: "Q3. Our skin feels the _____________ that blows.",
    image: "../assets/images/airquestionimage.png",
    imageClass: "small",
    options: [
      { text: "Wind", img: "../assets/images/wind.png" },
      { text: "Air", img: "../assets/images/air.png" },
      { text: "Breeze", img: "../assets/images/breeze24.png" },
      { text: "Smoke", img: "../assets/images/smoke.png" },
    ],
    answer: "Breeze",
  },
  {
    title: "Q4. _____________ is there in all creation.",
    image: "../assets/images/allcreattions-removebg-preview.png",
    options: [
      { text: "Man", img: "../assets/images/man-removebg-preview.png" },
      { text: "God", img: "../assets/images/god-removebg-preview.png" },
      { text: "World", img: "../assets/images/world-removebg-preview.png" },
      { text: "Sky", img: "../assets/images/sky2-removebg-preview.png" },
    ],
    answer: "God",
  },
];

function showCorrectConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    origin: { x: 0.5, y: 0.6 }
  });
}

/* ================= ANSWER STATE ================= */
const answerState = quizData.map(() => ({
  answered: false,
}));

/* ================= STATE ================= */
let current = 0;
let score = 0;
let answeredCorrect = false;

/* ================= ELEMENTS ================= */
const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ================= TTS ================= */
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* ================= NAVIGATION ================= */
function goHome() {
  window.location.href = "../index.html";
}

/* ================= PROGRESS ================= */
function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, index) => {
    part.classList.remove("active", "done");
    if (answerState[index].answered) {
      part.classList.add("done");
    }
    if (index === current) {
      part.classList.add("active");
    }
  });
}

/* ================= LOAD QUESTION ================= */
function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Question image";
  animalImg.className = q.imageClass || "";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `
<div class="img-wrap">
   <img src="${opt.img}" class="option-img">
</div>
  <span class="label">${opt.text}</span>
`;

    if (state.answered) {
      div.classList.add("disabled");
      if (opt.text === q.answer) {
        div.classList.add("correct-lock");
      }
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;

  updateProgress();
}

/* ================= CHECK ANSWER ================= */
function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  if (selected === correct) {
    state.answered = true;
    updateProgress();
    score++;

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    optionDiv.classList.add("correct-lock");
    nextBtn.disabled = false;

    showCorrectConfetti();
    speak("Correct");
    showPopup(true);

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    optionDiv.classList.add("wrong-shake");
    setTimeout(() => optionDiv.classList.remove("wrong-shake"), 600);
  }
}

/* ================= BUTTONS ================= */
nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

/* ================= KID POPUP (from chapter 1) ================= */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  document.getElementById("finalScore").textContent = "Your Score: " + score + " / " + quizData.length;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 300);
}

/* ================= START ================= */
loadQuestion();