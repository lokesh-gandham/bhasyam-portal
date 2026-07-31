const quizData = [
  {
    q: "1)",
    img: "../assets/images/oo.png",
    options: ["अ", "आ", "उ", "ऊ"],
    a: 3, // "ऊ" is the 4th option (index 3)
  },
  {
    q: "2)",
    img: "../assets/images/e.png",
    options: ["ए", "ओ", "ऐ", "औ"],
    a: 2, // "ऐ" is the 3rd option (index 2)
  },
  {
    q: "3)",
    img: "../assets/images/aha.png",
    options: ["अ", "अः", "ऊ", "औ"],
    a: 1, // "अः" is the 2nd option (index 1)
  },
  {
    q: "4)",
    img: "../assets/images/kha.png",
    options: ["क", "ख", "ग", "घ"],
    a: 1,
  },
  {
    q: "5)",
    img: "../assets/images/ja.png",
    options: ["च", "छ", "ज", "झ"],
    a: 2,
  },
  {
    q: "6)",
    img: "../assets/images/gha.png",
    options: ["क", "ख", "ग", "घ"],
    a: 3,
  },
  {
    q: "7)",
    img: "../assets/images/nya.png",
    options: ["छ", "ज", "झ", "ञ"],
    a: 3,
  },
  {
    q: "8)",
    img: "../assets/images/tha.png",
    options: ["ट", "ठ", "ड", "ढ"],
    a: 1,
  },
  {
    q: "9)",
    img: "../assets/images/dha.png",
    options: ["ढ", "ट", "ठ", "ड"],
    a: 0,
  },
  {
    q: "10)",
    img: "../assets/images/taa.png",
    options: ["थ", "त", "द", "ध"],
    a: 1,
  },
  {
    q: "11)",
    img: "../assets/images/pa.png",
    options: ["भ", "द", "प", "त"],
    a: 2,
  },
  {
    q: "12)",
    img: "../assets/images/shaa.png",
    options: ["फ", "ब", "ष", "त"],
    a: 2,
  },
  {
    q: "13)",
    img: "../assets/images/ya.png",
    options: ["ल", "व", "य", "र"],
    a: 2,
  },
  {
    q: "14)",
    img: "../assets/images/va.png",
    options: ["य", "र", "ल", "व"],
    a: 3,
  },
  {
    q: "15)",
    img: "../assets/images/tra.png",
    options: ["प", "त्र", "भ", "म"],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
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

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);

    d.innerHTML = `
   <div class="option-img">
      ${t}
   </div>
`;

    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        // speak("Correct");
        playCorrectSound();
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
      } else {
        // speak("Wrong");
        playWrongSound();
        showPopup(false);
        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
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
    `आपके अंक: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "👌👌👌";

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
