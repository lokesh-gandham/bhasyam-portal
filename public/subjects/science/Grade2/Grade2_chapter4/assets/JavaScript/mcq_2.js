const quizData = [
  {
    q: "Q1. _____ are living things.",
    img: "../assets/images/need_water_food.png",
    options: [
      { t: "Animals", img: "../assets/images/lion.png" },
      { t: "Books", img: "../assets/images/book.png" },
      { t: "Cars", img: "../assets/images/car.png" },
      { t: "Pens", img: "../assets/images/pen.png" }
    ],
    a: 0
  },
  {
    q: "Q2. Things made by man are known as ____.",
    img: "../assets/images/boy.png",
    options: [
      { t: "Living things", img: "../assets/images/lion.png" },
      { t: "natural things", img: "../assets/images/mcq4-3.png" },
      { t: "man-made things", img: "../assets/images/pen.png" },
      { t: "natural non-living things", img: "../assets/images/mcq2-4.png" }
    ],
    a: 2
  },
  {
    q: "Q3. ___ do not have life.",
    img: "../assets/images/mcq2-4.png",
    options: [
      { t: "Clouds", img: "../assets/images/clouds.png" },
      { t: "Birds", img: "../assets/images/bird.png" },
      { t: "Trees", img: "../assets/images/plant.png" },
      { t: "Animals", img: "../assets/images/lion.png" }
    ],
    a: 0
  },
  {
    q: "Q4. Birds and insects _____.",
    img: "../assets/images/mcq-4.png",
    options: [
      { t: "Don't lay eggs", img: "../assets/images/mcq4-1.png" },
      { t: "lay eggs", img: "../assets/images/mcq4-2.png" },
      { t: "Give birth to babies", img: "../assets/images/mcq4-3.png" },
      { t: "Do not have life", img: "../assets/images/mcq-5.png" }
    ],
    a: 1
  },
  {
    q: "Q5. ___ do not move from one place to another.",
    img: "../assets/images/mcq2-4.png",
    options: [
      { t: "Human beings", img: "../assets/images/boy.png" },
      { t: "Plants", img: "../assets/images/plant.png" },
      { t: "Animals", img: "../assets/images/lion.png" },
      { t: "Birds", img: "../assets/images/bird.png" }
    ],
    a: 1
  }
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const questionImg = document.getElementById("questionImg");
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

function loadQuestion() {
  const q = quizData[current];
  questionEl.textContent = q.q;
  questionImg.src = q.img;
  optionsEl.innerHTML = "";

  q.options.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "option";
    // div.innerHTML = `<span>${o.t}</span>`;
div.innerHTML = `
  <div class="option-content">
    <img src="${o.img}" class="option-img">
    <span>${o.t}</span>
  </div>
`;
    
    if (answered[current] !== null) {
      if (i === q.a) {
        div.classList.add("correct");
      } else {
        div.classList.add("disabled");
      }
    }

div.onclick = () => {

  // ?? if already answered correctly ? do nothing
  if (answered[current] !== null) return;

  if (i === q.a) {
    answered[current] = i;
    score++;

    speak("Correct");
    confetti()
    showPopup(true);

    div.classList.add("correct");

    // ?? disable ALL options after correct
   // ?? disable ALL options after correct
[...optionsEl.children].forEach(el => {
  el.style.pointerEvents = "none";
  if (!el.classList.contains("correct")) {
    el.classList.add("disabled");
  }
});
    nextBtn.disabled = false;

    // final popup
    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1200);
    }

  } else {
    speak("Wrong");
    showPopup(false);
  }
};

    optionsEl.appendChild(div);
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

function fireBigConfetti() {
  const duration = 1500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  const stars = document.getElementById("popupStars");

  popup.style.display = "flex";

  if (isCorrect) {
    popup.classList.add("correct");
    popup.classList.remove("wrong");

    icon.textContent = "🎉😊";
    title.textContent = "CORRECT!";
    msg.textContent = "Awesome! Moving to next...";
    
    stars.textContent = "⭐ ⭐ ⭐";
    stars.style.display = "block";

  } else {
    popup.classList.add("wrong");
    popup.classList.remove("correct");

    icon.textContent = "🥲💭";
    title.textContent = "OOPS!";
    msg.textContent = "Try again";

    stars.style.display = "none";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireBigConfetti();
}

// function nextSection() {
 
//   document.getElementById("finalPopup").style.display = "none";

  
//   const frame = window.parent.document.querySelector("iframe[name='quiz-frame']");

  
//   frame.src = "exercises/fillblanks.html";

  
//   const links = window.parent.document.querySelectorAll(".sidebar a");
//   links.forEach(l => l.classList.remove("active"));
//   if (links[1]) links[1].classList.add("active");
// }
function nextSection() {
   document.getElementById("finalPopup").style.display = "none";

  // Works BOTH on server and file:// protocol
 window.parent.postMessage({ action: "nextSection", target: "fillblanks.html" }, "*");

  try {
    const parentDoc = window.parent.document;
    const frame = parentDoc.querySelector("iframe[name='quiz-frame']");

    if (frame) {
      frame.src = "exercises/matching.html";
      const links = parentDoc.querySelectorAll(".sidebar a");
      links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href")?.includes("fillblanks.html")) {
          link.classList.add("active");
        }
      });
    }

  } catch (e) {
    // file:// fallback � store target and reload parent
    sessionStorage.setItem("activeSection", "fillblanks.html");
    window.location.href = "../Grade2_lesson4.html";  // ? go to parent
  }
}


function restart() {
  current = 0;
  score = 0;
  answered = Array(quizData.length).fill(null);

  document.getElementById("finalPopup").style.display = "none";

  loadQuestion();
}


loadQuestion();