/* ================= QUIZ DATA ================= */
/* ================= QUIZ DATA (PLANTS – FROM IMAGE) ================= */
/**************** QUIZ DATA ****************/
const quizData = [
  {
    title: "Q1. Vivek was good at ______ too.",
    image: "../assets/images/vivek.png",
    options: [
      { text: "studies", img: "../assets/images/mcq1-1.png" },
      { text: "sports", img: "../assets/images/mcq1-2.png"},
      { text: "drawing", img: "../assets/images/mcq1-3.png" },
      { text: "eating", img: "../assets/images//mcq1-4.png" },
    ],
    answer: "sports",
  },
  {
    title: "Q2. Vivek received ______ as gifts.",
    image: "../assets/images/gift.png",
    options: [
      { text: "books", img: "../assets/images/books.png" },
      { text: "cakes", img: "../assets/images/cake.png" },
      { text: "toys and colourful clothes", img: "../assets/images/toys.png" },
      { text: "colour pencils", img: "../assets/images/colorPencils.png" },
    ],
    answer: "toys and colourful clothes",
  },
  {
    title: "Q3. Aunt Saroja gifted Vivek a ______.",
    image: "../assets/images/auntyNboy.png",
    options: [
      { text: "toy", img: "../assets/images/toys.png" },
      { text: "tab", img: "../assets/images/tab.png" },
      { text: "dress", img: "../assets/images/top.png" },
      { text: "book", img: "../assets/images/books.png" },
    ],
    answer: "tab",
  },
  {
    title: "Q4. Vivek's parents told him to use the tab only to ______.",
    image: "../assets/images/tabb.png",
    options: [
      { text: "play games", img: "../assets/images/gaming.png" },
      { text: "watch cartoons", img: "../assets/images/cartoonTab.png" },
      { text: "watch videos that help him to learn", img: "../assets/images/studying.png" },
      { text: "listen to music", img: "../assets/images/music.png" },
    ],
    answer: "watch videos that help him to learn",
  },
  {
    title: "Q5. Vivek's uncle Kumar was a ______.",
    image: "../assets/images/uncleNboy.png",
    options: [
      { text: "teacher", img: "../assets/images/sir.png" },
      { text: "actor", img: "../assets/images/actor.png" },
      { text: "doctor", img: "../assets/images/doc.png" },
      { text: "driver", img: "../assets/images/taxi.png" },
    ],
    answer: "doctor",
  },
];
function showCorrectConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    origin: {
      x: 0.5,
      y: 0.6
    }
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
  window.location.href = "../index.html"; // ✅ change if needed
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
  animalImg.alt = "Animal";

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
      // 🔒 restore locked state
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
    showCorrectConfetti();
    score++;

    // 🔒 disable all options
    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    // ✅ highlight correct
    optionDiv.classList.add("correct-lock");
    nextBtn.disabled = false;

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

/* POPUPS */
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

  // Show actual score
  document.getElementById("finalScore").textContent = `Your Score: ${score} / ${quizData.length}`;

  // Keep stars based on actual score
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
      scalar: 0.5, // Smaller confetti
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      scalar: 0.5, // Smaller confetti
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
}
/* ================= START ================= */

loadQuestion();
