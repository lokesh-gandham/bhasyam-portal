
/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  // 🔥 Reset animation
  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  
 if (isCorrect) {
  icon.textContent = "🌟";
  title.textContent = "बहुत बढ़िया!";
  msg.textContent = "आपका उत्तर सही है।";

} else {
  icon.textContent = "😔";
  title.textContent = "ओह नहीं!";
  msg.textContent = "फिर से प्रयास करें।";
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
  `परिणाम: ${score} / ${quizData.length}`

   document.getElementById("stars").textContent = "🏅🏅🏅";
    fireConfettif()
}
const quizData = [

{
q:"Q1. दोस्तों ने एक नया खेल खेला।",
a:true,
img:"../assets/images/newgame.png",
answered:false
},

{
q:"Q2. नए खेल में गेंद और बल्ला थे।",
a:false,
img:"../assets/images/cricket.png",
answered:false
},

{
q:"Q3. खेल का नाम ‘पकड़म-पकड़ाई’ था।",
a:true,
img:"../assets/images/pp.png",
answered:false
},

{
q:"Q4. आँखें खोलने पर सबको दौड़ लगाना था।",
a:false,
img:"../assets/images/bhago.png",
answered:false
},

{
q:"Q5. नए खेल में दूसरी टोली जीत गई।",
a:false,
img:"../assets/images/win.png",
answered:false
}

];

let index=0, score=0;
const scoreBox = document.getElementById("scoreBox");

function updateScore(){
  scoreBox.textContent = "Score: " + score;
}
const questionEl=document.getElementById("question");
// const progressEl=document.getElementById("progress");
const trueBtn=document.getElementById("trueBtn");
const falseBtn=document.getElementById("falseBtn");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
prevBtn.disabled = true;
nextBtn.disabled = true;
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");


// function speak(t) {
//   speechSynthesis.cancel();
 
//   const msg = new SpeechSynthesisUtterance(t);  
 
//   msg.lang = "en-UK";  
//   msg.volume = 0.25;    
//   msg.rate = 1;
//   msg.pitch = 1;
 
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



function loadQuestion(){
  const q = quizData[index];   // ✅ define first

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;           // ✅ now works
  imgEl.style.display = "block";

  questionEl.textContent = q.q;
  // progressEl.textContent = `Question ${index+1}/${quizData.length}`;

  trueBtn.className = "true";
  falseBtn.className = "false";
trueBtn.classList.remove("correct","disabled");
falseBtn.classList.remove("correct","disabled");
  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);

  if(q.answered){
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;
}



function answer(user){
  const q = quizData[index];
  if(q.answered) return;

  const correct = q.a === user;

  //  speak(correct ? "Correct" : "Wrong");
  (correct ? playCorrectSound : playWrongSound)();
if(correct){

  q.answered = true;

  if(!q.scored){
    score++;
    q.scored = true;
    updateScore();
  }

  const correctBtn = user ? trueBtn : falseBtn;
  const wrongBtn = user ? falseBtn : trueBtn;

  correctBtn.classList.add("correct");
  wrongBtn.classList.add("disabled");

  showPopup(true);   // ✅ correct popup
  fireConfetti()

  nextBtn.disabled = false;

  if(index === quizData.length - 1){
    setTimeout(showFinal, 800);
  }

} else {

  showPopup(false);  // ❌ wrong popup

}
}


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

prevBtn.onclick=()=>{index--;loadQuestion();};
nextBtn.onclick=()=>{index++;loadQuestion();};

loadQuestion();
updateScore();
