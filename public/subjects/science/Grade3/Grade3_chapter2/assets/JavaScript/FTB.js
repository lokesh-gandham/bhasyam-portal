






const questions = [
  {
    question: "Q1. A group of cells similar in structure join together to form a ______.",
    answer: "tissue",
    image: "../assets/images/tissues.png",
  },

  {
    question: "Q2. Blood cells are formed in the ______.",
    answer: "bone marrow",
    image: "../assets/images/bone-marrow.png",
  },

  {
    question: "Q3. The process of giving birth to young ones is called ______.",
    answer: "reproduction",
    image: "../assets/images/reproduction.png",
  },

  {
    question: "Q4. The process by which exchange of gases takes place is called ______.",
    answer: "breathing",
    image: "../assets/images/respiration.png",
  },

  {
    question: "Q5. The brain sends and receives messages from the ______.",
    answer: "sense organs",
    image: "../assets/images/sense-organs.png",
  },
];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);
// Store the last letter set for each question
const lastLetterSetState = new Array(questions.length).fill(null);
// Store selected letters for each question
const selectedLettersState = new Array(questions.length).fill(null).map(() => []);

let currentAnswerLetters = [];
let currentTargetWord = "";
let letterOptionsActive = false;
let currentLetterSet = [];

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const input = document.getElementById("answerInput");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// Create letter options container
let letterOptionsContainer = null;

// Helper function to clean answer (remove spaces)
function cleanAnswer(answer) {
  return answer.toLowerCase().replace(/\s/g, "");
}

// Helper function to get 3 letters (1 correct, 2 wrong) based on current position
function getNextThreeLetters(answerWord, currentProgress) {
  const remainingLetters = answerWord.slice(currentProgress);
  if (remainingLetters.length === 0) return [];
  
  const nextCorrectLetter = remainingLetters[0];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const wrongLetters = [];
  
  while (wrongLetters.length < 2) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (randomLetter !== nextCorrectLetter && !wrongLetters.includes(randomLetter)) {
      wrongLetters.push(randomLetter);
    }
  }
  
  let threeLetters = [nextCorrectLetter, ...wrongLetters];
  
  for (let i = threeLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [threeLetters[i], threeLetters[j]] = [threeLetters[j], threeLetters[i]];
  }
  
  return threeLetters;
}

// Create letter options container BELOW the input box
function createLetterUI() {
  const inputArea = document.querySelector(".input-area");
  if (!inputArea) return;
  
  letterOptionsContainer = document.createElement("div");
  letterOptionsContainer.id = "letterOptions";
  letterOptionsContainer.style.cssText = `
    display: none;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
    margin-bottom: 5px;
    padding: 10px;
  `;
  
  const submitBtnElement = document.getElementById("submitBtn");
  if (submitBtnElement) {
    inputArea.insertBefore(letterOptionsContainer, submitBtnElement);
  } else {
    inputArea.appendChild(letterOptionsContainer);
  }
}

// Update input field with current answer
function updateInputDisplay() {
  input.value = currentAnswerLetters.join("");
  
  if (currentTargetWord && currentAnswerLetters.length === currentTargetWord.length) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// Disable all letter buttons immediately
function disableAllLetterButtons() {
  if (!letterOptionsContainer) return;
  const btns = letterOptionsContainer.querySelectorAll("button");
  for (let btn of btns) {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
    btn.style.pointerEvents = "none";
  }
}

// Clear all letter buttons
function clearLetterButtons() {
  if (letterOptionsContainer) {
    letterOptionsContainer.innerHTML = "";
    letterOptionsContainer.style.display = "none";
  }
}

// Render active 3 letter options (clickable)
function renderActiveLetterOptions() {
  if (!letterOptionsContainer) return;
  
  const answerWord = cleanAnswer(questions[currentQuestion].answer);
  currentTargetWord = answerWord;
  const currentProgress = currentAnswerLetters.length;
  
  if (currentProgress >= answerWord.length) {
    letterOptionsContainer.style.display = "none";
    return;
  }
  
  const threeLetters = getNextThreeLetters(answerWord, currentProgress);
  currentLetterSet = threeLetters;
  
  // Save this letter set
  lastLetterSetState[currentQuestion] = [...threeLetters];
  
  letterOptionsContainer.innerHTML = "";
  const setContainer = document.createElement("div");
  setContainer.style.cssText = `
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
  `;
  
  threeLetters.forEach(letter => {
    const letterBtn = document.createElement("button");
    letterBtn.textContent = letter.toUpperCase();
    letterBtn.style.cssText = `
      width: 70px;
      height: 70px;
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #86cfe5, #66b6d2);
      color: white;
      border: none;
      border-radius: 35px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 6px 0 #3e9dbb;
      font-family: "Livvic", sans-serif;
    `;
    
    letterBtn.onmouseenter = () => {
      if (!letterBtn.disabled) {
        letterBtn.style.transform = "scale(1.1)";
        letterBtn.style.boxShadow = "0 8px 0 #3e9dbb";
      }
    };
    letterBtn.onmouseleave = () => {
      if (!letterBtn.disabled) {
        letterBtn.style.transform = "scale(1)";
        letterBtn.style.boxShadow = "0 6px 0 #3e9dbb";
      }
    };
    letterBtn.onclick = () => selectLetter(letter, letterBtn);
    setContainer.appendChild(letterBtn);
  });
  
  letterOptionsContainer.appendChild(setContainer);
  letterOptionsContainer.style.display = "flex";
}

// Handle letter selection
function selectLetter(letter, clickedButton) {
  if (!currentTargetWord) return;
  
  const currentProgress = currentAnswerLetters.length;
  const expectedLetter = currentTargetWord[currentProgress];
  
  if (letter === expectedLetter) {
    // Disable the clicked button
    clickedButton.disabled = true;
    clickedButton.style.opacity = "0.5";
    clickedButton.style.cursor = "not-allowed";
    clickedButton.style.transform = "scale(0.95)";
    
    // Add correct letter to answer
    currentAnswerLetters.push(letter);
    updateInputDisplay();
    
    // Save to state
    selectedLettersState[currentQuestion] = [...currentAnswerLetters];
    
    // Check if answer is complete
    if (currentAnswerLetters.length === currentTargetWord.length) {
      // Immediately disable all letters before showing popup
      disableAllLetterButtons();
      // Auto submit after a short delay
      setTimeout(() => {
        if (currentAnswerLetters.length === currentTargetWord.length && answers[currentQuestion] === null) {
          autoSubmitAnswer();
        }
      }, 300);
    } else {
      // Show next set
      renderActiveLetterOptions();
    }
  } else {
    wrongLetterAnimation(clickedButton);
    // showTemporaryMessage("❌ Wrong letter! Try again!", "#ff6b6b",);
    speak("Wrong");
  }
}

// Wrong letter animation
function wrongLetterAnimation(button) {
  button.style.transform = "scale(0.95)";
  button.style.background = "linear-gradient(135deg, #ff6b6b, #ff5252)";
  setTimeout(() => {
    button.style.transform = "scale(1)";
    button.style.background = "linear-gradient(135deg, #86cfe5, #66b6d2)";
  }, 300);
}

// Auto submit when answer is complete
function autoSubmitAnswer() {
  const userAnswer = currentAnswerLetters.join("");
  const correctAnswer = cleanAnswer(questions[currentQuestion].answer);
  
  if (userAnswer === correctAnswer) {
    const originalAnswer = questions[currentQuestion].answer;
    answers[currentQuestion] = originalAnswer;
    score++;
    
    input.classList.remove("input-wrong");
    input.classList.add("input-correct");
    input.value = originalAnswer;
    input.disabled = true;
    
    speak("Correct");
    smallConfetti();
    showPopup(true);
    
    submitBtn.disabled = true;
    letterOptionsActive = false;
    
    // Letters are already disabled from selectLetter function
    
    if (currentQuestion < questions.length - 1) {
      nextBtn.disabled = false;
    }
    
    if (answers.every((a) => a !== null)) {
      setTimeout(showFinal, 1600);
    }
  }
}

// Show reference letter set (for answered questions - just visual, not clickable)
function showReferenceLetterSet(letterSet) {
  if (!letterOptionsContainer) return;
  
  letterOptionsContainer.innerHTML = "";
  const setContainer = document.createElement("div");
  setContainer.style.cssText = `
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
  `;
  
  letterSet.forEach(letter => {
    const letterBtn = document.createElement("button");
    letterBtn.textContent = letter.toUpperCase();
    letterBtn.style.cssText = `
      width: 70px;
      height: 70px;
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #a0c4d6, #88b4c9);
      color: white;
      border: none;
      border-radius: 35px;
      opacity: 0.7;
      cursor: default;
      box-shadow: 0 4px 0 #3e9dbb;
      font-family: "Livvic", sans-serif;
      pointer-events: none;
    `;
    letterBtn.disabled = true;
    setContainer.appendChild(letterBtn);
  });
  
  letterOptionsContainer.appendChild(setContainer);
  letterOptionsContainer.style.display = "flex";
}

// Load a question that has been answered
function loadAnsweredQuestion() {
  const q = questions[currentQuestion];
  currentTargetWord = cleanAnswer(q.answer);
  
  currentAnswerLetters = [...selectedLettersState[currentQuestion]];
  updateInputDisplay();
  
  input.value = answers[currentQuestion];
  input.disabled = true;
  input.classList.add("input-correct");
  submitBtn.disabled = true;
  letterOptionsActive = false;
  
  // Show reference letter set (disabled, not clickable)
  if (letterOptionsContainer) {
    const answerWord = cleanAnswer(q.answer);
    if (lastLetterSetState[currentQuestion]) {
      showReferenceLetterSet(lastLetterSetState[currentQuestion]);
    } else {
      const defaultSet = getNextThreeLetters(answerWord, 0);
      showReferenceLetterSet(defaultSet);
    }
  }
}

// Load a fresh/unanswered question
function loadFreshQuestion() {
  currentAnswerLetters = [];
  currentTargetWord = cleanAnswer(questions[currentQuestion].answer);
  updateInputDisplay();
  input.disabled = false;
  input.readOnly = true;
  input.value = "";
  input.classList.remove("input-correct", "input-wrong");
  submitBtn.disabled = true;
  letterOptionsActive = true;
  renderActiveLetterOptions();
}

function showTemporaryMessage(message, color) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = message;
  msgDiv.style.cssText = `
   
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${color};
    color: white;
     padding: clamp(10px, 3vw, 15px) clamp(20px, 5vw, 30px);
    border-radius: 50px;
    font-size: clamp(12px, 4vw, 20px);
    font-weight: 400;
    z-index: 10000;
         min-width: clamp(150px, 40vw, 250px);
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.4;
    animation: fadeMsg 1.5s ease forwards;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 1500);
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

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  image.src = q.image;
  
  if (answers[currentQuestion] !== null) {
    // Question already answered - show reference (not clickable)
    loadAnsweredQuestion();
  } else if (selectedLettersState[currentQuestion].length > 0) {
    // Partially answered - restore progress with active buttons
    currentAnswerLetters = [...selectedLettersState[currentQuestion]];
    currentTargetWord = cleanAnswer(q.answer);
    updateInputDisplay();
    input.disabled = false;
    input.readOnly = true;
    input.classList.remove("input-correct", "input-wrong");
    submitBtn.disabled = currentAnswerLetters.length !== currentTargetWord.length;
    letterOptionsActive = true;
    
    if (currentAnswerLetters.length < currentTargetWord.length) {
      renderActiveLetterOptions();
    } else {
      letterOptionsContainer.style.display = "none";
    }
  } else {
    // Fresh question
    loadFreshQuestion();
  }
  
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
  
  if (currentQuestion === questions.length - 1) {
    nextBtn.textContent = "Finish";
  } else {
    nextBtn.textContent = "Next →";
  }
}

// Click on input box - only works for unanswered questions
input.addEventListener("click", () => {
  if (answers[currentQuestion] === null && letterOptionsActive && currentTargetWord) {
    if (letterOptionsContainer && currentAnswerLetters.length < currentTargetWord.length) {
      renderActiveLetterOptions();
    }
  }
});

submitBtn.onclick = function () {
  const userAnswer = currentAnswerLetters.join("");
  const correctAnswer = cleanAnswer(questions[currentQuestion].answer);
  
  if (userAnswer === correctAnswer && userAnswer.length === correctAnswer.length) {
    answers[currentQuestion] = questions[currentQuestion].answer;
    score++;
    
    input.classList.remove("input-wrong");
    input.classList.add("input-correct");
    input.value = questions[currentQuestion].answer;
    input.disabled = true;
    
    // Disable all letter buttons immediately
    disableAllLetterButtons();
    
    speak("Correct");
    smallConfetti();
    showPopup(true);
    
    submitBtn.disabled = true;
    letterOptionsActive = false;
    
    if (answers.every((a) => a !== null)) {
      setTimeout(showFinal, 1600);
    } else {
      nextBtn.disabled = false;
    }
  } else {
    input.classList.remove("input-correct");
    input.classList.add("input-wrong");
    
    showPopup(false);
    speak("Wrong");
    
    setTimeout(() => {
      input.classList.remove("input-wrong");
    }, 600);
  }
};

nextBtn.onclick = function () {
  if (currentQuestion < questions.length - 1) {
    // Save progress before leaving
    if (answers[currentQuestion] === null && currentAnswerLetters.length > 0) {
      selectedLettersState[currentQuestion] = [...currentAnswerLetters];
    }
    currentQuestion++;
    loadQuestion();
  }
};

prevBtn.onclick = function () {
  if (currentQuestion > 0) {
    // Save progress before leaving
    if (answers[currentQuestion] === null && currentAnswerLetters.length > 0) {
      selectedLettersState[currentQuestion] = [...currentAnswerLetters];
    }
    currentQuestion--;
    loadQuestion();
  }
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  
  if (!popup) return;
  
  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";
  
  if (isCorrect) {
    icon.textContent = "🥳";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "😒";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }
  
  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  
  if (!popup) return;
  
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  
  popup.style.display = "flex";
  bigConfetti();
}

// Add fade animation
const fadeStyle = document.createElement("style");
fadeStyle.textContent = `
  @keyframes fadeMsg {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    70% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  }
`;
document.head.appendChild(fadeStyle);

// Initialize
createLetterUI();
loadQuestion();


const hintBtn = document.getElementById("hintBtn");

hintBtn.onclick = function () {

  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup kid-correct";
  popup.style.display = "flex";

  icon.textContent = "💡";
  title.textContent = "How To Play";

  msg.innerHTML = `
    Select the correct letters one by one.<br>
    Complete the word to finish the answer.
  `;

  setTimeout(() => {
    popup.style.display = "none";
  }, 2500);
};







