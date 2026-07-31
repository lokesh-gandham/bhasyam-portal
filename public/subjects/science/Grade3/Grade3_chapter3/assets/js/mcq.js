const quiz = [

{
q:"Q1. There are ______ major nutrients in food.",
img:"../assets/images/food.png",
options:[
{text:"Four", img:"../assets/images/four.png"},
{text:"Three", img:"../assets/images/three.png"},
{text:"Five", img:"../assets/images/five.png"},
{text:"Six", img:"../assets/images/six.png"}
],
answer:2
},

{
q:"Q2. ______ protect the vital organs by providing cushioning.",
img:"../assets/images/vital.png",
options:[
{text:"Carbohydrates", img:"../assets/images/carbs.png"},
{text:"Proteins", img:"../assets/images/protein.png"},
{text:"Fats", img:"../assets/images/fats.png"},
{text:"Vitamins", img:"../assets/images/vitamins.png"}
],
answer:2
},

{
q:"Q3. People who do a lot of physical work like farmers should consume more ______.",
img:"../assets/images/farmer.png",
options:[
{text:"Carbohydrates", img:"../assets/images/carbs.png"},
{text:"Proteins", img:"../assets/images/protein.png"},
{text:"Fats", img:"../assets/images/fats.png"},
{text:"Vitamins", img:"../assets/images/vitamins.png"}
],
answer:0
},

{
q:"Q4. Calcium, sodium, phosphorus and iron are some examples of ______.",
img:"../assets/images/minerals_1.png",
options:[
{text:"Carbohydrates", img:"../assets/images/carbs.png"},
{text:"Proteins", img:"../assets/images/protein.png"},
{text:"Vitamins", img:"../assets/images/vitamins.png"},
{text:"Minerals", img:"../assets/images/minerals.png"}
],
answer:3
},

{
q:"Q5. 70% of our body is made up of ______.",
img:"../assets/images/water_70.png",
options:[
{text:"Water", img:"../assets/images/water.png"},
{text:"Roughage", img:"../assets/images/fiber.png"},
{text:"Fats", img:"../assets/images/fats.png"},
{text:"Proteins", img:"../assets/images/protein.png"}
],
answer:0
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

question.innerText=quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;
options.innerHTML="";

quiz[index].options.forEach((o,i)=>{

let btn=document.createElement("button");

btn.className="option "+["blue","yellow","green","orange"][i];

btn.innerHTML = `
<img src="${o.img}" class="opt-img">
<span>${o.text}</span>
`;

btn.onclick=()=>check(i);

if(answered[index] && i===quiz[index].answer){
btn.classList.add("correctAnswer");
}

options.appendChild(btn);

});

prev.disabled=index===0;
next.disabled=!answered[index];

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

popup.className="popup "+(isCorrect?"correct":"wrong");
popup.style.display="flex";

if(isCorrect){
launchConfetti();
icon.textContent="??";
title.textContent="Correct!";
msg.textContent="Well done!";
}else{
icon.textContent="??";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>{
popup.style.display="none";
},1200);

}

function check(i){

if(answered[index]) return;

if(i===quiz[index].answer){

showPopup(true);
speak("Correct");

answered[index]=true;
score++;

next.disabled=false;

/* IF LAST QUESTION ? SHOW FINAL POPUP */

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti(); 
prev.disabled = true;  
},1000);

}else{

load();

}

}
else{

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

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
prev.disabled = true;  


}

}

prev.onclick=()=>{
index--;
load();
}

load();

function playAgain(){
location.reload();
}