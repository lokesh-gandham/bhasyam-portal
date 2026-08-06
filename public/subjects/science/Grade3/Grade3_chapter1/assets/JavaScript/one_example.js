const quizData = [
  {
    q: "Q1. Animals that lay eggs",
    img: "../assets/images/OE-1.png",
    options: [
      {
        img: "../assets/images/frog-turtle.png",
        text: "Frog, Turtle",
      },
      {
        img: "../assets/images/dog-goat.png",
        text: "Dog, Goat",
      },
    ],
    a: 0,
  },

  {
    q: "Q2. Animals that breathe through gills",
    img: "../assets/images/OE-2.png",
    options: [
      {
        img: "../assets/images/cow-dog.png",
        text: "Cow, Dog",
      },
      {
        img: "../assets/images/of.png",
        text: "Fish, Octopus",
      },
    ],
    a: 1,
  },

  {
    q: "Q3. Animals that move using their limbs",
    img: "../assets/images/OE-3.png",
    options: [
      {
        img: "../assets/images/dog-goat.png",
        text: "Dog, Goat",
      },
      {
        img: "../assets/images/fish-snake.png",
        text: "Fish, Snake",
      },
    ],
    a: 0,
  },

  {
    q: "Q4. Animals that eat only plants",
    img: "../assets/images/OE-4.png",
    options: [
      {
        img: "../assets/images/lion-tiger.png",
        text: "Lion, Tiger",
      },
      {
        img: "../assets/images/cow-goat.png",
        text: "Cow, Goat",
      },
      
    ],
    a: 1,
  },

  {
    q: "Q5. Animals that breathe through their moist skin when in water",
    img: "../assets/images/OE-5.png",
    options: [
      {
        img: "../assets/images/frog-newt.png",
        text: "Frog, Newt",
      },
      {
        img: "../assets/images/dog-cat.png",
        text: "Dog, Cat",
      },
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

  q.options.forEach((opt, i) => {
    const d = document.createElement("div");
    d.className = "option";

    d.innerHTML = `<img src="${opt.img}"><div>${opt.text}</div>`;

    /* RESTORE PREVIOUS ANSWER STATE */

    if (answered[current] !== null) {
      if (i === q.a) {
        d.classList.add("correct");
      } else {
        d.classList.add("hide");
      }

      d.style.pointerEvents = "none";
      d.style.transform = "translateX(0)";
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");

        [...optEl.children].forEach((o) => {
          o.style.pointerEvents = "none";

          if (o !== d) {
            o.classList.add("hide");
          }

          o.style.transform = "translateX(0)";
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = false;

        setTimeout(() => {
          if (current === quizData.length - 1) {
            nextBtn.disabled = true;
            showFinal();
          } else {
            nextBtn.disabled = false;
          }
        }, 1600);
      } else {
        d.classList.add("wrong-blink");
        setTimeout(() => {
          d.classList.remove("wrong-blink");
        }, 600);

        speak("Wrong");
        showPopup(false);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = answered[current] === null;
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
