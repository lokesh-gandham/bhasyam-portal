const questions = [
  {
    q: "Q1. अ ____ इ",
    a: ["आ"],
    options: ["आ", "ई", "उ", "ए"],
    img1: "../assets/images/mango.png",
    img2: "../assets/images/uun.png",
  },

  {
    q: "Q2. आ ____ ई",
    a: ["इ"],
    options: ["इ", "उ", "ऋ", "ओ"],
    img1: "../assets/images/owl.png",
    img2: "../assets/images/imli.png",
  },

  {
    q: "Q3. इ ____ उ",
    a: ["ई"],
    options: ["ई", "औ", "अं", "ए"],
    img1: "../assets/images/eekh.png",
    img2: "../assets/images/woman.png",
  },

  {
    q: "Q4. ई ____ ऊ",
    a: ["उ"],
    options: ["उ", "अः", "ऋ", "आ"],
    img1: "../assets/images/owl.png",
    img2: "../assets/images/mango.png",
  },

  {
    q: "Q5. उ ____ ऋ",
    a: ["ऊ"],
    options: ["ऊ", "ए", "ओ", "ई"],
    img1: "../assets/images/eekh.png",
    img2: "../assets/images/uun.png",
  },

  {
    q: "Q6. ऊ ____ ए",
    a: ["ऋ"],
    options: ["ऋ", "औ", "अं", "आ"],
    img1: "../assets/images/sadhu.png",
    img2: "../assets/images/thumb.png",
  },

  {
    q: "Q7. ऋ ____ ऐ",
    a: ["ए"],
    options: ["ए", "ओ", "ऊ", "उ"],
    img1: "../assets/images/uun.png",
    img2: "../assets/images/foot.png",
  },

  {
    q: "Q8. ए ____ ओ",
    a: ["ऐ"],
    options: ["ऐ", "ऋ", "इ", "अः"],
    img1: "../assets/images/chasma.png",
    img2: "../assets/images/imli.png",
  },

  {
    q: "Q9. ओ ____ अं",
    a: ["औ"],
    options: ["औ", "ए", "ई", "उ"],
    img1: "../assets/images/woman.png",
    img2: "../assets/images/owl.png",
  },

  {
    q: "Q10. औ ____ अः",
    a: ["अं"],
    options: ["अं", "ओ", "ऋ", "आ"],
    img1: "../assets/images/thumb.png",
    img2: "../assets/images/mango.png",
  },
];
let index = 0;
let score = 0;

const answers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({
    value: "",
    correct: false,
  })),
}));

const qImgEl1 = document.getElementById("qImg1");
const qImgEl2 = document.getElementById("qImg2");
const qTextEl = document.getElementById("qText");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const container = document.getElementById("inputsContainer");

// function speak(text) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(text);
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

document.body.addEventListener(
  "click",
  initAudioOnFirstClick,
  { once: true }
);
function preloadImages(callback) {
  const loader = document.getElementById("imgLoader");

  let loaded = 0;

  questions.forEach((q) => {
    const img = new Image();
    img.src = q.img;

    img.onload = img.onerror = () => {
      loaded++;

      if (loaded === questions.length) {
        loader.style.display = "none";
        callback();
      }
    };
  });
}

function loadQuestion() {
  const q = questions[index];
  const state = answers[index];

 qImgEl1.src = q.img1;
qImgEl2.src = q.img2;
  qTextEl.textContent = q.q;

  container.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

const input = document.createElement("input");

input.placeholder = "उत्तर चुने…";

// disable typing
input.readOnly = true;

// disable keyboard focus typing
input.style.caretColor = "transparent";

// disable mobile keyboard
input.setAttribute("inputmode", "none");

// Disable drag & drop
input.setAttribute("draggable", "false");

input.addEventListener("dragstart", (e) => e.preventDefault());
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

// Optional: disable paste
input.addEventListener("paste", (e) => e.preventDefault());
  

    const btn = document.createElement("button");
    btn.textContent = "जाँच";
    btn.disabled = true;


    if (state.boxes[i].correct) {
      box.classList.add("correct");
      input.value = state.boxes[i].value;
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

   const top = document.createElement("div");
top.className = "input-top";

top.append(input, btn);

const optionsWrap = document.createElement("div");
optionsWrap.className = "mini-options";
q.options.forEach((opt) => {

  const optionBtn = document.createElement("button");

  optionBtn.className = "mini-option";

  optionBtn.textContent = opt;

  // if already correct
  if (state.boxes[i].correct) {

    optionBtn.disabled = true;
  }

 optionBtn.onclick = () => {

  if (state.boxes[i].correct) return;

  input.value = opt;

  btn.disabled = false;
};

  optionsWrap.appendChild(optionBtn);
});
const optionButtons = box.querySelectorAll(".mini-option");

optionButtons.forEach((b) => {

  b.disabled = true;
});

box.append(top, optionsWrap);

container.appendChild(box);
  });

  prev.disabled = index === 0;

  const allDone = state.boxes.every((b) => b.correct);
  next.disabled = !allDone;
}

function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answersList = questions[index].a;
  const state = answers[index];

  if (answersList.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;

    state.used.push(value);

    state.boxes[i] = {
      value: value,
      correct: true,
    };

     box.querySelectorAll(".mini-option").forEach(opt => {
    opt.disabled = true;
    opt.style.opacity = "0.5";
    opt.style.cursor = "not-allowed";
  });

    // speak("Correct");
    playCorrectSound();
    showPopup(true);
    fireConfetti();
  } else {
    input.value = "";
    btn.disabled = true;
    // speak("Wrong");
    playWrongSound();
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const state = answers[index];
  const allDone = state.boxes.every((b) => b.correct);

  if (allDone) {
    next.disabled = false;

    if (!state.scored) {
      score++;
      state.scored = true;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1600);
      }
    }
  } else {
    next.disabled = true;
  }
}

prev.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
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
    `आपका परिणाम: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "👑👑👑";

  popup.style.display = "flex";

  fireConfettif();
}

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
