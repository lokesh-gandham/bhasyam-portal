/* ================= QUIZ DATA ================= */
const quizData = [

{
  title: "Q1. Direct contact diseases",
  options:[
    { text:"Chickenpox", img:"../assets/images/Chickenpox.png"},
    { text:"Malaria", img:"../assets/images/malaria.png"},  // wrong
    { text:"Ringworm", img:"../assets/images/Ringworm.png"},
  ],
  answer: ["Ringworm","Chickenpox"]
},

{
  title: "Q2. Vectors",
  options:[
    { text:"Housefly", img:"../assets/images/Housefly.png"},
    { text:"Mosquito", img:"../assets/images/Mosquito.png"},
    { text:"Dog", img:"../assets/images/Dogg.png"} // wrong
  ],
  answer: ["Housefly","Mosquito"]
},

{
  title: "Q3. Object-borne diseases",
  options:[
    { text:"Scabies", img:"../assets/images/scabie2.png"},
    { text:"Asthma", img:"../assets/images/Asthma.png"}, // wrong
    { text:"COVID 19", img:"../assets/images/covid-19.png"},
  ],
  answer: ["Scabies","COVID 19"]
},

{
  title: "Q4. Occupational diseases",
  options:[
    { text:"Flu", img:"../assets/images/healthill.png"}, // wrong
    { text:"Cataract", img:"../assets/images/cataract.png"},
    { text:"Lung/Skin Cancer", img:"../assets/images/cancerboy1.png"},
  ],
  answer: ["Cataract","Lung/Skin Cancer"]
}

];


/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered:false,
  selected:[]
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

       if(q.answer.includes(opt.text)){
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
  const correct = quizData[current].answer;

  if(state.answered) return;

  const options = document.querySelectorAll(".option");

  // prevent double click on same option
  if(state.selected.includes(selected)) return;

  state.selected.push(selected);

  options.forEach(opt => {
    const text = opt.querySelector(".label").textContent;

    // ? if correct clicked
    if(text === selected && correct.includes(text)){
        opt.classList.add("correct-lock");
        opt.style.pointerEvents = "none";

        speak("Correct");
        showPopup(true);
    }

    // ? if wrong clicked
    if(text === selected && !correct.includes(text)){
        opt.classList.add("wrong-shake");
        opt.style.pointerEvents = "none";

        speak("Wrong");
        showPopup(false);
    }
  });

  // ? check if ALL correct answers are clicked (only for moving next)
  const allCorrectSelected = correct.every(ans => state.selected.includes(ans));

  if(allCorrectSelected){
    state.answered = true;
    score++;

    scoreBox.textContent = "Score: " + score;

    options.forEach(opt => {
      opt.style.pointerEvents = "none";
    });

    nextBtn.disabled = false;

    fireConfetti();

    if(current === quizData.length - 1){
      setTimeout(showFinal, 1500);
    }
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
    icon.textContent="🎉😊";
    title.textContent="Correct!";
    msg.textContent="Well done!";
  }
  else{
    icon.textContent="🥲💭";
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
  "⭐".repeat(score);
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
