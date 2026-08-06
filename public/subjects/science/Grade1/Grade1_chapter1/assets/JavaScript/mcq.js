const quizData = [
  {
    q: "Q1. There are ______ types of families.",
    img: "../assets/images/relatives.png",
    options: [
      "../assets/images/four.png|four",
      "../assets/images/two.png|two",
      "../assets/images/three.png|three",
      "../assets/images/five.png|five",
    ],
    a: 2,
  },

  {
    q: "Q2. Uncles live in a ______ family.",
    img: "../assets/images/uncles.png",
    options: [
      "../assets/images/joint-family.png|joint",
      "../assets/images/small-family.png|small",
      "../assets/images/nuclear-family.png|nuclear",
      "../assets/images/large-family.png|large",
    ],
    a: 0,
  },

  {
    q: "Q3. We watch TV, listen to music and meet our guests in the ______.",
    img: "../assets/images/living.png",
    options: [
      "../assets/images/kitchen.png|kitchen",
      "../assets/images/bedroom.png|bedroom",
      "../assets/images/bathroom.png|bathroom",
      "../assets/images/living-room.png|living room",
    ],
    a: 3,
  },

  {
    q: "Q4. A hut is a ______ house.",
    img: "../assets/images/hut.png",
    options: [
      "../assets/images/kutcha.png|kutcha",
      "../assets/images/tree.png|tree",
      "../assets/images/pucca.png|pucca",
      "../assets/images/boat.png|boat",
    ],
    a: 0,
  },

  {
    q: "Q5. A house protects us from ______.",
    img: "../assets/images/house.png",
    options: [
      "../assets/images/relatives.png|relatives",
      "../assets/images/rain.png|rain",
      "../assets/images/friends.png|friends",
      "../assets/images/none.png|none of these",
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
