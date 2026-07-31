const questions = [
  {
    q: "Q1. I get my uniforms stitched by a ________.",
    a: "tailor",
    img: "../assets/images/ftb1.png",
  },
  {
    q: "Q2. If there is a fire accident, a ________ will help us.",
    a: "firefighter",
    img: "../assets/images/ftb2.png",
  },
  {
    q: "Q3. A ________ delivers letters to our houses.",
    a: "postman",
    img: "../assets/images/ftb3.png",
  },
  {
    q: "Q4. My aunt lost her jewellery. She should go to the ________ for help.",
    a: "police station",
    img: "../assets/images/ftb4.png",
  },
  {
    q: "Q5. Every day, my granny enjoys a nice walk in the ________.",
    a: "park",
    img: "../assets/images/ftb5.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
// const partsProgress = document.getElementById("partsProgress");
// partsProgress.style.gridTemplateColumns = `repeat(${questions.length}, 1fr)`;

// questions.forEach(() => {
//   const part = document.createElement("div");
//   part.className = "part";
//   partsProgress.appendChild(part);
// });

function goHome() {
  window.location.href = "../index.html";
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

function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", answers[i] !== null);
  });
}

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src = q.img;

  input.value = answers[index] || "";
  input.disabled = answers[index] !== null;
  check.disabled = answers[index] !== null || !input.value.trim();

  inputBox.classList.toggle("correct", answers[index] !== null);

  // ? BUTTON RULES
  prev.disabled = index === 0;
  next.disabled = answers[index] === null;

  updateProgress();
}

input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

input.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

check.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
    speak("Correct");
    showPopup(true);
    updateProgress();
    smallConfetti();

    load();

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    input.value = "";
    check.disabled = true;
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
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
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

load();
