/* ================= QUIZ DATA ================= */
const quizData = [
{
  title: "Q1. A ____ is a temporary house.",
  image: "../assets/images/mcq-1.png",
  options: [
    { text: "Bungalow", img: "../assets/images/bunglow.png" },
    { text: "Apartment", img: "../assets/images/apartment.png" },
    { text: "Tent", img: "../assets/images/tent.png" },
    { text: "Flat", img: "../assets/images/flat.png" }
  ],
  answer: "Tent"
},
{
  title: "Q2. Large houses with spacious rooms are called ___.",
  image: "../assets/images/mcq-2.png",
  options: [
    { text: "Igloos", img: "../assets/images/igloo.png" },
    { text: "Bungalows", img: "../assets/images/bunglow.png" },
    { text: "Caravanas", img: "../assets/images/caravans.png" },
    { text: "Tents", img: "../assets/images/tent.png" }
  ],
  answer: "Bungalows"
},
{
  title: "Q3. A house made of blocks of snow is called an ___.",
  image: "../assets/images/mcq-3.png",
  options: [
    { text: "Caravan", img: "../assets/images/caravans.png" },
    { text: "Igloo", img: "../assets/images/igloo.png" },
    { text: "Tent", img: "../assets/images/tent.png" },
    { text: "Houseboat", img: "../assets/images/houseboat.png" }
  ],
  answer: "Igloo"
},
{
  title: "Q4. Tents are made of ___.",
  image: "../assets/images/tent.png",
  options: [
    { text: "Bricks", img: "../assets/images/bricks.png" },
    { text: "Cement", img: "../assets/images/cement.png" },
    { text: "Canvas", img: "../assets/images/canvas.png" },
    { text: "Wood", img: "../assets/images/wood.png" }
  ],
  answer: "Canvas"
},
{
  title: "Q5. We study in the ___.",
  image: "../assets/images/mcq-5.png",
  options: [
    { text: "Kitchen", img: "../assets/images/kitchen.png" },
    { text: "Bathroom", img: "../assets/images/bathroom.png" },
    { text: "Study room", img: "../assets/images/study-room.png" },
    { text: "Dinnig room", img: "../assets/images/dinnig.png" }
  ],
  answer: "Study room"
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
<img src="${opt.img}" class="option-img">
<span class="label">${opt.text}</span>
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