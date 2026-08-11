/* =========================
   QUIZ DATA
========================= */

const quiz = [


  {
    id: 2,
    title: "दिए गए वर्णों के बीच वाला अक्षर लिखिए।",

    questions: [
      { left:"ख", correct:["ग"], right:"घ" },
      { left:"आ", correct:["इ"], right:"ई" },
      { left:"ए", correct:["ऐ"], right:"ओ" },
      { left:"इ", correct:["ई"], right:"उ" },
      { left:"ग", correct:["घ"], right:"ङ" },
      { left:"उ", correct:["ऊ"], right:"ऋ" },

      { left:"औ", correct:["अं"], right:"अः" },
      { left:"ऋ", correct:["ए"], right:"ऐ" },
      { left:"च", correct:["छ"], right:"ज" },
      { left:"ठ", correct:["ड"], right:"ढ" },
      { left:"त", correct:["थ"], right:"द" },
      { left:"फ", correct:["ब"], right:"भ" },

      { left:"ष", correct:["स"], right:"ह" },
      { left:"ज", correct:["झ"], right:"ञ" },
      { left:"ड", correct:["ढ"], right:"ण" },
      { left:"द", correct:["ध"], right:"न" },
      { left:"य", correct:["र"], right:"ल" },
      { left:"त्र", correct:["ज्ञ"], right:"श्र" }
    ]
  }]
  



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
   ELEMENTS
========================= */

const questionContainer =
  document.getElementById("blanks");

const optionsContainer =
  document.getElementById("letters");

const submitBtn =
  document.getElementById("submitBtn");

const prevBtn =
  document.getElementById("prev");

const nextBtn =
  document.getElementById("next");

const title =
  document.getElementById("questionTitle");

const img =
  document.getElementById("questionImage");

/* =========================
   IMAGE
========================= */

img.src =
  "../assets/images/sequence.png";

img.alt =
  "Hindi Alphabet Learning";

/* =========================
   CONFIG
========================= */

const QUESTIONS_PER_PAGE = 6;

/* =========================
   STATE
========================= */

let currentSection = 0;

let currentPage = 0;

let score = 0;

let selectedOption = "";

let currentBlank = null;

let answers = {};

let lockedAnswers = {};

let completedPages = {};

/* =========================
   TOTAL PAGES
========================= */

function getTotalPages(sectionIndex){

  return Math.ceil(
    quiz[sectionIndex].questions.length /
    QUESTIONS_PER_PAGE
  );

}

/* =========================
   OPTIONS
========================= */

function generateOptions(currentQuestions){

  let correctAnswers = [];

  currentQuestions.forEach(q=>{

    q.correct.forEach(ans=>{

      correctAnswers.push(ans);

    });

  });

  const extras = [
    "क","त","न","म","ल","स","ह","प",
    "थ","भ","य","व","अ","इ","उ","च"
  ];

  while(correctAnswers.length < 8){

    let random =
      extras[
        Math.floor(
          Math.random() *
          extras.length
        )
      ];

    if(!correctAnswers.includes(random)){

      correctAnswers.push(random);

    }

  }

  return correctAnswers
    .sort(()=>Math.random() - 0.5);

}
function getNextEmptyBlank(){

  let blanks =
    document.querySelectorAll(".blank");

  for(let blank of blanks){

    if(
      blank.innerText === "" &&
      !blank.classList.contains("correct")
    ){

      return blank;

    }

  }

  return null;

}


/* =========================
   RENDER
========================= */

function renderQuiz(){

  questionContainer.innerHTML = "";
  optionsContainer.innerHTML = "";

  submitBtn.disabled = true;

  selectedOption = "";
  currentBlank = null;

  const section = quiz[currentSection];

  title.innerText = section.title;

  const start =
    currentPage * QUESTIONS_PER_PAGE;

  const end =
    start + QUESTIONS_PER_PAGE;

  const currentQuestions =
    section.questions.slice(start, end);

  currentQuestions.forEach((q, index) => {

    const realIndex =
      start + index;

    let box =
      document.createElement("div");

    box.className =
      "question-box";

    let html = "";

html += `<span>${q.left}</span>`;

q.correct.forEach((ans, blankIndex) => {

  const key =
    `${currentSection}-${realIndex}-${blankIndex}`;

  const value =
    answers[key] || "";

  const isLocked =
    lockedAnswers[key];

  html += `
    <div
      class="blank ${isLocked ? 'correct' : ''}"
      data-index="${realIndex}"
      data-blank="${blankIndex}">
      ${value}
    </div>
  `;

});

html += `<span>${q.right}</span>`;

    box.innerHTML = html;

    questionContainer.appendChild(box);

  });

  const options =
    generateOptions(currentQuestions);

  options.forEach(letter => {

    let btn =
      document.createElement("button");

    btn.className = "letter";

    btn.innerText = letter;

    btn.onclick = function(){

      if(!currentBlank){
        currentBlank =
          getNextEmptyBlank();
      }

      if(
        currentBlank &&
        currentBlank.classList.contains("correct")
      ){
        currentBlank =
          getNextEmptyBlank();
      }

      if(!currentBlank) return;

      document
      .querySelectorAll(".blank")
      .forEach(b => {
        b.classList.remove("active-blank");
      });

      currentBlank.classList.add(
        "active-blank"
      );

      currentBlank.innerText =
        letter;

      selectedOption =
        letter;

      submitBtn.disabled =
        false;

      document
      .querySelectorAll(".letter")
      .forEach(l => {
        l.disabled = true;
      });

    };

    optionsContainer.appendChild(btn);

  });

  updateNav();

  const firstBlank =
    getNextEmptyBlank();

  if(firstBlank){

    document
    .querySelectorAll(".blank")
    .forEach(b => {
      b.classList.remove(
        "active-blank"
      );
    });

    firstBlank.classList.add(
      "active-blank"
    );

    currentBlank =
      firstBlank;
  }

}

renderQuiz();

/* =========================
   BACKSPACE
========================= */

document.addEventListener("keydown",function(e){

  if(e.key !== "Backspace") return;

  if(!currentBlank) return;

  if(currentBlank.classList.contains("correct")) return;

  const index =
    currentBlank.dataset.index;

  const blankIndex =
    currentBlank.dataset.blank;

  const key =
    `${currentSection}-${index}-${blankIndex}`;

  currentBlank.innerText = "";

  currentBlank.classList.remove("wrong");

  delete answers[key];

  submitBtn.disabled = true;

  document
  .querySelectorAll(".letter")
  .forEach(l=>{

    l.disabled = false;

  });

});

/* =========================
   SUBMIT
========================= */

submitBtn.onclick = function(){

  if(!currentBlank) return;

  const index =
    currentBlank.dataset.index;

  const blankIndex =
    currentBlank.dataset.blank;

  const section =
    quiz[currentSection];

  const correct =
  
    section.questions[index]
    .correct[blankIndex];

  const selected =
    currentBlank.innerText;
    console.log(
  "Question:",
  section.questions[index]
);

console.log(
  "Selected:",
  selected
);

console.log(
  "Correct:",
  correct
);

  const key =
    `${currentSection}-${index}-${blankIndex}`;

  answers[key] = selected;

  /* =========================
     CORRECT
  ========================= */

  if(selected === correct){

    // speak("सही");
    playCorrect();

    showPopup(true);

    currentBlank.classList.add(
      "correct"
    );

    currentBlank.classList.remove(
      "active-blank"
    );

    lockedAnswers[key] = true;

    score++;

    document
    .querySelectorAll(".letter")
    .forEach(l=>{

      l.disabled = false;

    });

    submitBtn.disabled = true;

    /* MOVE TO NEXT EMPTY BLANK */

   /* AUTO MOVE ACTIVE TO NEXT BLANK */

setTimeout(()=>{

  const nextBlank = getNextEmptyBlank();

  document
  .querySelectorAll(".blank")
  .forEach(b=>{
    b.classList.remove("active-blank");
  });

  if(nextBlank){
    nextBlank.classList.add("active-blank");
    currentBlank = nextBlank;

    // Lock options until user selects for new blank
    document
    .querySelectorAll(".letter")
    .forEach(l=>{
      l.disabled = false;
    });

  } else {
    currentBlank = null;

    document
    .querySelectorAll(".letter")
    .forEach(l=>{
      l.disabled = false;
    });
  }

  submitBtn.disabled = true;

}, 100);

    checkPageComplete();

  }

  /* =========================
     WRONG
  ========================= */

  else{

    // speak("गलत");
    playWrong();

    showPopup(false);

    currentBlank.classList.add(
      "wrong"
    );

setTimeout(()=>{

  currentBlank.innerText = "";

  currentBlank.classList.remove("wrong");

  // Re-add active color to same blank for retry
  currentBlank.classList.add("active-blank");

  delete answers[key];

  document
  .querySelectorAll(".letter")
  .forEach(l=>{
    l.disabled = false;
  });

  submitBtn.disabled = true;

}, 500);

  }

};
/* =========================
   PAGE COMPLETE
========================= */

function checkPageComplete(){

  const start =
    currentPage *
    QUESTIONS_PER_PAGE;

  const end =
    start + QUESTIONS_PER_PAGE;

  const currentQuestions =
    quiz[currentSection]
    .questions.slice(start,end);

  let completed = true;

  currentQuestions.forEach((q,index)=>{

    const realIndex =
      start + index;

    q.correct.forEach((ans,blankIndex)=>{

      const key =
        `${currentSection}-${realIndex}-${blankIndex}`;

      if(!lockedAnswers[key]){

        completed = false;

      }

    });

  });

  if(completed){

    completedPages[
      `${currentSection}-${currentPage}`
    ] = true;

    const totalPages =
      getTotalPages(currentSection);

    /* LAST PAGE OF LAST SECTION */

    if(
      currentSection === quiz.length - 1 &&
      currentPage === totalPages - 1
    ){

      setTimeout(()=>{

        showFinal();

      },800);

    }

    else{

      nextBtn.disabled = false;

    }

  }

}

/* =========================
   NEXT
========================= */

nextBtn.onclick = function(){

  if(!completedPages[
    `${currentSection}-${currentPage}`
  ]) return;

  const totalPages =
    getTotalPages(currentSection);

  if(currentPage <
    totalPages - 1){

    currentPage++;

  }else{

    if(currentSection <
      quiz.length - 1){

      currentSection++;

      currentPage = 0;

    }else{

      showFinal();

      return;

    }

  }

  renderQuiz();

};

/* =========================
   PREV
========================= */

prevBtn.onclick = function(){

  if(currentPage > 0){

    currentPage--;

  }else{

    if(currentSection > 0){

      currentSection--;

      currentPage =
        getTotalPages(currentSection)-1;

    }

  }

  renderQuiz();

};

/* =========================
   NAV
========================= */

function updateNav(){

  prevBtn.disabled =
    currentSection === 0 &&
    currentPage === 0;

  nextBtn.disabled =
    !completedPages[
      `${currentSection}-${currentPage}`
    ];

}

/* =========================
   FINAL POPUP
========================= */

function showFinal(){

  const finalPopup =
    document.getElementById(
      "finalPopup"
    );

  finalPopup.style.display =
    "flex";

  let totalQuestions = 0;

  quiz.forEach(section=>{

    totalQuestions +=
      section.questions.length;

  });

  document.getElementById(
    "finalScore"
  ).textContent =
  `आपका परिणाम : ${score} / ${totalQuestions}`;

  document.getElementById(
    "stars"
  ).textContent =
  "⭐⭐⭐";
  const duration = 2000;

  const end =
    Date.now() + duration;

  (function frame(){

    confetti({

      particleCount:6,

      angle:60,

      spread:55,

      origin:{x:0}

    });

    confetti({

      particleCount:6,

      angle:120,

      spread:55,

      origin:{x:1}

    });

    if(Date.now() < end){

      requestAnimationFrame(frame);

    }

  })();

}

/* =========================
   POPUP
========================= */

function showPopup(isCorrect){

  const popup =
    document.getElementById(
      "answerPopup"
    );

  const icon =
    document.getElementById(
      "popupIcon"
    );

  const popupTitle =
    document.getElementById(
      "popupTitle"
    );

  const msg =
    document.getElementById(
      "popupMsg"
    );

  popup.className =
    "popup " +
    (isCorrect
      ? "correct"
      : "wrong");

  popup.style.display = "none";

  void popup.offsetWidth;

  popup.style.display = "flex";

  if(isCorrect){

    icon.textContent = "🥳";

    popupTitle.textContent =
      "सही जवाब!";

    msg.textContent =
      "बहुत बढ़िया!";

  }else{

    icon.textContent = "😔";

    popupTitle.textContent =
      "गलत जवाब!";

    msg.textContent =
      "फिर से कोशिश करें!";

  }

  setTimeout(()=>{

    popup.style.display = "none";

  },1200);

}