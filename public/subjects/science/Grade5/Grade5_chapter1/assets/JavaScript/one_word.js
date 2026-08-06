
const quizData=[

{
q:"Q1. The muscles that are not under the control of our will.",
a:"INVOLUNTARY MUSCLES",
img:"../assets/images/involuntaryMuscles.png"
},

{
q:"Q2. This encloses the brain and protects it from injuries.",
a:"CRANIUM",
img:"../assets/images/cranium.webp"
},

{
q:"Q3. This protects the lungs.",
a:"RIB CAGE",
img:"../assets/images/Lungs.png"
},

{
q:"Q4. Joints that allow movement of bones.",
a:"MOVABLE JOINTS",
img:"../assets/images/moveablejoints.png"
},

{
q:"Q5. This kind of joint is found in the hip.",
a:"BALL AND SOCKET JOINT",
img:"../assets/images/hips.png"
}

];


/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(isCorrect?"correct":"wrong");
popup.style.display="flex";

if(isCorrect){

icon.textContent="🎉";
title.textContent="Correct!";
msg.textContent="Well done!";
speak("Correct");
fireConfetti();

}else{

icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
speak("Wrong");

}

setTimeout(()=>{
popup.style.display="none";
},1200);

}


/* ================= FINAL POPUP ================= */

function showFinal(){

const finalPopup=document.getElementById("finalPopup");

finalPopup.style.display="flex";

document.getElementById("finalScore").textContent=
`Score: ${score} / ${quizData.length}`;

document.getElementById("stars").textContent=
"⭐".repeat(score);

fireConfettif();

}


/* ================= SPEECH ================= */

function speak(text){

speechSynthesis.cancel();

const msg=new SpeechSynthesisUtterance(text);

msg.lang="en-UK";
msg.volume=0.25;
msg.rate=1;
msg.pitch=1;

speechSynthesis.speak(msg);

}


/* ================= QUIZ DATA ================= */

/* ================= VARIABLES ================= */

let current=0;
let score=0;

const qEl=document.getElementById("question");
const imgEl=document.getElementById("questionImg");
const nextBtn=document.getElementById("next");
const prevBtn=document.getElementById("prev");
const submitBtn=document.getElementById("submitBtn");

const input = document.getElementById("answerInput");
// ❌ Block drag & drop on input
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

input.addEventListener("input", () => {
  if(input.value.trim().length > 0){
    submitBtn.disabled = false;   // enable
  }else{
    submitBtn.disabled = true;    // disable
  }
});

const scoreBox=document.getElementById("scoreBox");


let correctWord="";


/* NEW STORAGE */
let savedAnswers=new Array(quizData.length).fill(null);
let locked=new Array(quizData.length).fill(false);


/* ================= SCORE ================= */

function updateScore(){

scoreBox.textContent="Score: "+score;

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){
document.getElementById("answerInput").focus();
const q=quizData[current];
const input = document.getElementById("answerInput");

if(savedAnswers[current]){
  input.value = savedAnswers[current];   // ✅ restore answer
  input.disabled = true;                 // 🔒 lock it
}else{
  input.value = "";
  input.disabled = false;
}

input.focus();
submitBtn.disabled = true;   // 🔥 ALWAYS start disabled
qEl.textContent=q.q;
imgEl.src=q.img;

correctWord=q.a.toUpperCase();





/* Lock behavior */
if(locked[current]){
  nextBtn.disabled = false;
  submitBtn.disabled = true;
}else{
  nextBtn.disabled = true;
 submitBtn.disabled = true;   // 🔥 FIRST CHANGE
}

prevBtn.disabled=current===0;


}

/* ================= KEYBOARD INPUT ================= */




/* ================= SUBMIT ================= */
submitBtn.onclick = () => {

  const input = document.getElementById("answerInput");
  let guess = input.value.trim().toUpperCase();

  if(!guess) return;

 if(guess === correctWord){

  input.value = correctWord;
  input.disabled = true;

  savedAnswers[current] = correctWord;   // 🔥 SAVE ANSWER

  score++;
  updateScore();
  showPopup(true);

  locked[current] = true;

  nextBtn.disabled = false;
  submitBtn.disabled = true;

    if(current === quizData.length - 1){
      setTimeout(showFinal,1200);
    }

  } 
   else {
  showPopup(false);
  input.value = "";  

  submitBtn.disabled = true;   // 🔥 ADD THIS LINE
}

};
/* ================= NAVIGATION ================= */

nextBtn.onclick=()=>{

current++;
loadQuestion();

};

prevBtn.onclick=()=>{

current--;
loadQuestion();

};


/* ================= CONFETTI ================= */

function fireConfetti() {

confetti({
particleCount:40,
spread:100,
origin:{y:0.6}
});

}

function fireConfettif() {

confetti({
particleCount:100,
spread:140,
origin:{y:0.6}
});

}


/* ================= START ================= */

updateScore();
loadQuestion();