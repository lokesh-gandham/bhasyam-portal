
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
    icon.textContent = "👍";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "👎";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score} / ${quizData.length}`

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
    fireConfettif()
}
const quizData = [

{
q:"Q1. Health is the state of being ill.",
a:false,
img:"../assets/images/healthill.png",
answered:false
},

{
q:"Q2. Microorganisms which cause diseases are called pathogens.",
a:true,
img:"../assets/images/pathogens.png",
answered:false
},

{
q:"Q3. Conjunctivitis is caused by cuts and wounds.",
a:false,
img:"../assets/images/Conjunctivitiscuts.png",
answered:false
},

{
q:"Q4. Plague is an object-borne disease.",
a:false,
img:"../assets/images/Plagueplug.png",
answered:false
},

{
q:"Q5. Vaccination is the most effective way to prevent diseases.",
a:true,
img:"../assets/images/doctorvaccine.png",
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


function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

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

  speak(correct ? "Correct" : "Wrong");
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
