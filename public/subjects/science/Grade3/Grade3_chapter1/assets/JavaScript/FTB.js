const questions = [
  {
    q: "Q1. Living things respond to ________.",
    a: ["stimuli"],
    img: "../assets/images/ftb-1.png",
  },
  {
    q: "Q2. Living things have ________ in them.",
    a: ["life"],
    img: "../assets/images/TF-5.png",
  },
  {
    q: "Q3. Animals such as frogs and rabbits ________ or ________ using their limbs.",
    a: ["hop", "leap"],   // ? 2 blanks
    img: "../assets/images/ftb-3.png",
  },
  {
    q: "Q4. Earthworms use their ________ to slide or crawl.",
    a: ["muscles"],
    img: "../assets/images/TF-1.png",
  },
  {
    q: "Q5. Animals that eat the flesh of other animals are called ________.",
    a: ["carnivores"],
    img: "../assets/images/lion-tiger.png",
  },
];

let index = 0;
let score = 0;

window.addEventListener("drop", e => e.preventDefault(), true);
window.addEventListener("dragover", e => e.preventDefault(), true);
const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputsRow = document.getElementById("inputsContainer");

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({ value: "", correct: false })),
}));

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

function loadQuestion() {
  const q = questions[index];

  questionText.innerText = q.q;
  image.src = q.img;

  image.classList.toggle(
    "reveal",
    userAnswers[index].boxes.every((b) => b.correct),
  );

  prevBtn.disabled = index === 0;

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type here...";
    input.value = userAnswers[index].boxes[i].value;

    /* ?? BLOCK DROP */
input.addEventListener("drop", (e) => {
  e.preventDefault();
});

/* ?? BLOCK PASTE */
input.addEventListener("paste", (e) => {
  e.preventDefault();
});

/* ?? BLOCK RIGHT CLICK */
input.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

/* ? CLEAN BAD INPUT (FIXES URL / IMAGE DROP BUG) */
input.addEventListener("input", () => {

  let val = input.value;

  // ?? remove unwanted injected content
  if (
    val.includes("http") ||
    val.includes("www.") ||
    val.includes("blob:") ||
    val.includes("data:") ||
    val.match(/\.(png|jpg|jpeg|gif|webp)$/i)
  ) {
    input.value = "";
    return;
  }

  // ? allow only letters + space
  input.value = val.replace(/[^a-zA-Z ]/g, "");

});

    const btn = document.createElement("button");
    btn.textContent = "?";
    btn.disabled = input.value.trim() === "";

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });
    if (userAnswers[index].boxes[i].correct) {
      box.classList.add("correct");
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);
    inputsRow.appendChild(box);
  });

  checkAllAnswered();
}

function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answers = questions[index].a;
  const state = userAnswers[index];

  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;
    btn.style.cursor = "not-allowed";

    state.used.push(value);
    state.boxes[i] = { value, correct: true };

    speak("Correct");
    smallConfetti();
    showPopup(true);
  } else {
    input.value = "";
    btn.disabled = true;

    speak("Wrong");
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const done = userAnswers[index].boxes.every((b) => b.correct);
  nextBtn.disabled = !done;

  if (done && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;
    image.classList.add("reveal");

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  }
}

nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
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
    icon.textContent = "????";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "????";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
