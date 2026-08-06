const quiz = [

{
q:"Q1. Which food item is rich in carbohydrates?",

options:[
{text:"Potato & corn", img:"../assets/images/potato&corn.png"},
{text:"Egg & fish", img:"../assets/images/egg&fish.png"}
],
answer:0
},

{
q:"Q2. Which food item is rich in proteins?",

options:[
{text:"Butter & oil", img:"../assets/images/butter&oil.png"},
{text:"Pulses & egg", img:"../assets/images/pulses&egg.png"}
],
answer:1
},

{
q:"Q3. Which food item is rich in fats?",

options:[
{text:"Oil & butter", img:"../assets/images/butter&oil.png"},
{text:"Papaya & apple", img:"../assets/images/papaya&apple.png"}
],
answer:0
},

{
q:"Q4. Which food item is rich in vitamins and minerals?",

options:[
  {text:"Oil & butter", img:"../assets/images/butter&oil.png"},
{text:"Mushroom & fish", img:"../assets/images/mushroom&fish.png"}

],
answer:1
},

{
q:"Q5. Which food item is rich in roughage?",

options:[
{text:"Cucumber & Strawberries", img:"../assets/images/papaya&almond.png"},
{text:"Fish & egg", img:"../assets/images/egg&fish.png"}
],
answer:0
}

];
let index=0;
let score=0;
let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const optionsDiv=document.getElementById("options");

const prev=document.getElementById("prev");
const next=document.getElementById("next");
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
function showPopup(correct){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(correct?"correct":"wrong");
popup.style.display="flex";

if(correct){
  launchConfetti(); 
icon.textContent="🥳";
title.textContent="Correct!";
msg.textContent="Well done!";
}else{
icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>popup.style.display="none",1200);

}

function check(i){

const buttons = document.querySelectorAll(".option");

if(i === quiz[index].answer){

showPopup(true);
speak("Correct");

answered[index] = true;
score++;

buttons[i].classList.add("correctAnswer");

/* disable all buttons after correct */
buttons.forEach(btn => btn.disabled = true);

/* allow next only after correct */
next.disabled = false;

if(index === quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/"+quiz.length;
launchConfetti(); 
prev.disabled = true;

},1200);

}

}else{

showPopup(false);
speak("Wrong");

/* user can try again */
buttons[i].classList.add("wrongAnswer");

/* optional: disable that wrong option only */
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

function playAgain(){
location.reload();
}

load();
