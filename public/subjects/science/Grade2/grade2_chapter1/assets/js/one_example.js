/* ================= QUIZ DATA ================= */
const quizData = [

{
  title: "Q1. A material used to build pucca houses",
  options:[
    { text:"Stones", img:"./../assets/images/stones.png"},
    { text:"Mud", img:"./../assets/images/mud.png"},
  ],
  answer: "Stones"
},

{
  title: "Q2. A material used to build Kutcha houses ",
  options:[
    { text:"Mud", img:"./../assets/images/mud.png"},
 { text:"Cement", img:"./../assets/images/bunglow.png"},
  ],
  answer: "Mud"
},

{
  title: "Q3. A pucca house",
  options:[
      { text:"Hut", img:"./../assets/images/hut.png"},
    { text:"Bungalow", img:"./../assets/images/bunglow.png"},
  ],
  answer: "Bungalow"
},

{
  title: "Q4. A Kutcha house",
  options:[
    { text:"Caravan", img:"../assets/images/caravan.png"},
    { text:"Hut", img:"../assets/images/hut.png"},
  ],
  answer: "Hut"
},

{
  title: "Q5. A Moveable house",
  options:[
    { text:"Flat", img:"../assets/images/flat.png"},
    { text:"Tent", img:"../assets/images/tent.png"},
  ],
  answer: "Tent"
}

];


/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered:false
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const optionsBox = document.getElementById("optionsBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

function speak(text){

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);

  msg.lang="en-UK";
  msg.volume=0.25;
  msg.rate=1;
  msg.pitch=1;

  speechSynthesis.speak(msg);

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){

  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;

  optionsBox.innerHTML = "";

  q.options.forEach(opt=>{

    const div=document.createElement("div");
    div.className="option";

   div.innerHTML = `
<div class="option-card">

  <div class="beam"></div>

  <img src="${opt.img}" class="option-img">

  <div class="platform"></div>

</div>

<div class="label">${opt.text}</div>
`;
    /* If already answered show result */
    if(state.answered){

        if(opt.text === q.answer){
            div.classList.add("correct-lock");
        }
        else{
            div.classList.add("wrong-shake");
        }

        div.style.pointerEvents="none";
    }

    else{
        div.onclick=()=>checkAnswer(opt.text);
    }

    optionsBox.appendChild(div);

  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;

}


/* ================= CHECK ANSWER ================= */

function checkAnswer(selected){

const state = answerState[current];

if(state.answered) return;

const correct = quizData[current].answer;

const options = document.querySelectorAll(".option");

if(selected === correct){

    state.answered = true;

    score++;

    scoreBox.textContent = "Score: " + score;

    options.forEach(opt => {

        const text = opt.querySelector(".label").textContent;

        if(text === correct){
            opt.classList.add("correct-lock");
        }
        else{
            opt.classList.add("wrong-shake");
        }

        opt.style.pointerEvents="none";

    });

    nextBtn.disabled=false;

    speak("Correct");
    showPopup(true);
     fireConfetti(); 

    if(current===quizData.length-1){
        setTimeout(showFinal,1500);
    }

}
else{

    speak("Wrong");
    showPopup(false);

}

}


/* ================= POPUPS ================= */

function showPopup(isCorrect){

  const popup=document.getElementById("answerPopup");
  const icon=document.getElementById("popupIcon");
  const title=document.getElementById("popupTitle");
  const msg=document.getElementById("popupMsg");

  popup.className="popup "+(isCorrect?"correct":"wrong");
  popup.style.display="flex";

  if(isCorrect){
    icon.textContent="??";
    title.textContent="Correct!";
    msg.textContent="Well done!";
  }
  else{
    icon.textContent="??";
    title.textContent="Wrong!";
    msg.textContent="Try again!";
  }

  setTimeout(()=>{
    popup.style.display="none";
  },1200);

}


function showFinal(){

  const finalPopup=document.getElementById("finalPopup");

  finalPopup.style.display="flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
  "?".repeat(score);
   fireConfettif(); 

}


/* ================= BUTTONS ================= */

nextBtn.onclick=()=>{

  if(current < quizData.length-1){

    current++;
    loadQuestion();

  }

};

prevBtn.onclick=()=>{

  if(current > 0){

    current--;
    loadQuestion();

  }

};


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

/* ================= START ================= */

loadQuestion();
