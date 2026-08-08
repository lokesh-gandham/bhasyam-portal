function shouldSkipFinalCorrectPopup() {
  try {
    if (typeof answered !== "undefined" && Array.isArray(answered) && answered.length && answered.every(a => a !== null && a !== false)) return true;
  } catch (error) {}
  return false;
}

const quizData = [
  {
    word: "Park",
    answer: "Parks",
    suffix: "s",
    img: "../assets/images/parksin-removebg-preview.png",
    pluralCount: 4,
  },
  {
    word: "Teacher",
    answer: "Teachers",
    suffix: "s",
    img: "../assets/images/teachersingular.png",
    pluralImg: "../assets/images/teacherplural.png",
    pluralCount: 1,
  },
  {
    word: "Holiday",
    answer: "Holidays",
    suffix: "s",
    img: "../assets/images/holiday.png",
    pluralImg: "../assets/images/holidayversion1.png",
    pluralCount: 1,
  },
  {
    word: "Friend",
    answer: "Friends",
    suffix: "s",
    img: "../assets/images/friend.png",
    pluralImg: "../assets/images/friends_plural-removebg-preview.png",
    pluralCount: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const singularWordEl = document.getElementById("singularWord");
const pluralImagesEl = document.getElementById("pluralImages");
const letterCirclesEl = document.getElementById("letterCircles");
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
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 70, spread: 90, origin: { y: 0.7 } });
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase();
}

function renderPluralImages(question) {
  pluralImagesEl.innerHTML = "";
  const hasMultiple = question.pluralImgs && question.pluralImgs.length > 1;
  pluralImagesEl.classList.toggle("single-image", !hasMultiple && question.pluralCount === 1);
  const count = hasMultiple ? question.pluralImgs.length : question.pluralCount;
  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.src = hasMultiple ? question.pluralImgs[i] : (question.pluralImg || question.img);
    img.alt = `${question.word} ${i + 1}`;
    pluralImagesEl.appendChild(img);
  }
}

function buildLetterCircles(answer, disabled) {
  letterCirclesEl.innerHTML = "";
  const letters = answer.split("");
  letters.forEach((letter, i) => {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "letter-circle";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.dataset.index = i;
    input.dataset.answer = letter.toLowerCase();
    input.disabled = disabled;

    if (answered[current]?.correct) {
      input.value = letter.toUpperCase();
      input.classList.add("correct");
    }

    input.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase();
      e.target.value = val ? val.toUpperCase() : "";
      if (val && i < letters.length - 1) {
        const next = letterCirclesEl.children[i + 1];
        if (next && !next.disabled) next.focus();
      }
      checkAutoValidate();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && i > 0) {
        const prev = letterCirclesEl.children[i - 1];
        if (prev && !prev.disabled) {
          prev.focus();
          prev.value = "";
        }
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text").toLowerCase();
      const pasteLetters = paste.split("").filter(c => /[a-z]/i.test(c));
      pasteLetters.forEach((ch, j) => {
        const idx = i + j;
        if (idx < letters.length) {
          letterCirclesEl.children[idx].value = ch.toUpperCase();
        }
      });
      const focusIdx = Math.min(i + pasteLetters.length, letters.length - 1);
      letterCirclesEl.children[focusIdx].focus();
      checkAutoValidate();
    });

    letterCirclesEl.appendChild(input);
  });
}

function checkAutoValidate() {
  if (answered[current]?.correct) return;
  const question = quizData[current];
  const circles = [...letterCirclesEl.querySelectorAll(".letter-circle")];
  const userValue = circles.map(c => c.value.toLowerCase()).join("");

  if (userValue.length < question.answer.length) return;

  const isCorrect = userValue === normalizeAnswer(question.answer);

  if (isCorrect) {
    answered[current] = { value: userValue, correct: true };
    score++;
    circles.forEach(c => {
      c.disabled = true;
      c.classList.add("correct");
    });
    nextBtn.disabled = current === quizData.length - 1;
    speak("Correct");
    smallConfetti();
    showPopup(true);

    if (answered.every((item) => item?.correct)) {
      setTimeout(showFinal, 1700);
    }
  } else {
    circles.forEach(c => c.classList.add("wrong"));
    speak("Try again");
    showPopup(false);
    setTimeout(() => {
      circles.forEach(c => {
        c.classList.remove("wrong");
        c.value = "";
      });
      if (circles[0]) circles[0].focus();
    }, 700);
  }
}

function loadQuestion() {
  const question = quizData[current];
  qEl.style.display = "";
  imgEl.src = question.img;
  imgEl.alt = question.word;
  singularWordEl.textContent = question.word;
  renderPluralImages(question);

  const isDone = Boolean(answered[current]?.correct);
  buildLetterCircles(question.answer, isDone);

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === quizData.length - 1 || !answered[current]?.correct;

  setTimeout(() => {
    if (!isDone) {
      const first = letterCirclesEl.querySelector(".letter-circle");
      if (first) first.focus();
    }
  }, 80);
}

prevBtn.addEventListener("click", () => {
  if (current === 0) return;
  current--;
  loadQuestion();
});

nextBtn.addEventListener("click", () => {
  if (current >= quizData.length - 1 || !answered[current]?.correct) return;
  current++;
  loadQuestion();
});

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = `kid-popup ${isCorrect ? "kid-correct" : "kid-wrong"}`;
  popup.style.display = "flex";
  icon.textContent = isCorrect ? "\u2713" : "\u00d7";
  title.textContent = isCorrect ? "Great Job!" : "Try Again!";
  msg.textContent = isCorrect ? "That plural word is correct." : "Check the spelling and try again.";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1300);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quizData.length}`;
  document.getElementById("stars").textContent = "\u2B50".repeat(3);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
