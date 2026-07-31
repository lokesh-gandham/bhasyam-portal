const questions = [
  {
    question: "Q1. व ______ ष",
    answer: "श",

    options: ["श", "ह"],

    images: ["../assets/images/saljam.png", "../assets/images/hal.png"],
  },

  {
    question: "Q2. क्ष ______ ज्ञ",
    answer: "त्र",

    options: ["ल", "त्र"],

    images: ["../assets/images/laddu.png", "../assets/images/trisul.png"],
  },

  {
    question: "Q3. ष ______ ह",
    answer: "स",

    options: ["स", "र"],

    images: ["../assets/images/sabjiya.png", "../assets/images/rath.png"],
  },

  {
    question: "Q4. य ______ ल",
    answer: "र",

    options: ["श", "र"],

    images: ["../assets/images/sahad.png", "../assets/images/rassi.png"],
  },

  {
    question: "Q5. र ______ व",
    answer: "ल",

    options: ["ल", "त्र"],

    images: ["../assets/images/laddu.png", "../assets/images/trisul.png"],
  },
];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);

const questionText = document.getElementById("questionText");
const image1 = document.getElementById("questionImage1");
const image2 = document.getElementById("questionImage2");
const input = document.getElementById("answerInput");
input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
});

input.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;

  for (let item of items) {
    if (item.type.indexOf("image") !== -1) {
      e.preventDefault();
    }
  }
});

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const miniOptions = document.querySelector(".mini-options");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  image1.src = q.images[0];
  image2.src = q.images[1];

  miniOptions.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");

    btn.classList.add("mini-btn");

    btn.innerText = opt;

    if (answers[currentQuestion] !== null) {
      btn.disabled = true;
    }

    btn.onclick = function () {
      if (answers[currentQuestion] !== null) return;

      input.value = opt;

      submitBtn.disabled = false;
    };

    miniOptions.appendChild(btn);
  });

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

// function speak(t) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(t);
//   msg.lang = "en-UK";
//   msg.volume = 0.25;
//   msg.rate = 1;
//   msg.pitch = 1;
//   speechSynthesis.speak(msg);
// }

// ===== AUDIO =====
let audioCtx = null;

function playCorrectSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.2;
    oscillator.type = "sine";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.5,
    );

    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio error:", e);
  }
}

function playWrongSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.25;
    oscillator.type = "sawtooth";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.4,
    );

    oscillator.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    console.log("Audio error:", e);
  }
}

// Initialize audio
function initAudioOnFirstClick() {
  if (audioCtx) return;

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const source = audioCtx.createBufferSource();

    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (e) {
    console.log("Audio init error:", e);
  }
}

document.body.addEventListener("click", initAudioOnFirstClick, { once: true });

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
    const currentBtns = document.querySelectorAll(".mini-btn");

    currentBtns.forEach((btn) => {
      btn.disabled = true;

      if (btn.innerText.toLowerCase() === correctAnswer) {
        btn.style.background = "#b8f5b1";

        btn.style.color = "#14532d";
      }
    });

    answers[currentQuestion] = userAnswer;
    score++;

    input.classList.remove("input-wrong");
    input.classList.add("input-correct");

    // speak("Correct");
    playCorrectSound();
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
    // speak("Wrong");
    playWrongSound();

    setTimeout(() => {
      input.classList.remove("input-wrong");
    }, 600);

    input.value = "";

    const currentBtns = document.querySelectorAll(".mini-btn");

    currentBtns.forEach((btn) => {
      btn.disabled = false;
    });
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
    icon.textContent = "🐵";

    title.textContent = "वाह!";

    msg.textContent = "आपने कमाल कर दिया!";
  } else {
    icon.textContent = "🙈";

    title.textContent = "अरे!";

    msg.textContent = "थोड़ा और सोचिए!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपके अंक: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "👌👌👌";

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
