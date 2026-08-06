// const quiz = [
//   {
//     q: "Q1. Select organs of the Respiratory system",
//     options: [
//       { img: "../assets/images/nose.png", text: "Nose", correct: true },
//       { img: "../assets/images/lungs.png", text: "Lungs", correct: true },
//       { img: "../assets/images/heart.png", text: "Heart", correct: false },
//     ],
//   },
//   {
//     q: "Q2. Select organs of the Digestive system",
//     options: [
//       { img: "../assets/images/mouth.png", text: "Mouth", correct: true },
//       { img: "../assets/images/stomach.png", text: "Stomach", correct: true },
//       { img: "../assets/images/brain.png", text: "Brain", correct: false },
//     ],
//   },
//   {
//     q: "Q3. Select organs of the Circulatory system",
//     options: [
//       { img: "../assets/images/heart.png", text: "Heart", correct: true },
//       { img: "../assets/images/blood-vessels.png", text: "Blood Vessels", correct: true },
//       { img: "../assets/images/lungs.png", text: "Lungs", correct: false },
//     ],
//   },
//   {
//     q: "Q4. Select organs of the Nervous system",
//     options: [
//       { img: "../assets/images/brain.png", text: "Brain", correct: true },
//       { img: "../assets/images/spinal-cord.png", text: "Spinal Cord", correct: true },
//       { img: "../assets/images/kidneys.png", text: "Kidneys", correct: false },
//     ],
//   },
//   {
//     q: "Q5. Select organs of the Excretory system",
//     options: [
//       { img: "../assets/images/kidneys.png", text: "Kidneys", correct: true },
//       { img: "../assets/images/excretory.png", text: "Urinary Bladder", correct: true },
//       { img: "../assets/images/stomach.png", text: "Stomach", correct: false },
//     ],
//   },
// ];

// let current = 0;
// let score = 0;
// let selectedAnswers = [];
// let answers = new Array(quiz.length).fill().map(() => []);

// const qEl = document.getElementById("question");
// // const img1 = document.getElementById("img1");
// // const img2 = document.getElementById("img2");
// // const t1 = document.getElementById("text1");
// // const t2 = document.getElementById("text2");

// // const box1 = document.getElementById("box1");
// // const box2 = document.getElementById("box2");

// // const inputContainer = document.querySelector(".input-container");
// // const input = document.getElementById("answerInput");
// // const submit = document.getElementById("submitBtn");

// const prev = document.getElementById("prevBtn");
// const next = document.getElementById("nextBtn");

// function speak(t) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(t);
//   msg.lang = "en-UK";
//   msg.volume = 0.25;
//   msg.rate = 1;
//   msg.pitch = 1;
//   speechSynthesis.speak(msg);
// }

// function smallConfetti() {
//   confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
// }

// function bigConfetti() {
//   confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
// }

// function load() {
//   const q = quiz[current];
//   qEl.textContent = q.q;

//   const optionsContainer = document.getElementById("options");
//   optionsContainer.innerHTML = "";

//   selectedAnswers = [];

//   q.options.forEach((opt) => {
//     const div = document.createElement("div");
//     div.className = "option";

//     div.innerHTML = `
//       <img src="${opt.img}" class="option-img"/>
//       <span>${opt.text}</span>
//     `;

//     // ?? if already answered ? show state
//     if (answers[current].length > 0) {

//       if (opt.correct) {
//         div.classList.add("correct");
//       }

//       div.style.pointerEvents = "none"; // disable clicking
//       next.disabled = false;

//     } else {
//       div.onclick = () => handleSelect(div, opt);
//     }

//     optionsContainer.appendChild(div);
//   });

//   prev.disabled = current === 0;

//   // if not answered ? disable next
//   if (answers[current].length < 2) {
//     next.disabled = true;
//   }
// }

// // input.addEventListener("input", () => {
// //   submit.disabled = !input.value.trim();
// // });

// // input.addEventListener("dragover", (e) => {
// //   e.preventDefault();
// // });

// // input.addEventListener("drop", (e) => {
// //   e.preventDefault();
// // });
// document.addEventListener("dragover", (e) => e.preventDefault());
// document.addEventListener("drop", (e) => e.preventDefault());

// // submit.onclick = function () {
// //   const user = input.value.trim().toLowerCase();
// //   const q = quiz[current];
// //   const correct = q.a;

// //   if (user === correct) {
// //     answers[current] = user;
// //     score++;

// //     inputContainer.classList.add("correct");
// //     input.disabled = true;
// //     submit.disabled = true;

// //     if (correct === q.t1.toLowerCase()) {
// //       box1.classList.add("correct");
// //       box2.classList.add("wrong");
// //     } else {
// //       box2.classList.add("correct");
// //       box1.classList.add("wrong");
// //     }

// //     speak("Correct");
// //     smallConfetti();
// //     showPopup(true);

// //     next.disabled = false;

// //     if (answers.every((a) => a !== null)) setTimeout(showFinal, 1600);
// //   } else {
// //     speak("Wrong");
// //     showPopup(false);

// //     input.value = "";
// //     submit.disabled = true;
// //   }
// // };

// function handleSelect(el, option) {
//   if (answers[current].length === 2) return; // already answered

//   if (el.classList.contains("selected")) return;

//   el.classList.add("selected");

//   if (option.correct) {
//     el.classList.add("correct");
//     answers[current].push(option.text);

//     speak("Correct");

//     if (answers[current].length === 2) {
//       score++;

//       smallConfetti();
//       showPopup(true);

//       next.disabled = false;

//       // disable all clicks
//       document.querySelectorAll(".option").forEach(opt => {
//         opt.style.pointerEvents = "none";
//       });

//       if (current === quiz.length - 1) {
//         setTimeout(showFinal, 1500);
//       }
//     }

//   } else {
//     el.classList.add("wrong");

//     speak("Wrong");
//     showPopup(false);
//   }
// }

// prev.onclick = () => {
//   current--;
//   load();
// };
// next.onclick = () => {
//   current++;
//   load();
// };
// function showPopup(isCorrect) {
//   const popup = document.getElementById("answerPopup");
//   const icon = document.getElementById("popupIcon");
//   const title = document.getElementById("popupTitle");
//   const msg = document.getElementById("popupMsg");

//   popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
//   popup.style.display = "flex";

//   if (isCorrect) {
//     icon.textContent = "🎉😊";
//     title.textContent = "Great Job!";
//     msg.textContent = "You got it right!";
//   } else {
//     icon.textContent = "🥲💭";
//     title.textContent = "Oops!";
//     msg.textContent = "Try again, you can do it!";
//   }

//   setTimeout(() => {
//     popup.style.display = "none";
//   }, 1400);
// }

// function showFinal() {
//   const popup = document.getElementById("finalPopup");
//   document.getElementById("finalScore").textContent =
//     `Your Score: ${score} / ${quiz.length}`;
//   document.getElementById("stars").textContent = "⭐".repeat(score);
//   popup.style.display = "flex";
//   bigConfetti();
// }

// load();




const quiz = [
  {
    q: "Q1. Select organs of the Respiratory system",
    options: [
      { img: "../assets/images/nose.png", text: "Nose", correct: true },
      { img: "../assets/images/Lungs.png", text: "Lungs", correct: true },
      { img: "../assets/images/heart.png", text: "Heart", correct: false },
    ],
  },
  {
    q: "Q2. Select organs of the Digestive system",
    options: [
      { img: "../assets/images/mouth.png", text: "Mouth", correct: true },
      { img: "../assets/images/stomach.png", text: "Stomach", correct: true },
      { img: "../assets/images/brain.png", text: "Brain", correct: false },
    ],
  },
  {
    q: "Q3. Select organs of the Circulatory system",
    options: [
      { img: "../assets/images/heart.png", text: "Heart", correct: true },
      { img: "../assets/images/blood-vessels.png", text: "Blood Vessels", correct: true },
      { img: "../assets/images/Lungs.png", text: "Lungs", correct: false },
    ],
  },
  {
    q: "Q4. Select organs of the Nervous system",
    options: [
      { img: "../assets/images/brain.png", text: "Brain", correct: true },
      { img: "../assets/images/spinal-cord.png", text: "Spinal Cord", correct: true },
      { img: "../assets/images/kidneys.png", text: "Kidneys", correct: false },
    ],
  },
  {
    q: "Q5. Select organs of the Excretory system",
    options: [
      { img: "../assets/images/kidneys.png", text: "Kidneys", correct: true },
      { img: "../assets/images/excretory.png", text: "Urinary Bladder", correct: true },
      { img: "../assets/images/stomach.png", text: "Stomach", correct: false },
    ],
  },
];

let current = 0;
let score = 0;
let selectedAnswers = [];
let answers = new Array(quiz.length).fill().map(() => []);

const qEl = document.getElementById("question");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

// Function to show floating thumbs up emojis from a specific element
function showThumbsUpFromElement(element, count = 3) {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < count; i++) {
    const thumbsEmoji = document.createElement("div");
    thumbsEmoji.textContent = "👍";
    thumbsEmoji.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${Math.floor(Math.random() * 20) + 25}px;
      z-index: 10000;
      pointer-events: none;
      opacity: 1;
      transform: translate(-50%, -50%);
      animation: floatUpThumbs ${Math.random() * 1 + 1.5}s ease-out forwards;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    `;
    
    document.body.appendChild(thumbsEmoji);
    
    setTimeout(() => {
      if (thumbsEmoji && thumbsEmoji.remove) thumbsEmoji.remove();
    }, 2500);
  }
}

// Add CSS animation for floating thumbs
const style = document.createElement("style");
style.textContent = `
  @keyframes floatUpThumbs {
    0% {
      transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
      opacity: 1;
    }
    30% {
      transform: translate(-50%, -80px) scale(1.2) rotate(15deg);
      opacity: 1;
    }
    60% {
      transform: translate(-50%, -160px) scale(1) rotate(-10deg);
      opacity: 0.9;
    }
    100% {
      transform: translate(-50%, -250px) scale(0.8) rotate(20deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

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

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  selectedAnswers = [];

  q.options.forEach((opt, index) => {
    const div = document.createElement("div");
    div.className = "option";
    div.setAttribute("data-option-index", index);
    div.setAttribute("data-correct", opt.correct);

    div.innerHTML = `
      <img src="${opt.img}" class="option-img"/>
      <span>${opt.text}</span>
    `;

    // if already answered ? show state
    if (answers[current].length > 0) {
      if (opt.correct) {
        div.classList.add("correct");
      }
      div.style.pointerEvents = "none";
      next.disabled = false;
    } else {
      div.onclick = () => handleSelect(div, opt);
    }

    optionsContainer.appendChild(div);
  });

  prev.disabled = current === 0;

  if (answers[current].length < 2) {
    next.disabled = true;
  }
}

document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

function handleSelect(el, option) {
  if (answers[current].length === 2) return;
  if (el.classList.contains("selected")) return;

  el.classList.add("selected");

  if (option.correct) {
    el.classList.add("correct");
    answers[current].push(option.text);
    
    // Show thumbs up emojis from the clicked correct option
    showThumbsUpFromElement(el, 5);
    
    speak("Correct");

    if (answers[current].length === 2) {
      score++;
      smallConfetti();
      showPopup(true);

      next.disabled = false;

      // disable all clicks
      document.querySelectorAll(".option").forEach(opt => {
        opt.style.pointerEvents = "none";
      });

      if (current === quiz.length - 1) {
        setTimeout(showFinal, 1500);
      }
    }

  } else {
    el.classList.add("wrong");
    speak("Wrong");
    showPopup(false);
    
    // Show sad face animation for wrong answer
    showWrongFeedback(el);
  }
}

// Show sad feedback for wrong answer
function showWrongFeedback(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const sadEmoji = document.createElement("div");
  sadEmoji.textContent = "😢";
  sadEmoji.style.cssText = `
    position: fixed;
    left: ${centerX}px;
    top: ${centerY}px;
    font-size: 30px;
    z-index: 10000;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: shakeWrong 0.5s ease-out forwards;
  `;
  
  document.body.appendChild(sadEmoji);
  
  setTimeout(() => {
    if (sadEmoji && sadEmoji.remove) sadEmoji.remove();
  }, 800);
}

// Add shake animation for wrong answers
const wrongStyle = document.createElement("style");
wrongStyle.textContent = `
  @keyframes shakeWrong {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
    20% { transform: translate(-60%, -50%) scale(1.2); }
    40% { transform: translate(-40%, -50%) scale(1.2); }
    60% { transform: translate(-60%, -50%) scale(1.2); }
    80% { transform: translate(-40%, -50%) scale(1.2); }
    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(wrongStyle);

prev.onclick = () => {
  current--;
  load();
};

next.onclick = () => {
  current++;
  load();
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
    `Your Score: ${score} / ${quiz.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

load();
