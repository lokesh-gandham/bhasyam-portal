const quizData = [
  {
    image: "../assets/images/mcq-1.png",
    q: "Our tongue helps us ___ the food.",
    options: [
      { text: "Hear", img: "../assets/images/hear.png" },
      { text: "See", img: "../assets/images/see.png" },
      { text: "Taste", img: "../assets/images/taste.png" },
      { text: "Feel", img: "../assets/images/feel.png" }
    ],
    correct: 2,
  },
  {
    image: "../assets/images/boy.png",
    q: "Our whole body is covered with the ____.",
    options: [
      { text: "Arms", img: "../assets/images/arms.png" },
      { text: "Legs", img: "../assets/images/legs.png" },
      { text: "Muscles", img: "../assets/images/muscles.png" },
      { text: "Skin", img: "../assets/images/Skin1.png" }
    ],
    correct: 3,
  },
  {
    image: "../assets/images/head.png",
    q: "The ____ is located inside our head.",
    options: [
      { text: "Heart", img: "../assets/images/heart.png" },
      { text: "Brain", img: "../assets/images/brain.png" },
      { text: "Lungs", img: "../assets/images/lungs.png" },
      { text: "Stomach", img: "../assets/images/stomach.png" }
    ],
    correct: 1,
  },
  {
    image: "../assets/images/mcq-4.png",
    q: "We have a pair of ___.",
    options: [
      { text: "Lungs", img: "../assets/images/lungs.png" },
      { text: "Heart", img: "../assets/images/heart.png" },
      { text: "Brain", img: "../assets/images/brain.png" },
      { text: "Stomach", img: "../assets/images/stomach.png" },
    ],
    correct: 0
  },
  {
    image: "../assets/images/mcq-5.png",
    q: "The ___ pumps blood to all the parts of the body.",
    options: [
      { text: "Brain", img: "../assets/images/brain.png" },
      { text: "Heart", img: "../assets/images/heart.png" },
      { text: "Lungs", img: "../assets/images/lungs.png" },
      { text: "Stomach", img: "../assets/images/stomach.png" }
    ],
    correct: 1
  }
];

let index = 0, score = 0;
let answers = Array(quizData.length).fill(null);

const qText = document.getElementById("questionText");
const qImg = document.getElementById("questionImg");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");

// Get option containers for cross layout
const optionTop = document.getElementById("optionTop");
const optionBottom = document.getElementById("optionBottom");
const optionLeft = document.getElementById("optionLeft");
const optionRight = document.getElementById("optionRight");

const correctAudio = document.getElementById("correctSound");
const wrongAudio = document.getElementById("wrongSound");

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "??";
    title.textContent = "Correct!";
    msg.textContent = "Well done! ??";
  } else {
    icon.textContent = "??";
    title.textContent = "Wrong!";
    msg.textContent = "Try again! ??";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/${quizData.length}`;
  const starsHtml = "?".repeat(score) + "?".repeat(quizData.length - score);
  document.getElementById("stars").innerHTML = starsHtml;
  fireConfettif();
}

function renderProgress() {
  progress.innerHTML = "";
  quizData.forEach((_, i) => {
    const d = document.createElement("div");
    d.textContent = answers[i] !== null ? "?" : i + 1;
    d.style.background = answers[i] !== null ? "#4CAF50" : "#e0e0e0";
    d.style.color = answers[i] !== null ? "#fff" : "#888";
    progress.appendChild(d);
  });
}

function clearOptions() {
  optionTop.innerHTML = "";
  optionBottom.innerHTML = "";
  optionLeft.innerHTML = "";
  optionRight.innerHTML = "";
}

function createOptionButton(opt, idx, correctIdx, isAnswered) {
  const div = document.createElement("div");
  div.className = "opt-btn";
  div.innerHTML = `
    <img src="${opt.img}" class="opt-img" alt="${opt.text}">
    <span class="opt-text">${opt.text}</span>
  `;

  if (isAnswered) {
    if (idx === correctIdx) {
      div.classList.add("correct");
    }
    div.classList.add("disabled");
  }

  div.onclick = () => selectAnswer(div, idx);
  return div;
}

function loadQuestion() {
  const q = quizData[index];
  qText.textContent = q.q;
  qImg.src = q.image;
  qImg.style.display = "block";

  prevBtn.disabled = index === 0;
  
  const options = q.options;
  const correctIdx = q.correct;
  const isAnswered = answers[index] !== null;
  
  clearOptions();
  
  // Assign options to cross positions:
  // Option 0 ? TOP
  // Option 1 ? BOTTOM
  // Option 2 ? LEFT
  // Option 3 ? RIGHT
  if (options[0]) optionTop.appendChild(createOptionButton(options[0], 0, correctIdx, isAnswered));
  if (options[1]) optionBottom.appendChild(createOptionButton(options[1], 1, correctIdx, isAnswered));
  if (options[2]) optionLeft.appendChild(createOptionButton(options[2], 2, correctIdx, isAnswered));
  if (options[3]) optionRight.appendChild(createOptionButton(options[3], 3, correctIdx, isAnswered));
  
  if (isAnswered) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
  
  renderProgress();
}

function selectAnswer(el, idx) {
  const correct = quizData[index].correct;
  
  if (answers[index] !== null) return;
  
  if (idx !== correct) {
    el.classList.add("disabled");
    if (wrongAudio) wrongAudio.play();
    speak("Wrong");
    showPopup(false);
    return;
  }
  
  // Correct answer
  answers[index] = idx;
  score++;
  el.classList.add("correct");
  el.classList.add("disabled");
  if (correctAudio) correctAudio.play();
  speak("Correct");
  showPopup(true);
  fireConfetti();
  
  // Disable all other options
  document.querySelectorAll(".opt-btn").forEach((opt, i) => {
    if (i !== idx) opt.classList.add("disabled");
  });
  
  nextBtn.disabled = false;
  renderProgress();
  
  if (index === quizData.length - 1) setTimeout(showFinal, 1000);
}

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (index < quizData.length - 1) {
    index++;
    loadQuestion();
  }
};

function restart() {
  index = 0;
  score = 0;
  answers.fill(null);
  document.getElementById("finalPopup").style.display = "none";
  loadQuestion();
}

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

// Initial load
loadQuestion();