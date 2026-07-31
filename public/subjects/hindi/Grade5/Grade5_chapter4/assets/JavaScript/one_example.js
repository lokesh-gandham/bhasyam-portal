const quiz = [
  {
    q: "Q1. Components of air",
    img1: "../assets/images/stone_wood.png",
    t2: "Nitrogen & Oxygen",
    img2: "../assets/images/nitrogen-oxygen.png",
    t1: "Stone & Wood",
    a: "Nitrogen & Oxygen"
  },
  {
    q: "Q2. Forms of air",
    img1: "../assets/images/wind_storm.png",
    t1: "Wind & Storm",
    img2: "../assets/images/table_chair.png",
    t2: "Table & Chair",
    a: "Wind & Storm"
  },
  {
    q: "Q3. Uses of air",
    img1: "../assets/images/breathing_fire.png",
    t1: "Breathing & Burning",
    img2: "../assets/images/rock_soil.png",
    t2: "Rock & Soil",
    a: "Breathing & Burning",
  },
  {
    q: "Q4. Sources of water",
    img1: "../assets/images/rain_pond.png",
    t2: "Rain & Pond",
    img2: "../assets/images/fire_sand.png",
    t1: "Fire & Sand",
    a: "Rain & Pond",
  },
  {
    q: "Q5. Living things need air",
    img1: "../assets/images/human_animal.png",
    t1: "Human & Animal",
    img2: "../assets/images/car_robot.png",
    t2: "Car & Robot",
    a: "Human & Animal",
  }
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

function load() {
  const q = quiz[current];
  qEl.textContent = q.q;
  img1.src = q.img1;
  img2.src = q.img2;
  t1.textContent = q.t1;
  t2.textContent = q.t2;
  
  // Reset both boxes to be visible every time you load a question
  box1.style.display = "flex";  // or "block" depending on your CSS
  box2.style.display = "flex";
  box1.style.visibility = "visible";
  box2.style.visibility = "visible";
  
  box1.classList.remove("correct", "wrong");
  box2.classList.remove("correct", "wrong");
  
  prev.disabled = current === 0;
  next.disabled = answers[current] === null;
  
  // If this question was already answered, show the correct answer and hide wrong one
  if (answers[current] !== null) {
    const correctAnswer = q.a;
    if (correctAnswer === q.t1) {
      box1.classList.add("correct");
      box2.style.display = "none";  // Hide wrong option
      box2.style.visibility = "hidden";
    } else {
      box2.classList.add("correct");
      box1.style.display = "none";  // Hide wrong option
      box1.style.visibility = "hidden";
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
  bigConfetti();
}

function choose(choice) {
  if (answers[current] !== null) return;
  const q = quiz[current];
  let selected = choice === 1 ? q.t1 : q.t2;
  
  if (selected === q.a) {
    answers[current] = selected;
    score++;
    
    if (choice === 1) {
      box1.classList.add("correct");
      box2.style.display = "none";  // Remove/hide wrong option immediately
      box2.style.visibility = "hidden";
    } else {
      box2.classList.add("correct");
      box1.style.display = "none";  // Remove/hide wrong option immediately
      box1.style.visibility = "hidden";
    }
    
    speak("Correct");
    smallConfetti();
    showPopup(true);
    next.disabled = false;
    if (answers.every((a) => a !== null)) setTimeout(showFinal, 1600);
  } else {
    if (choice === 1) {
      blinkWrong(box1);
    } else {
      blinkWrong(box2);
    }
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