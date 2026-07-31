const questions = [
  {
    q: "इमली",
    a: "इ",
    options: ["अ", "आ", "इ", "उ"],
    img: "../assets/images/imli.png",
  },
  {
    q: "उल्लू",
    a: "उ",
    options: ["उ", "ऋ", "ओ", "ए"],
    img: "../assets/images/ullu.png",
  },
  {
    q: "आग",
    a: "आ",
    options: ["अ", "आ", "इ", "ई"],
    img: "../assets/images/aag.png",
  },
  {
    q: "अनार",
    a: "अ",
    options: ["अ", "आ", "इ", "ओ"],
    img: "../assets/images/anar.png",
  },
  {
    q: "ऋषि",
    a: "ऋ",
    options: ["ऋ", "ए", "ऐ", "उ"],
    img: "../assets/images/rishi.png",
  },
  {
    q: "ऐनक",
    a: "ऐ",
    options: ["ऐ", "ए", "ओ", "औ"],
    img: "../assets/images/ainak.png",
  },
  {
    q: "अंगूर",
    a: "अं",
    options: ["अं", "अ", "आ", "ओ"],
    img: "../assets/images/angoor.png",
  },
  {
    q: "ओखली",
    a: "ओ",
    options: ["ओ", "औ", "अं", "ऐ"],
    img: "../assets/images/okhli.png",
  },
  {
    q: "कमल",
    a: "क",
    options: ["क", "ख", "ग", "घ"],
    img: "../assets/images/kamal.png",
  },
  {
    q: "जहाज",
    a: "ज",
    options: ["ज", "झ", "ट", "ठ"],
    img: "../assets/images/jahaj.png",
  },
  {
    q: "टमाटर",
    a: "ट",
    options: ["ट", "ठ", "ड", "ढ"],
    img: "../assets/images/tamatar.png",
  },
  {
    q: "तकिया",
    a: "त",
    options: ["त", "थ", "द", "ध"],
    img: "../assets/images/takiya.png",
  },
  {
    q: "धनुष",
    a: "ध",
    options: ["ध", "द", "थ", "न"],
    img: "../assets/images/dhanush.png",
  },
  {
    q: "भवन",
    a: "भ",
    options: ["भ", "ब", "म", "प"],
    img: "../assets/images/building.png",
  },
  {
    q: "नल",
    a: "न",
    options: ["न", "प", "फ", "ब"],
    img: "../assets/images/nal.png",
  },
  {
    q: "पतंग",
    a: "प",
    options: ["प", "फ", "ब", "भ"],
    img: "../assets/images/patang.png",
  },
  {
    q: "बतख",
    a: "ब",
    options: ["ब", "भ", "म", "य"],
    img: "../assets/images/batakh.png",
  },
  {
    q: "मटर",
    a: "म",
    options: ["म", "भ", "ब", "य"],
    img: "../assets/images/matar.png",
  },
  {
    q: "यज्ञ",
    a: "य",
    options: ["य", "र", "ल", "व"],
    img: "../assets/images/yagya.png",
  },
  {
    q: "लट्टू",
    a: "ल",
    options: ["ल", "व", "श", "ष"],
    img: "../assets/images/spinningToy.png",
  },
  {
    q: "शलगम",
    a: "श",
    options: ["श", "ष", "स", "ह"],
    img: "../assets/images/shalgam.png",
  },
  {
    q: "हल",
    a: "ह",
    options: ["ह", "स", "ष", "श"],
    img: "../assets/images/hal.png",
  },
  {
    q: "क्षत्रिय",
    a: "क्ष",
    options: ["क्ष", "त्र", "ज्ञ", "श्र"],
    img: "../assets/images/kshatriya.png",
  },
  {
    q: "श्रमिक",
    a: "श्र",
    options: ["श्र", "त्र", "ज्ञ", "क्ष"],
    img: "../assets/images/shramik.png",
  },
];

const QUESTIONS_PER_PAGE = 4;

let currentPage = 0;

let score = 0;

const answered =
  Array(questions.length).fill(false);

const cardsGrid =
  document.getElementById("cardsGrid");

const prevBtn =
  document.getElementById("prev");

const nextBtn =
  document.getElementById("next");

const pageIndicator =
  document.getElementById("pageIndicator");

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




/* =========================
   RENDER PAGE
========================= */

function renderPage() {

  cardsGrid.innerHTML = "";

  const start =
    currentPage * QUESTIONS_PER_PAGE;

  const end =
    start + QUESTIONS_PER_PAGE;

  const currentQuestions =
    questions.slice(start, end);

  currentQuestions.forEach((q, i) => {

    const realIndex =
      start + i;

    const card =
      document.createElement("div");

    card.className =
      "flashcard";

    if (answered[realIndex]) {

      card.classList.add("locked");
    }

    card.innerHTML = `

      <div class="question-word">
        ${q.q}
      </div>

      <img
        class="flash-image"
        src="${q.img}"
        alt=""
      >

      <div class="options-row">

    ${q.options.map(option => `

  <button
    class="option-btn
      ${
        answered[realIndex] &&
        option === q.a
          ? "correct"
          : ""
      }
    "
    data-answer="${option}"
    data-index="${realIndex}"
  >

    ${option}

  </button>

`).join("")}

      </div>
    `;

    cardsGrid.appendChild(card);
  });

  addOptionEvents();

  updateNav();

}


/* =========================
   OPTION EVENTS
========================= */

function addOptionEvents() {

  const optionButtons =
    document.querySelectorAll(".option-btn");

  optionButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      const selected =
        btn.dataset.answer;

      const qIndex =
        Number(btn.dataset.index);

      const question =
        questions[qIndex];

      if (answered[qIndex]) return;

      /* CORRECT */

      if (selected === question.a) {

        btn.classList.add("correct");

        answered[qIndex] = true;

        score++;

      //  speak("सही");
      playCorrect();
        showPopup(true);

        setTimeout(() => {

          btn.closest(".flashcard")
            .classList.add("locked");

        }, 200);

        checkPageComplete();

      }

      /* WRONG */

      else {

        btn.classList.add("wrong");

      //  speak("गलत");
      playWrong();

        showPopup(false);

        setTimeout(() => {

          btn.classList.remove("wrong");

        }, 500);
      }

    });

  });

}


/* =========================
   CHECK PAGE COMPLETE
========================= */

function checkPageComplete() {

  const start =
    currentPage * QUESTIONS_PER_PAGE;

  const end =
    start + QUESTIONS_PER_PAGE;

  const currentQuestions =
    answered.slice(start, end);

  const completed =
    currentQuestions.every(Boolean);

  nextBtn.disabled = !completed;

  /* FINAL POPUP */

  if (
    answered.every(Boolean)
  ) {

    setTimeout(() => {

      showFinal();

    }, 1000);
  }

}


/* =========================
   UPDATE NAVIGATION
========================= */

function updateNav() {

  const totalPages =
    Math.ceil(
      questions.length /
      QUESTIONS_PER_PAGE
    );

  pageIndicator.textContent =
    `${currentPage + 1} / ${totalPages}`;

  prevBtn.disabled =
    currentPage === 0;

  nextBtn.disabled = true;

  checkPageComplete();

}


/* =========================
   NEXT PAGE
========================= */

nextBtn.addEventListener("click", () => {

  const totalPages =
    Math.ceil(
      questions.length /
      QUESTIONS_PER_PAGE
    );

  if (currentPage < totalPages - 1) {

    currentPage++;

    renderPage();
  }

});


/* =========================
   PREV PAGE
========================= */

prevBtn.addEventListener("click", () => {

  if (currentPage > 0) {

    currentPage--;

    renderPage();
  }

});


/* =========================
   POPUP
========================= */

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
    "popup " +
    (isCorrect ? "correct" : "wrong");

  popup.style.display = "none";

  void popup.offsetWidth;

  popup.style.display = "flex";

  if (isCorrect) {

    icon.textContent = "🥳";

    title.textContent =
      "सही जवाब!";

    msg.textContent =
      "बहुत बढ़िया!";

  }

  else {

    icon.textContent = "😔";

    title.textContent =
      "गलत जवाब!";

    msg.textContent =
      "फिर से कोशिश करें!";
  }

  setTimeout(() => {

    popup.style.display =
      "none";

  }, 1200);

}


/* =========================
   FINAL POPUP
========================= */

function showFinal() {

  const finalPopup =
    document.getElementById("finalPopup");

  finalPopup.style.display =
    "flex";

  document.getElementById(
    "finalScore"
  ).textContent =
    `आपका परिणाम: ${score}/${questions.length}`;


  /* ===== 6 STAR SYSTEM ===== */

  const totalStars = 6;

  const earnedStars =
    Math.round(
      (score / questions.length) *
      totalStars
    );

  document.getElementById(
    "stars"
  ).textContent =
    "⭐".repeat(earnedStars);


  /* ===== CONFETTI ===== */

  if (window.innerWidth >= 769) {

    const duration = 2000;

    const end =
      Date.now() + duration;

    (function frame() {

      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {

        requestAnimationFrame(frame);
      }

    })();
  }

}


/* =========================
   INITIAL RENDER
========================= */

renderPage();