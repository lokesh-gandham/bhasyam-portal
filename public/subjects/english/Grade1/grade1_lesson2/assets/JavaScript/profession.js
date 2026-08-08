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
    desc: "A person who teaches in a school is called a ____.",
    img: "../assets/images/school-removebg-preview.png",
    answer: "Teacher",
    choices: ["Teacher", "Doctor", "Driver", "Chef"],
    revealImg: "../assets/images/teacher-removebg-preview.png",
  },
  {
    desc: "A person who cooks in a restaurant is called a ____.",
    img: "../assets/images/restaurant-removebg-preview.png",
    answer: "Chef",
    choices: ["Florist", "Teacher", "Chef", "Doctor"],
    revealImg: "../assets/images/chef-removebg-preview.png",
  },
  {
    desc: "A person who sells flowers is called a ____.",
    img: "../assets/images/flowers-removebg-preview.png",
    answer: "Florist",
    choices: ["Driver", "Florist", "Chef", "Teacher"],
    revealImg: "../assets/images/florist-removebg-preview.png",
  },
  {
    desc: "A person who treats sick patients is called a ____.",
    img: "../assets/images/patientd-removebg-preview.png",
    answer: "Doctor",
    choices: ["Doctor", "Driver", "Florist", "Chef"],
    revealImg: "../assets/images/doctorcart-removebg-preview.png",
  },
  {
    desc: "A person who drives a vehicle is called a ____.",
    img: "../assets/images/bus-removebg-preview.png",
    answer: "Driver",
    choices: ["Teacher", "Driver", "Doctor", "Florist"],
    revealImg: "../assets/images/driver-removebg-preview.png",
  },
];

let current = 0;
let answered = Array(quizData.length).fill(null);
const professionImages = {
  Teacher: "../assets/images/teacher-removebg-preview.png",
  Doctor: "../assets/images/doctorcart-removebg-preview.png",
  Driver: "../assets/images/driver-removebg-preview.png",
  Chef: "../assets/images/chef-removebg-preview.png",
  Florist: "../assets/images/florist-removebg-preview.png",
};

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const descEl = document.getElementById("profDesc");
const choiceGrid = document.getElementById("choiceGrid");
const feedbackEl = document.getElementById("feedback");
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
  try { confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } }); } catch(e) {}
}

function bigConfetti() {
  try { confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } }); } catch(e) {}
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.desc;
  
  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = "block";
    imgEl.parentElement.style.display = "flex";
    imgEl.style.opacity = "1";
  } else {
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
    imgEl.parentElement.style.display = "none";
  }
  
  descEl.textContent = "Q" + (current + 1) + ". " + q.desc;
  choiceGrid.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  q.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prof-choice";
    const choiceImg = professionImages[choice] || "";
    button.innerHTML = `${choiceImg ? `<img src="${choiceImg}" alt="${choice}">` : ""}<span>${choice}</span>`;
    button.setAttribute("aria-label", choice);
    button.dataset.choice = choice;
    button.onclick = () => chooseAnswer(choice, button);
    choiceGrid.appendChild(button);
  });
  
  if (answered[current] !== null) {
    markAnswered();
    feedbackEl.className = "feedback correct";
  }
  
  nextBtn.disabled = current === quizData.length - 1 || answered[current] === null;
  prevBtn.disabled = current === 0;
}

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

function markAnswered() {
  const q = quizData[current];
  [...choiceGrid.children].forEach(button => {
    button.disabled = true;
    if (button.dataset.choice === q.answer) button.classList.add("correct");
    else button.classList.add("disabled");
  });
}

function chooseAnswer(choice, button) {
  const q = quizData[current];
  if (answered[current] !== null) return;

  if (choice === q.answer) {
    answered[current] = choice;
    markAnswered();
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback correct";
    nextBtn.disabled = current === quizData.length - 1;
    speak("Correct");
    showPopup(true);
    smallConfetti();
    if (answered.every(a => a !== null)) setTimeout(showFinal, 1700);
  } else {
    button.classList.add("wrong");
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback wrong";
    speak("Try again");
    showPopup(false);
    setTimeout(() => {
      button.classList.remove("wrong");
    }, 700);
  }
}

prevBtn.onclick = () => {
  if (current === 0) return;
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  if (current >= quizData.length - 1) return;
  current++;
  loadQuestion();
};

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent = "Score: " + answered.filter(a => a !== null).length + " / " + quizData.length;
  document.getElementById("stars").innerHTML = "&#11088;".repeat(answered.filter(a => a !== null).length);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
