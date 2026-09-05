/* =========================
   QUIZ DATA
========================= */

const quiz = [
  {
    id: 1,
    title: "आगे वाले अक्षर को खींचकर बॉक्स में रखिए।",

    questions: [
      { correct: ["अ"], middle: "आ", right: "इ" },
      { correct: ["ई"], middle: "उ", right: "ऊ" },
      { correct: ["ऐ"], middle: "ओ", right: "औ" },
      { correct: ["क"], middle: "ख", right: "ग" },
      { correct: ["छ"], middle: "ज", right: "झ" },
      { correct: ["ट"], middle: "ठ", right: "ड" },

      { correct: ["थ"], middle: "द", right: "ध" },
      { correct: ["प"], middle: "फ", right: "ब" },
      { correct: ["य"], middle: "र", right: "ल" },
      { correct: ["आ"], middle: "इ", right: "ई" },
      { correct: ["ऋ"], middle: "ए", right: "ऐ" },
      { correct: ["औ"], middle: "अं", right: "अः" },

      { correct: ["ग"], middle: "घ", right: "ङ" },
      { correct: ["च"], middle: "छ", right: "ज" },
      { correct: ["ड"], middle: "ढ", right: "ण" },
      { correct: ["द"], middle: "ध", right: "न" },
      { correct: ["ब"], middle: "भ", right: "म" },
      { correct: ["श"], middle: "ष", right: "स" },
    ],
  },

  // {
  //   id: 2,
  //   title: "दिए गए वर्णों के बीच वाला अक्षर लिखिए।",

  //   questions: [
  //     { left:"ख", correct:["ग"], right:"घ" },
  //     { left:"आ", correct:["इ"], right:"ई" },
  //     { left:"ए", correct:["ऐ"], right:"ओ" },
  //     { left:"इ", correct:["ई"], right:"उ" },
  //     { left:"ग", correct:["घ"], right:"ङ" },
  //     { left:"उ", correct:["ऊ"], right:"ऋ" },

  //     { left:"औ", correct:["अं"], right:"अः" },
  //     { left:"ऋ", correct:["ए"], right:"ऐ" },
  //     { left:"च", correct:["छ"], right:"ज" },
  //     { left:"ठ", correct:["ड"], right:"ढ" },
  //     { left:"त", correct:["थ"], right:"द" },
  //     { left:"फ", correct:["ब"], right:"भ" },

  //     { left:"ष", correct:["स"], right:"ह" },
  //     { left:"ज", correct:["झ"], right:"ञ" },
  //     { left:"ड", correct:["ढ"], right:"ण" },
  //     { left:"द", correct:["ध"], right:"न" },
  //     { left:"य", correct:["र"], right:"ल" },
  //     { left:"त्र", correct:["ज्ञ"], right:"श्र" }
  //   ]
  // },

  // {
  //   id: 3,
  //   title: "दिए गए वर्णों के बाद वाला अक्षर लिखिए।",

  //   questions: [
  //     { left:"इ", middle:"ई", correct:["उ"] },
  //     { left:"अ", middle:"आ", correct:["इ"] },
  //     { left:"ए", middle:"ऐ", correct:["ओ"] },
  //     { left:"क", middle:"ख", correct:["ग"] },
  //     { left:"छ", middle:"ज", correct:["झ"] },
  //     { left:"ट", middle:"ठ", correct:["ड"] },

  //     { left:"थ", middle:"द", correct:["ध"] },
  //     { left:"प", middle:"फ", correct:["ब"] },
  //     { left:"श", middle:"ष", correct:["स"] },
  //     { left:"उ", middle:"ऊ", correct:["ऋ"] },
  //     { left:"ऋ", middle:"ए", correct:["ऐ"] },
  //     { left:"औ", middle:"अं", correct:["अः"] },

  //     { left:"ग", middle:"घ", correct:["ङ"] },
  //     { left:"च", middle:"छ", correct:["ज"] },
  //     { left:"ड", middle:"ढ", correct:["ण"] },
  //     { left:"द", middle:"ध", correct:["न"] },
  //     { left:"य", middle:"र", correct:["ल"] },
  //     { left:"क्ष", middle:"त्र", correct:["ज्ञ"] }
  //   ]
  // }
];

/* =========================
   SPEAK
========================= */

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

    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.45);

    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
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

    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);

    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
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
  } catch (e) {}
}

/* =========================
   ELEMENTS
========================= */

const questionContainer = document.getElementById("blanks");

const optionsContainer = document.getElementById("letters");

const prevBtn = document.getElementById("prev");

const nextBtn = document.getElementById("next");

const title = document.getElementById("questionTitle");

const img = document.getElementById("questionImage");

/* =========================
   IMAGE
========================= */

img.src = "../assets/images/sequence.png";

img.alt = "Hindi Alphabet Learning";

/* =========================
   CONFIG
========================= */

const QUESTIONS_PER_PAGE = 1;

/* =========================
   STATE
========================= */

let currentSection = 0;
let currentPage = 0;

let score = 0;

let currentBlank = null;

let answers = {};
let lockedAnswers = {};

// Stores whether each question is correctly completed
let completedPages = {};

/* =========================
   TOTAL PAGES
========================= */

function getTotalPages(sectionIndex) {
  return Math.ceil(quiz[sectionIndex].questions.length / QUESTIONS_PER_PAGE);
}

/* =========================
   OPTIONS
========================= */

function generateOptions(currentQuestions) {
  let correctAnswers = [];

  currentQuestions.forEach((q) => {
    q.correct.forEach((ans) => {
      correctAnswers.push(ans);
    });
  });

  const extras = ["क", "त", "न", "म", "ल", "स", "ह", "प", "थ", "भ", "य", "व", "अ", "इ", "उ", "च"];

  while (correctAnswers.length < 8) {
    let random = extras[Math.floor(Math.random() * extras.length)];

    if (!correctAnswers.includes(random)) {
      correctAnswers.push(random);
    }
  }

  return correctAnswers.sort(() => Math.random() - 0.5);
}

/* =========================
   RENDER
========================= */

function getNextEmptyBlank() {
  return document.querySelector(".blank:not(.correct)");
}

function renderQuiz() {
  questionContainer.innerHTML = "";
  optionsContainer.innerHTML = "";

  currentBlank = null;

  const section = quiz[currentSection];

  title.innerText = section.title;

  const start = currentPage * QUESTIONS_PER_PAGE;

  const end = start + QUESTIONS_PER_PAGE;

  const currentQuestions = section.questions.slice(start, end);

  currentQuestions.forEach((q, index) => {
    const realIndex = start + index;

    let box = document.createElement("div");

    box.className = "question-box";

    let html = "";

    /* =====================================
       SECTION 1
       BLANK + MIDDLE + RIGHT
    ===================================== */

    if (currentSection === 0) {
      q.correct.forEach((ans, blankIndex) => {
        const key = `${currentSection}-${realIndex}-${blankIndex}`;

        const value = answers[key] || "";

        const isLocked = lockedAnswers[key];

        html += `
          <div
            class="blank ${isLocked ? "correct" : ""}"
            data-index="${realIndex}"
            data-blank="${blankIndex}"
          >
            ${value}
          </div>
        `;
      });

      html += `<span>${q.middle}</span>`;
      html += `<span>${q.right}</span>`;
    }

    /* =====================================
       SECTION 2
       LEFT + BLANK + RIGHT
    ===================================== */
    else if (currentSection === 1) {
      html += `<span>${q.left}</span>`;

      q.correct.forEach((ans, blankIndex) => {
        const key = `${currentSection}-${realIndex}-${blankIndex}`;

        const value = answers[key] || "";

        const isLocked = lockedAnswers[key];

        html += `
          <div
            class="blank ${isLocked ? "correct" : ""}"
            data-index="${realIndex}"
            data-blank="${blankIndex}"
          >
            ${value}
          </div>
        `;
      });

      html += `<span>${q.right}</span>`;
    }

    /* =====================================
       SECTION 3
       LEFT + MIDDLE + BLANK
    ===================================== */
    else {
      html += `<span>${q.left}</span>`;
      html += `<span>${q.middle}</span>`;

      q.correct.forEach((ans, blankIndex) => {
        const key = `${currentSection}-${realIndex}-${blankIndex}`;

        const value = answers[key] || "";

        const isLocked = lockedAnswers[key];

        html += `
          <div
            class="blank ${isLocked ? "correct" : ""}"
            data-index="${realIndex}"
            data-blank="${blankIndex}"
          >
            ${value}
          </div>
        `;
      });
    }

    box.innerHTML = html;

    questionContainer.appendChild(box);
  });

  /* =====================================
     CREATE LETTER OPTIONS
  ===================================== */

  const options = generateOptions(currentQuestions);

  options.forEach((letter) => {
    const btn = document.createElement("button");

    btn.className = "letter";

    btn.innerText = letter;

    /* DRAGGABLE */

    btn.draggable = true;

    btn.dataset.letter = letter;

    /* =====================================
       DESKTOP DRAG
    ===================================== */

    btn.addEventListener("dragstart", function (e) {
      initAudioOnce();

      e.dataTransfer.setData("text/plain", letter);

      e.dataTransfer.effectAllowed = "copy";

      btn.classList.add("dragging");
    });

    btn.addEventListener("dragend", function () {
      btn.classList.remove("dragging");

      document.querySelectorAll(".blank").forEach((blank) => {
        blank.classList.remove("drag-over");
      });
    });

    /* =====================================
       TOUCH DRAG
       Works on mobile/tablet
    ===================================== */

    btn.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;

      initAudioOnce();

      startTouchDrag(btn, letter, e);
    });

    optionsContainer.appendChild(btn);
  });

  /* =====================================
     DRAG & DROP BLANKS
  ===================================== */

  document.querySelectorAll(".blank").forEach((blank) => {
    blank.addEventListener("dragover", function (e) {
      if (blank.classList.contains("correct")) {
        return;
      }

      e.preventDefault();

      blank.classList.add("drag-over");

      e.dataTransfer.dropEffect = "copy";
    });

    blank.addEventListener("dragleave", function () {
      blank.classList.remove("drag-over");
    });

    blank.addEventListener("drop", function (e) {
      e.preventDefault();

      blank.classList.remove("drag-over");

      if (blank.classList.contains("correct")) {
        return;
      }

      const letter = e.dataTransfer.getData("text/plain");

      if (!letter) return;

      placeDraggedLetter(blank, letter);
    });
  });

  /* =====================================
     FIND FIRST EMPTY BLANK
  ===================================== */

  const firstBlank = getNextEmptyBlank();

  if (firstBlank) {
    firstBlank.classList.add("active-blank");

    currentBlank = firstBlank;
  }

  updateNav();
}

renderQuiz();

/* =========================================
   PLACE DRAGGED LETTER
========================================= */

function placeDraggedLetter(blank, letter) {

  if (!blank) return;

  // Do nothing if this blank is already correctly answered
  if (blank.classList.contains("correct")) {
    return;
  }

  const questionIndex = Number(blank.dataset.index);
  const blankIndex = Number(blank.dataset.blank);

  const section = quiz[currentSection];

  const correctAnswer =
    section.questions[questionIndex].correct[blankIndex];

  const answerKey =
    `${currentSection}-${questionIndex}-${blankIndex}`;

  const pageKey =
    `${currentSection}-${currentPage}`;


  // ==========================================
  // PUT DROPPED LETTER IN BLANK
  // ==========================================

  blank.innerText = letter;

  answers[answerKey] = letter;

  currentBlank = blank;


  // ==========================================
  // CORRECT ANSWER
  // ==========================================

  if (letter === correctAnswer) {

    // Sound
    playCorrect();

    // Correct popup
    showPopup(true);

    // Correct styling
    blank.classList.remove("wrong");
    blank.classList.remove("active-blank");
    blank.classList.add("correct");

    // Lock answer
    lockedAnswers[answerKey] = true;

    // Increase score
    score++;

    // Disable the used option
    document.querySelectorAll(".letter").forEach((option) => {

      if (option.dataset.letter === letter) {
        option.disabled = true;
      }

    });

    // ==========================================
    // MARK QUESTION COMPLETE
    // ==========================================

    completedPages[pageKey] = true;

    // ==========================================
    // ENABLE NEXT BUTTON
    // ==========================================

    nextBtn.disabled = false;

    // No automatic navigation
    currentBlank = null;

    return;
  }


  // ==========================================
  // WRONG ANSWER
  // ==========================================

  playWrong();

  showPopup(false);

  blank.classList.add("wrong");


  // Remove wrong answer after short delay
  setTimeout(() => {

    blank.innerText = "";

    blank.classList.remove("wrong");

    blank.classList.add("active-blank");

    delete answers[answerKey];

    currentBlank = blank;

  }, 700);
}
/* =========================================
   TOUCH DRAG
========================================= */

let touchClone = null;
let touchLetter = "";
let touchBlank = null;

function startTouchDrag(button, letter, startEvent) {
  touchLetter = letter;

  button.classList.add("dragging");

  /* Create floating copy */

  touchClone = button.cloneNode(true);

  touchClone.classList.add("touch-drag-clone");

  touchClone.style.position = "fixed";
  touchClone.style.pointerEvents = "none";
  touchClone.style.zIndex = "9999";
  touchClone.style.width = button.offsetWidth + "px";
  touchClone.style.height = button.offsetHeight + "px";

  document.body.appendChild(touchClone);

  moveTouchClone(startEvent.clientX, startEvent.clientY);

  const moveHandler = function (e) {
    e.preventDefault();

    moveTouchClone(e.clientX, e.clientY);

    /* Find blank under finger */

    const element = document.elementFromPoint(e.clientX, e.clientY);

    const blank = element ? element.closest(".blank") : null;

    document.querySelectorAll(".blank").forEach((b) => {
      b.classList.remove("drag-over");
    });

    if (blank && !blank.classList.contains("correct")) {
      blank.classList.add("drag-over");

      touchBlank = blank;
    } else {
      touchBlank = null;
    }
  };

  const endHandler = function (e) {
    e.preventDefault();

    document.removeEventListener("pointermove", moveHandler);

    document.removeEventListener("pointerup", endHandler);

    button.classList.remove("dragging");

    if (touchBlank) {
      placeDraggedLetter(touchBlank, touchLetter);
    }

    document.querySelectorAll(".blank").forEach((b) => {
      b.classList.remove("drag-over");
    });

    if (touchClone) {
      touchClone.remove();

      touchClone = null;
    }

    touchBlank = null;
  };

  document.addEventListener("pointermove", moveHandler, { passive: false });

  document.addEventListener("pointerup", endHandler, { passive: false });
}

function moveTouchClone(x, y) {
  if (!touchClone) return;

  touchClone.style.left = x - 37 + "px";

  touchClone.style.top = y - 37 + "px";
}

/* =========================
   BACKSPACE
========================= */

document.addEventListener("keydown", function (e) {

  if (e.key !== "Backspace") return;

  if (!currentBlank) return;

  if (currentBlank.classList.contains("correct")) return;

  const index = currentBlank.dataset.index;
  const blankIndex = currentBlank.dataset.blank;

  const key =
    `${currentSection}-${index}-${blankIndex}`;

  currentBlank.innerText = "";

  currentBlank.classList.remove("wrong");

  delete answers[key];

  document.querySelectorAll(".letter").forEach((l) => {
    l.disabled = false;
  });

});

/* =========================
   SUBMIT
========================= */

/* =========================
   PAGE COMPLETE
========================= */

/* =========================
   NEXT
========================= */

nextBtn.onclick = function () {

  // ==========================================
  // CHECK CURRENT QUESTION
  // ==========================================

  const pageKey =
    `${currentSection}-${currentPage}`;

  // Safety check:
  // Next cannot work until answer is correct
  if (!completedPages[pageKey]) {
    return;
  }


  // ==========================================
  // GET TOTAL QUESTIONS IN CURRENT SECTION
  // ==========================================

  const totalPages =
    getTotalPages(currentSection);


  // ==========================================
  // GO TO NEXT QUESTION
  // ==========================================

  if (currentPage < totalPages - 1) {

    currentPage++;

    renderQuiz();

    return;
  }


  // ==========================================
  // CURRENT SECTION FINISHED
  // ==========================================

  if (currentSection < quiz.length - 1) {

    currentSection++;

    currentPage = 0;

    renderQuiz();

    return;
  }


  // ==========================================
  // ENTIRE QUIZ FINISHED
  // ==========================================

  showFinal();
};
/* =========================
   PREV
========================= */

prevBtn.onclick = function () {

  // ==========================================
  // PREVIOUS QUESTION
  // ==========================================

  if (currentPage > 0) {

    currentPage--;

    renderQuiz();

    return;
  }


  // ==========================================
  // PREVIOUS SECTION
  // ==========================================

  if (currentSection > 0) {

    currentSection--;

    currentPage =
      getTotalPages(currentSection) - 1;

    renderQuiz();

    return;
  }

};

/* =========================
   NAV
========================= */

function updateNav() {

  // ==========================================
  // PREVIOUS
  // ==========================================

  if (currentSection === 0 && currentPage === 0) {

    prevBtn.disabled = true;

  } else {

    prevBtn.disabled = false;

  }


  // ==========================================
  // NEXT
  // ==========================================

  const pageKey =
    `${currentSection}-${currentPage}`;

  if (completedPages[pageKey]) {

    nextBtn.disabled = false;

  } else {

    nextBtn.disabled = true;

  }

}

/* =========================
   FINAL POPUP
========================= */

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  let totalQuestions = 0;

  quiz.forEach((section) => {
    totalQuestions += section.questions.length;
  });

  document.getElementById("finalScore").textContent = `Score : ${score} / ${totalQuestions}`;

  document.getElementById("stars").textContent = "⭐⭐⭐";
  const duration = 2000;

  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,

      angle: 60,

      spread: 55,

      origin: { x: 0 },
    });

    confetti({
      particleCount: 6,

      angle: 120,

      spread: 55,

      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* =========================
   POPUP
========================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");

  const icon = document.getElementById("popupIcon");

  const popupTitle = document.getElementById("popupTitle");

  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");

  popup.style.display = "none";

  void popup.offsetWidth;

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🥳";

    popupTitle.textContent = "सही जवाब!";

    msg.textContent = "बहुत बढ़िया!";
  } else {
    icon.textContent = "😔";

    popupTitle.textContent = "गलत जवाब!";

    msg.textContent = "फिर से कोशिश करें!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}
