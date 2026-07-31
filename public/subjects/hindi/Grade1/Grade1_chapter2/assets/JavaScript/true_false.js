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
const questions = [

{
q: "Q1. क _",
a: "ख",
options:["ख","ग","न"],
img: "../assets/images/khargosh.webp"
},

{
q: "Q2. ग _",
a: "घ",
options:["ज","घ","त"],
img: "../assets/images/ghadi.webp"
},

{
q: "Q3. ख _",
a: "ग",
options:["च","ड","ग"],
img: "../assets/images/gamala.webp"
},

{
q: "Q4. घ _",
a: "ङ",
options:["ङ","भ","ट"],
img: "../assets/images/sankh.png"
},

{
q: "Q5. च _",
a: "छ",
options:["ढ","छ","फ"],
img: "../assets/images/chhata.webp"
},

{
q: "Q6. ज _",
a: "झ",
options:["झ","ल","र"],
img: "../assets/images/jhanda.webp"
},

{
q: "Q7. छ _",
a: "ज",
options:["न","ज","प"],
img: "../assets/images/jahaj.webp"
},

{
q: "Q8. झ _",
a: "ञ",
options:["ब","ञ","स"],
img: "../assets/images/manch.webp"
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

  q.options.forEach((opt)=>{

    const btn = document.createElement("button");

    btn.className = "choice-btn";

    btn.textContent = opt;

   if(answers[index]){

  // show ONLY correct answer on revisit

  if(opt !== q.a){

    return;
  }

  btn.disabled = true;

  btn.style.opacity = "1";
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

  const allBtns =
  document.querySelectorAll(".choice-btn");

  allBtns.forEach((b)=>{

    if(b.textContent !== q.a){

      b.remove();

    }else{

      b.disabled = true;

      b.style.opacity = "1";
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