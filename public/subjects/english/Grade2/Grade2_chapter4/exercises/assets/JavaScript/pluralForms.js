const quizData = [
  {
    q: "One Elf → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p1.png",
    options: [
      "../assets/images/elf.png|elfes",
      "../assets/images/elf.png|elves",
      "../assets/images/elf.png|elfs",
      "../assets/images/elf.png|elfies",
    ],
    a: 1,
  },

  {
    q: "One Leaf → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p2.png",
    options: [
      "../assets/images/leaf.png|leaves",
      "../assets/images/leaf.png|leafs",
      "../assets/images/leaf.png|leafes",
      "../assets/images/leaf.png|leafies",
    ],
    a: 0,
  },

  {
    q: "One Wolf → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p3.png",
    options: [
      "../assets/images/wolf.png|wolfes",
      "../assets/images/wolf.png|wolves",
      "../assets/images/wolf.png|wolfs",
      "../assets/images/wolf.png|wolfies",
    ],
    a: 1,
  },
  {
    q: "One Thief → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p4.png",
    options: [
      "../assets/images/thief.png|thiefs",
      "../assets/images/thief.png|thieves",
      "../assets/images/thief.png|thiefes",
      "../assets/images/thief.png|thievs",
    ],
    a: 1,
  },
  {
    q: "One Shelf → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p5.png",
    options: [
      "../assets/images/shelf.png|shelfs",
      "../assets/images/shelf.png|shelves",
      "../assets/images/shelf.png|shelfes",
      "../assets/images/shelf.png|shelvies",
    ],
    a: 1,
  },

  {
    q: "One Knife → Many",
    backQ: "Many ___?",
    title: "Write the plural forms of the following words.",
    desc: "Most of the singular words ending in 'f' or 'fe' form their plurals by replacing 'f' or 'fe' with 'ves'.",
    img: "../assets/images/p6.png",
    options: [
      "../assets/images/chaku.png|knifes",
      "../assets/images/chaku.png|knives",
      "../assets/images/chaku.png|knifees",
      "../assets/images/chaku.png|knifves",
    ],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qNumFront = document.getElementById("qNumFront");
const qTextFront = document.getElementById("qTextFront");
const qNumBack = document.getElementById("qNumBack");
const qTextBack = document.getElementById("qTextBack");

const frontImgEl = document.getElementById("frontImg");
const backImgEl = document.getElementById("backImg");

const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flipBtn = document.getElementById("flipBtn");
const flipCard = document.getElementById("flipCard");

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

function stripNumber(text) {
  return text.replace(/^Q\d+\.\s*/, "");
}

function loadQuestion() {
  const q = quizData[current];
  const frontText = q.q;
  const backText = q.backQ || q.q;

  qTextFront.textContent = frontText;
  qTextBack.textContent = backText;

  frontImgEl.src = q.img;
  // Back card shows the concept image shared across this question's options
  backImgEl.src = q.options[0].split("|")[0];

  // Always land on the question (front) side when navigating
  flipCard.classList.remove("flipped");

  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;
  prevBtn.disabled = current === 0;

  q.options.forEach((t, i) => {
    const text = t.split("|")[1];

    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);
    d.innerHTML = `<span class="option-text">${text}</span>`;

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
}

flipBtn.onclick = () => {
  flipCard.classList.toggle("flipped");
};

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
  bigConfetti();
}

loadQuestion();