const questions = [
  {
    q: "Q1. Earthworms are non-living things.",
    a: false,
    img: "../assets/images/TF-1.png",
  },
  {
    q: "Q2. Plants do not respond to stimuli.",
    a: false,
    img: "../assets/images/TF-2.png",
  },
  {
    q: "Q3. Living things can live without water.",
    a: false,
    img: "../assets/images/TF-3.png",
  },
  {
    q: "Q4. Frogs and insects lay eggs.",
    a: true,
    img: "../assets/images/TF-4.png",
  },
  {
    q: "Q5. All living things have the same lifespan.",
    a: false,
    img: "../assets/images/TF-5.png",
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

  trueIcon.innerHTML = "";
  falseIcon.innerHTML = "";

  trueBtn.disabled = false;
  falseBtn.disabled = false;

  trueBtn.classList.remove("correct", "wrong");
  falseBtn.classList.remove("correct", "wrong");

  if (answers[index] !== null) {
    nextBtn.disabled = false;

    if (answers[index] === true) {
      trueIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      falseIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';

      trueBtn.classList.add("correct");
      falseBtn.classList.add("wrong");
    } else {
      falseIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      trueIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';

      falseBtn.classList.add("correct");
      trueBtn.classList.add("wrong");
    }

    /* LOCK BUTTONS */
    trueBtn.disabled = true;
    falseBtn.disabled = true;
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
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
      trueIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      falseIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';

      trueBtn.classList.add("correct");
      falseBtn.classList.add("wrong");
    } else {
      falseIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      trueIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';

      falseBtn.classList.add("correct");
      trueBtn.classList.add("wrong");
    }

    /* LOCK BUTTONS */
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    nextBtn.disabled = false;

    if (index === questions.length - 1) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);
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
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
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
}

render();
