const quiz = [
  {
    q: "Q1. Give one example of a cereal",
    img1: "../assets/images/vegetable.png",
    t1: "Vegetables",
    img2: "../assets/images/CerealEx.png",
    t2: "Rice",
    a: "rice",
  },

  {
    q: "Q2. Give one example of a fruit",
    img1: "../assets/images/apple.png",
    t1: "Apple",
    img2: "../assets/images/bread.png",
    t2: "Bread",
    a: "apple",
  },

  {
    q: "Q3. Give one example of a junk food",
    img1: "../assets/images/salad.png",
    t1: "Salad",
    img2: "../assets/images/pizza.png",
    t2: "Pizza",
    a: "pizza",
  },

  {
    q: "Q4. Give one example of a healthy food",
    img1: "../assets/images/ice-cream.png",
    t1: "Ice cream",
    img2: "../assets/images/MilkG.png",
    t2: "Milk",
    a: "milk",
  },

  {
    q: "Q5. Give one example of an animal product",
    img1: "../assets/images/cheese.png",
    t1: "Cheese",
    img2: "../assets/images/oe-fruit.png",
    t2: "Fruits",
    a: "cheese",
  },
];

let current = 0;
let score = 0;
let answers = new Array(quiz.length).fill(null);

const qEl = document.getElementById("question");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const t1 = document.getElementById("text1");
const t2 = document.getElementById("text2");
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function load() {
  const q = quiz[current];
  qEl.textContent = q.q;
  img1.src = q.img1;
  img2.src = q.img2;
  t1.textContent = q.t1;
  t2.textContent = q.t2;
  box1.classList.remove("correct", "wrong");
  box2.classList.remove("correct", "wrong");
  prev.disabled = current === 0;
  next.disabled = answers[current] === null;
  if (answers[current] !== null) {
    const correct = q.a;
    if (correct === q.t1.toLowerCase()) {
      box1.classList.add("correct");
      box2.classList.add("wrong");
    } else {
      box2.classList.add("correct");
      box1.classList.add("wrong");
    }
  }
}

function blinkWrong(box) {
  box.classList.add("wrongBlink");
  setTimeout(() => {
    box.classList.remove("wrongBlink");
  }, 350);
}

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
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quiz.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
  fireConfettif();
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function choose(choice) {
  if (answers[current] !== null) return;
  const q = quiz[current];
  let selected = choice === 1 ? q.t1.toLowerCase() : q.t2.toLowerCase();
  if (selected === q.a) {
    answers[current] = selected;
    score++;
    if (choice === 1) {
      box1.classList.add("correct");
      box2.classList.add("wrong");
    } else {
      box2.classList.add("correct");
      box1.classList.add("wrong");
    }
    speak("Correct");
    showPopup(true);
    fireConfetti();
    next.disabled = false;
    if (answers.every((a) => a !== null)) setTimeout(showFinal, 1600);
  } else {
    const box = choice === 1 ? box1 : box2;

    box.classList.add("temp-wrong");

    setTimeout(() => {
      box.classList.remove("temp-wrong");
    }, 500);

    speak("Wrong");
    showPopup(false);
  }
}

box1.onclick = () => choose(1);
box2.onclick = () => choose(2);
prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
};
load();
