
 
const quizData = [
  {
    q: "Q1. Cartilage is a kind of tissue seen at the end of muscles.",
    a: false,
    img: "../assets/images/kindtissue.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q2. The long bones of the skeleton help in the formation of new blood cells inside their bone marrow.",
    a: true,
    img: "../assets/images/longbone.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q3. The spine helps us stand straight.",
    a: true,
    img: "../assets/images/spinehelptostand.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q4. Minerals like calcium and phosphorus make the bones strong.",
    a: true,
    img: "../assets/images/BonesStrongWithMinerals.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q5. A newborn baby has 200 bones.",
    a: false,
    img: "../assets/images/newbornBaby.png",
    answered: false,
    userAnswer: null 
  }
];

let index=0, score=0;
const questionEl=document.getElementById("question");
const progressEl=document.getElementById("progress");
const trueBtn=document.getElementById("trueBtn");
const falseBtn=document.getElementById("falseBtn");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");


trueBtn.draggable = true;
falseBtn.draggable = true;


function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if(isCorrect){
    popup.className = "popup correct";
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    popup.className = "popup wrong";
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=>{
    popup.style.display="none";
  },1200);
}
function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif();
}
function restart() {
  index = 0;
  score = 0;

  quizData.forEach(q => {
    q.answered = false;
    q.userAnswer = null;
  });

  document.getElementById("finalPopup").style.display = "none";

  loadQuestion();
}





// function speak(t){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function loadQuestion(){
  const q = quizData[index];   // ✅ define first

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;           // ✅ now works
  imgEl.style.display = "block";

  questionEl.textContent = q.q;
  progressEl.textContent = `Question ${index+1}/${quizData.length}`;

  trueBtn.className = "true";
  falseBtn.className = "false";

  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);

  if(q.answered){
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;

  // 🔁 RESTORE DROP BOX STATE
if(q.answered){
  dropBox.innerHTML =
  `<span class="emoji">${q.userAnswer ? "Correct" : "Correct"}</span>`;

  dropBox.classList.add("locked");
} else {
  dropBox.innerHTML =
  `<span class="drop-text">Drop Answer Here</span>`;

  dropBox.classList.remove("locked");
}
trueBtn.draggable = !q.answered;
falseBtn.draggable = !q.answered;

}



function answer(user){
  const q = quizData[index];
  if(q.answered) return;

  const correct = q.a === user;

  speak(correct ? "Correct" : "Wrong");

  if(correct){
  q.answered = true;
  q.userAnswer = user;   // ✅ SAVE ANSWER
  score++;
 dropBox.innerHTML =
  `<span class="emoji">${user ? "Correct" : "Correct"}</span>`;

dropBox.classList.add("locked");

trueBtn.draggable = false;
falseBtn.draggable = false;


    const correctBtn = user ? trueBtn : falseBtn;
    const wrongBtn = user ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");   // ✅ green border
    correctBtn.onclick = null;             // ❌ no more clicks
    wrongBtn.classList.add("disabled");    // ❌ disable wrong
    
    showPopup(true);
     fireConfetti();


    // 👉 enable Next
    nextBtn.disabled = false;

    // 👉 enable Prev from 2nd question
   

    // 🏆 FINAL QUESTION
    if(index === quizData.length - 1){
      setTimeout(() => {
  finalPopupShown = true;
        // 🔒 lock navigation
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    
        showFinal();


      }, 800);
    }

  } else {
   showPopup(false);

  }
}


prevBtn.onclick=()=>{index--;loadQuestion();};
nextBtn.onclick=()=>{index++;loadQuestion();};

let draggedValue = null;
const dropBox = document.getElementById("dropBox");





function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 }
  });
}



loadQuestion();


// DRAG START
trueBtn.addEventListener("dragstart", () => {
  draggedValue = true;
});
falseBtn.addEventListener("dragstart", () => {
  draggedValue = false;
});

// DROP ZONE


dropBox.addEventListener("dragover", e => {
  e.preventDefault();
  dropBox.classList.add("hover");
});

dropBox.addEventListener("dragleave", () => {
  dropBox.classList.remove("hover");
});

dropBox.addEventListener("drop", () => {
  dropBox.classList.remove("hover");
  if(draggedValue !== null){
    answer(draggedValue);   // 🔥 USE YOUR EXISTING FUNCTION
    draggedValue = null;
  }
});
