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
    `परिणाम : ${score} / ${questions.length}`;
  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  fireConfettif();
}


/* ================= QUESTIONS ================= */

const questions = [

{
q: "Q1. क ___ ग ",
a: "ख",

img1: "../assets/images/khargosh.webp",
img2: "../assets/images/gamla.webp"
},

{
q: "Q2. ख ___ घ ",
a: "ग",

img2: "../assets/images/gamla.webp",
img1: "../assets/images/ghadi.webp"
},

{
q: "Q3. च ___ ज ",
a: "छ",

img2: "../assets/images/chhata.webp",
img1: "../assets/images/jahaj.webp"
},

{
q: "Q4. ज ___ ञ ",
a: "झ",

img1: "../assets/images/jhanda.webp",
img2: "../assets/images/manch.webp"
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

const input    = document.getElementById("answerInput");

// ✅ restrict input behavior
input.setAttribute("autocomplete", "off");
input.setAttribute("spellcheck", "false");

// ❌ block drag
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

// ❌ block paste (very important)
input.addEventListener("paste", (e) => e.preventDefault());
const submitBtn= document.getElementById("submitBtn");


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

  qImgEl.innerHTML = `
  <div class="image-card">
    <img src="${q.img1}" class="question-img">
  </div>

  <div class="image-card">
    <img src="${q.img2}" class="question-img">
  </div>
`;
  qTextEl.textContent = q.q;
input.value = "";
input.disabled = false;
submitBtn.style.display = "inline-block";
submitBtn.disabled = true;

  

  const alreadyCorrect = !!answers[index];

 if(alreadyCorrect){

  input.value = q.a.toUpperCase();
  input.disabled = true;

  submitBtn.style.display = "none";   // hide submit button

}
  prev.disabled = index === 0;
  next.disabled = !alreadyCorrect;

}

input.addEventListener("input", () => {

  if(input.value.trim().length > 0){
    submitBtn.disabled = false;
  }else{
    submitBtn.disabled = true;
  }

});

/* ================= EVENTS ================= */

submitBtn.onclick = checkAnswer;

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