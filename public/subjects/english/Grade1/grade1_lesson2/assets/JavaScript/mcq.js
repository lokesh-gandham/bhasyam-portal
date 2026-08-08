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
    q: "Q1. With whom did Pranav go to the ice cream parlour?",
    img: "../assets/images/icecreamparlour.jpg",
    options: [
      { text: "Father", img: "../assets/images/choice-father.png" },
      { text: "Mother", img: "../assets/images/choice-mother.png" },
      { text: "Alone", img: "../assets/images/choice-alone.png" },
      { text: "Friends", img: "../assets/images/choice-friends.png" },
    ],
    a: 2,
  },
  {
    q: "Q2. Why did the boy go to the ice cream parlour?",
    img: "../assets/images/boy-removebg-preview.png",
    options: [
      { text: "To have meals", img: "../assets/images/choice-q2-meals.png" },
      { text: "To meet someone", img: "../assets/images/choice-q2-meet.png" },
      { text: "To have an ice cream", img: "../assets/images/choice-q2-icecream.png" },
      { text: "To have juice", img: "../assets/images/choice-q2-juice.png" },
    ],
    a: 2,
  },
  {
    q: "Q3. How much is a sundae?",
    img: "../assets/images/sundea-removebg-preview.png",
    options: [
      { text: "25 rupees", img: "../assets/images/choice-q3-25.png" },
      { text: "50 rupees", img: "../assets/images/choice-q3-50.png" },
      { text: "40 rupees", img: "../assets/images/choice-q3-40.png" },
      { text: "30 rupees", img: "../assets/images/choice-q3-30.png" },
    ],
    a: 1,
  },
  {
    q: "Q4. What was the price of the ice cream the boy had?",
    img: "../assets/images/boyice-removebg-preview.png",
    options: [
      { text: "25 rupees", img: "../assets/images/choice-q4-25.png" },
      { text: "15 rupees", img: "../assets/images/choice-q4-15.png" },
      { text: "10 rupees", img: "../assets/images/choice-q4-10.png" },
      { text: "20 rupees", img: "../assets/images/choice-q4-20.png" },
    ],
    a: 0,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
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
  try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } }); } catch(e) {}
}

function bigConfetti() {
  try { confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } }); } catch(e) {}
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  optEl.innerHTML = "";
  nextBtn.disabled = current === quizData.length - 1 || answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option";
    const option = normalizeOption(t, q);
    if (!option.img) d.classList.add("text-only");

    const label = document.createElement("div");
    label.className = "option-label";

    const number = document.createElement("span");
    number.className = "choice-number";
    number.textContent = `${i + 1}.`;

    const text = document.createElement("span");
    text.className = "choice-text";
    text.textContent = option.text;

    label.appendChild(number);
    label.appendChild(text);

    const visual = document.createElement("div");
    visual.className = "choice-visual";

    if (option.crop) {
      visual.classList.add("reference-crop", option.crop);
      visual.setAttribute("role", "img");
      visual.setAttribute("aria-label", option.text);
    } else if (option.img) {
      const image = document.createElement("img");
      image.src = option.img;
      image.alt = option.text;
      visual.appendChild(image);
    }

    d.appendChild(label);
    d.appendChild(visual);

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
        setTimeout(() => { d.classList.remove("wrong"); }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

function normalizeOption(option, question) {
  if (typeof option === "object") return option;
  const parts = option.split("|");
  return {
    text: parts[1] || parts[0],
    img: question.img || "",
  };
}

prevBtn.onclick = () => { current--; loadQuestion(); };
nextBtn.onclick = () => { current++; loadQuestion(); };

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
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
