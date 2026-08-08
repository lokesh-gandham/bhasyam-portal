/**************** RHYMING WORDS — ALL ON ONE SCREEN ****************/

const quizData = [
  {
    word: "bright",
    image: "../assets/images/bright-removebg-preview.png",
    options: [
      { text: "night", image: "../assets/images/night1-removebg-preview.png" },
      { text: "spoon", image: "../assets/images/spoon-removebg-preview.png" },
      { text: "light", image: "../assets/images/light-removebg-preview.png" }
    ],
    answer: "spoon"
  },
  {
    word: "dew",
    image: "../assets/images/dew-removebg-preview.png",
    options: [
      { text: "few", image: "../assets/images/few-removebg-preview.png" },
      { text: "new", image: "../assets/images/latest-removebg-preview.png" },
      { text: "song", image: "../assets/images/song-removebg-preview.png" }
    ],
    answer: "song"
  },
  {
    word: "feel",
    image: "../assets/images/feel-removebg-preview.png",
    options: [
      { text: "doll", image: "../assets/images/doll-removebg-preview.png" },
      { text: "reel", image: "../assets/images/reel-removebg-preview.png" },
      { text: "peel", image: "../assets/images/peel-removebg-preview.png" }
    ],
    answer: "doll"
  },
  {
    word: "green",
    image: "../assets/images/green-removebg-preview.png",
    options: [
      { text: "keen", image: "../assets/images/keen-removebg-preview.png" },
      { text: "air", image: "../assets/images/air1-removebg-preview.png" },
      { text: "seen", image: "../assets/images/seen-removebg-preview.png" }
    ],
    answer: "air"
  }
];

/* ================= STATE ================= */
let score = 0;
const answered = quizData.map(() => false);

/* ================= ELEMENTS ================= */
const questionArea = document.getElementById("questionArea");

/* ================= TTS ================= */
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* ================= RENDER ALL QUESTIONS ================= */
function renderAllQuestions() {
  var html = '';

  quizData.forEach(function (q, idx) {
    var isDone = answered[idx];

    var cardColors = [
      'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'
    ];

    html += '<div class="q-card" data-qindex="' + idx + '" style="background:' + cardColors[idx] + '">';

    // Reference side
    var refImgClass = idx === 2 ? 'q-ref-img q-ref-img-lg' : 'q-ref-img';
    html += '<div class="q-ref-side">';
    html += '  <div class="q-card-number">' + (idx + 1) + '</div>';
    html += '  <img class="' + refImgClass + '" src="' + q.image + '" alt="' + q.word + '" draggable="false" onerror="this.style.display=\'none\'">';
    html += '  <div class="q-word-box">';
    html += '    <div class="q-word">' + q.word + '</div>';
    html += '  </div>';
    html += '</div>';

    // Options
    html += '<div class="q-options">';
    q.options.forEach(function (opt, optIdx) {
      var cls = "q-option";
      if (isDone && opt.text === q.answer) cls += " correct-selected";
      else if (isDone) cls += " disabled";

      html += '<div class="' + cls + '" data-qindex="' + idx + '" data-text="' + opt.text + '">';
      html += '  <img class="q-option-img" src="' + opt.image + '" alt="' + opt.text + '" draggable="false" onerror="this.style.display=\'none\'">';
      html += '  <span class="q-option-text">' + opt.text + '</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '</div>';
  });

  questionArea.innerHTML = html;

  // Bind clicks
  var optEls = questionArea.querySelectorAll(".q-option:not(.disabled):not(.correct-selected)");
  optEls.forEach(function (el) {
    el.addEventListener("click", function () {
      handleAnswer(el);
    });
  });

  updateScore();
}

/* ================= HANDLE ANSWER ================= */
function handleAnswer(el) {
  var qIdx = parseInt(el.getAttribute("data-qindex"));
  if (answered[qIdx]) return;

  var q = quizData[qIdx];
  var selected = el.getAttribute("data-text");

  if (selected === q.answer) {
    answered[qIdx] = true;
    score++;
    el.classList.add("correct-selected");
    speak("Correct");

    // Disable all options for this question
    var card = el.closest(".q-card");
    var allOpts = card.querySelectorAll(".q-option");
    allOpts.forEach(function (o) {
      if (!o.classList.contains("correct-selected")) {
        o.classList.add("disabled");
      }
      o.onclick = null;
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    showPopup(true);
    updateScore();

    // Check if all done
    if (answered.every(function (a) { return a; })) {
      setTimeout(function () { showFinal(); }, 1400);
    }
  } else {
    speak("Wrong");
    el.classList.add("wrong-shake");
    showPopup(false);
    setTimeout(function () {
      el.classList.remove("wrong-shake");
    }, 500);
  }
}

/* ================= UPDATE SCORE ================= */
function updateScore() {
}

/* ================= KID POPUP ================= */
function showPopup(isCorrect) {
  var popup = document.getElementById("answerPopup");
  var icon = document.getElementById("popupIcon");
  var title = document.getElementById("popupTitle");
  var msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(function () {
    popup.style.display = "none";
  }, 1400);
}

/* ================= FINAL POPUP ================= */
function showFinal() {
  document.getElementById("finalPopup").style.display = "flex";
  document.getElementById("finalScore").textContent = "Your Score: " + score + " / " + quizData.length;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  setTimeout(function () {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 300);
}

/* ================= INIT ================= */
renderAllQuestions();
