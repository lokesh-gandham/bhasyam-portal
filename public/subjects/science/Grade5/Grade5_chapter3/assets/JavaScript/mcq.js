/* ================= QUIZ DATA ================= */
const quizData = [

{
title: "Q1. Cancer may be caused due to exposure to ________.",
image: "../assets/images/cancerboy.png",
options: [
{ text: "sound", img: "../assets/images/djsound.png" },
{ text: "music", img: "../assets/images/drum.png" },
{ text: "x-ray radiation", img: "../assets/images/x-rayradiation.png" },
{ text: "light", img: "../assets/images/lightbulb.png" }
],
answer: "x-ray radiation"
},

{
title: "Q2. A vaccine helps us by activating our ________ system.",
image: "../assets/images/doctorvaccine.png",
options: [
{ text: "digestive", img: "../assets/images/digestive.png" },
{ text: "immune", img: "../assets/images/immune.png" },
{ text: "respiratory", img: "../assets/images/respiratory.png" },
{ text: "nervous", img: "../assets/images/nerves.png" }
],
answer: "immune"
},

{
title: "Q3. Cholera, typhoid and diarrhoea are caused by consuming contaminated ________.",
image: "../assets/images/boytoilet.png",
options: [
{ text: "water", img: "../assets/images/WaterGak.png" },
{ text: "fruits", img: "../assets/images/Fruitakk (2).png" },
{ text: "food", img: "../assets/images/Lunchak.png" },
{ text: "vegetables", img: "../assets/images/Vegitableakp.png" }
],
answer: "water"
},

{
title: "Q4. ________ is caused by sneezing and coughing of an infected person.",
image: "../assets/images/infectedperson.png",
options: [
{ text: "Malaria", img: "../assets/images/malaria.png" },
{ text: "Scabies", img: "../assets/images/scabie2.png" },
{ text: "Typhoid", img: "../assets/images/Typhoid.png" },
{ text: "COVID 19", img: "../assets/images/covid-19.png" }
],
answer: "COVID 19"
},

{
title: "Q5. ________ is caused by the bite of rabid animals.",
image: "../assets/images/dogbite.png",
options: [
{ text: "Dengue", img: "../assets/images/malaria.png" },
{ text: "Plague", img: "../assets/images/Plague.png" },
{ text: "Rabies", img: "../assets/images/rabies.png" },
{ text: "Yellow fever", img: "../assets/images/yellowfever.png" }
],
answer: "Rabies"
}

];

/* ================= STATE ================= */

let current = 0;
let score = 0;
const answerState = quizData.map(() => ({
  answered: false,
  selected: null
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

function speak(text) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(text);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}


/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
 div.innerHTML = `
  <div class="img-box">
    <img src="${opt.img}" class="option-img">
  </div>
  <div class="label">${opt.text}</div>
`;
if (state.answered) {

  div.classList.add("disabled");

  if (opt.text === q.answer) {
    div.classList.add("correct-lock");
  }
  else {
    div.classList.add("fade-wrong");
  }

} else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}


/* ================= CHECK ANSWER ================= */
function checkAnswer(optionDiv, selected) {

  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  state.selected = selected; // save selected answer

  const options = document.querySelectorAll(".option");

  if (selected === correct) {

    state.answered = true;
    score++;
    scoreBox.textContent = "Score: " + score;

    options.forEach((o) => {

      const text = o.querySelector(".label").textContent;

      o.classList.add("disabled");

      if (text === correct) {
        o.classList.add("correct-lock");
      } 
      else {
        o.classList.add("fade-wrong");   // fade other options
      }

    });

    nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
    fireConfetti();

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }

  } else {

    speak("Wrong");

    optionDiv.classList.add("wrong-shake");

    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);

  }

}

/* ================= POPUPS (NEW SYSTEM) ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

    // ?? RESET animation (important)
  icon.style.animation = "none";
  void icon.offsetWidth; 
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif(); 

 

 
}


/* ================= BUTTONS ================= */

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

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

/* ================= START ================= */

loadQuestion();
