const quizData = [
  {
    q: "Q1. We breathe through our ______.",
    img: "../assets/images/breathing.png",
    options: [
      "../assets/images/ear.png|ears",
      "../assets/images/nose.png|nose",
      "../assets/images/eyes.png|eyes",
      "../assets/images/skin.png|skin",
    ],
    a: 1,
  },

  {
    q: "Q2. We hear with our ______.",
    img: "../assets/images/hearing.png",
    options: [
      "../assets/images/nose.png|nose",
      "../assets/images/ear.png|ears",
      "../assets/images/skin.png|skin",
      "../assets/images/eyes.png|eyes",
    ],
    a: 1,
  },

  {
    q: "Q3. Each hand has five ______.",
    img: "../assets/images/hands.png",
    options: [
      "../assets/images/toes.png|toes",
      "../assets/images/legs.png|legs",
      "../assets/images/fingers1.png|fingers",
      "../assets/images/arms.png|arms",
    ],
    a: 2,
  },

  {
    q: "Q4. We have ______ sense organs.",
    img: "../assets/images/face.png",
    options: [
      "../assets/images/five.png|five",
      "../assets/images/two.png|two",
      "../assets/images/six.png|six",
      "../assets/images/four.png|four",
    ],
    a: 0,
  },

  {
    q: "Q5. Our hands are part of our ______.",
    img: "../assets/images/hands.png",
    options: [
      "../assets/images/legs.png|legs",
      "../assets/images/feet.png|feet",
      "../assets/images/arms.png|arms",
      "../assets/images/toes.png|toes",
    ],
    a: 2,
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

    d.innerHTML = `<div class="option-img"><img src="${img}"></div><span>${text}</span>`;

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

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
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
    icon.textContent = "👍";
    title.textContent = "Great Job!";
    msg.textContent = "";
  } else {
    icon.textContent = "👎";
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
