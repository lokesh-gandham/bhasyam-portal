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
    q: "Q1. Hans is ___ years old.",
    img: "../assets/images/hansbg.png",
    options: ["../assets/images/five-removebg-preview.png|Five", "../assets/images/six-removebg-preview.png|Six", "../assets/images/seven-removebg-preview.png|Seven", "../assets/images/eight-removebg-preview.png|Eight"],
    a: 1,
  },
  {
    q: "Q2. Hans' father is a _______________.",
    img: "../assets/images/hansfather1.png",
    options: ["../assets/images/engineerbg.png|Engineer", "../assets/images/doctorbg.png|Doctor", "../assets/images/teacherbg.png|Teacher", "../assets/images/farmerbg.png|Farmer"],
    a: 1,
  },
  {
    q: "Q3. Hans has a pet _____________.",
    img: "../assets/images/rabbitbg.png",
    options: ["../assets/images/cat.png|Cat", "../assets/images/parrotbg.png|Parrot", "../assets/images/dogbg.png|Dog", "../assets/images/fishbg.png|Fish"],
    a: 2,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);
let currentCorrectImg = "";

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
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  const correctParts = q.options[q.a].split("|");
  currentCorrectImg = correctParts[0] && (correctParts[0].includes("/") || correctParts[0].includes(".")) ? correctParts[0] : "";

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);
    d.style.cssText = "padding:22px 28px;";

    const parts = t.split("|");
    const img = parts[0];
    const text = parts[1] || parts[0];
    const isImage = img && (img.includes("/") || img.includes("."));

    if (isImage) {
      d.innerHTML = `<div class="option-img"><img src="${img}"></div><span>${text}</span>`;
    } else {
      d.innerHTML = `<span>${text}</span>`;
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
        showPopup(true, currentCorrectImg);
        nextBtn.disabled = false;

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
  current++;
  loadQuestion();
};

function showPopup(isCorrect, correctImg) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  document.querySelectorAll(".sparkle").forEach(el => el.remove());

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.innerHTML = "";
    icon.textContent = "\u{1F389}";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
    const sparks = ["⭐", "✨", "🌟", "💫", "✨"];
    sparks.forEach((s, i) => {
      const el = document.createElement("div");
      el.className = "sparkle";
      el.textContent = s;
      el.style.left = (15 + i * 18) + "%";
      el.style.top = "20%";
      el.style.animationDelay = (i * 0.12) + "s";
      icon.parentElement.appendChild(el);
    });
  } else {
    icon.textContent = "😕";
    title.textContent = "Not quite!";
    msg.textContent = "Keep trying, you'll get it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
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
