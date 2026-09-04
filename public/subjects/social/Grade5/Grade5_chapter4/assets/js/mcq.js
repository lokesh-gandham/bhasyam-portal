/* ================= QUIZ DATA ================= */
const quizData = [
{
  title: "Q1. Grasslands around the world are slowly getting converted into farmlands by _____.",
  image: "../assets/images/MCQ-1.png",
  options: [
    { text: "Farmers", img: "../assets/images/farmer.png" },
    { text: "Tailors", img: "../assets/images/tailor.png" },
    { text: "Cobblers", img: "../assets/images/cobbler.png" }
  ],
  answer: "Farmers"
},
{
  title: "Q2. The _______ are the biggest farming regions of the world.",
  image: "../assets/images/mcq22.png",
  options: [
    { text: "Pampas", img: "../assets/images/pampas.png" },
    { text: "Prairies", img: "../assets/images/Prairies.png" },
    { text: "Velds", img: "../assets/images/velds.png" }
  ],
  answer: "Prairies"
},
{
  title: "Q3. A large part of Pampas is used for rearing cattle for _______.",
  image: "../assets/images/mcq-3.png",
  options: [
    { text: "Milk", img: "../assets/images/milk.png" },
    { text: "Wool", img: "../assets/images/wool.png" },
    { text: "Meat", img: "../assets/images/meat.png" }
  ],
  answer: "Meat"
},
{
  title: "Q4. The Velds are found on the plateau of _____.",
  image: "../assets/images/velds.png",
  options: [
    { text: "South Africa", img: "../assets/images/south-africa.png" },
    { text: "Australia", img: "../assets/images/america.png" },
    { text: "America", img: "../assets/images/aus.png" }
  ],
  answer: "South Africa"
},
{
  title: "Q5. Many people who live in temperate grasslands have a strong connection to _____.",
  image: "../assets/images/fib-2.png",
  options: [
    { text: "Weather", img: "../assets/images/weather.png" },
    { text: "Nature", img: "../assets/images/nature.png" },
    { text: "Animals", img: "../assets/images/animals.png" }
  ],
  answer: "Nature"
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
    scoreBox.textContent = "Your Score: " + score;

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

    speak("Try again");

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

    // 🔥 RESET animation (important)
  icon.style.animation = "none";
  void icon.offsetWidth; 
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
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
    `Your Score: ${score}/${quizData.length}`;

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