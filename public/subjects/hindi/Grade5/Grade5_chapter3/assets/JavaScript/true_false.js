/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  const choiceOptions = document.getElementById("choiceOptions");

  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
   icon.textContent = "🌟";
  title.textContent = "बहुत बढ़िया!";
  msg.textContent = "आपका उत्तर सही है।";

    // speak("Correct");
    playCorrectSound();
    fireConfetti();

  } else {
 icon.textContent = "😔";
  title.textContent = "ओह नहीं!";
  msg.textContent = "फिर से प्रयास करें।";

    // speak("Wrong");
    playWrongSound();
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `परिणाम: ${score} / ${questions.length}`;

  
   document.getElementById("stars").textContent = "🏅🏅🏅";

  fireConfettif();
}


/* ================= QUESTIONS ================= */
/* ================= QUESTIONS ================= */

const questions = [

{
q: "Q1. रेल - ______",
a: "खेल",
img: "../assets/images/rel.png",

options:[
"पकड़े",
"हार",
"वहाँ",
"हार",
"वाला",
"अंडा",
"छाए",
"खेल"
]
},

{
q: "Q2. लगाएं - ______",
a: "छाए",
img: "../assets/images/lgao.png",

options:[
"खेल",
"पकड़े",
"हार",
"छाए",
"मेल",
"वहाँ",
"वाला",
"अंडा"
]
},

{
q: "Q3. यहाँ - ______",
a: "वहाँ",
img: "../assets/images/ynha.png",

options:[
"मेल",
"वहाँ",
"अंडा",
"हार",
"खेल",
"छाए",
"वाला",
"पकड़े"
]
},

{
q: "Q4. चार - ______",
a: "हार",
img: "../assets/images/char.png",

options:[
"पकड़े",
"वहाँ",
"हार",
"मेल",
"वाला",
"अंडा",
"छाए",
"खेल"
]
},

{
q: "Q5. बल्ला - ______",
a: "वाला",
img: "../assets/images/balla.png",

options:[
"मेल",
"वहाँ",
"वाला",
"पकड़े",
"हार",
"अंडा",
"खेल",
"छाए"
]
},

{
q: "Q6. खेल - ______",
a: "मेल",
img: "../assets/images/khel.png",

options:[
"पकड़े",
"हार",
"वहाँ",
"मेल",
"वाला",
"अंडा",
"छाए",
"वहाँ"
]
},

{
q: "Q7. छोड़े - ______",
a: "पकड़े",
img: "../assets/images/chode.png",

options:[
"वहाँ",
"हार",
"मेल",
"अंडा",
"पकड़े",
"छाए",
"वाला",
"खेल"
]
},

{
q: "Q8. डंडा - ______",
a: "अंडा",
img: "../assets/images/danda1.png",

options:[
"हार",
"वहाँ",
"अंडा",
"मेल",
"खेल",
"छाए",
"पकड़े",
"वाला"
]
}

];
let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);


/* ================= ELEMENTS ================= */

const qImgEl   = document.getElementById("qImg");
const qTextEl  = document.getElementById("qText");
const prev     = document.getElementById("prevBtn");
const next     = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");







/* ================= FUNCTIONS ================= */

function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

// function speak(text) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(text);
//   msg.lang = "en-UK";
//   msg.volume = 0.3;
//   msg.rate = 1.0;
//   msg.pitch = 1.0;
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


/* ================= CHECK ANSWER ================= */

function checkAnswer(){

  const correct = questions[index].a.toLowerCase();
  const userAnswer = input.value.trim().toLowerCase();

  if(userAnswer === correct){

    score++;
    updateScore();

    showPopup(true);

    answers[index] = correct;

    input.disabled = true;
    submitBtn.disabled = true;

    next.disabled = false;

    if(index === questions.length - 1){
      setTimeout(showFinal,1600);
    }

  }else{

    showPopup(false);
    input.value = "";

  }

}


/* ================= LOAD QUESTION ================= */
function loadQuestion(){

  const q = questions[index];

  qImgEl.src = q.img;

  qTextEl.textContent = q.q;

  choiceOptions.innerHTML = "";

  choiceOptions.style.display = "grid";

choiceOptions.style.gridTemplateColumns =
"repeat(4,1fr)";

choiceOptions.style.justifyItems = "center";

  q.options.forEach((opt)=>{

    const btn = document.createElement("button");

    btn.className = "choice-btn";

    btn.textContent = opt;

if(answers[index]){

  // hide wrong answers
  if(opt !== q.a){

    return;
  }

  // center single button
  choiceOptions.style.display = "flex";

  choiceOptions.style.justifyContent = "center";

  choiceOptions.style.alignItems = "center";

  btn.disabled = true;

  btn.classList.add("correct-answer");
}

    btn.onclick = ()=>{

      if(answers[index]) return;

      if(opt === q.a){

  answers[index] = true;

  score++;

  updateScore();

  showPopup(true);

  next.disabled = false;

  // remove wrong options instantly

// CENTER LAYOUT
choiceOptions.style.display = "flex";

choiceOptions.style.justifyContent = "center";

choiceOptions.style.alignItems = "center";

// REMOVE WRONG BUTTONS
const allBtns =
document.querySelectorAll(".choice-btn");

allBtns.forEach((b)=>{

  if(b.textContent !== q.a){

    b.remove();

  }else{

    b.disabled = true;

    b.classList.add("correct-answer");
  }

});

  if(index === questions.length - 1){

    setTimeout(showFinal,1400);
  }

}
      
      else{

        showPopup(false);
      }
    };

    choiceOptions.appendChild(btn);

  });

  prev.disabled = index === 0;

  next.disabled = !answers[index];
}


/* ================= EVENTS ================= */



prev.onclick = () => {
  index--;
  loadQuestion();
};

next.onclick = () => {
  if(index < questions.length - 1){
    index++;
    loadQuestion();
  }
};


/* ================= CONFETTI ================= */

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}


/* ================= START ================= */

updateScore();
loadQuestion();


// ❌ block drag/drop on whole page
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());