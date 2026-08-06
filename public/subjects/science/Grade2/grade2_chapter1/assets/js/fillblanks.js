/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";

    speak("Correct");
    fireConfetti();

  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";

    speak("Wrong");
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  fireConfettif();
}


/* ================= QUESTIONS ================= */
const questions = [

{
q: "Q1. A ____ is the place where we live.",
a: "house",
img: "./../assets/images/apartment.png"
},

{
q: "Q2. We take rest and sleep in the ____.",
a: "bedroom",
img: "./../assets/images/bedroom.png"
},

{
q: "Q3. _____ are found in lakes.",
a: "Houseboats",
img: "./../assets/images/houseboat.png"
},

{
q: "Q4. A ___ is a house on wheels.",
a: "Caravan",
img: "./../assets/images/caravans.png"
},

{
q: "Q5. A _____ can be easily shifted from one place to another.",
a: "tent",
img: "./../assets/images/tent.png"
}

];

let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);


/* ================= ELEMENTS ================= */

const qImgEl   = document.getElementById("qImg");
const qTextEl  = document.getElementById("qText");
const prev     = document.getElementById("prevBtn");
const next     = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

const input    = document.getElementById("answerInput");
const submitBtn= document.getElementById("submitBtn");

input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

qImgEl.addEventListener("dragover", (e) => {
  e.preventDefault();
});

qImgEl.addEventListener("drop", (e) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  // ✅ local file
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      qImgEl.src = event.target.result;
    };

    reader.readAsDataURL(file);
    return;
  }

  // ✅ browser image (URL)
  const url =
    e.dataTransfer.getData("text/uri-list") ||
    e.dataTransfer.getData("text/plain");

  if (url) {
    qImgEl.src = url;
  }
});

/* ================= FUNCTIONS ================= */





function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.3;
  msg.rate = 1.0;
  msg.pitch = 1.0;
  speechSynthesis.speak(msg);
}


/* ================= CHECK ANSWER ================= */

function checkAnswer(){

  const correct = questions[index].a.toLowerCase();
  const userAnswer = input.value.trim().toLowerCase();

  if(userAnswer === correct){

    score++;
    updateScore();

    showPopup(true);

    answers[index] = correct;

    input.disabled = true;
    submitBtn.disabled = true;

    next.disabled = false;

    if(index === questions.length - 1){
      setTimeout(showFinal,1600);
    }

  }else{

    showPopup(false);
    input.value = "";

  }

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){

  const q = questions[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;
input.value = "";
input.disabled = false;
submitBtn.style.display = "inline-block";
submitBtn.disabled = true;

  

  const alreadyCorrect = !!answers[index];

 if(alreadyCorrect){

  input.value = q.a.toUpperCase();
  input.disabled = true;

  submitBtn.style.display = "none";   // hide submit button

}
  prev.disabled = index === 0;
  next.disabled = !alreadyCorrect;

}

input.addEventListener("input", () => {

  if(input.value.trim().length > 0){
    submitBtn.disabled = false;
  }else{
    submitBtn.disabled = true;
  }

});

/* ================= EVENTS ================= */

submitBtn.onclick = checkAnswer;

prev.onclick = () => {
  index--;
  loadQuestion();
};

next.onclick = () => {
  if(index < questions.length - 1){
    index++;
    loadQuestion();
  }
};


/* ================= CONFETTI ================= */

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

updateScore();
loadQuestion();
