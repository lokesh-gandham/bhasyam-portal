const questions = [
  {
    q: "Q1. Our eyes help us listen.",
    a: false,
    img: "../assets/images/eyes.png",
  },
  {
    q: "Q2. Each hand has ten fingers.",
    a: false,
    img: "../assets/images/handsssss.png",
  },
  {
    q: "Q3. We can see the world around us with our limbs.",
    a: false,
    img: "../assets/images/limbs.png",
  },
  {
    q: "Q4. Our legs help us eat and pick things.",
    a: false,
    img: "../assets/images/legs.png",
  },
  {
    q: "Q5. Our skin helps us feel.",
    a: true,
    img: "../assets/images/sense.png",
  },
];
let index = 0;
let score = 0;

const answers = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");

const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trueIcon = document.getElementById("trueIcon");
const falseIcon = document.getElementById("falseIcon");

/* RENDER */

function render() {
  qEl.textContent = questions[index].q;
  imgEl.src = questions[index].img;

  // trueIcon.innerHTML = "";
  // falseIcon.innerHTML = "";

  trueBtn.disabled = false;
  falseBtn.disabled = false;

  trueBtn.classList.remove("correct", "wrong");
  falseBtn.classList.remove("correct", "wrong");

  if (answers[index] !== null) {
    nextBtn.disabled = false;

    if (answers[index] === true) {
      trueBtn.classList.add("correct");
      falseBtn.classList.add("wrong");
      setEmoji("correct-true");
    } else {
      falseBtn.classList.add("correct");
      trueBtn.classList.add("wrong");
      setEmoji("correct-false");
    }

    // ? allow interaction again if needed
    trueBtn.disabled = false;
    falseBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
  if (answers[index] === null) {
    setEmoji();
  }
}

/* SPEECH */

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

function setEmoji(state) {
  // reset both
  trueBtn.style.setProperty("--emoji", '"??"');
  falseBtn.style.setProperty("--emoji", '"??"');

  if (state === "correct-true") {
    trueBtn.style.setProperty("--emoji", '"??"');
    falseBtn.style.setProperty("--emoji", '"??"');
  } else if (state === "correct-false") {
    falseBtn.style.setProperty("--emoji", '"??"');
    trueBtn.style.setProperty("--emoji", '"??"');
  }
}

/* ANSWER */

function answer(val) {
  if (answers[index] !== null) return;

  if (questions[index].a === val) {
    answers[index] = val;
    score++;

    speak("Correct");
    smallConfetti();
    showPopup(true);

    if (val) {
      setEmoji("correct-true");
      trueBtn.classList.add("correct");
      falseBtn.classList.add("wrong");
    } else {
      setEmoji("correct-false");
      falseBtn.classList.add("correct");
      trueBtn.classList.add("wrong");
    }

    trueBtn.disabled = true;
    falseBtn.disabled = true;

    nextBtn.disabled = false;

    if (index === questions.length - 1) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);

    // OPTIONAL: show sad face on wrong click
    if (val) {
      trueBtn.style.setProperty("--emoji", '"??"');
    } else {
      falseBtn.style.setProperty("--emoji", '"??"');
    }
  }
}

trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);

/* NAV */

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};

nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    render();
  }
};

/* POPUP */

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
    msg.textContent = "";
  } else {
    icon.textContent = "??";
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
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

render();
