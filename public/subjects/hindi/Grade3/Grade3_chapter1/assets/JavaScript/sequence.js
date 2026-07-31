let activeQuestion = null;
let score = 0;

/* =========================
   AUDIO
========================= */
/* =========================
   SPEECH FUNCTION
========================= */

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "hi-IN"; // ✅ changed from en-IN to hi-IN
  msg.volume = 1;     // ✅ increased from 0.7
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* =========================
   QUESTION ANSWERS
========================= */

const questionBoxes = document.querySelectorAll(".question-box");
// AFTER
const letters = document.querySelectorAll(".letter");

/* =========================
   ADD ANSWERS TO QUESTIONS
========================= */

questionBoxes[0].dataset.answer = "इ";
questionBoxes[1].dataset.answer = "ज";
questionBoxes[2].dataset.answer = "ब";
questionBoxes[3].dataset.answer = "स";

const totalCorrect = questionBoxes.length;

/* =========================
   SELECT QUESTION
========================= */

questionBoxes.forEach((question) => {

  question.addEventListener("click", () => {

    // already completed
    if (question.classList.contains("completed")) return;

    // remove old active
    questionBoxes.forEach((q) => {
      q.classList.remove("active");
    });

    // activate current
    question.classList.add("active");

    activeQuestion = question;

  });

});

/* =========================
   SELECT LETTER
========================= */

letters.forEach((letter) => {

  letter.addEventListener("click", () => {

    // no question selected
    if (!activeQuestion) return;

// AFTER
const selectedLetter = letter.dataset.letter;

    const correctAnswer =
      activeQuestion.dataset.answer;

    /* =========================
       CORRECT
    ========================= */

    if (selectedLetter === correctAnswer) {

     speak("सही जवाब");

      showPopup(true);

      // fill answer
      activeQuestion.innerHTML =
        activeQuestion.textContent.replace("_?", selectedLetter);

      // lock question
      activeQuestion.classList.add("completed");
      activeQuestion.classList.remove("active");

      // disable selected letter
      letter.classList.add("used");
      letter.style.pointerEvents = "none";
      letter.style.opacity = "0.5";

      score++;

      activeQuestion = null;

      /* =========================
         FINAL POPUP
      ========================= */

      if (score === totalCorrect) {

        setTimeout(() => {
          showFinal();
        }, 1200);

      }

    }

    /* =========================
       WRONG
    ========================= */

    else {

   speak("गलत जवाब");

      showPopup(false);

      // shake animation
      letter.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)" },
          { transform: "translate(-50%, -50%) scale(0.8)" },
          { transform: "translate(-50%, -50%) scale(1)" },
        ],
        {
          duration: 300,
        }
      );

    }

  });

});

/* =========================
   POPUP
========================= */

function showPopup(isCorrect) {

  const popup =
    document.getElementById("answerPopup");

  const icon =
    document.getElementById("popupIcon");

  const title =
    document.getElementById("popupTitle");

  const msg =
    document.getElementById("popupMsg");

  /* CHANGE POPUP TYPE */
  popup.className =
    "popup " + (isCorrect ? "correct" : "wrong");

  /* SHOW POPUP */
  /* RESET ANIMATION */

popup.style.display = "none";

void popup.offsetWidth;
  popup.style.display = "flex";

  /* CORRECT */
  if (isCorrect) {

    icon.textContent = "🥳";

    title.textContent = "सही जवाब!";

    msg.textContent = "बहुत बढ़िया!";

  }

  /* WRONG */
  else {

    icon.textContent = "😔";

    title.textContent = "गलत जवाब!";

    msg.textContent = "फिर से कोशिश करें!";
  }

  /* AUTO HIDE */
  setTimeout(() => {

    popup.style.display = "none";

  }, 1200);
}

/* =========================
   FINAL POPUP
========================= */

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  document.getElementById("finalScore").textContent = `Score: ${score}/4`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  if (window.innerWidth >= 769) {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}