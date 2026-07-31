const questions = [
  {
    q: "Q1. Each of our body parts has different __________ and different __________.",
    a: ["names", "functions"],
    img: "../assets/images/body-parts.png",
  },
  {
    q: "Q2. Each foot has five __________.",
    a: ["toes"],
    img: "../assets/images/feedd.png",
  },
  {
    q: "Q3. Eyes, ears, nose, tongue and skin are called the __________.",
    a: ["sense organs"],
    img: "../assets/images/sense-organs.png",
  },
  {
    q: "Q4. The __________ is a sense organ that helps us taste.",
    a: ["tongue"],
    img: "../assets/images/taste.png",
  },
  {
    q: "Q5. We hold things with our __________.",
    a: ["hands"],
    img: "../assets/images/hold.png",
  },
];

let index = 0;
let score = 0;

const answers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({
    value: "",
    correct: false,
  })),
}));

const qImgEl = document.getElementById("qImg");
const qTextEl = document.getElementById("qText");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const container = document.getElementById("inputsContainer");

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function preloadImages(callback) {
  const loader = document.getElementById("imgLoader");

  let loaded = 0;

  questions.forEach((q) => {
    const img = new Image();
    img.src = q.img;

    img.onload = img.onerror = () => {
      loaded++;

      if (loaded === questions.length) {
        loader.style.display = "none";
        callback();
      }
    };
  });
}

function loadQuestion() {
  const q = questions[index];
  const state = answers[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;

  container.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.placeholder = "Type your answer...";
    input.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    const btn = document.createElement("button");
    btn.textContent = "Submit";
    btn.disabled = true;

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });

    if (state.boxes[i].correct) {
      box.classList.add("correct");
      input.value = state.boxes[i].value;
      input.disabled = true;
      btn.disabled = true;
      btn.classList.add("disabled-btn");
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);
    container.appendChild(box);
  });

  prev.disabled = index === 0;

  const allDone = state.boxes.every((b) => b.correct);
  next.disabled = !allDone;
}

function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answersList = questions[index].a;
  const state = answers[index];

  if (answersList.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;
    btn.classList.add("disabled-btn");

    state.used.push(value);

    state.boxes[i] = {
      value: value,
      correct: true,
    };

    speak("Correct");
    showPopup(true);
    fireConfetti();
  } else {
    input.value = "";
    speak("Wrong");
    showPopup(false);
    btn.disabled = true;
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const state = answers[index];
  const allDone = state.boxes.every((b) => b.correct);

  if (allDone) {
    next.disabled = false;

    if (!state.scored) {
      score++;
      state.scored = true;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1600);
      }
    }
  } else {
    next.disabled = true;
  }
}

prev.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
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

  fireConfettif();
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

preloadImages(loadQuestion);
