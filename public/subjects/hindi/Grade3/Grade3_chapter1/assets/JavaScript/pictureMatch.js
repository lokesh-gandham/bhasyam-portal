const questions = [
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "कप",
    img: "../assets/images/bowl.png",
  },
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "खग",
    img: "../assets/images/khag.png",
  },
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "बस",
    img: "../assets/images/bus.png",
  },
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "कलम",
    img: "../assets/images/pen.png",
  },
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "बतख",
    img: "../assets/images/batakh.png",
  },
  {
    q: "चित्र देखिए और उसके सही नाम पर क्लिक कीजिए। ",
    a: "भवन",
    img: "../assets/images/building.png",
  }
];
let index = 0;
let score = 0;

const answered = Array(questions.length).fill(false);
const selectedAnswers = Array(questions.length).fill("");

// ELEMENTS
const qEl = document.getElementById("question");
const img = document.getElementById("image");
const optionsRow = document.getElementById("optionsRow");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let audioCtx = null;

function playCorrect() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 880;

        gain.gain.value = 0.2;

        osc.type = "sine";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.45
        );

        osc.stop(audioCtx.currentTime + 0.45);

    } catch(e) {}

}

function playWrong() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 480;

        gain.gain.value = 0.2;

        osc.type = "triangle";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.4
        );

        osc.stop(audioCtx.currentTime + 0.4);

    } catch(e) {}

}

function initAudioOnce() {

    if (audioCtx) return;

    try {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const buffer = audioCtx.createBuffer(1, 1, 22050);

        const src = audioCtx.createBufferSource();

        src.buffer = buffer;

        src.connect(audioCtx.destination);

        src.start();

    } catch(e) {}

}



// CONFETTI
function fireSmallConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 }
  });
}

function fireBigConfetti() {

  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {

    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }

  })();
}

// GENERATE OPTIONS
function generateOptions(correctAnswer) {

  const allAnswers = questions.map(q => q.a);

  const distractors =
    allAnswers.filter(a => a !== correctAnswer);

  const randomWrong =
    distractors
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

  return [...randomWrong, correctAnswer]
    .sort(() => Math.random() - 0.5);
}

// POPUP
function showPopup(isCorrect) {

  const popup =
    document.getElementById("answerPopup");

  const icon =
    document.getElementById("popupIcon");

  const title =
    document.getElementById("popupTitle");

  const msg =
    document.getElementById("popupMsg");

  popup.className =
    "popup " + (isCorrect ? "correct" : "wrong");

  popup.style.display = "none";

  void popup.offsetWidth;

  popup.style.display = "flex";

  if (isCorrect) {

    icon.textContent = "🥳";
    title.textContent = "सही जवाब!";
    msg.textContent = "बहुत बढ़िया!";

  } else {

    icon.textContent = "😔";
    title.textContent = "गलत जवाब!";
    msg.textContent = "फिर से कोशिश करें!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

// RENDER OPTIONS
function renderOptions(correctAnswer) {

  optionsRow.innerHTML = "";

  const options =
    generateOptions(correctAnswer);

  options.forEach(opt => {

    const btn =
      document.createElement("button");

    btn.className = "option-btn";

    btn.textContent = opt;

    btn.onclick = () => {

      optionsRow
        .querySelectorAll(".option-btn")
        .forEach(b => b.disabled = true);

      // CORRECT
      if (opt === correctAnswer) {

        btn.classList.add("correct-bubble");

        answered[index] = true;

        selectedAnswers[index] = opt;

        score++;

        nextBtn.disabled = false;

        // speak("सही");
        playCorrect();

        fireSmallConfetti();

        showPopup(true);

        setTimeout(() => {

          if (index === questions.length - 1) {
            showFinal();
          }

        }, 800);

      }

      // WRONG
      else {

        btn.classList.add("wrong-bubble");

        // speak("गलत");
        playWrong();

        showPopup(false);

        setTimeout(() => {

          renderOptions(correctAnswer);

        }, 800);
      }

    };

    optionsRow.appendChild(btn);

  });

}

// LOAD QUESTION
function load() {

  const q = questions[index];

  qEl.textContent = q.q;

  img.src = q.img;

  if (answered[index]) {

    optionsRow.innerHTML = "";

    const btn =
      document.createElement("button");

    btn.className =
      "option-btn correct-bubble locked-bubble";

    btn.textContent =
      selectedAnswers[index];

    btn.disabled = true;

    optionsRow.appendChild(btn);

    nextBtn.disabled = false;

  }

  else {

    renderOptions(q.a);

    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
}

// NAVIGATION
prevBtn.onclick = () => {

  if (index > 0) {

    index--;

    load();
  }

};

nextBtn.onclick = () => {

  if (index < questions.length - 1) {

    index++;

    load();
  }

};

// FINAL POPUP
function showFinal() {

  const popup =
    document.getElementById("finalPopup");

  popup.style.display = "flex";

  document.getElementById("finalScore")
    .textContent =
    `आपका परिणाम: ${score}/${questions.length}`;

  document.getElementById("stars")
  .textContent = "⭐⭐⭐";

  fireBigConfetti();
}

// START
load();