const quizData = [
  {
    title: "Q1. ऊ",
    image: "../assets/images/uun.png",
    options: [
      { text: "अ", correct: false },
      { text: "आ", correct: false },
      { text: "उ", correct: false },
      { text: "ऊ", correct: true },
    ],
  },
  {
    title: "Q2. ऐ",
    image: "../assets/images/chasma.png",
    options: [
      { text: "ए", correct: false },
      { text: "ओ", correct: false },
      { text: "ऐ", correct: true },
      { text: "औ", correct: false },
    ],
  },
  {
    title: "Q3. अः",
    image: "../assets/images/boy-think.png",
    options: [
      { text: "अ", correct: false },
      { text: "अः", correct: true },
      { text: "ऊ", correct: false },
      { text: "औ", correct: false },
    ],
  },
];
let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered: false,
  wrong: [],
}));

const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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
      audioCtx.currentTime + 0.5
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
      audioCtx.currentTime + 0.4
    );

    oscillator.stop(audioCtx.currentTime + 0.4);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

// Initialize audio on first click
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

document.body.addEventListener(
  "click",
  initAudioOnFirstClick,
  { once: true }
);

// const correctSound = document.getElementById("correctSound");
// const wrongSound = document.getElementById("wrongSound");

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function preloadImages(callback) {
  const loader = document.getElementById("imgLoader");
  loader.textContent = "Loading images...";

  let images = [];

  quizData.forEach((q) => {
    images.push(q.image);
    q.options.forEach((opt) => {
      images.push(opt.img);
    });
  });

  let loaded = 0;

  images.forEach((src) => {
    const img = new Image();
    img.src = src;

    img.onload = img.onerror = () => {
      loaded++;

      if (loaded === images.length) {
        loader.textContent = "";
        callback();
      }
    };
  });
}

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;

  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");

    div.className = "option";

    div.innerHTML = `<img src="${opt.img}" class="option-img"> <span class="label">${opt.text}</span>`;

    if (state.answered) {
      div.classList.add("disabled");

      if (opt.correct) {
        div.classList.add("correct-lock");
      } else {
        div.classList.add("wrong-faded");
      }
    }

    if (state.wrong.includes(opt.text)) {
      div.classList.add("wrong-faded");
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}

function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

 const correctOption = quizData[current].options.find(opt => opt.correct);

  if (selected === correctOption.text) {
    state.answered = true;
    score++;

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");

      if (o !== optionDiv) {
        o.classList.add("wrong-faded");
      }

      o.onclick = null;
    });

    optionDiv.classList.add("correct-lock");

    nextBtn.disabled = false;

    // speak("Correct");
    playCorrectSound();

    showPopup(true);

    fireConfetti();

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    // speak("Wrong");
    playWrongSound();

    optionDiv.classList.add("wrong-shake");
    optionDiv.classList.add("wrong-faded");

    state.wrong.push(selected);

    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);
  }
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🏅";
    title.textContent = "बहुत बढ़िया!";
    msg.textContent = "आपका उत्तर सही है।";
  } else {
    icon.textContent = "⚠️";
    title.textContent = "ओह!";
    msg.textContent = "दोबारा प्रयास करें।";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपका परिणाम: ${score} / ${quizData.length}`;

 document.getElementById("stars").textContent = "👑👑👑";

  popup.style.display = "flex";
  fireConfettif();
}

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

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

preloadImages(loadQuestion);
