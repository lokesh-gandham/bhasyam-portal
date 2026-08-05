const quizData = [
  {
    q: "Q1. The ___________ of a cacti protect them from animals. ",
    qImg: "../images/mcq1.png",
    options: [
      { t: "stems", cls: "blue", img: "../images/stem.png" },
      { t: "spines", cls: "orange", img: "../images/spines.png" },
      { t: "roots", cls: "green", img: "../images/roots.png" },
    ],
    a: 1, // spines
  },
  {
    q: "Q2. ________ are the nomads of the Sahara Desert.",
    qImg: "../images/mcq2.png",
    options: [
      { t: "Banjaras", cls: "blue", img: "../images/banjaras.png" },
      { t: "Inuits", cls: "orange", img: "../images/inuits.png" },
      { t: "Bedouins", cls: "green", img: "../images/bedouins.png" },
    ],
    a: 2, // Bedouins
  },
  {
    q: "Q3.The ______ is the richest petroleum producing region in the world.",
    qImg: "../images/mcq3.png",
    options: [
      { t: "Arabian Desert", cls: "blue", img: "../images/Arabian-Desert.png" },
      { t: "Thar Desert", cls: "orange", img: "../images/thar-desert.png" },
      { t: "Sahara Desert", cls: "green", img: "../images/sahara.png" },
    ],
    a: 0, // Arabian Desert
  },
  {
    q: "Q4. In India, __________ is a cold desert.",
    qImg: "../images/mcq4.png",
    options: [
      { t: "Kashmir", cls: "blue", img: "../images/kashmir.png" },
      { t: "Manali", cls: "orange", img: "../images/manali.png" },
      { t: "Ladakh", cls: "green", img: "../images/ladhak.png" },
    ],
    a: 2, // Ladakh
  },
  {
    q: "Q5. ___________ are temporary houses.",
    qImg: "../images/mcq5.png",
    options: [
      { t: "Tents", cls: "blue", img: "../images/tent.png" },
      { t: "Mud houses", cls: "orange", img: "../images/mud-house.png" },
      { t: "Pucca houses", cls: "green", img: "../images/apartment.png" },
    ],
    a: 0, // Tents
  },
];
function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    scalar: 1
  });

  // Small second burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.5 },
      scalar: 0.8
    });
  }, 180);
}

// =============================================
//  STATE
// =============================================
let current  = 0;
let score    = 0;
let answered = Array(quizData.length).fill(null); // null = unanswered, else index chosen

// =============================================
//  DOM REFS
// =============================================
const qEl      = document.getElementById("question");
const optionsEl = document.getElementById("options");
const imgBoxEl  = document.getElementById("imgBox");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound   = document.getElementById("wrongSound");

// =============================================
//  SPEECH
// =============================================
        function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-US";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }
// function playFeedback(isCorrect) {
//   if (!window.speechSynthesis) return;

//   window.speechSynthesis.cancel();

//   const msg = new SpeechSynthesisUtterance(
//     isCorrect ? "Correct!" : "Try again"
//   );

//   msg.lang = "en-US";
//   msg.rate = 1;
//   msg.pitch = isCorrect ? 1.2 : 0.9;

//   window.speechSynthesis.speak(msg);
// }



function renderImgBox(questionData, correctIndex, isAnswered) {
  imgBoxEl.innerHTML = "";

  // Single question image only — disabled (locked) until answered correctly.
  imgBoxEl.classList.add("answered");

  const slot = document.createElement("div");
  slot.className = "img-slot qimg" + (isAnswered ? " qimg-enabled" : " qimg-enabled");

  const img = document.createElement("img");
  img.src = questionData.qImg;
  img.alt = "question image";

  slot.appendChild(img);
  imgBoxEl.appendChild(slot);
}

// =============================================
//  ANIMATE IMAGE BOX ON CORRECT ANSWER
//
//  Unlock (enable) the single question image with a pop animation.
// =============================================
function animateImgBoxToWinner(correctIndex) {
  const slot = imgBoxEl.querySelector(".img-slot");
  if (!slot) return;

  slot.classList.remove("qimg-disabled");
  slot.classList.add("qimg-enabled");
}

// =============================================
//  LOAD QUESTION
// =============================================
function loadQuestion() {
  const q           = quizData[current];
  const wasAnswered = answered[current] !== null;

  // Question text
  // Question text
// Question text
qEl.textContent = q.q;

// Remove previous class
qEl.classList.remove("question-left");

// Add only for Question 3
if (current === 2) {
    qEl.classList.add("question-left");
}
  // Image box
  renderImgBox(q, q.a, wasAnswered);

  // Options
  optionsEl.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = `option ${opt.cls}`;

    // Option image + text
    const img = document.createElement("img");
    img.src = opt.img;
    img.alt = opt.t;

    const span = document.createElement("span");
    span.textContent = opt.t;

    div.appendChild(img);
    div.appendChild(span);

    // If already answered, lock the UI
    if (wasAnswered) {
      if (i === q.a) {
        div.classList.add("correct");
      } else {
        div.classList.add("disabled");
      }
    }

    // Click handler
    div.onclick = () => handleOptionClick(i, div);

    optionsEl.appendChild(div);
  });

  // Nav buttons
  prevBtn.disabled = current === 0;
  nextBtn.disabled = !wasAnswered;
}

// =============================================
//  HANDLE OPTION CLICK
// =============================================
function handleOptionClick(selectedIndex, clickedDiv) {
  if (answered[current] !== null) return; // already answered

  const q            = quizData[current];
  const isCorrect    = selectedIndex === q.a;

  if (isCorrect) {
    speak("correct");
    // playFeedback("correct");
    // ── CORRECT ──
    answered[current] = selectedIndex;
    score++;

    // Highlight the option
    clickedDiv.classList.add("correct");

    // Disable all other options
    [...optionsEl.children].forEach((el, idx) => {
      if (idx !== selectedIndex) el.classList.add("disabled");
    });

    // Enable Next
    nextBtn.disabled = false;

    // Animate image box
    animateImgBoxToWinner(selectedIndex);

    // Audio + speech + popup
    // playFeedback(true);
    fireConfetti();
    showAnswerPopup(true);

    // Check if all done
    if (answered.every(x => x !== null)) {
      setTimeout(showFinal, 1600);
    }

  } else {
    // ── WRONG ──
    clickedDiv.classList.add("disabled");
     speak("Try again");

    showAnswerPopup(false);
  }
}

// =============================================
//  PREV / NEXT
// =============================================
prevBtn.onclick = () => {
  if (current > 0) { current--; loadQuestion(); }
};

nextBtn.onclick = () => {
  if (current < quizData.length - 1) { current++; loadQuestion(); }
};

// =============================================
//  ANSWER POPUP (CORRECT / WRONG)
// =============================================
function showAnswerPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon  = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg   = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent  = "🎉";
    title.textContent = "Correct!";
    msg.textContent   = "Well done!";
  } else {
    icon.textContent  = "😔";
    title.textContent = "Wrong!";
    msg.textContent   = "Try again!";
  }

  setTimeout(() => { popup.style.display = "none"; }, 1200);
}

// =============================================
//  FINAL POPUP + CONFETTI
// =============================================
function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `You scored ${score} out of ${quizData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // Confetti burst from both sides
  const duration = 2200;
  const end      = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle:  60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// =============================================
//  INIT
// =============================================
loadQuestion();
