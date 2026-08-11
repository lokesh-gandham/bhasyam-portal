
/* ===================== FULL FIXED JS (NO DELETIONS) ===================== */

const quizData = [
{
 q:"Q1. आ",
 options:[
  {text:"अ",img:"../assets/images/1-1.png"},
  {text:"आ",img:"../assets/images/1-2.png"},
  {text:"ओ",img:"../assets/images/1-3.png"},
  {text:"औ",img:"../assets/images/1-4.png"}
 ],
 correctIndex:1
},
{
 q:"Q2. ऊ",
 options:[
  {text:"ए",img:"../assets/images/2-1.png"},
  {text:"ऐ",img:"../assets/images/2-2.png"},
  {text:"ऊ",img:"../assets/images/2-3.png"},
  {text:"इ",img:"../assets/images/2-4.png"}
 ],
 correctIndex:2
},
{
 q:"Q3. उ",
 options:[
  {text:"अ",img:"../assets/images/1-1.png"},
  {text:"आ",img:"../assets/images/1-2.png"},
  {text:"ऊ",img:"../assets/images/2-3.png"},
  {text:"उ",img:"../assets/images/3-4.png"}
 ],
 correctIndex:3
},
{
 q:"Q4. ई",
 options:[
  {text:"आ",img:"../assets/images/1-2.png"},
  {text:"औ",img:"../assets/images/1-4.png"},
  {text:"इ",img:"../assets/images/2-4.png"},
  {text:"ई",img:"../assets/images/4-4.png"}
 ],
 correctIndex:3
},

];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);

const questionText = document.getElementById("questionText");
const qEmoji = document.getElementById("qEmoji");
const optionsBox = document.getElementById("optionsBox");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const bubbleOrbit = document.getElementById("bubbleOrbit");
const orbitIndicator = document.getElementById("orbitIndicator");


// function speak(text){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }
function speak(t) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);

  msg.lang = "hi-IN";   // Hindi voice
  msg.volume = 1;
  msg.rate = 0.9;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
// function speak(t) {
//   speechSynthesis.cancel();   // optional but recommended

//   const msg = new SpeechSynthesisUtterance(t);
//   msg.volume = 0.1;   // 🔉 lower volume (0 to 1)
//   msg.rate = 1;
//   msg.pitch = 1;

//   speechSynthesis.speak(msg);
// }

function showPopup(isCorrect) {

  const popup =
    document.getElementById("answerPopup");

  const icon =
    document.getElementById("popupIcon");

  const title =
    document.getElementById("popupTitle");

  const msg =
    document.getElementById("popupMsg");

  /* CHANGE POPUP TYPE */
  popup.className =
    "popup " + (isCorrect ? "correct" : "wrong");

  /* SHOW POPUP */
  /* RESET ANIMATION */

popup.style.display = "none";

void popup.offsetWidth;
  popup.style.display = "flex";

  /* CORRECT */
  if (isCorrect) {

    icon.textContent = "🥳";

    title.textContent = "सही जवाब!";

    msg.textContent = "बहुत बढ़िया!";

  }

  /* WRONG */
  else {

    icon.textContent = "😔";

    title.textContent = "गलत जवाब!";

    msg.textContent = "फिर से कोशिश करें!";
  }

  /* AUTO HIDE */
  setTimeout(() => {

    popup.style.display = "none";

  }, 1200);
}

/* ===== PROGRESS ===== */

// function buildProgress(){
//   bubbleOrbit.querySelectorAll(".bubble-step").forEach(e=>e.remove());
//   quizData.forEach(()=>{
//     const step=document.createElement("div");
//     step.className="bubble-step";
//     step.innerHTML='<div class="bubble-dot">⭐</div>';
//     bubbleOrbit.appendChild(step);
//   });
// }

// function moveIndicator(){
//   const steps=document.querySelectorAll(".bubble-step");
//   const step=steps[current];
//   const orbitRect=bubbleOrbit.getBoundingClientRect();
//   const stepRect=step.getBoundingClientRect();
//   orbitIndicator.style.left =
//     (stepRect.left - orbitRect.left + stepRect.width/2) + "px";
// }

// function updateProgress(){
//   document.querySelectorAll(".bubble-step").forEach((s,i)=>{
//     s.classList.toggle("active",i===current);
//     s.classList.toggle("done",i<current);
//   });
//   requestAnimationFrame(moveIndicator);
// }

/* ===== QUIZ ===== */

function loadQuestion(){
  const q = quizData[current];
  questionText.textContent = q.q;
  // qEmoji.textContent = q.emoji;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, idx)=>{
    const div=document.createElement("div");
    div.className="option";
    div.innerHTML=`<img src="${opt.img}"><div class="opt-label">${opt.text}</div>`;
    div.onclick=()=>checkAnswer(div, idx);
    optionsBox.appendChild(div);
  });
  /* 🔁 RESTORE STATE WHEN GOING BACK */
if(answered[current]){
  const correctIndex = quizData[current].correctIndex;

  document.querySelectorAll(".option").forEach((o, i)=>{
    o.classList.add("disabled");
    if(i === correctIndex){
      o.classList.remove("disabled");
      o.classList.add("correct-lock");
    }
  });

  nextBtn.disabled = false;
}


  prevBtn.disabled = current === 0;
  nextBtn.disabled = !answered[current];
  updateProgress();
}
function showFinal() {

  const finalPopup =
    document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore")
    .textContent = `Score : ${score}/${quizData.length}`;

  document.getElementById("stars")
    .textContent = "⭐".repeat(3);

  /* CONFETTI */

  const duration = 2000;

  const end = Date.now() + duration;

  (function frame() {

    confetti({

      particleCount: 6,

      angle: 60,

      spread: 55,

      origin: { x: 0 }

    });

    confetti({

      particleCount: 6,

      angle: 120,

      spread: 55,

      origin: { x: 1 }

    });

    if (Date.now() < end) {

      requestAnimationFrame(frame);

    }

  })();

}

function checkAnswer(optionDiv, selected){
  if(answered[current]) return;

  const correctIndex = quizData[current].correctIndex;

  if(selected === correctIndex){
    answered[current] = true;
    score++;
   speak("सही जवाब");

    document.querySelectorAll(".option").forEach(o=>o.classList.add("disabled"));
    optionDiv.classList.add("correct-lock");
showPopup(true);

if(current === quizData.length - 1){

  setTimeout(()=>{

    showFinal();

  },1100);

}else{

  nextBtn.disabled = false;

}
  }else{
   speak("गलत जवाब");
showPopup(false);

  }
}

prevBtn.onclick = ()=>{ current--; loadQuestion(); };
nextBtn.onclick = ()=>{ current++; loadQuestion(); };

// buildProgress();
loadQuestion();
window.addEventListener("resize",()=>requestAnimationFrame(moveIndicator));


