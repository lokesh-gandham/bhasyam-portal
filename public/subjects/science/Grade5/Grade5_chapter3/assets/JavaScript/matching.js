

let popupTimer=null;
const pairs = [
 { l:"Rabies", r:"Animal bite" },
 { l:"Tetanus", r:"Cuts and wounds" },
 { l:"Conjunctivitis", r:"Direct contact" },
 { l:"Dengue", r:"Vector" },
 { l:"Scabies", r:"Object-borne" }
];

/* =========================
   LEFT SIDE IMAGES
========================= */

const leftImages = {
 "Rabies": "../assets/images/rabies.png",
 "Tetanus": "../assets/images/cataract.png",
 "Conjunctivitis": "../assets/images/tf-3.png",
 "Dengue": "../assets/images/mcq5-1.png",
 "Scabies": "../assets/images/scabie.png"
};

/* =========================
   RIGHT SIDE IMAGES
========================= */

const images = {
 "Animal bite": "../assets/images/dogbite.png",
 "Cuts and wounds": "../assets/images/Conjunctivitiscuts.png",
 "Direct contact": "../assets/images/infectedperson.png",
 "Vector": "../assets/images/vector.png",
 "Object-borne": "../assets/images/Housefly.png"
};


let armed=null;
let score=0;
let matched=0;
const letters=["a","b","c","d","e"];
const letterColors = ["#f4b6b6","#f7d58a","#cfe5a6"];
const leftCol=document.getElementById("leftCol");
const rightCol=document.getElementById("rightCol");
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");
const scoreBox = document.getElementById("scoreBox");


function updateScore(){
  scoreBox.textContent = "Score: " + score;
}

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function showPopup(html,final=false){
 popup.style.display="flex";
 popupText.className=final?"popup-box popup-final":"popup-box";
 popupText.innerHTML=html;

 if(popupTimer) clearTimeout(popupTimer);

 if(!final){
  popupTimer=setTimeout(()=>popup.style.display="none",1000);
 }
}

function render(){
 leftCol.innerHTML="";
 rightCol.innerHTML="";

 pairs.forEach(p=>{
  const l=document.createElement("div");
  l.className="item";
l.innerHTML=`
<div class="icon-circle">
  <img src="${leftImages[p.l]}" class="left-icon">
</div>

<span class="question-text">${p.l}</span>
`;
  l.onclick=()=>arm(l,p);
  leftCol.appendChild(l);
 });

 [...pairs].sort(()=>Math.random()-0.5).forEach((p,index)=>{
  const r=document.createElement("div");
  r.className="item";
r.innerHTML=`
<div class="letter" style="background:${letterColors[index]}">${letters[index]}</div>
<span>${p.r}</span>
`;
  r.onclick=()=>attempt(r,p);
  rightCol.appendChild(r);
 });
}

function arm(el,p){
 if(el.classList.contains("correct")) return;
 document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("armed"));
 el.classList.add("armed");
 armed={el,p};
}

function attempt(el,p){
 if(!armed || el.classList.contains("correct")) return;

  showRightClickEffect(el);

 if(armed.p.r===p.r){
  drawLine(armed.el, el);
  // remove active highlight
  el.classList.remove("active");

  armed.el.classList.add("correct");
  el.classList.add("correct");

  // ? show letter on left item
  const letter = el.querySelector(".letter").textContent;
  

  score++;
  matched++;
  updateScore();

  speak("Correct");
  
  fireConfetti();

  document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("armed"));
  armed=null;

  if(matched===pairs.length){
   setTimeout(finalPopup,1100);
  }
}
 else{
  speak("Wrong");
 
  // ?? LEFT QUESTION STAYS SELECTED (NO RESET)
 }
}

function finalPopup(){

  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score} / ${pairs.length}`;

  document.getElementById("stars").textContent =
  "?".repeat(score);
  fireConfettif()

}


render();


const leftItems = document.querySelectorAll(".left .item");

leftItems.forEach(item => {
  item.addEventListener("click", () => {


    leftItems.forEach(i => i.classList.remove("active"));

    item.classList.add("active");
      setTimeout(()=>{
      item.classList.remove("active");
    },100);

  });
});

function drawLine(leftEl,rightEl){

const svg = document.getElementById("lineLayer");

const leftRect = leftEl.getBoundingClientRect();
const rightRect = rightEl.getBoundingClientRect();
const quizRect = document.querySelector(".quiz").getBoundingClientRect();

const gap = 14;   // distance from box

/* start + end points */

const startX = leftRect.right - quizRect.left - 10;
const startY = leftRect.top + leftRect.height/2 - quizRect.top;

const endX = rightRect.left - quizRect.left - gap;
const endY = rightRect.top + rightRect.height/2 - quizRect.top;

/* smaller curve for better shape */

const curve = 50;

const path = document.createElementNS("http://www.w3.org/2000/svg","path");

const d = `
M ${startX} ${startY}
C ${startX + curve} ${startY},
  ${endX - curve} ${endY},
  ${endX} ${endY}
`;

path.setAttribute("d", d);
path.setAttribute("class","match-line");

svg.appendChild(path);
// LEFT ARROW ?
const startArrow = document.createElementNS("http://www.w3.org/2000/svg","text");

startArrow.setAttribute("x", startX - 6);
startArrow.setAttribute("y", startY + 5);
startArrow.setAttribute("text-anchor", "middle");
startArrow.setAttribute("font-size", "18");
startArrow.setAttribute("fill", "#6ecbff");

startArrow.textContent = "?";

svg.appendChild(startArrow);


// RIGHT ARROW ?
const endArrow = document.createElementNS("http://www.w3.org/2000/svg","text");

endArrow.setAttribute("x", endX + 1);
endArrow.setAttribute("y", endY + 5);
endArrow.setAttribute("text-anchor", "middle");
endArrow.setAttribute("font-size", "18");
endArrow.setAttribute("fill", "#6ecbff");

endArrow.textContent = "?";

svg.appendChild(endArrow); }
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

function showRightClickEffect(el){

  el.classList.add("temp-active");

  setTimeout(()=>{
    el.classList.remove("temp-active");
  }, 500);

}
