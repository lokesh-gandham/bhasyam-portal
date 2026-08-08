function shouldSkipFinalCorrectPopup() {
  try {
    if (typeof answered !== "undefined" && Array.isArray(answered) && answered.length && answered.every(a => a !== null && a !== false)) return true;
    if (typeof answeredQuestions !== "undefined" && Array.isArray(answeredQuestions) && answeredQuestions.length && answeredQuestions.every(Boolean)) return true;
    const leftItems = [...document.querySelectorAll(".left-item")];
    if (leftItems.length && leftItems.every(item => item.classList.contains("matched"))) return true;
    const meanSlots = [...document.querySelectorAll(".mean-slot")];
    if (meanSlots.length && meanSlots.every(slot => slot.classList.contains("correct") || slot.classList.contains("filled"))) return true;
    const droppedWords = [...document.querySelectorAll(".dropped-word")];
    if (droppedWords.length && droppedWords.every(word => word.classList.contains("correct"))) return true;
  } catch (error) {}
  return false;
}
const quizData = [
  {
    q: "Q1. What is the plural of parent?",
    img: "../assets/images/parent-removebg-preview.png",
    options: ["|parents", "|parentes", "|parenties", "|parent"],
    a: 0,
  },
  {
    q: "Q2. What is the plural of boy?",
    img: "../assets/images/boycart-removebg-preview.png",
    options: ["|boy", "|boys", "|boyes", "|boyies"],
    a: 1,
  },
  {
    q: "Q3. What is the plural of face?",
    img: "../assets/images/face-removebg-preview.png",
    options: ["|faces", "|face", "|facees", "|faceies"],
    a: 0,
  },
  {
    q: "Q4. What is the plural of slab?",
    img: "../assets/images/slab-removebg-preview.png",
    options: ["|slab", "|slabs", "|slabes", "|slabies"],
    a: 1,
  },
  {
    q: "Q5. What is the plural of table?",
    img: "../assets/images/table-removebg-preview.png",
    options: ["|table", "|tables", "|tablees", "|tableies"],
    a: 1,
  },
  {
    q: "Q6. What is the plural of letter?",
    img: "../assets/images/letter-removebg-preview.png",
    options: ["|letter", "|letters", "|letteres", "|letteries"],
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

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.volume = 1;
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
  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = "block";
    imgEl.parentElement.style.display = "flex";
  } else {
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
    imgEl.parentElement.style.display = "none";
  }
  optEl.innerHTML = "";
  nextBtn.disabled = current === quizData.length - 1 || answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);

    const parts = t.split("|");
    const img = parts[0];
    const text = parts[1] || parts[0];
    const isImage = img && (img.includes("/") || img.includes("."));
    const displayText = text.charAt(0).toUpperCase() + text.slice(1);

    if (isImage) {
      d.innerHTML = `<span>${displayText}</span>`;
    } else {
      d.innerHTML = `<span>${displayText}</span>`;
    }

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
        nextBtn.disabled = current === quizData.length - 1;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1700);
      } else {
        speak("Try again");
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
  if (current >= quizData.length - 1) return;
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
  icon.innerHTML = isCorrect ? "&#10003;" : "&#10007;";
  title.textContent = isCorrect ? "Right!" : "Try Again!";
  msg.textContent = isCorrect ? "Great job!" : "Have another go.";
  setTimeout(() => { popup.style.display = "none"; }, 1200);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent = `Score: ${score} / ${quizData.length}`;
  document.getElementById("stars").innerHTML = "&#11088;".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
