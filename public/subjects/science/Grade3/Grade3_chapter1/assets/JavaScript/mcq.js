const quizData = [
  {
    q: "Q1. Birds fly with the help of their ________.",
    img: "../assets/images/birds.png",
    options: [
      { text: "lungs", img: "../assets/images/bird-lungs.png" },
      { text: "wings", img: "../assets/images/bird-wings.png" },
      { text: "gills", img: "../assets/images/bird-gills.png" },
      { text: "fins", img: "../assets/images/bird-fins.png" },
    ],
    a: 1,
  },
  {
    q: "Q2. A ________ lays eggs.",
    img: "../assets/images/MCQ_Q2.png",
    options: [
      { text: "bat", img: "../assets/images/bat.png" },
      { text: "lizard", img: "../assets/images/lizard.png" },
      { text: "kangaroo", img: "../assets/images/kangaroo.png" },
      { text: "bear", img: "../assets/images/bear.png" },
    ],
    a: 1,
  },
  {
    q: "Q3. A ________ has six legs.",
    img: "../assets/images/MCQ_Q3.png",
    options: [
      { text: "butterfly", img: "../assets/images/butterfly.png" },
      { text: "snake", img: "../assets/images/snake.png" },
      { text: "bird", img: "../assets/images/bird.png" },
      { text: "fish", img: "../assets/images/fish.png" },
    ],
    a: 0,
  },
  {
    q: "Q4. Plants make food in their ________.",
    img: "../assets/images/MCQ_Q4.png",
    options: [
      { text: "leaves", img: "../assets/images/leaves.png" },
      { text: "roots", img: "../assets/images/roots.png" },
      { text: "stems", img: "../assets/images/stems.png" },
      { text: "branches", img: "../assets/images/branches.png" },
    ],
    a: 0,
  },
  {
    q: "Q5. Aquatic birds swim with the help of their ________.",
    img: "../assets/images/MCQ_Q5.png",
    options: [
      { text: "fins", img: "../assets/images/fins.png" },
      { text: "wings", img: "../assets/images/wings.png" },
      { text: "webbed feet", img: "../assets/images/webbed-feet.png" },
      { text: "feathers", img: "../assets/images/feathers.png" },
    ],
    a: 2,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

/* ? FIXED DOM REFERENCES */
const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stations = [...document.querySelectorAll(".station")];

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
d.innerHTML = `
  <img src="${t.img}" class="opt-img">
  <p>${t.text}</p>
`;

    /* RESTORE STATE */
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
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) {
          setTimeout(showFinal, 1600);
        }
      } else {
        speak("Wrong");
        showPopup(false);

        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

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
    icon.textContent = "????";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "????";
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

/* ?? START */
loadQuestion();
