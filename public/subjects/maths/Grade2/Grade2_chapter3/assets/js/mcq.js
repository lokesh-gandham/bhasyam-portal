const quizData = [
  {
    q: "Q1. The mason was very ______.",
    img: "../assets/images/mcq-1.png",
    options: [
      "../assets/images/mcq1-1.png|Lazy",
      "../assets/images/mcq1-2.png|Hardworking",
      "../assets/images/mcq1-3.png|Quiet",
      "../assets/images/mcq1-4.png|Careless",
    ],
    a: 1,
  },

  {
    q: "Q2. When the mason became old, he wanted to ______.",
    img: "../assets/images/mcq-2.png",
    options: [
      "../assets/images/mcq2-1.png|Take rest",
      "../assets/images/mcq2-2.png|Sleep",
      "../assets/images/mcq2-3.png|Build more houses",
      "../assets/images/mcq2-4.png|Sell a house",
    ],
    a: 0,
  },

  {
    q: "Q3. The mason finished building the last house in ______ months.",
    img: "../assets/images/mcq-3.png",
    options: [
      "../assets/images/mcq3-1.png|Seven",
      "../assets/images/mcq3-2.png|Eight",
      "../assets/images/mcq3-3.png|Six",
      "../assets/images/mcq3-4.png|Nine",
    ],
    a: 2,
  },

  {
    q: "Q4. The mason built the last house ______.",
    img: "../assets/images/mcq-4.png",
    options: [
      "../assets/images/mcq4-1.png|Carelessly",
      "../assets/images/mcq4-2.png|Perfectly",
      "../assets/images/mcq4-3.png|Quickly",
      "../assets/images/mcq4-4.png|Slowly",
    ],
    a: 0,
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
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    scalar: 0.8
  });
}

function loadQuestion() {

  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";

  // Reset layout
  optEl.style.display = "grid";
  optEl.style.gridTemplateColumns = "1fr 1fr";
  optEl.style.justifyItems = "stretch";
  optEl.style.alignItems = "stretch";

  const selectedAnswer = answered[current];

  // If already answered, show only the correct option
  if (selectedAnswer !== null && selectedAnswer !== undefined) {

    optEl.style.gridTemplateColumns = "1fr";
    optEl.style.justifyItems = "center";
    optEl.style.alignItems = "center";

    const correctIndex = q.a;
    const t = q.options[correctIndex];

    const d = document.createElement("div");
    d.className = "option o" + ((correctIndex % 4) + 1);

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `
      <div class="option-img">
        <img src="${img}">
      </div>
      ${text}
    `;

    d.classList.add("correct", "centered");
    optEl.appendChild(d);

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === quizData.length - 1;

    return;
  }

  // New unanswered question
  nextBtn.disabled = true;

  q.options.forEach((t, i) => {

    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `
      <div class="option-img">
        <img src="${img}">
      </div>
      ${text}
    `;

    d.onclick = () => {

      if (answered[current] !== null) return;

      if (i === q.a) {

        answered[current] = i;
        score++;

        [...optEl.children].forEach(option => {
          if (option !== d) {
            option.classList.add("hidden");
          }
        });

        d.classList.add("correct", "centered");

        optEl.style.gridTemplateColumns = "1fr";
        optEl.style.justifyItems = "center";
        optEl.style.alignItems = "center";

        smallConfetti();
        speak("Correct");
        showPopup(true);

        // Enable Next after correct answer
        if (current < quizData.length - 1) {
          nextBtn.disabled = false;
        }

        if (answered.every(a => a !== null)) {
          setTimeout(showFinal, 1600);
        }

      } else {

        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 600);

        speak("try again");
        showPopup(false);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
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
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲";
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
  
  // Big confetti celebration
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 300);
}

loadQuestion();