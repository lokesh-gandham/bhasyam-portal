















const quizData = [
  {
    q: "Q1. Millions of tiny units in our body are called ______.",
    img: "../assets/images/F1.png",
    options: [
      "../assets/images/organs.png|organs",
      "../assets/images/cells.png|cells",
      "../assets/images/blocks.png|blocks",
      "../assets/images/tissues.png|tissues",
    ],
    a: 1,
  },

  {
    q: "Q2. Breathing is a process of the ______ system.",
    img: "../assets/images/breathing.png",
    options: [
      "../assets/images/digestive.png|digestive",
      "../assets/images/respiratory.png|respiratory",
      "../assets/images/excretory.png|excretory",
      "../assets/images/circulatory.png|circulatory",
    ],
    a: 1,
  },

  {
    q: "Q3. The ______ removes waste from our body in the form of sweat.",
    img: "../assets/images/body.png",
    options: [
      "../assets/images/eyes.png|eyes",
      "../assets/images/skin.png|skin",
      "../assets/images/mouth.png|mouth",
      "../assets/images/ears.png|ears",
    ],
    a: 1,
  },

  {
    q: "Q4. The heart and the blood vessels are the organs of the ______ system of the body.",
    img: "../assets/images/blood-circulation.png",
    options: [
      "../assets/images/organs.png|muscular",
      "../assets/images/circulatory.png|circulatory",
      "../assets/images/F1.png|nervous",
      "../assets/images/respiratory.png|respiratory",
    ],
    a: 1,
  },

  {
    q: "Q5. The heart is the size of one's own ______.",
    img: "../assets/images/heart.png",
    options: [
      "../assets/images/finger.png|finger",
      "../assets/images/fist.png|fist",
      "../assets/images/hand.png|hand",
      "../assets/images/palm.png|palm",
    ],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Function to show floating thumbs up emojis from the correct option
function showThumbsUpFromElement(element) {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create 5-6 thumbs up emojis
  const numberOfEmojis = Math.floor(Math.random() * 2) + 5;
  
  for (let i = 0; i < numberOfEmojis; i++) {
    const thumbsEmoji = document.createElement("div");
    thumbsEmoji.textContent = "??";
    thumbsEmoji.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${Math.floor(Math.random() * 20) + 25}px;
      z-index: 10000;
      pointer-events: none;
      opacity: 1;
      transform: translate(-50%, -50%);
      animation: floatThumbs ${Math.random() * 0.8 + 1.2}s ease-out forwards;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    `;
    
    document.body.appendChild(thumbsEmoji);
    
    setTimeout(() => {
      if (thumbsEmoji && thumbsEmoji.remove) thumbsEmoji.remove();
    }, 2000);
  }
}

// Add CSS animation for floating thumbs
const style = document.createElement("style");
style.textContent = `
  @keyframes floatThumbs {
    0% {
      transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
      opacity: 1;
    }
    25% {
      transform: translate(-50%, -60px) scale(1.2) rotate(15deg);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -120px) scale(1) rotate(-10deg);
      opacity: 0.9;
    }
    75% {
      transform: translate(-50%, -180px) scale(0.9) rotate(10deg);
      opacity: 0.7;
    }
    100% {
      transform: translate(-50%, -250px) scale(0.7) rotate(20deg);
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
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `<div class="option-img"><img src="${img}"></div>${text}`;

    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");
        
        // Show thumbs up emojis from this correct option
        showThumbsUpFromElement(d);
        
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
      } else {
        speak("Wrong");
        showPopup(false);
        d.classList.add("wrong");

        // Show sad face for wrong answer
        showWrongFeedback(d);

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

// Show wrong feedback with sad emoji
function showWrongFeedback(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const sadEmoji = document.createElement("div");
  sadEmoji.textContent = "?";
  sadEmoji.style.cssText = `
    position: fixed;
    left: ${centerX}px;
    top: ${centerY}px;
    font-size: 30px;
    z-index: 10000;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: shakeWrong 0.5s ease-out forwards;
  `;
  
  document.body.appendChild(sadEmoji);
  
  setTimeout(() => {
    if (sadEmoji && sadEmoji.remove) sadEmoji.remove();
  }, 800);
}

// Add shake animation for wrong answers
const wrongStyle = document.createElement("style");
wrongStyle.textContent = `
  @keyframes shakeWrong {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
    20% { transform: translate(-60%, -50%) scale(1.3); }
    40% { transform: translate(-40%, -50%) scale(1.3); }
    60% { transform: translate(-60%, -50%) scale(1.3); }
    80% { transform: translate(-40%, -50%) scale(1.3); }
    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(wrongStyle);

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "??";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "??";
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();









