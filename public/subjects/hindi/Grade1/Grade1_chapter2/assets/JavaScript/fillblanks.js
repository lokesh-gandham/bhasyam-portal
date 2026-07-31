/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

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

const questions = [

{
q: "Q1.  _ख ",
a: "क",
options:["ग","क","न"],
img: "../assets/images/kamal.webp"
},

{
q: "Q2.  _ग",
a: "ख",
options:["ट","घ","ख"],
img: "../assets/images/khargosh.webp"
},

{
q: "Q3.  _घ",
a: "ग",
options:["च","ग","ड"],
img: "../assets/images/gamala.webp"
},

{
q: "Q4.  _ङ",
a: "घ",
options:["त","घ","ज"],
img: "../assets/images/ghadi.webp"
},

{
q: "Q5.  _छ",
a: "च",
options:["भ","ढ","च"],
img: "../assets/images/charkha.webp"
},

{
q: "Q6.  _झ",
a: "ज", 
options:["फ","ज","ल"],
img: "../assets/images/jahaj.webp"
},

{
q: "Q7.  _ज",
a: "छ",
options:["प","छ","न"],
img: "../assets/images/chhata.webp"
},

{
q: "Q8.  _ञ",
a: "झ",
options:["र","ब","झ"],
img: "../assets/images/jhanda.webp"
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

const answerSlot = document.getElementById("answerSlot");



const optionRow = document.getElementById("optionRow");;


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

/* ==
/* ================= LOAD QUESTION ================= */
function loadQuestion(){

  const q = questions[index];

  qImgEl.src = q.img;

  qTextEl.textContent = q.q;

if(answers[index]){

  answerSlot.textContent = questions[index].a;

}else{

  answerSlot.textContent = "";
}

  optionRow.innerHTML = "";

  q.options.forEach((opt)=>{
    const alreadyCorrect = answers[index];

    const btn = document.createElement("button");

    btn.className = "option-btn";

    btn.textContent = opt;

    if(alreadyCorrect){

    btn.disabled = true;
}

    btn.onclick = ()=>{

      if(answers[index]) return;
      answerSlot.textContent = opt;

    if(opt === q.a){

    showPopup(true);

    answers[index] = true;

    // Disable all option buttons
    optionRow.querySelectorAll(".option-btn").forEach(button => {
        button.disabled = true;
    });

    next.disabled = false;

    score++;

    updateScore();

    if(index === questions.length - 1){
        setTimeout(showFinal,1400);
    }
}else{

        showPopup(false);

        setTimeout(()=>{

          answerSlot.textContent = "";

        },500);
      }

    };

    optionRow.appendChild(btn);

  });

  prev.disabled = index === 0;

  next.disabled = !answers[index];
}
/* ================= EVENTS ================= */

prev.onclick = () => {

  if(index > 0){

    index--;

    loadQuestion();
  }
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