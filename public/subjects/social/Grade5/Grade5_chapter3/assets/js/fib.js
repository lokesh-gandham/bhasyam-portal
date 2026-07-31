const questions = [
  {
    q: "Q1. Deserts receive ________ rainfall every year.",
    a: "Scanty",
    img: "../images/desert.png",
  },
  {
    q: "Q2. The ________ of cacti help it to prevent loss of water.",
    a: "Thorns",
    img: "../images/MCQ-1.png",
  },
  {
    q: "Q3. Mining is one of the chief ________ of the people in desert regions.",
    a: "Occupations",
    img: "../images/miner.png",
  },
  {
    q: "Q4. People in Ladakh generally prefer to stay in the ________ as they feel warmer there.",
    a: "Ground floor",
    img: "../images/ladhak.png",
  },
  {
    q: "Q5. Almost 75% of the ________ in the world are from desert regions.",
    a: "Oil reserves",
    img: "../images/Arabian-Desert.png",
  },
];

document.addEventListener("dragover", function (e) {
    e.preventDefault();
});

document.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
});

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    scalar: 1
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.5 },
      scalar: 0.8
    });
  }, 180);
}

let index = 0;
let score = 0;
const answers = Array(5).fill(null);

const qText = document.getElementById("qText");
const qImage = document.getElementById("qImage");
const input = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
function formatAnswer(text) {
    text = text.trimStart();
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
// function playFeedback(isCorrect) {
//   if (!window.speechSynthesis) return;
//   window.speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(
//     isCorrect ? "Correct!" : "Try again"
//   );
//   msg.lang = "en-US";
//   msg.rate = 1;
//   msg.pitch = isCorrect ? 1.2 : 0.9;
//   window.speechSynthesis.speak(msg);
// }

speechSynthesis.getVoices();
speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};
    function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-US";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }
function loadQuestion() {
  const q = questions[index];
  document.getElementById("qText").textContent = q.q;
  qImage.src = q.img;
  
  const qText = document.getElementById("qText");
  qText.textContent = q.q;
  qText.style.textAlign = (index === 0 || index === 1) ? "center" : "left";
  
  input.value = answers[index] ? formatAnswer(answers[index]) : "";
  input.disabled = !!answers[index];
  checkBtn.disabled = !!answers[index] || !input.value.trim();
  nextBtn.disabled = !answers[index];
  prevBtn.disabled = index === 0;

  document.querySelector(".input-row").classList.remove("correct");
  if (answers[index]) {
    document.querySelector(".input-row").classList.add("correct");
  }
}

input.oninput = () => {
    if (answers[index]) return;

    const pos = input.selectionStart;

    if (input.value.length > 0) {
        input.value =
            input.value.charAt(0).toUpperCase() +
            input.value.slice(1).toLowerCase();
    }

    input.setSelectionRange(pos, pos);
    checkBtn.disabled = !input.value.trim();
};

checkBtn.onclick = () => {
const user = input.value.trim().toLowerCase();
  const correct = questions[index].a.toLowerCase();

  if (user === correct) {
    fireConfetti();
answers[index] =
    questions[index].a.charAt(0).toUpperCase() +
    questions[index].a.slice(1).toLowerCase();
    score++;
   speak("Correct");
    showPopup(true);
   input.value = answers[index];
input.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    document.querySelector(".input-row").classList.add("correct");

    if (index === 4) setTimeout(showFinal, 1600);
  } else {
   speak("Try again");
    showPopup(false);
    input.value = "";
  }
};

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};

nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

// =============================================
// FINAL POPUP - SAME AS MCQ QUIZ
// =============================================
function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `You scored ${score} out of ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

loadQuestion();