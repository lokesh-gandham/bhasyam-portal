// ======================== HINDI SPEECH SYNTHESIS ========================

// function speakHindi(text){

//   if(!("speechSynthesis" in window)) return;

//   speechSynthesis.cancel();

//   const utterance =
//     new SpeechSynthesisUtterance(text);

//   utterance.lang = "hi-IN";

//   utterance.rate = 0.9;

//   utterance.pitch = 1.1;

//   utterance.volume = 1;

//   speechSynthesis.speak(utterance);
// }

// ======================== SOUND EFFECTS ========================

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

// ======================== CONFETTI ========================

function triggerConfetti(){

  confetti({
    particleCount:350,
    spread:130,
    origin:{ y:0.5 }
  });

}

// ======================== POPUP ========================

const popupDiv =
  document.getElementById("reactionPopup");

const popupEmojiSpan =
  document.getElementById("popupEmojiDisplay");

function showResultPopup(isCorrect){

  if(isCorrect){

    popupEmojiSpan.innerHTML = "😊";

    // speakHindi("सही");
    playCorrect();
    confetti({
      particleCount:140,
      spread:80,
      origin:{ y:0.6 }
    });

  }else{

    popupEmojiSpan.innerHTML = "😢";

    //  speakHindi("गलत");
    playWrong();
  }

  popupDiv.classList.add("active");

  setTimeout(()=>{

    popupDiv.classList.remove("active");

  },900);
}

// ======================== FINAL POPUP ========================

function triggerFinalCelebration(){

  triggerConfetti();

  const finalOverlay =
    document.getElementById("finalPopupOverlay");

  setTimeout(()=>{

    finalOverlay.classList.add("active");

  },500);
}

document.getElementById("finalPlayAgainBtn").onclick = ()=>{

  location.reload();

};

// ======================== QUESTIONS ========================

const allQuestions = [

  // PAGE 1

  {
    image:"../assets/images/corn.png",
    answer:"मक्का",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  {
    image:"../assets/images/mom.png",
    answer:"अम्मा",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  {
    image:"../assets/images/cat.png",
    answer:"बिल्ली",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  {
    image:"../assets/images/balloon.png",
    answer:"गुब्बारा",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  {
    image:"../assets/images/leaf.png",
    answer:"पत्ता",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  {
    image:"../assets/images/spinningToy.png",
    answer:"लट्टू",
    options:["पत्ता","लट्टू","मक्का","अम्मा","बिल्ली","गुब्बारा",]
  },

  // PAGE 2

  {
    image:"../assets/images/fly.png",
    answer:"मक्खी",
    options:["चिट्ठी","डॉक्टर","पत्थर","मक्खी","सब्ज़ी","गड्ढा"]
  },

  {
    image:"../assets/images/manhole.png",
    answer:"गड्ढा",
    options:["सब्ज़ी","मक्खी","गड्ढा","चिट्ठी","पत्थर","डॉक्टर"]
  },

  {
    image:"../assets/images/letter.png",
    answer:"चिट्ठी",
    options:["पत्थर","चिट्ठी","मक्खी","डॉक्टर","गड्ढा","सब्ज़ी"]
  },

  {
    image:"../assets/images/vegetables.png",
    answer:"सब्ज़ी",
    options:["डॉक्टर","सब्ज़ी","चिट्ठी","पत्थर","मक्खी","गड्ढा"]
  },

  {
    image:"../assets/images/doctor.png",
    answer:"डॉक्टर",
    options:["गड्ढा","पत्थर","डॉक्टर","सब्ज़ी","चिट्ठी","मक्खी"]
  },

  {
    image:"../assets/images/stone.png",
    answer:"पत्थर",
    options:["मक्खी","पत्थर","डॉक्टर","गड्ढा","सब्ज़ी","चिट्ठी"]
  },

  // PAGE 3

  {
    image:"../assets/images/sun.png",
    answer:"सूर्य",
    options:["प्रसाद","दर्पण","सूर्य","ट्रक","पर्वत","राष्ट्र"]
  },

  {
    image:"../assets/images/mountain.png",
    answer:"पर्वत",
    options:["राष्ट्र","सूर्य","पर्वत","दर्पण","ट्रक","प्रसाद"]
  },

  {
    image:"../assets/images/laddu.png",
    answer:"प्रसाद",
    options:["दर्पण","प्रसाद","राष्ट्र","सूर्य","पर्वत","ट्रक"]
  },

  {
    image:"../assets/images/mirror.png",
    answer:"दर्पण",
    options:["ट्रक","दर्पण","प्रसाद","राष्ट्र","सूर्य","पर्वत"]
  },

  {
    image:"../assets/images/truck.png",
    answer:"ट्रक",
    options:["पर्वत","राष्ट्र","ट्रक","सूर्य","दर्पण","प्रसाद"]
  },

  {
    image:"../assets/images/map.png",
    answer:"राष्ट्र",
    options:["सूर्य","प्रसाद","दर्पण","राष्ट्र","ट्रक","पर्वत"]
  }

];

// ======================== GAME STATE ========================

const QUESTIONS_PER_PAGE = 6;

const TOTAL_PAGES =
  Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);

let currentPage = 0;

let solvedStatus =
  new Array(allQuestions.length).fill(false);

let solvedAnswers =
  new Array(allQuestions.length).fill("");

let currentActiveQuestion = 0;

// ======================== DOM ========================

const questionsGrid =
  document.getElementById("questionsGrid");

const optionsContainer =
  document.getElementById("optionsContainer");

const optionsArea =
  document.getElementById("optionsArea");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

// ======================== ACTIVE QUESTION ========================

function updateActiveQuestionHighlight(){

  const cards =
    document.querySelectorAll(".question-card");

  const startIdx =
    currentPage * QUESTIONS_PER_PAGE;

  cards.forEach((card,idx)=>{

    card.classList.remove("active-question");

    const globalIdx = startIdx + idx;

    if(
      idx === currentActiveQuestion &&
      globalIdx < allQuestions.length &&
      !solvedStatus[globalIdx]
    ){

      card.classList.add("active-question");
    }
  });
}

// ======================== FINAL CHECK ========================

function checkAndShowFinalPopup(){

  const allSolved =
    solvedStatus.every(status => status === true);

  if(allSolved){

    triggerFinalCelebration();
  }
}

// ======================== OPTION CLICK ========================

function handleOptionClick(selectedOption){

  const startIdx =
    currentPage * QUESTIONS_PER_PAGE;

  const currentQIndex =
    startIdx + currentActiveQuestion;

  if(currentQIndex >= allQuestions.length) return;

  if(solvedStatus[currentQIndex]){

    // speakHindi("यह प्रश्न पहले ही हल हो चुका है");

    return;
  }

  const currentQuestion =
    allQuestions[currentQIndex];

  if(selectedOption === currentQuestion.answer){

    solvedStatus[currentQIndex] = true;

    solvedAnswers[currentQIndex] =
      selectedOption;

    const inputField =
      document.querySelector(
        `.answer-input[data-qidx='${currentQIndex}']`
      );

    if(inputField){

      inputField.value = selectedOption;

      inputField.classList.add("correct-answer");
    }
    playCorrect();

   

    showResultPopup(true);

    let nextUnsolved = -1;

    for(
      let i = currentActiveQuestion + 1;
      i < QUESTIONS_PER_PAGE;
      i++
    ){

      const checkIdx = startIdx + i;

      if(
        checkIdx < allQuestions.length &&
        !solvedStatus[checkIdx]
      ){

        nextUnsolved = i;

        break;
      }
    }

    if(nextUnsolved !== -1){

      currentActiveQuestion =
        nextUnsolved;
    }

    renderPage();

    checkAndShowFinalPopup();

  }else{
    playWrong();

    

    showResultPopup(false);
  }
}

// ======================== OPTIONS ========================

function renderOptions(){

  const startIdx =
    currentPage * QUESTIONS_PER_PAGE;

  let activeQIndex =
    startIdx + currentActiveQuestion;

  if(activeQIndex >= allQuestions.length) return;

  const currentQuestion =
    allQuestions[activeQIndex];

  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach(opt=>{

    const btn =
      document.createElement("button");

    btn.className = "option-btn";

    btn.textContent = opt;

    let disabled = false;

    for(
      let i = 0;
      i < QUESTIONS_PER_PAGE;
      i++
    ){

      const globalIdx = startIdx + i;

      if(
        globalIdx < allQuestions.length &&
        solvedStatus[globalIdx] &&
        solvedAnswers[globalIdx] === opt
      ){

        disabled = true;

        break;
      }
    }

    if(disabled){

      btn.classList.add("disabled-option");
    }

    btn.onclick = ()=>{

      handleOptionClick(opt);
    };

    optionsContainer.appendChild(btn);
  });
}

// ======================== RENDER PAGE ========================

function renderPage(){

  const startIdx =
    currentPage * QUESTIONS_PER_PAGE;

  const endIdx =
    Math.min(
      startIdx + QUESTIONS_PER_PAGE,
      allQuestions.length
    );

  const pageQuestions =
    allQuestions.slice(startIdx,endIdx);

  questionsGrid.innerHTML = "";

  for(
    let i = 0;
    i < pageQuestions.length;
    i++
  ){

    const globalIdx = startIdx + i;

    const q = pageQuestions[i];

    const isSolved =
      solvedStatus[globalIdx];

    const savedAnswer =
      solvedAnswers[globalIdx];

    const card =
      document.createElement("div");

    card.className = "question-card";

    card.innerHTML = `
      <img src="${q.image}"
           class="question-img">

      <input type="text"
             class="answer-input
             ${isSolved ? 'correct-answer':''}"
             placeholder="उत्तर"
             disabled
             value="${isSolved ? savedAnswer:''}"
             data-qidx="${globalIdx}">
    `;

    questionsGrid.appendChild(card);
  }

  let firstUnsolved = -1;

  for(
    let i = 0;
    i < QUESTIONS_PER_PAGE;
    i++
  ){

    const globalIdx = startIdx + i;

    if(
      globalIdx < allQuestions.length &&
      !solvedStatus[globalIdx]
    ){

      firstUnsolved = i;

      break;
    }
  }

  currentActiveQuestion =
    firstUnsolved !== -1
      ? firstUnsolved
      : 0;

  updateActiveQuestionHighlight();

  renderOptions();

  checkAllAnsweredOnPage();
}

// ======================== PAGE CHECK ========================

function checkAllAnsweredOnPage(){

  const startIdx =
    currentPage * QUESTIONS_PER_PAGE;

  const endIdx =
    Math.min(
      startIdx + QUESTIONS_PER_PAGE,
      allQuestions.length
    );

  let allAnswered = true;

  for(let i = startIdx; i < endIdx; i++){

    if(!solvedStatus[i]){

      allAnswered = false;

      break;
    }
  }

  nextBtn.disabled = !allAnswered;
}

// ======================== NAVIGATION ========================

prevBtn.onclick = ()=>{

  if(currentPage > 0){

    currentPage--;

    renderPage();

    prevBtn.disabled =
      currentPage === 0;
  }
};

nextBtn.onclick = ()=>{

  if(currentPage < TOTAL_PAGES - 1){

    currentPage++;

    renderPage();

    prevBtn.disabled = false;

  }else{

    checkAndShowFinalPopup();
  }
};

// ======================== START ========================

renderPage();

prevBtn.disabled = true;

checkAllAnsweredOnPage();