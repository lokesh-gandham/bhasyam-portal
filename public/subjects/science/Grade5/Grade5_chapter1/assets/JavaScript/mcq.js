const quizData = [
  {
    image: "../assets/images/brainbox.webp",
    q: "Q1. The brain box is made of ______ flat bones.",
    options: [
      { text: "", img: "../assets/images/10.png" },
      { text: "", img: "../assets/images/8.png" },
      { text: "", img: "../assets/images/6.png" },
      { text: "", img: "../assets/images/9.png" }
    ],
    correct: 1
  },
  {
    image: "../assets/images/newskull.webp",
    q: "Q2. The ______ is the only movable joint in the skull.",
    options: [
      { text: "Lower jaw", img: "../assets/images/lowerjaw.webp" },
      { text: "Upper jaw", img: "../assets/images/upperjaw.webp" },
      { text: "Vertebrae", img: "../assets/images/vertebrae.webp" },
      { text: "Sternum", img: "../assets/images/sternum.webp" }
    ],
    correct: 0
  },
  {
    image: "../assets/images/floatingbone.webp",
    q: "Q3. The first bone of the spine is the ______.",
    options: [
      { text: "Ribcage", img: "../assets/images/ribcage.webp" },
      //{ text: "Globe", img: "../assets/images/globe.png" },
      { text: "Atlas", img: "../assets/images/atlas.webp" },
      { text: "Sternum", img: "../assets/images/sternum.webp" },
      { text: "Cranium", img: "../assets/images/cranium.webp" }
    ],
    correct: 1
  },
  {
    image: "../assets/images/moveablejoints.png",
    q: "Q4. The floating ribs are found in the ______.",
    options: [
      { text: "Spine", img: "../assets/images/spine.webp" },
      { text: "Ribcage", img: "../assets/images/ribcage.webp" },
      { text: "Limbs", img: "../assets/images/limbs2.png" },
      { text: "Skull", img: "../assets/images/skull.webp" }
    ],
    correct: 1
  },
  {
    image: "../assets/images/limbs2.png",
    q: "Q5. ______ pairs of ribs are attached to the vertebral column at the back and to the sternum in the front.",
    options: [
      { text: "", img: "../assets/images/12.png" },
      { text: "", img: "../assets/images/2.png" },
      { text: "", img: "../assets/images/10.png" },
      { text: "", img: "../assets/images/22.png" }
    ],
    correct: 2
  }
];

let index = 0,
  score = 0;
let answers = Array(quizData.length).fill(null);

const qText = document.getElementById("questionText");
const qEmoji = document.getElementById("questionEmoji");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const progress = document.getElementById("progress");
const qImg = document.getElementById("questionImg");

// function speak(t) {
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
function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  // 🔥 RESET classes
  popup.classList.remove("correct", "wrong");

  if(isCorrect){
    popup.classList.add("correct");   // ✅ IMPORTANT
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  }else{
    popup.classList.add("wrong");     // ✅ IMPORTANT
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=>{
    popup.style.display="none";
  },1200);
}


function renderProgress() {
  progress.innerHTML = "";
  quizData.forEach((_, i) => {
    const d = document.createElement("div");
    d.textContent = answers[i] !== null ? "" : "";
    progress.appendChild(d);
  });
}

function loadQuestion() {
  const q = quizData[index];
  qText.textContent = q.q;
  qImg.src = q.image;
qImg.style.display = "block";
 //qImg.src = q.image;


  optionsEl.innerHTML = "";
  prevBtn.disabled = index === 0;
  nextBtn.disabled = answers[index] !== q.correct;
  renderProgress();

q.options.forEach((opt, i) => {

  const div = document.createElement("div");
  div.className = "option";

  div.innerHTML = `
      <div class="option-img-wrap">
          <img src="${opt.img}" class="option-img">
      </div>
      <div class="option-text">${opt.text}</div>
  `;

  // restore state if already answered
  if (answers[index] !== null) {
    if (i === q.correct) {
      div.classList.add("correct");
      div.style.pointerEvents = "none";
    } else {
      div.classList.add("disabled");
    }
  }

  div.onclick = () => selectAnswer(div, i);

  optionsEl.appendChild(div);
});
}

function selectAnswer(el, i) {
  const correct = quizData[index].correct;
  if (i !== correct) {
    el.classList.add("disabled");
    wrongSound.play();
    speak("Wrong");
    showPopup(false);

    return;
  }
  answers[index] = i;
  score++;
  el.classList.add("correct");
  el.style.pointerEvents = "none";
  correctSound.play();
  speak("Correct");
 showPopup(true);
     fireConfetti();


  document.querySelectorAll(".option").forEach((o, idx) => {
    if (idx !== i) o.classList.add("disabled");
  });
  nextBtn.disabled = false;
  renderProgress();
  if (index === quizData.length - 1) setTimeout(showFinal, 1000);
}

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
      fireConfettif(); 
}


function restart() {
  index = 0;
  score = 0;
  answers.fill(null);

  // hide final popup
  document.getElementById("finalPopup").style.display = "none";

  loadQuestion();
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
    particleCount: 20,
    spread: 40,
    origin: { y: 0.6 }
  });
}




loadQuestion();
