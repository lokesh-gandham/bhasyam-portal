const quizData = [
  {
    q: "Q1. Each part of our body has a special job to do.",
    a: true,
    img: "../assets/images/TF-1.png",
    answered: false,
    userAnswer: null,
  },
  {
    q: "Q2. The adult human body has 203 bones.",
    a: false,
    img: "../assets/images/TF-2.png",
    answered: false,
    userAnswer: null,
  },
  {
    q: "Q3. The heart is an external part of our body.",
    a: false,
    img: "../assets/images/heart.png",
    answered: false,
    userAnswer: null,
  },
  {
    q: "Q4. The brain controls all the functions of the body.",
    a: true,
    img: "../assets/images/brain.png",
    answered: false,
    userAnswer: null,
  },
  {
    q: "Q5. Bones are covered with muscles.",
    a: true,
    img: "../assets/images/TF-5.png",
    answered: false,
    userAnswer: null,
  },
];

let index = 0,
  score = 0;
let finalPopupShown = false;
const questionEl = document.getElementById("question");
const progressEl = document.getElementById("progress");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dropBox = document.getElementById("dropBox");

let draggedValue = null;

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Correct!";
    msg.textContent = "Well done! 🎉😊";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Wrong!";
    msg.textContent = "Try again! 🥲💭";
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
  const starsHtml = "⭐".repeat(score) + "☆".repeat(quizData.length - score);
  document.getElementById("stars").innerHTML = starsHtml;
  fireConfettif();
}

function restart() {
  index = 0;
  score = 0;
  finalPopupShown = false;

  quizData.forEach((q) => {
    q.answered = false;
    q.userAnswer = null;
  });

  document.getElementById("finalPopup").style.display = "none";
  loadQuestion();
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function updateButtonsForAnswered(q) {
  const correctBtn = q.a ? trueBtn : falseBtn;
  const wrongBtn = q.a ? falseBtn : trueBtn;

  // Hide wrong option completely (display: none)
  wrongBtn.style.display = "none";

  // Center the correct option
  const buttonsContainer = document.getElementById("tfButtons");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "center";
  correctBtn.style.width = "250px";
  correctBtn.style.margin = "0 auto";

  // Add correct class to correct button
  correctBtn.classList.add("correct");
  correctBtn.disabled = true;

  // Update drop box
  dropBox.innerHTML = `<span class="emoji">? Correct Answer: ${q.a ? "TRUE" : "FALSE"}</span>`;
  dropBox.classList.add("locked");
}

function resetButtons() {
  // Show both buttons again
  trueBtn.style.display = "flex";
  falseBtn.style.display = "flex";

  // Reset button styles
  trueBtn.classList.remove("correct");
  falseBtn.classList.remove("correct");
  trueBtn.disabled = false;
  falseBtn.disabled = false;

  // Reset container style
  const buttonsContainer = document.getElementById("tfButtons");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "center";
  buttonsContainer.style.gap = "60px";

  // Reset button widths
  trueBtn.style.width = "";
  falseBtn.style.width = "";
  trueBtn.style.margin = "";
  falseBtn.style.margin = "";

  // Reset drop box
  dropBox.innerHTML = `<span class="drop-text">Drop Answer Here</span>`;
  dropBox.classList.remove("locked");
}

function loadQuestion() {
  if (finalPopupShown) return;

  const q = quizData[index];

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;
  imgEl.style.display = "block";

  questionEl.textContent = q.q;
  progressEl.textContent = `Question ${index + 1}/${quizData.length}`;

  // Reset button states first
  resetButtons();

  // If question already answered, show correct answer centered
  if (q.answered) {
    updateButtonsForAnswered(q);
  }

  // Enable/disable navigation
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;

  // Setup drag and drop
  trueBtn.draggable = !q.answered;
  falseBtn.draggable = !q.answered;
}

function answer(user) {
  const q = quizData[index];
  if (q.answered || finalPopupShown) return;

  const correct = q.a === user;
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  speak(correct ? "Correct" : "Wrong");

  if (correct) {
    q.answered = true;
    q.userAnswer = user;
    score++;

    // Update button states - hide wrong, center correct
    updateButtonsForAnswered(q);

    showPopup(true);
    fireConfetti();

    // Enable next button
    nextBtn.disabled = false;

    // Check if final question
    if (index === quizData.length - 1) {
      setTimeout(() => {
        finalPopupShown = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        showFinal();
      }, 800);
    }
  } else {
    showPopup(false);
    // Shake effect for wrong answer
    const wrongBtn = user ? trueBtn : falseBtn;
    wrongBtn.style.animation = "shake 0.4s ease";
    setTimeout(() => {
      wrongBtn.style.animation = "";
    }, 400);
  }
}

// Navigation
prevBtn.onclick = () => {
  if (index > 0 && !finalPopupShown) {
    index--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (index < quizData.length - 1 && !finalPopupShown) {
    index++;
    loadQuestion();
  }
};

// Drag and Drop
trueBtn.addEventListener("dragstart", () => {
  draggedValue = true;
});
falseBtn.addEventListener("dragstart", () => {
  draggedValue = false;
});

dropBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropBox.classList.add("hover");
});

dropBox.addEventListener("dragleave", () => {
  dropBox.classList.remove("hover");
});

dropBox.addEventListener("drop", () => {
  dropBox.classList.remove("hover");
  if (draggedValue !== null) {
    answer(draggedValue);
    draggedValue = null;
  }
});

// Button clicks
trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 },
  });
}

// Add shake animation CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
`;
document.head.appendChild(style);

loadQuestion();
