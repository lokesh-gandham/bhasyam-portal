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
    icon.textContent = " ??";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";

    speak("Correct");
    fireConfetti();

  } else {
    icon.textContent = "??";
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
    "?".repeat(score);

  fireConfettif();
}


/* ================= QUESTIONS ================= */
const questions = [

{
q: "Q1. A __________ is an abnormal condition that affects the organs or the organ systems of the body.",
a: "disease",
img: "../assets/images/boyveltilater.png"
},

{
q: "Q2. The disease causing germs do not harm the __________ in which they stay dormant.",
a: "vector",
img: "../assets/images/vector.png"
},

{
q: "Q3. Use mosquito __________ to keep the vectors at bay.",
a: "repellents",
img: "../assets/images/Mosquito.png"
},

{
q: "Q4. Coughing releases tiny droplets of mucus and __________ containing the pathogens.",
a: "saliva",
img: "../assets/images/pathogens.png"
},

{
q: "Q5. __________ enter the body through the wound caused by the bite of rabid animals, especially dogs.",
a: "Rabies virus",
img: "../assets/images/dogbite.png"
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

// ? restrict input behavior
input.setAttribute("autocomplete", "off");
input.setAttribute("spellcheck", "false");

// ? block drag
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

// ? block paste (very important)
input.addEventListener("paste", (e) => e.preventDefault());
const submitBtn= document.getElementById("submitBtn");


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


// ? block drag/drop on whole page
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());