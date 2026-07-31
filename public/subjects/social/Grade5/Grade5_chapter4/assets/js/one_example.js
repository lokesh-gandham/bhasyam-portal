/* ================= QUIZ DATA ================= */
const quizData = [

{
  title: "Q1. This place is the largest producer of wool in the world.",
  options: [
    { text: "Australia", img: "../assets/images/aus.png" },
    { text: "The Pampas", img: "../assets/images/pampas.png" },
  ],
  answer: "Australia"
},

{
  title: "Q2. This area experiences mostly humid sub-tropical climate.",
  options: [
    { text: "The Downs", img: "../assets/images/downs.png" },
    { text: "The Steppes", img: "../assets/images/fib-2.png" },
  ],
  answer: "The Downs"
},

{
  title: "Q3. This grassland is found in North America.",
  options: [
    { text: "The Prairies", img: "../assets/images/Prairies.png" },
    { text: "The Pampas", img: "../assets/images/pampas.png" },
  ],
  answer: "The Prairies"
},

{
  title: "Q4. This land has a humid climate making it more suitable to grow grass.",
  options: [
    { text: "The Pampas", img: "../assets/images/pampas.png" },
    { text: "The Velds", img: "../assets/images/velds.png" },
  ],
  answer: "The Pampas"
},

{
  title: "Q5. Dairy farms and meat-processing factories are well-developed here.",
  options: [
    { text: "The Prairies", img: "../assets/images/Prairies.png" },
    { text: "The Velds", img: "../assets/images/velds.png" },
  ],
  answer: "The Prairies"
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
  optionsBox.classList.remove("one-option");

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

        scoreBox.textContent = "Your Score: " + score;

        const optionsContainer = document.getElementById("optionsBox");

        options.forEach(opt => {

            const text = opt.querySelector(".label").textContent;

            if(text === correct){

                opt.classList.add("correct-lock");

            }else{

                // disappear animation
                opt.classList.add("hide-option");

                setTimeout(()=>{
                    opt.remove();

                    // when only one option remains, move it to center
                    if(optionsContainer.children.length === 1){
                        optionsContainer.classList.add("one-option");
                    }

                },400);

            }

            opt.style.pointerEvents="none";

        });

        nextBtn.disabled = false;

        speak("Correct");
        showPopup(true);
        fireConfetti();

        if(current===quizData.length-1){
            setTimeout(showFinal,1500);
        }

    }else{

        speak("try again");
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
    icon.textContent="🎉";
    title.textContent="Correct!";
    msg.textContent="Well done!";
  }
  else{
    icon.textContent="😔";
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
  `Your Score: ${score}/${quizData.length}`;

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