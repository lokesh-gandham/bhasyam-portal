const quizData = [
  {
    title: "Q1. _____ gives us energy.",
    image: "../assets/images/food.png",
    options: [
      { text: "Egg", img: "../assets/images/egg.png" },
      { text: "Rice", img: "../assets/images/rice.png" },
      { text: "Milk", img: "../assets/images/milk.png" },
      { text: "Meat", img: "../assets/images/meat.png" },
    ],
    answer: "Rice",
  },
  {
    title:
      "Q2. ____ protect us from falling sick.",
    image: "../assets/images/sick.png",
    options: [
      { text: "Chocolates", img: "../assets/images/chocolates.png" },
      { text: "Pulses", img: "../assets/images/pulses.png" },
      { text: "Fruits", img: "../assets/images/fruits.png" },
      { text: "Cereals", img: "../assets/images/cereals.png" },
    ],
    answer: "Fruits",
  },
  {
    title: "Q3.Vegetarians do not eat ___.",
    image: "../assets/images/veg.png",
    options: [
      { text: "Vegetables", img: "../assets/images/vegetables.png" },
      { text:"Fish", img: "../assets/images/fish.png" },
      { text: "Ghee", img: "../assets/images/ghee.png" },
      { text: "Fruits", img: "../assets/images/fruits.png" },
    ],
    answer: "Fish",
  },
  {
    title: "Q4. ____ is the first meal of the day.",
    image: "../assets/images/food.png",
    options: [
      { text: "Breakfast", img: "../assets/images/breakfast.png" },
      { text: "Dinner", img: "../assets/images/dinner.png" },
      { text: "Lunch", img: "../assets/images/lunch.png" },
      { text: "Snacks", img: "../assets/images/junkfood.png" },
    ],
    answer: "Breakfast",
  },
  {
    title:
      "Q5. ___ removes waste from the body.",
    image: "../assets/images/washroom.png",
    options: [
      { text: "Water", img: "../assets/images/water.png" },
      { text: "Food", img: "../assets/images/food.png" },
      { text: "Juice", img: "../assets/images/juice.png" },
      { text: "Milk", img: "../assets/images/milk.png" },
    ],
    answer: "Water",
  },
];

/* ================= ANSWER STATE ================= */
const answerState = quizData.map(() => ({
  answered: false,
}));

/* ================= STATE ================= */
let current = 0;
let score = 0;
let answeredCorrect = false;

/* ================= ELEMENTS ================= */
const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
// const partsProgress = document.getElementById("partsProgress");
// partsProgress.style.gridTemplateColumns = `repeat(${quizData.length}, 1fr)`;

// quizData.forEach(() => {
//   const part = document.createElement("div");
//   part.className = "part";
//   partsProgress.appendChild(part);
// });

/* ================= TTS ================= */
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* ================= NAVIGATION ================= */
function goHome() {
  window.location.href = "../index.html"; // ✅ change if needed
}

/* ================= PROGRESS ================= */
function updateProgress() {
  const parts = document.querySelectorAll(".part");

  parts.forEach((part, index) => {
    part.classList.remove("active", "done");

    if (answerState[index].answered) {
      part.classList.add("done");
    }

    if (index === current) {
      part.classList.add("active");
    }
  });
}

/* ================= LOAD QUESTION ================= */
function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Animal";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `
<div class="img-wrap">
   <img src="${opt.img}" class="option-img">
</div>

  <span class="label">${opt.text}</span>
`;

    if (state.answered) {
      // 🔒 restore locked state
      div.classList.add("disabled");
      if (opt.text === q.answer) {
        div.classList.add("correct-lock");
      }
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;

  updateProgress();
}

/* ================= CHECK ANSWER ================= */
function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  if (selected === correct) {
    state.answered = true;
    updateProgress();
    score++;

    // 🔒 disable all options
    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    // ✅ highlight correct
    optionDiv.classList.add("correct-lock");
    nextBtn.disabled = false;

    speak("Correct");

    showPopup(true);

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    optionDiv.classList.add("wrong-shake");
    setTimeout(() => optionDiv.classList.remove("wrong-shake"), 600);
  }
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

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
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

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

/* ================= START ================= */

loadQuestion();
