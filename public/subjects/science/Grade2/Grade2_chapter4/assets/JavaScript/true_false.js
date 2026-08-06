
 

const quizData = [
  {
    q: "Q.1. Cartilage is harder than bone.",
    a: false, // ❌ cartilage is softer than bone
    img: "../assets/images/CartilageHardThanBone.png",
    answered: false ,
    userAnswer: null 
  },
  {
    q: "Q.2. The bone marrow is a soft tissue.",
    a: true, // ✅ correct
    img: "../assets/images/bonemarrowSoftTissue.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q.3. Bones store vitamins in them.",
    a: false, // ❌ bones store minerals, not vitamins
    img: "../assets/images/humerusBonesStoreVitamins.png",
    answered: false,
    userAnswer: null 
  },
  {
    q: "Q.4. Minerals like calcium and phosphorus make the bones strong.",
    a: true, // ✅ correct
    img: "../assets/images/BonesStrongWithMinerals.png",
    answered: false ,
    userAnswer: null 
  },
  {
    q: "Q.5. A newborn baby has 206 bones.",
    a: false, // ❌ newborn has about 300 bones
    img: "../assets/images/newbornBaby.png",
    answered: false ,
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
