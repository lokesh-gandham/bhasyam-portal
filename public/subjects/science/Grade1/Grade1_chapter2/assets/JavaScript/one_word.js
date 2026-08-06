const quizData = [
  {
    q: "Q1. We write and eat with the help of these",
    a: "HANDS",
    img: "../assets/images/writing.png",
  },
  {
    q: "Q2. The part of our body other than the head and the limbs",
    a: "TRUNK",
    img: "../assets/images/trunk.png",
  },
  {
    q: "Q3. The sense organ that helps us smell",
    a: "NOSE",
    img: "../assets/images/smelling.png",
  },
];

let currentQuestionIndex = 0;
let quizScore = 0;

const answeredQuestions = Array(quizData.length).fill(false);
const storedAnswers = Array(quizData.length).fill("");

const questionTitle = document.getElementById("questionTitle");
const questionImage = document.getElementById("questionImage");

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const submitButton = document.getElementById("submitButton");

const answerSlotsContainer = document.getElementById("answerSlots");
const letterContainer = document.getElementById("letterContainer");

let correctAnswer = "";
let letterTiles = [];

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
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

function shuffleLetters(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createAnswerSlots(word) {
  answerSlotsContainer.innerHTML = "";

  for (let i = 0; i < word.length; i++) {
    if (word[i] === " ") {
      // GAP BETWEEN WORDS
      const gap = document.createElement("div");
      gap.className = "answer-gap";
      answerSlotsContainer.appendChild(gap);
    } else {
      const slot = document.createElement("div");
      slot.className = "answer-slot";
      slot.onclick = () => removeLetterFromSlot(slot);
      answerSlotsContainer.appendChild(slot);
    }
  }
}

function removeLetterFromSlot(slot) {
  if (slot.classList.contains("locked")) return;

  const letter = slot.textContent;
  if (!letter) return;

  slot.textContent = "";
  slot.classList.remove("filled");

  const tile = letterTiles.find(
    (t) => t.textContent === letter && t.classList.contains("used"),
  );

  if (tile) {
    tile.classList.remove("used");
    tile.onclick = () => insertLetterIntoSlot(tile, letter);
  }

  submitButton.disabled = true;
}

function generateLetterTiles(answer) {
  letterContainer.innerHTML = "";
  letterTiles = [];

  let letters = answer.replace(/\s/g, "").split(""); // REMOVE SPACES
  shuffleLetters(letters);

  letters.forEach((letter) => {
    const tile = document.createElement("div");

    tile.className = "letter-tile";
    tile.textContent = letter;

    tile.onclick = () => insertLetterIntoSlot(tile, letter);

    letterContainer.appendChild(tile);
    letterTiles.push(tile);
  });
}

function insertLetterIntoSlot(tile, letter) {
  // stop editing after correct answer
  if (answeredQuestions[currentQuestionIndex]) return;

  const slots = document.querySelectorAll(".answer-slot");

  const empty = [...slots].find(
    (s) => !s.textContent && !s.classList.contains("locked"),
  );

  if (!empty) return;

  empty.textContent = letter;
  empty.classList.add("filled");

  tile.classList.add("used");
  tile.onclick = null;

  validateSlotCompletion();
}

function validateSlotCompletion() {
  const slots = document.querySelectorAll(".answer-slot");

  let word = [...slots].map((s) => s.textContent).join("");

  if (word.length === correctAnswer.replace(/\s/g, "").length) {
    submitButton.disabled = false;
  }
}

function removeLastFilledSlot() {
  // prevent deleting locked answers
  if (answeredQuestions[currentQuestionIndex]) return;

  const slots = document.querySelectorAll(".answer-slot");

  const filled = [...slots].filter(
    (s) => s.textContent && !s.classList.contains("locked"),
  );

  if (filled.length === 0) return;

  const last = filled[filled.length - 1];

  const letter = last.textContent;

  last.textContent = "";
  last.classList.remove("filled");

  const tile = letterTiles.find(
    (t) => t.textContent === letter && t.classList.contains("used"),
  );

  if (tile) {
    tile.classList.remove("used");
    tile.onclick = () => insertLetterIntoSlot(tile, letter);
  }

  submitButton.disabled = true;
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "👍";
    title.textContent = "Great Job!";
    msg.textContent = "";
  } else {
    icon.textContent = "👎";
    title.textContent = "Oops!";
    msg.textContent = "";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent =
    `Your Score: ${quizScore} / ${quizData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(quizScore);
  popup.style.display = "flex";
  bigConfetti();
}

function renderQuestion() {
  const question = quizData[currentQuestionIndex];

  questionTitle.textContent = question.q;
  questionImage.src = question.img;

  correctAnswer = question.a.toUpperCase();

  createAnswerSlots(correctAnswer);

  if (answeredQuestions[currentQuestionIndex]) {
    const slots = document.querySelectorAll(".answer-slot");
    const saved = storedAnswers[currentQuestionIndex].split("");

    let index = 0;
    slots.forEach((slot) => {
      if (!slot.classList.contains("answer-slot")) return;

      if (saved[index]) {
        slot.textContent = saved[index];
        slot.classList.add("locked");
        index++;
      }
    });

    generateLetterTiles(correctAnswer);

    letterTiles.forEach((tile) => {
      tile.classList.add("used");
      tile.onclick = null;
    });

    submitButton.disabled = true;
    nextButton.disabled = false;
  } else {
    generateLetterTiles(correctAnswer);
    submitButton.disabled = true;
    nextButton.disabled = true;
  }

  previousButton.disabled = currentQuestionIndex === 0;
}

submitButton.onclick = () => {
  const slots = document.querySelectorAll(".answer-slot");

  let guess = [...slots].map((s) => s.textContent).join("");

  if (guess === correctAnswer.replace(/\s/g, "")) {
    quizScore++;

    showPopup(true);
    speak("Correct");
    smallConfetti();

    answeredQuestions[currentQuestionIndex] = true;
    storedAnswers[currentQuestionIndex] = guess;

    slots.forEach((s) => {
      s.classList.add("locked");
      s.onclick = null;
    });

    submitButton.disabled = true;
    nextButton.disabled = false;

    if (currentQuestionIndex === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    showPopup(false);
    speak("Wrong");

    setTimeout(() => {
      slots.forEach((s) => {
        s.textContent = "";
        s.classList.remove("filled");
      });
      letterTiles.forEach((tile) => {
        tile.classList.remove("used");
        tile.onclick = () => insertLetterIntoSlot(tile, tile.textContent);
      });
      submitButton.disabled = true;
    }, 800);
  }
};

nextButton.onclick = () => {
  currentQuestionIndex++;
  renderQuestion();
};

previousButton.onclick = () => {
  currentQuestionIndex--;
  renderQuestion();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" || e.key === "Delete") {
    removeLastFilledSlot();
  }
});

renderQuestion();
