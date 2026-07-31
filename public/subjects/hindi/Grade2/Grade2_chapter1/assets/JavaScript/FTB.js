const questions = [
  // --- New Questions from the Vowel Pairs Image ---
  {
    question: "Q1. ______ आ",
    answer: "अ",
    options: ["अ", "इ", "उ", "आ"],
    image: "../assets/images/anar.png",
  },
  {
    question: "Q2. ______ ई",
    answer: "इ",
    options: ["अ", "इ", "ई", "उ"],
    image: "../assets/images/imli.png",
  },
  {
    question: "Q3. ______ ऊ",
    answer: "उ",
    options: ["उ", "ऊ", "ऋ", "इ"],
    image: "../assets/images/ullu.png",
  },
  {
    question: "Q4. ______ ए",
    answer: "ऋ",
    options: ["ऊ", "ऋ", "ए", "ऐ"],
    image: "../assets/images/rishi.png",
  },
  {
    question: "Q5. ______ ऐ",
    answer: "ए",
    options: ["ए", "ऐ", "ओ", "औ"],
    image: "../assets/images/edi.png",
  },
  {
    question: "Q6. ______ औ",
    answer: "ओ",
    options: ["ओ", "औ", "अं", "अः"],
    image: "../assets/images/okhali.png",
  },
  {
    question: "Q7. ______ अः",
    answer: "अं",
    options: ["औ", "अं", "अः", "अ"],
    image: "../assets/images/angur.png",
  },
  {
    question: "Q8. ______ उ",
    answer: "ई",
    options: ["इ", "ई", "उ", "ऊ"],
    image: "../assets/images/ekha.png",
  },

  // --- Original Questions (Reindexed) ---
  {
    question: "Q9. ______ ख",
    answer: "क",
    options: ["क", "म", "ग", "घ"],
    image: "../assets/images/kamal.png",
  },
  {
    question: "Q10. ______ ग",
    answer: "ख",
    options: ["ख", "ज", "ट", "क"],
    image: "../assets/images/khargosh.png",
  },
  {
    question: "Q11. ______ घ",
    answer: "ग",
    options: ["च", "ग", "द", "ख"],
    image: "../assets/images/gamla.png",
  },
  {
    question: "Q12. ______ ड़",
    answer: "घ",
    options: ["घ", "फ", "ल", "ङ"],
    image: "../assets/images/ghadi.png",
  },
  {
    question: "Q13. ______ छ",
    answer: "च",
    options: ["च", "न", "प", "ज"],
    image: "../assets/images/chamach.png",
  },
  {
    question: "Q14. ______ झ",
    answer: "ज",
    options: ["थ", "ज", "य", "च"],
    image: "../assets/images/jahaj.png",
  },
  {
    question: "Q15. ______ ज",
    answer: "छ",
    options: ["ल", "छ", "व", "झ"],
    image: "../assets/images/chhata.png",
  },
  {
    question: "Q16. ______ ञ",
    answer: "झ",
    options: ["झ", "ह", "र", "ज"],
    image: "../assets/images/jhula.png",
  },
  {
    question: "Q17. ______ ठ",
    answer: "ट",
    options: ["ट", "ड", "ण", "ठ"],
    image: "../assets/images/tamater.png",
  },
  {
    question: "Q18. ______ ढ",
    answer: "ठ",
    options: ["ठ", "ट", "ढ", "ड"],
    image: "../assets/images/thathera.png",
  },
  {
    question: "Q19. ______ थ",
    answer: "त",
    options: ["त", "द", "न", "थ"],
    image: "../assets/images/tarbuj.png",
  },
  {
    question: "Q20. ______ म",
    answer: "भ",
    options: ["भ", "ब", "प", "म"],
    image: "../assets/images/bhalu.png",
  },
  {
    question: "Q21. ______ फ",
    answer: "प",
    options: ["प", "ब", "म", "फ"],
    image: "../assets/images/patang.png",
  },
  {
    question: "Q22. ______ ण",
    answer: "ढ",
    options: ["ढ", "ठ", "ड", "ण"],
    image: "../assets/images/dhakkan.png",
  },
  {
    question: "Q23. ______ भ",
    answer: "ब",
    options: ["ब", "प", "फ", "भ"],
    image: "../assets/images/billi.png",
  },
  {
    question: "Q24. ______ न",
    answer: "ध",
    options: ["ध", "त", "थ", "न"],
    image: "../assets/images/dhanush.png",
  },
  {
    question: "Q25. ______ ज्ञ",
    answer: "त्र",
    options: ["त्र", "क्ष", "श", "ज्ञ"],
    image: "../assets/images/trisul.png",
  },
  {
    question: "Q26. ______ स",
    answer: "ष",
    options: ["ष", "श", "ह", "स"],
    image: "../assets/images/satkond2.png",
  },
  {
    question: "Q27. ______ ल",
    answer: "र",
    options: ["र", "य", "व", "ल"],
    image: "../assets/images/rassi.png",
  },
  {
    question: "Q28. ______ ष",
    answer: "श",
    options: ["श", "ष", "स", "ह"],
    image: "../assets/images/sahad.png",
  },
  {
    question: "Q29. ______ र",
    answer: "य",
    options: ["य", "ल", "व", "र"],
    image: "../assets/images/yagya.png",
  },
  {
    question: "Q30. ______ व",
    answer: "ल",
    options: ["ल", "र", "य", "व"],
    image: "../assets/images/lattu.png",
  },
];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);
const optionsWrap = document.getElementById("optionsWrap");

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const input = document.getElementById("answerInput");

input.readOnly = true;

// hide typing cursor
input.style.caretColor = "transparent";

// stop mobile keyboard
input.setAttribute("inputmode", "none");

// disable typing
input.addEventListener("keydown", (e) => {
  e.preventDefault();
});

// disable paste
input.addEventListener("paste", (e) => {
  e.preventDefault();
});

// disable drop
input.addEventListener("drop", (e) => {
  e.preventDefault();
});

// disable typing by mouse
input.addEventListener("beforeinput", (e) => {
  e.preventDefault();
});
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

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  image.src = q.image;

  optionsWrap.innerHTML = "";

  const options = [...q.options];

  options.sort(() => Math.random() - 0.5);

  if (answers[currentQuestion] !== null) {
    optionsWrap.innerHTML = "";

    const correctBtn = document.createElement("button");

    correctBtn.className = "option-btn correct-option";

    correctBtn.innerText = answers[currentQuestion];

    correctBtn.disabled = true;

    optionsWrap.appendChild(correctBtn);

    input.value = answers[currentQuestion];

    input.disabled = true;

    input.classList.add("input-correct");

    prevBtn.disabled = currentQuestion === 0;

    nextBtn.disabled = false;

    return;
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");

    btn.className = "option-btn";

    btn.innerText = opt;

    if (answers[currentQuestion] !== null) {
      btn.disabled = true;
    }

    btn.onclick = () => {
      if (answers[currentQuestion] !== null) return;

      // first put into input
      input.value = opt;

      // remove old styles
      input.classList.remove("input-wrong", "input-correct");

      // wait little then check
      setTimeout(() => {
        // CORRECT
        if (opt === q.answer) {
          answers[currentQuestion] = opt;

          score++;

          input.disabled = true;

          input.classList.add("input-correct");

          btn.classList.add("correct-option");

          optionsWrap.innerHTML = "";

          const correctBtn = document.createElement("button");

          correctBtn.className = "option-btn correct-option";

          correctBtn.innerText = opt;

          correctBtn.disabled = true;

          optionsWrap.appendChild(correctBtn);

          playCorrectSound();

          smallConfetti();

          showPopup(true);

          nextBtn.disabled = false;

          if (answers.every((a) => a !== null)) {
            setTimeout(showFinal, 1400);
          }
        }

        // WRONG
        else {
          input.classList.add("input-wrong");

          btn.classList.add("wrong-option");

          playWrongSound();

          showPopup(false);

          setTimeout(() => {
            input.value = "";

            input.classList.remove("input-wrong");

            btn.classList.remove("wrong-option");
          }, 700);
        }
      }, 300);
    };

    optionsWrap.appendChild(btn);
  });

  input.value = answers[currentQuestion] || "";
  input.disabled = answers[currentQuestion] !== null;

  input.classList.remove("input-wrong", "input-correct");

  if (answers[currentQuestion] !== null) {
    input.classList.add("input-correct");
  }

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
}

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
