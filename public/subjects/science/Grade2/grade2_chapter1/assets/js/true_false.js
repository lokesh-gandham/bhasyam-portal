
/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  // ?? Reset animation
  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "??";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "??";
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
    "?".repeat(score);
    fireConfettif()
}

const quizData = [

{
q:"Q1. All the rooms in a house are same.",
a:false,
img:"./../assets/images/flat.png",
answered:false
},

{
q:"Q2. We eat food in the dining room.",
a:true,
img:"./../assets/images/kitchen.png",
answered:false
},

{
q:"Q3. Pucca houses are built with mud.",
a:false,
img:"./../assets/images/tf-3.png",
answered:false
},

{
q:"Q4. Kutcha houses are temporary houses.",
a:true,
img:"./../assets/images/hut.png",
answered:false
},

{
q:"Q5. Houseboats float on water",
a:true,
img:"./../assets/images/houseboat.png",
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
  const q = quizData[index];   // ? define first

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;           // ? now works
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

  showPopup(true);   // ? correct popup
  fireConfetti()

  nextBtn.disabled = false;

  if(index === quizData.length - 1){
    setTimeout(showFinal, 800);
  }

} else {

  showPopup(false);  // ? wrong popup

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
