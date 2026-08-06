const quiz = [

{
q:"Q1. A Living thing",

options:[
{text:"Cat", img:"../assets/images/cat.png"},
{text:"Chair", img:"../assets/images/chair.png"}
],
answer:0
},

{
q:"Q2. A Non-living thing",

options:[
{text:"Chair", img:"../assets/images/chair.png"},
{text:"Lion", img:"../assets/images/lion.png"}
],
answer:0
},


];
let index=0;
let score=0;
let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const optionsDiv=document.getElementById("options");

const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
let wrongSelected = [null,null,null,null,null];

function speak(text){

speechSynthesis.cancel();

const msg = new SpeechSynthesisUtterance(text);

msg.lang = "en-UK";
msg.volume = 0.25;
msg.rate = 1;
msg.pitch = 1;

speechSynthesis.speak(msg);

}
function load(){

question.innerText = quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;

optionsDiv.innerHTML = "";

quiz[index].options.forEach((o,i)=>{

let btn = document.createElement("button");

btn.className="option";

btn.innerHTML=`
<img src="${o.img}" class="opt-img">
<span>${o.text}</span>
`;

/* if correct answered earlier */
if(answered[index] && i === quiz[index].answer){
btn.classList.add("correctAnswer");
}

/* disable wrong option */
if(wrongSelected[index] === i){
btn.disabled = true;
}

/* prevent answering again when coming back */
if(answered[index] || wrongSelected[index] !== null){

btn.disabled = true;

}else{

btn.onclick = ()=>check(i);

}

optionsDiv.appendChild(btn);

});
prev.disabled = index === 0;
next.disabled = !answered[index];

}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  const stars = document.getElementById("popupStars");

  popup.style.display = "flex";

  if (isCorrect) {
    popup.classList.add("correct");
    popup.classList.remove("wrong");

    icon.textContent = "✔";
    title.textContent = "CORRECT!";
    msg.textContent = "Awesome! Moving to next...";
    
    stars.textContent = "⭐ ⭐ ⭐";
    stars.style.display = "block";

  } else {
    popup.classList.add("wrong");
    popup.classList.remove("correct");

    icon.textContent = "✖";
    title.textContent = "OOPS!";
    msg.textContent = "Try again";

    stars.style.display = "none";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}
function check(i) {
  const buttons = document.querySelectorAll(".option");

  if (i === quiz[index].answer) {
    showPopup(true);
    speak("Correct");
    showPopup(true);
speak("Correct");

// Small Confetti
confetti({
  particleCount: 35,
  spread: 55,
  startVelocity: 25,
  origin: { y: 0.6 }
});

    answered[index] = true;
    score++;

    buttons[i].classList.add("correctAnswer");
    buttons.forEach(btn => btn.disabled = true);
    next.disabled = false;

    if (index === quiz.length - 1) {
      setTimeout(() => {
        showFinal(); // ✅ call showFinal() instead of showing #final div
        prev.disabled = true;
      }, 1200);
    }

  } else {
    showPopup(false);
    speak("Wrong");
    buttons[i].classList.add("wrongAnswer");
    buttons[i].disabled = true;
  }
}



next.onclick=()=>{

if(index<quiz.length-1){

index++;
load();

}

}

prev.onclick=()=>{

index--;
load();

}

function restart(){
  location.reload();
}

load();
function fireBigConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/${quiz.length}`; // ✅ quiz not quizData

  document.getElementById("stars").textContent = "⭐".repeat(score);
  fireBigConfetti();
}

function nextSection() {
    document.getElementById("finalPopup").style.display = "none";
    window.parent.postMessage({ action: "nextSection", target: "matching.html" }, "*");
    try {
        const parentDoc = window.parent.document;
        const frame = parentDoc.querySelector("iframe[name='quiz-frame']");
        if (frame) {
            frame.src = "exercises/matching.html";
            const links = parentDoc.querySelectorAll(".sidebar a");
            links.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href")?.includes("fillblanks.html")) {
                    link.classList.add("active");
                }
            });
        }
    } catch (e) {
        sessionStorage.setItem("activeSection", "two_example.html.html");
        window.location.href = "../Grade2_lesson4.html";
    }
}