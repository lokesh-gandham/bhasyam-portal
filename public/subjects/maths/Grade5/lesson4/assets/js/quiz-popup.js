/* =========================================================
   SHARED QUIZ POPUPS  (pairs with assets/css/quiz-popup.css)
   Gives the self-contained Chapter 4 activities the same
   right / wrong / final popups as the other quizzes.

   API:
     QuizPopup.answer(ok, title, msg, ms, onDone)
     QuizPopup.final(score, total)      // persistent, has "Play Again"
   ========================================================= */
(function (w, d) {
  "use strict";

  var answerEl = null, cardEl = null, iconEl = null, titleEl = null, msgEl = null;
  var finalEl = null;
  var timer = null;

  /* ---- voice ---- */
  function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-US";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}
  if ("speechSynthesis" in w) { try { w.speechSynthesis.getVoices(); } catch (e) {} }

  function buildAnswer() {
    if (answerEl) return;
    answerEl = d.createElement("div");
    answerEl.className = "qp-overlay";
    answerEl.innerHTML =
      '<div class="qp-card">' +
        '<div class="qp-icon"></div>' +
        '<div class="qp-title"></div>' +
        '<div class="qp-msg"></div>' +
      '</div>';
    d.body.appendChild(answerEl);
    cardEl  = answerEl.querySelector(".qp-card");
    iconEl  = answerEl.querySelector(".qp-icon");
    titleEl = answerEl.querySelector(".qp-title");
    msgEl   = answerEl.querySelector(".qp-msg");
    answerEl.addEventListener("click", hideAnswer);
  }

  function hideAnswer() {
    if (answerEl) answerEl.classList.remove("show");
  }

  /* Fixed wording, identical for every Chapter 4 activity:
     correct -> "Correct!"
     wrong   -> "Try again"
     The title / msg arguments are ignored on purpose. */
  function answer(ok, title, msg, ms, onDone) {
    buildAnswer();
    clearTimeout(timer);
    cardEl.className = "qp-card " + (ok ? "good" : "bad");
    iconEl.textContent = ok ? "🎉" : "🥲";
    titleEl.textContent = ok ? "Correct!" : "Try again";
    msgEl.textContent = "";
    answerEl.classList.add("show");
    speak(titleEl.textContent);
    timer = setTimeout(function () {
      hideAnswer();
      if (typeof onDone === "function") onDone();
    }, ms || 1400);
  }

  /* Final popup — markup + wording identical to the other quizzes:
     "🎉 Congratulations!", "Your Score: X / Y", one star per point. */
  function final(score, total) {
    if (!finalEl) {
      finalEl = d.createElement("div");
      finalEl.className = "qp-final";
      finalEl.innerHTML =
        '<div class="qp-final-box">' +
          '<h2>🎉 Congratulations!</h2>' +
          '<p class="qp-score"></p>' +
          '<div class="qp-stars"></div>' +
          '<button type="button" class="qp-again">Play Again</button>' +
        '</div>';
      d.body.appendChild(finalEl);
      finalEl.querySelector(".qp-again").addEventListener("click", function () {
        w.location.reload();
      });
    }
    var n = (typeof score === "number") ? score : 3;
    var t = (typeof total === "number") ? total : n;
    finalEl.querySelector(".qp-score").textContent = "Your Score: " + n + " / " + t;
    finalEl.querySelector(".qp-stars").textContent = "⭐".repeat(Math.max(0, Math.min(n, 5)));
    hideAnswer();
    finalEl.classList.add("show");
    /* no voice on the final popup */
  }

  w.QuizPopup = { answer: answer, final: final, hide: hideAnswer, speak: speak };
})(window, document);
