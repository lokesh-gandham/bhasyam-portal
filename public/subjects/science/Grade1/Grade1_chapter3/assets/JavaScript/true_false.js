const questions = [
  {
    q: "Q1. We keep our money safe in a supermarket.",
    a: false,
    img: "../assets/images/tf11.png",
  },
  {
    q: "Q2. We go to a post office to send letters.",
    a: true,
    img: "../assets/images/tf2.png",
  },
  {
    q: "Q3. A park is a place where we play.",
    a: true,
    img: "../assets/images/tf3.png",
  },
  {
    q: "Q4. People who live in houses nearby are our neighbours.",
    a: true,
    img: "../assets/images/tf4.png",
  },
  {
    q: "Q5. A plumber gives us medicines when we are sick.",
    a: false,
    img: "../assets/images/tf5.png",
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
  // dropBox: document.getElementById("dropBox"),
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
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
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

  elements.trueBtn.classList.remove("correct", "wrong", "dim");
  elements.falseBtn.classList.remove("correct", "wrong", "dim");

  if (q.userAnswer !== undefined) {
    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    if (q.a) {
      elements.trueBtn.classList.add("correct");
      elements.falseBtn.classList.add("wrong", "dim");
    } else {
      elements.falseBtn.classList.add("correct");
      elements.trueBtn.classList.add("wrong", "dim");
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

    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    elements.trueBtn.classList.remove("correct", "wrong", "dim");
    elements.falseBtn.classList.remove("correct", "wrong", "dim");

    if (correct) {
      // TRUE is correct
      elements.trueBtn.classList.add("correct");
      elements.falseBtn.classList.add("wrong", "dim");
    } else {
      // FALSE is correct
      elements.falseBtn.classList.add("correct");
      elements.trueBtn.classList.add("wrong", "dim");
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

    // TEMP WRONG EFFECT
    if (selected === true) {
      elements.trueBtn.classList.add("wrong");
    } else {
      elements.falseBtn.classList.add("wrong");
    }

    setTimeout(() => {
      elements.trueBtn.classList.remove("wrong");
      elements.falseBtn.classList.remove("wrong");
    }, 800);
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
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
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
