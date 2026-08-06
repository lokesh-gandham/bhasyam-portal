const questions = [
  {
    q: "Q1. An organ is the smallest living unit of an organism.",
    a: false,
    img: "../assets/images/organs.png",
  },

  {
    q: "Q2. A newborn baby has 206 bones.",
    a: false,
    img: "../assets/images/kid.png",
  },

  {
    q: "Q3. The lungs are the major organs of the digestive system.",
    a: false,
    img: "../assets/images/Lungs.png",
  },

  {
    q: "Q4. The spongy substance inside the bone is called the bone marrow.",
    a: true,
    img: "../assets/images/bone-marrow.png",
  },

  {
    q: "Q5. The circulatory system protects the soft internal organs.",
    a: false,
    img: "../assets/images/circulatory.png",
  },
];

let currentIndex = 0;
let score = 0;

const elements = {
  question: document.getElementById("question"),
  img: document.getElementById("questionImg"),
  trueBtn: document.getElementById("trueBtn"),
  falseBtn: document.getElementById("falseBtn"),
  trueIcon: document.getElementById("trueIcon"),
  falseIcon: document.getElementById("falseIcon"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  popup: document.getElementById("answerPopup"),
  popupIcon: document.getElementById("popupIcon"),
  popupTitle: document.getElementById("popupTitle"),
  popupMsg: document.getElementById("popupMsg"),
  finalPopup: document.getElementById("finalPopup"),
  finalScore: document.getElementById("finalScore"),
  stars: document.getElementById("stars"),
};

// Function to create floating thumbs up emojis coming OUT FROM the correct button
function floatThumbsUpFromButton(correctAnswer) {
  const targetBtn = correctAnswer === true ? elements.trueBtn : elements.falseBtn;
  
  // Get the button's position on screen
  const buttonRect = targetBtn.getBoundingClientRect();
  
  // Center of the button
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;
  
  const numberOfEmojis = Math.floor(Math.random() * 2) + 5; // Random between 5-6
  const container = document.body;
  
  for (let i = 0; i < numberOfEmojis; i++) {
    // Create thumbs up emoji element
    const thumbsEmoji = document.createElement("div");
    thumbsEmoji.textContent = "👍";
    thumbsEmoji.className = "floating-thumbs";
    
    // Random angle for explosion effect (in radians)
    const angle = Math.random() * Math.PI * 2;
    // Random distance for spread
    const distance = Math.random() * 80 + 20;
    
    // Calculate random direction offset
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance - 30; // Slight upward bias
    
    // Random delay for staggered animation
    const randomDelay = Math.random() * 0.3;
    
    // Random size for variety
    const randomSize = Math.floor(Math.random() * 24) + 20; // 20px to 44px
    
    // Random rotation
    const randomRotation = (Math.random() - 0.5) * 40;
    
    // Start position is the button center
    thumbsEmoji.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${randomSize}px;
      z-index: 10000;
      pointer-events: none;
      animation: floatFromButton ${Math.random() * 1.5 + 2}s ease-out forwards;
      animation-delay: ${randomDelay}s;
      transform: translate(-50%, -50%) rotate(${randomRotation}deg);
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      --target-x: ${offsetX}px;
      --target-y: ${offsetY}px;
    `;
    
    container.appendChild(thumbsEmoji);
    
    // Remove emoji after animation completes
    setTimeout(() => {
      if (thumbsEmoji && thumbsEmoji.remove) thumbsEmoji.remove();
    }, 3500);
  }
}

// Add CSS animation for thumbs floating from button
const style = document.createElement("style");
style.textContent = `
  @keyframes floatFromButton {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
      opacity: 1;
    }
    20% {
      transform: translate(calc(-50% + var(--target-x) * 0.3), calc(-50% + var(--target-y) * 0.3)) rotate(5deg);
      opacity: 1;
    }
    50% {
      transform: translate(calc(-50% + var(--target-x) * 0.7), calc(-50% + var(--target-y) * 0.7 - 50px)) rotate(-5deg);
      opacity: 0.9;
    }
    100% {
      transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y) - 150px)) rotate(15deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

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
  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  }
}

function bigConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
  }
}

function clearFeedback() {
  elements.trueIcon.textContent = "";
  elements.falseIcon.textContent = "";
  elements.trueBtn.classList.remove("correct", "wrong");
  elements.falseBtn.classList.remove("correct", "wrong");
  elements.trueBtn.disabled = false;
  elements.falseBtn.disabled = false;
  elements.nextBtn.disabled = true;
}

function showFeedback(correctAnswer) {
  // Show thumbs only when answered correctly
  if (correctAnswer === true) {
    elements.trueIcon.textContent = "😀";
    elements.falseIcon.textContent = "😒";
    elements.trueBtn.classList.add("correct");
    elements.falseBtn.classList.add("wrong");
  } else {
    elements.falseIcon.textContent = "😀";
    elements.trueIcon.textContent = "😒";
    elements.falseBtn.classList.add("correct");
    elements.trueBtn.classList.add("wrong");
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  elements.question.textContent = q.q;
  elements.img.src = q.img;
  elements.img.alt = " loading";

  clearFeedback();

  elements.prevBtn.disabled = currentIndex === 0;

  // If already answered correctly earlier → show feedback & enable next
  if (questions[currentIndex].answeredCorrectly) {
    showFeedback(q.a);
    elements.nextBtn.disabled = false;
    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;
  }
}

function handleAnswer(selected) {
  const correct = questions[currentIndex].a;
  const isCorrect = selected === correct;

  if (isCorrect) {
    score++;
    speak("Correct");
    smallConfetti();
    questions[currentIndex].answeredCorrectly = true;
    showFeedback(correct);
    elements.nextBtn.disabled = false;
    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    // 🎈 Launch 5-6 floating thumbs up emojis FROM the correct button
    floatThumbsUpFromButton(correct);

    showPopup(true);

    if (currentIndex === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
  }
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

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

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
  
  // Also float thumbs from center of screen on final completion
  setTimeout(() => {
    const mockBtn = { getBoundingClientRect: () => ({
      left: window.innerWidth / 2 - 50,
      top: window.innerHeight / 2 - 25,
      width: 100,
      height: 50
    })};
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (typeof floatThumbsUpFromButton === 'function') {
          const tempCorrect = true;
          const targetBtn = elements.trueBtn;
          const buttonRect = targetBtn.getBoundingClientRect();
          const centerX = buttonRect.left + buttonRect.width / 2;
          const centerY = buttonRect.top + buttonRect.height / 2;
          const container = document.body;
          const thumbsEmoji = document.createElement("div");
          thumbsEmoji.textContent = "";
          const randomSize = Math.floor(Math.random() * 24) + 20;
          thumbsEmoji.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: ${randomSize}px;
            z-index: 10000;
            pointer-events: none;
            animation: floatFromButton 2s ease-out forwards;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
            --target-x: ${(Math.random() - 0.5) * 150}px;
            --target-y: ${Math.random() * -200 - 50}px;
          `;
          container.appendChild(thumbsEmoji);
          setTimeout(() => thumbsEmoji.remove(), 2500);
        }
      }, i * 100);
    }
  }, 500);
}

// Event listeners
elements.trueBtn.onclick = () => handleAnswer(true);
elements.falseBtn.onclick = () => handleAnswer(false);

elements.prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

elements.nextBtn.onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};

// Start
renderQuestion();
