const quiz = [

{
q:"Q1. The little boy had to spend all day on his _______________.",
options:[
{text:"House",img:"../assets/images/house.png"},
{text:"Room",img:"../assets/images/room.png"},
{text:"Bed",img:"../assets/images/bed.png"},
{text:"School",img:"../assets/images/school.png"}
],
answer:2,
img:"../assets/images/schoolBoy.png"
},

{
q:"Q2. One day, he saw something _______________ outside the window.",
options:[
{text:"Circle",img:"../assets/images/circle.png"},
{text:"Square",img:"../assets/images/square.png"},
{text:"Triangle",img:"../assets/images/triangle.png"},
{text:"Strange",img:"../assets/images/strange.png"}
],
answer:3,
img:"../assets/images/window.png"
},

{
q:"Q3. The boy saw a _______________ eating a sandwich.",
options:[
{text:"Monkey",img:"../assets/images/monkey.png"},
{text:"Penguin",img:"../assets/images/penguin.png"},
{text:"Pig",img:"../assets/images/pig.png"},
{text:"Elephant",img:"../assets/images/elephant.png"}
],
answer:1,
img:"../assets/images/sandwich.png"
},

{
q:"Q4. More and more _______________ appeared out of the window.",
options:[
{text:"Animals",img:"../assets/images/animals.png"},
{text:"Birds",img:"../assets/images/birds.png"},
{text:"Characters",img:"../assets/images/characters.png"},
{text:"Children",img:"../assets/images/friend.png"}
],
answer:2,
img:"../assets/images/mcq5.png"
}

];

let index=0;
let score=0;
let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const options=document.getElementById("options");

const prev=document.getElementById("prev");
const next=document.getElementById("next");



function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function load(){

question.innerText = quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;
options.innerHTML = "";

/* Center only first question */
if(index === 0){
    question.classList.add("center-question");
}else{
    question.classList.remove("center-question");
}

quiz[index].options.forEach((o,i)=>{

    let btn = document.createElement("button");

    btn.className = "option " + ["blue","yellow","green","orange"][i];

    btn.innerHTML = `
        <img src="${o.img}" class="opt-img">
        <span>${o.text}</span>
    `;

    btn.onclick = () => check(i);

    if(answered[index] && i === quiz[index].answer){
        btn.classList.add("correctAnswer");
    }

    options.appendChild(btn);

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

function showPopup(isCorrect){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="kid-popup "+(isCorrect?"kid-correct":"kid-wrong");
popup.style.display="flex";

if(isCorrect){
launchConfetti();
icon.textContent="🎉";
title.textContent="Great Job!";
msg.textContent="You got it right!";
}else{
icon.textContent="🥲";
title.textContent="Oops!";
msg.textContent="Try again, you can do it!";
}

setTimeout(()=>{
popup.style.display="none";
},1400);

}

function check(i){

    if(answered[index]) return;

    if(i === quiz[index].answer){

        showPopup(true);
        speak("Correct");

        answered[index] = true;
        score++;

        next.disabled = false;

        // Reload so correctAnswer border is applied
        load();

        if(index === quiz.length - 1){

            setTimeout(() => {

                showFinal();

            }, 1300);

        }

    } else {

        showPopup(false);
        speak("Wrong");

    }
}

next.onclick=()=>{

if(index<quiz.length-1){

index++;
load();

}
else{

showFinal();

}

}

prev.onclick=()=>{
index--;
load();
}

function showFinal(){

const popup=document.getElementById("finalPopup");

document.getElementById("finalScore").textContent =
`Your Score: ${score} / ${quiz.length}`;

document.getElementById("stars").textContent = "⭐".repeat(score);

popup.style.display="flex";

launchConfetti();

prev.disabled = true;

}

load();

function playAgain(){
location.reload();
}