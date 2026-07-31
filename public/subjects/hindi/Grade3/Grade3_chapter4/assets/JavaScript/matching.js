

let popupTimer=null;

// const pairs = [
//  { l:"ख ", r:"ख " },
//  { l:"घ ", r:"घ " },
//  { l:"झ ", r:"झ " },
//  { l:"छ ", r:"छ " },

// ];

// const images = {
//  "छ ": "../assets/images/brain_function.png",
//  "झ ": "../assets/images/digestion.png",
//  "ख ": "../assets/images/breathing.png",
//  "घ ": "../assets/images/heart_pumping.png",
 
// };

const pairs = [

  { l:"जंगल के पेड़ पर", r:"पक्षी विश्राम करते थे।" },

  { l:"बहेलिया जाल बिछाकर", r:"पेड़ के पीछे छिप गया" },

  { l:"दाना चुगने के लिए आए तो", r:"कबूतर जाल में फँस गए।" },

  { l:"तरकीब से सभी कबूतर", r:"जाल के साथ उड़ गए।" },

  { l:"दोस्त चूहे ने जाल कुतरकर", r:"कबूतरों को आज़ाद किया।" },

];


/* =========================
   LEFT SIDE IMAGES
========================= */



/* =========================
   RIGHT SIDE IMAGES
========================= */




/* =========================
   CORRECT ANSWERS
========================= */

const correctPairs = {

  "जंगल के पेड़ पर": "पक्षी विश्राम करते थे।",

  "बहेलिया जाल बिछाकर": "पेड़ के पीछे छिप गया",

  "दाना चुगने के लिए आए तो": "कबूतर जाल में फँस गए।",

  "तरकीब से सभी कबूतर": "जाल के साथ उड़ गए।",

  "दोस्त चूहे ने जाल कुतरकर": "कबूतरों को आज़ाद किया।",

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

// function speak(t) {
//   speechSynthesis.cancel();
 
//   const msg = new SpeechSynthesisUtterance(t);  
 
//   msg.lang = "en-UK";  
//   msg.volume = 0.25;    
//   msg.rate = 1;
//   msg.pitch = 1;
 
//   speechSynthesis.speak(msg);  
// }


// ===== AUDIO =====
let audioCtx = null;

function playCorrectSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.2;
    oscillator.type = "sine";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.5
    );

    oscillator.stop(audioCtx.currentTime + 0.5);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

function playWrongSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.25;
    oscillator.type = "sawtooth";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.4
    );

    oscillator.stop(audioCtx.currentTime + 0.4);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

// Initialize audio
function initAudioOnFirstClick() {
  if (audioCtx) return;

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const source = audioCtx.createBufferSource();

    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();

  } catch (e) {
    console.log("Audio init error:", e);
  }
}
document.body.addEventListener(
  "click",
  initAudioOnFirstClick,
  { once: true }
);


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

pairs.forEach((p,index)=>{
  const l=document.createElement("div");
  l.className="item";
l.innerHTML=`

<div class="text-bg">${p.l}</div>

<div class="dot"></div>
`;
  l.onclick=()=>arm(l,p);
  leftCol.appendChild(l);
 });

 [...pairs].sort(()=>Math.random()-0.5).forEach((p,index)=>{
  const r=document.createElement("div");
  r.className="item";
r.innerHTML=`
<div class="dot"></div>
<div class="text-bg">${p.r}</div>
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

if(correctPairs[armed.p.l] === p.r){
  drawLine(armed.el, el);
  // remove active highlight
  el.classList.remove("active");

  armed.el.classList.add("correct");
  el.classList.add("correct");

  // ⭐ show letter on left item
  // const letter = el.querySelector(".letter").textContent;
  

  score++;
  matched++;
  updateScore();

  // speak("Correct");
   playCorrectSound();

  
  fireConfetti();

  document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("armed"));
  armed=null;

  if(matched===pairs.length){
   setTimeout(finalPopup,1100);
  }
}
 else{
  // speak("Wrong");
   playWrongSound();
 
  // ⬅️ LEFT QUESTION STAYS SELECTED (NO RESET)
 }
}

// function finalPopup(){

//   const finalPopup = document.getElementById("finalPopup");

//   finalPopup.classList.add("active");

//   document.getElementById("finalScore").textContent =
//   `परिणाम: ${score} / ${pairs.length}`;

//   fireConfettif();

// }
function finalPopup() {

    document.getElementById("finalScore").textContent =
        `परिणाम: ${score} / ${pairs.length}`;

    document.getElementById("stars").textContent =
        "⭐⭐⭐⭐⭐";

    document
        .getElementById("finalPopup")
        .classList.add("active");

    fireConfettif();
}


render();


const leftItems = document.querySelectorAll(".left .item");

leftItems.forEach(item => {

  item.addEventListener("click", () => {

    // remove old active
    leftItems.forEach(i => {
      i.classList.remove("active");
    });

    // keep selected visible
    item.classList.add("active");

  });

});
function drawLine(leftEl, rightEl) {

    const svg =
        document.getElementById("lineLayer");

    const svgRect =
        svg.getBoundingClientRect();

    const leftDot =
        leftEl.querySelector(".dot");

    const rightDot =
        rightEl.querySelector(".dot");

    const leftRect =
        leftDot.getBoundingClientRect();

    const rightRect =
        rightDot.getBoundingClientRect();

    const startX =
        leftRect.left +
        leftRect.width / 2 -
        svgRect.left;

    const startY =
        leftRect.top +
        leftRect.height / 2 -
        svgRect.top;

    const endX =
        rightRect.left +
        rightRect.width / 2 -
        svgRect.left;

    const endY =
        rightRect.top +
        rightRect.height / 2 -
        svgRect.top;

    const curveOffset =
        (endX - startX) * 0.45;

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

    path.setAttribute(
        "d",
        `
        M ${startX} ${startY}
        C ${startX + curveOffset} ${startY},
          ${endX - curveOffset} ${endY},
          ${endX} ${endY}
        `
    );

    path.setAttribute(
        "class",
        "match-line"
    );

    svg.appendChild(path);

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

function showRightClickEffect(el){

  el.classList.add("temp-active");

  setTimeout(()=>{
    el.classList.remove("temp-active");
  }, 500);

}
document.getElementById("finalPlayAgainBtn").onclick = () => {
    location.reload();
};