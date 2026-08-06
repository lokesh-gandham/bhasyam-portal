const questions = [
  {
    q: "Q1. If the amplitude of sound is less, the sound produced is feeble.",
    a: true,
    img: "../assets/images/soundvibrations.png",
  },
  {
    q: "Q2. Noise pollution is harmless to human beings.",
    a: false,
    img: "../assets/images/noisepollution.png",
  },
  {
    q: "Q3. Sound propagates maximum in gases.",
    a: false,
    img: "../assets/images/Gasesak.png",
  },
  {
    q: "Q4. Luminous objects do not emit light.",
    a: false,
    img: "../assets/images/luminousobjects.png",
  },
  {
    q: "Q5. When the frequency is high, the loudness is less.",
    a: false,
    img: "../assets/images/frequencysound.png",
  },
];

let currentIndex = 0;
let score = 0;

const elements = {
  question: document.getElementById("question"),
  img: document.getElementById("questionImg"),
  trueBtn: document.getElementById("trueBtn"),
  falseBtn: document.getElementById("falseBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  dropBox: document.getElementById("dropBox"),
};

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  const duration = 100;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function renderQuestion() {
  const q = questions[currentIndex];

  elements.question.textContent = q.q;
  elements.img.src = q.img;

  elements.prevBtn.disabled = currentIndex === 0;

  elements.trueBtn.style.opacity = "1";
  elements.falseBtn.style.opacity = "1";

  elements.trueBtn.disabled = false;
  elements.falseBtn.disabled = false;

  elements.nextBtn.disabled = true;

  elements.dropBox.textContent = "";
  elements.dropBox.classList.remove("filled");

  /* restore previous answer */

  if (q.userAnswer !== undefined) {
    elements.dropBox.textContent = q.userAnswer ? "TRUE" : "FALSE";
    elements.dropBox.classList.add("filled");

    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    if (q.a) {
      elements.trueBtn.style.opacity = "1";
      elements.falseBtn.style.opacity = ".5";
    } else {
      elements.falseBtn.style.opacity = "1";
      elements.trueBtn.style.opacity = ".5";
    }

    elements.nextBtn.disabled = false;
  }
}

function handleAnswer(selected) {
  const q = questions[currentIndex];

  if (q.userAnswer !== undefined) return;

  const correct = q.a;

  if (selected === correct) {
    score++;

    q.userAnswer = selected;

    elements.dropBox.textContent = correct ? "TRUE" : "FALSE";
    elements.dropBox.classList.add("filled");

    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    if (correct) {
      elements.trueBtn.style.opacity = "1";
      elements.falseBtn.style.opacity = ".5";
    } else {
      elements.falseBtn.style.opacity = "1";
      elements.trueBtn.style.opacity = ".5";
    }

    elements.nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
    smallConfetti();

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
  icon.textContent = "👍";
  title.textContent = "Good";
  msg.textContent = "Correct choice.";
} else {
  icon.textContent = "👎";
  title.textContent = "Retry";
  msg.textContent = "Pick again.";
}

  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

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

renderQuestion();
