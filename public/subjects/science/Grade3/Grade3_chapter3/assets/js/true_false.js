const quiz = [

{
q:"Q1. Junk food is a healthy diet.",
answer:false,
img:"../assets/images/junkfood.png"
},

{
q:"Q2. Carbohydrates are energy-giving nutrients.",
answer:true,
img:"../assets/images/carbs.png"
},

{
q:"Q3. Starch and sugar are two types of proteins.",
answer:false,
img:"../assets/images/starch.png"
},

{
q:"Q4. Protein is the fibre present in the food.",
answer:false,
img:"../assets/images/protein.png"
},

{
q:"Q5. Consuming a lot of fatty food will make us very obese.",
answer:true,
img:"../assets/images/fats.png"
}

];
let index=0;
let score=0;

let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const img=document.getElementById("questionImage");

const prev=document.getElementById("prev");
const next=document.getElementById("next");


/* TEXT TO SPEECH */

function speak(t){

speechSynthesis.cancel();

const msg=new SpeechSynthesisUtterance(t);

msg.lang="en-UK";
msg.volume=0.3;
msg.rate=1;

speechSynthesis.speak(msg);

}


/* LOAD QUESTION */

function load(){

question.innerText=quiz[index].q;

img.src=quiz[index].img;

// speak(quiz[index].q);

prev.disabled=index===0;
next.disabled=!answered[index];

/* reset buttons */

document.querySelectorAll(".tf-btn").forEach(btn=>{
btn.classList.remove("correctAnswer");
btn.disabled=false;
});

/* show correct answer when going back */

if(answered[index]){

if(quiz[index].answer){
document.querySelector(".true-btn").classList.add("correctAnswer");
}else{
document.querySelector(".false-btn").classList.add("correctAnswer");
}

document.querySelectorAll(".tf-btn").forEach(btn=>{
btn.disabled=true;
});

}

}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

/* POPUP */

function showPopup(isCorrect){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(isCorrect?"correct":"wrong");
popup.style.display="flex";

if(isCorrect){
launchConfetti();
icon.textContent="🎉😊";
title.textContent="Correct!";
msg.textContent="Well done!";

speak("Correct");

}else{

icon.textContent="🥲💭";
title.textContent="Wrong!";
msg.textContent="Try again!";

speak("Wrong");

}

setTimeout(()=>{
popup.style.display="none";
},1200);

}


/* CHECK ANSWER */
function check(val){

if(answered[index]) return;

if(val===quiz[index].answer){

showPopup(true);

score++;

answered[index]=true;

next.disabled=false;

/* highlight correct */

if(val){
document.querySelector(".true-btn").classList.add("correctAnswer");
}else{
document.querySelector(".false-btn").classList.add("correctAnswer");
}

/* disable buttons */

document.querySelectorAll(".tf-btn").forEach(btn=>{
btn.disabled=true;
});

/* final popup */

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti(); 
prev.disabled = true;  
},1000);

}

}
else{

showPopup(false);

}

}


/* NEXT */

next.onclick=function(){

if(index<quiz.length-1){

index++;
load();

}

}


/* PREV */

prev.onclick=function(){

index--;
load();

}


/* PLAY AGAIN */

function playAgain(){

location.reload();

}

load();