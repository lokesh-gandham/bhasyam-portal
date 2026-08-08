function shouldSkipFinalCorrectPopup() {
  try {
    if (typeof answered !== "undefined" && Array.isArray(answered) && answered.length && answered.every(a => a !== null && a !== false)) return true;
    if (typeof answeredQuestions !== "undefined" && Array.isArray(answeredQuestions) && answeredQuestions.length && answeredQuestions.every(Boolean)) return true;
    const leftItems = [...document.querySelectorAll(".left-item")];
    if (leftItems.length && leftItems.every(item => item.classList.contains("matched"))) return true;
    const meanSlots = [...document.querySelectorAll(".mean-slot")];
    if (meanSlots.length && meanSlots.every(slot => slot.classList.contains("correct") || slot.classList.contains("filled"))) return true;
    const droppedWords = [...document.querySelectorAll(".dropped-word")];
    if (droppedWords.length && droppedWords.every(word => word.classList.contains("correct"))) return true;
  } catch (error) {}
  return false;
}
const quizData = [
  {
    q: "Q1. What is the opposite of old?",
    img: "../assets/images/old.png",
    answer: "young",
    scrambled: "ynuog"
  },
  {
    q: "Q2. What is the opposite of good?",
    img: "../assets/images/good.png",
    answer: "bad",
    scrambled: "bda"
  },
  {
    q: "Q3. What is the opposite of beautiful?",
    img: "../assets/images/beautiful.png",
    answer: "ugly",
    scrambled: "ulgy"
  },
  {
    q: "Q4. What is the opposite of happy?",
    img: "../assets/images/happy.png",
    answer: "sad",
    scrambled: "sda"
  }
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);
let letterStates = [];
let selectedOrder = [];

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const imgWrapper = document.getElementById("questionImgWrapper");
const answerDisplay = document.getElementById("answerDisplay");
const lettersContainer = document.getElementById("lettersContainer");
const clearBtn = document.getElementById("clearBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;

  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = "inline";
    imgWrapper.style.display = "block";
  } else {
    imgEl.style.display = "none";
    imgWrapper.style.display = "none";
  }

  answerDisplay.innerHTML = "";
  selectedOrder = [];
  answerDisplay.className = "answer-display";

  for (let i = 0; i < q.answer.length; i++) {
    const slot = document.createElement("div");
    slot.className = "letter-slot";
    slot.dataset.index = i;
    slot.onclick = () => handleSlotClick(i);
    answerDisplay.appendChild(slot);
  }

  const scrambled = q.scrambled ? q.scrambled.split("") : shuffle(q.answer.split(""));
  letterStates = scrambled.map(ch => ({ letter: ch, used: false }));

  lettersContainer.innerHTML = "";
  letterStates.forEach((ls, i) => {
    const circle = document.createElement("div");
    circle.className = "letter-circle";
    circle.textContent = ls.letter;
    circle.dataset.index = i;
    circle.onclick = () => handleLetterClick(i);
    lettersContainer.appendChild(circle);
  });

  if (answered[current] !== null) {
    nextBtn.disabled = current === quizData.length - 1;
    const slots = answerDisplay.children;
    for (let i = 0; i < q.answer.length; i++) {
      slots[i].textContent = q.answer[i];
      slots[i].classList.add("filled", "correct");
    }
    const circles = lettersContainer.children;
    for (let i = 0; i < circles.length; i++) {
      circles[i].classList.add("used");
    }
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = current === 0;
}

function handleLetterClick(index) {
  if (letterStates[index].used) return;
  if (answered[current] !== null) return;

  letterStates[index].used = true;
  selectedOrder.push(index);

  const circles = lettersContainer.children;
  circles[index].classList.add("used");

  const slotIndex = selectedOrder.length - 1;
  const q = quizData[current];
  const slots = answerDisplay.children;
  slots[slotIndex].textContent = letterStates[index].letter;
  slots[slotIndex].classList.add("filled");

  if (selectedOrder.length === q.answer.length) {
    setTimeout(checkAnswer, 400);
  }
}

function handleSlotClick(index) {
  if (answered[current] !== null) return;
  if (index >= selectedOrder.length) return;

  const q = quizData[current];
  const letterIndex = selectedOrder[index];
  letterStates[letterIndex].used = false;

  selectedOrder.splice(index, 1);

  const circles = lettersContainer.children;
  circles[letterIndex].classList.remove("used");

  const slots = answerDisplay.children;
  slots[index].textContent = "";
  slots[index].classList.remove("filled");

  for (let i = index; i < selectedOrder.length; i++) {
    const li = selectedOrder[i];
    slots[i].textContent = letterStates[li].letter;
    slots[i].classList.add("filled");
  }
  if (index < q.answer.length) {
    slots[selectedOrder.length].textContent = "";
    slots[selectedOrder.length].classList.remove("filled");
  }
}

function checkAnswer() {
  if (answered[current] !== null) return;

  const q = quizData[current];
  const formedWord = selectedOrder.map(i => letterStates[i].letter).join("").toLowerCase();

  if (formedWord === q.answer.toLowerCase()) {
    answered[current] = true;
    score++;
    answerDisplay.className = "answer-display correct";

    const slots = answerDisplay.children;
    for (let i = 0; i < slots.length; i++) {
      slots[i].classList.add("correct");
    }

    speak("Correct");
    smallConfetti();
    showPopup(true);
    nextBtn.disabled = current === quizData.length - 1;

    if (answered.every(a => a !== null)) setTimeout(showFinal, 1700);
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
    answerDisplay.className = "answer-display wrong";
    speak("Try again");

    const slots = answerDisplay.children;
    for (let i = 0; i < slots.length; i++) {
      slots[i].textContent = "";
      slots[i].classList.remove("filled");
    }

    const circles = lettersContainer.children;
    for (let i = 0; i < letterStates.length; i++) {
      letterStates[i].used = false;
      circles[i].classList.remove("used");
    }

    selectedOrder = [];

    setTimeout(() => {
      answerDisplay.className = "answer-display";
    }, 600);

    showPopup(false);
  }
}

clearBtn.onclick = () => {
  if (answered[current] !== null) return;

  const q = quizData[current];
  const slots = answerDisplay.children;
  for (let i = 0; i < slots.length; i++) {
    slots[i].textContent = "";
    slots[i].classList.remove("filled");
  }

  const circles = lettersContainer.children;
  for (let i = 0; i < letterStates.length; i++) {
    letterStates[i].used = false;
    circles[i].classList.remove("used");
  }

  selectedOrder = [];
  answerDisplay.className = "answer-display";
};

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  if (current >= quizData.length - 1) return;
  current++;
  loadQuestion();
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  document.querySelectorAll(".sparkle").forEach(el => el.remove());

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "\u{1F389}";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
    correctSound.currentTime = 0;
    correctSound.play();
    const sparks = ["⭐", "✨", "🌟", "💫", "✨"];
    sparks.forEach((s, i) => {
      const el = document.createElement("div");
      el.className = "sparkle";
      el.textContent = s;
      el.style.left = (15 + i * 18) + "%";
      el.style.top = "20%";
      el.style.animationDelay = (i * 0.12) + "s";
      icon.parentElement.appendChild(el);
    });
  } else {
    icon.textContent = "\u{1F615}";
    title.textContent = "Not quite!";
    msg.textContent = "Keep trying, you'll get it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quizData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
