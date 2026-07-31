const questions = [
  // --- New Questions from the Vowel Pairs Image (Front) ---
  {
    question: "Q1. अ ______",
    answer: "आ",
    options: ["आ", "इ", "उ", "अ"],
    image: "../assets/images/aam.png",
  },
  {
    question: "Q2. इ ______",
    answer: "ई",
    options: ["ई", "इ", "उ", "ऊ"],
    image: "../assets/images/ekha.png",
  },
  {
    question: "Q3. उ ______",
    answer: "ऊ",
    options: ["ऊ", "ऋ", "इ", "उ"],
    image: "../assets/images/un.png",
  },
  {
    question: "Q4. ऋ ______",
    answer: "ए",
    options: ["ए", "ऐ", "ऋ", "ऊ"],
    image: "../assets/images/edi.png",
  },
  {
    question: "Q5. ए ______",
    answer: "ऐ",
    options: ["ऐ", "ए", "ओ", "औ"],
    image: "../assets/images/enak.png",
  },
  {
    question: "Q6. ओ ______",
    answer: "औ",
    options: ["औ", "ओ", "अं", "अः"],
    image: "../assets/images/aurat.png",
  },
  {
    question: "Q7. अं ______",
    answer: "अः",
    options: ["अः", "अं", "औ", "आ"],
    image: "../assets/images/boy-think.png",
  },
  {
    question: "Q8. आ ______",
    answer: "इ",
    options: ["इ", "ई", "आ", "उ"],
    image: "../assets/images/imli.png",
  },

  {
    question: "Q9. क ______",
    answer: "ख",
    options: ["ख", "म", "ग", "क"],
    image: "../assets/images/khargosh.png",
  },
  {
    question: "Q10. ग ______",
    answer: "घ",
    options: ["घ", "ज", "ट", "ग"],
    image: "../assets/images/ghadi.png",
  },
  {
    question: "Q11. ख ______",
    answer: "ग",
    options: ["च", "ग", "द", "ख"],
    image: "../assets/images/gamla.png",
  },
  {
    question: "Q12. घ ______",
    answer: "ड़",
    options: ["ड़", "फ", "ल", "घ"],
    image: "../assets/images/damaru.png",
  },
  {
    question: "Q13. च ______",
    answer: "छ",
    options: ["छ", "न", "प", "च"],
    image: "../assets/images/chhata.png",
  },
  {
    question: "Q14. ज ______",
    answer: "झ",
    options: ["थ", "झ", "य", "ज"],
    image: "../assets/images/jhula.png",
  },
  {
    question: "Q15. छ ______",
    answer: "ज",
    options: ["ल", "ज", "व", "छ"],
    image: "../assets/images/jahaj.png",
  },
  {
    question: "Q16. झ ______",
    answer: "ञ",
    options: ["ञ", "ह", "र", "झ"],
    image: "../assets/images/boy-think.png",
  },
  {
    question: "Q17. ट ______",
    answer: "ठ",
    options: ["ठ", "ड", "ढ", "ट"],
    image: "../assets/images/thathera.png",
  },
  {
    question: "Q18. फ ______",
    answer: "ब",
    options: ["ब", "प", "म", "फ"],
    image: "../assets/images/billi.png",
  },
  {
    question: "Q19.भ ______",
    answer: "म",
    options: ["म", "ब", "फ", "भ"],
    image: "../assets/images/machhli.png",
  },
  {
    question: "Q20. ढ ______",
    answer: "ण",
    options: ["ण", "ट", "ठ", "ढ"],
    image: "../assets/images/boy-think.png",
  },
  {
    question: "Q21. त ______",
    answer: "थ",
    options: ["थ", "त", "द", "ध"],
    image: "../assets/images/tharmas.png",
  },
  {
    question: "Q22. ड ______",
    answer: "ढ",
    options: ["ढ", "ठ", "ण", "ड"],
    image: "../assets/images/dhakkan.png",
  },
  {
    question: "Q23. द ______",
    answer: "ध",
    options: ["ध", "थ", "न", "द"],
    image: "../assets/images/dhanush.png",
  },
  {
    question: "Q24. ध ______",
    answer: "न",
    options: ["न", "त", "थ", "ध"],
    image: "../assets/images/nal.png",
  },
  {
    question: "Q25. य ______",
    answer: "र",
    options: ["र", "ल", "व", "य"],
    image: "../assets/images/rath.png",
  },
  {
    question: "Q26. ष ______",
    answer: "स",
    options: ["स", "श", "ह", "ष"],
    image: "../assets/images/sun.png",
  },
  {
    question: "Q27. त्र ______",
    answer: "ज्ञ",
    options: ["ज्ञ", "क्ष", "श", "त्र"],
    image: "../assets/images/rishi.png",
  },
  {
    question: "Q28. स ______",
    answer: "ह",
    options: ["ह", "श", "ष", "स"],
    image: "../assets/images/hal.png",
  },
  {
    question: "Q29. र ______",
    answer: "ल",
    options: ["ल", "य", "व", "र"],
    image: "../assets/images/lattu.png",
  },
];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);
const optionsWrap = document.getElementById("optionsWrap");

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
// const input = document.getElementById("answerInput");

// input.readOnly = true;

// hide cursor
// input.style.caretColor = "transparent";

// stop mobile keyboard
// input.setAttribute("inputmode", "none");

// disable typing
// input.addEventListener("keydown", (e) => {
//   e.preventDefault();
// });

// disable paste
// input.addEventListener("paste", (e) => {
//   e.preventDefault();
// });

// disable drag/drop
// input.addEventListener("dragover", (e) => {
//   e.preventDefault();
// });

// input.addEventListener("drop", (e) => {
//   e.preventDefault();
// });

// disable manual input
// input.addEventListener("beforeinput", (e) => {
//   e.preventDefault();
// });
// input.addEventListener("dragover", (e) => {
//   e.preventDefault();
// });

// input.addEventListener("drop", (e) => {
//   e.preventDefault();
// });

// input.addEventListener("paste", (e) => {
//   const items = e.clipboardData.items;

//   for (let item of items) {
//     if (item.type.indexOf("image") !== -1) {
//       e.preventDefault();
//     }
//   }
// });

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  image.src = q.image;

  optionsWrap.innerHTML = "";

const options = [...q.options];

options.sort(() => Math.random() - 0.5);


if(answers[currentQuestion] !== null){

    optionsWrap.innerHTML = "";

    const correctBtn =
      document.createElement("button");

    correctBtn.className =
      "option-btn correct-option";

    correctBtn.innerText =
      answers[currentQuestion];

    correctBtn.disabled = true;

    optionsWrap.appendChild(correctBtn);

    // input.value =
    //   answers[currentQuestion];

    // input.disabled = true;

    // input.classList.add(
    //   "input-correct"
    // );

    prevBtn.disabled =
      currentQuestion === 0;

    nextBtn.disabled = false;

    return;
}

options.forEach((opt) => {

    const btn = document.createElement("button");

    btn.className = "option-btn";

    btn.innerText = opt;

    if(answers[currentQuestion] !== null){
        btn.disabled = true;
    }

 btn.onclick = () => {

    if(answers[currentQuestion] !== null) return;

    // first put into input
    // input.value = opt;

    // remove old styles
    // input.classList.remove(
    //   "input-wrong",
    //   "input-correct"
    // );

    // wait little then check
    setTimeout(() => {

        // CORRECT
        if(opt === q.answer){

            answers[currentQuestion] = opt;

            score++;

            // input.disabled = true;

            // input.classList.add(
            //   "input-correct"
            // );

            btn.classList.add(
              "correct-option"
            );

         optionsWrap.innerHTML = "";

const correctBtn = document.createElement("button");

correctBtn.className =
  "option-btn correct-option";

correctBtn.innerText = opt;

correctBtn.disabled = true;

optionsWrap.appendChild(correctBtn);

            playCorrectSound();

            smallConfetti();

            showPopup(true);

            nextBtn.disabled = false;

            if (
              answers.every(
                (a) => a !== null
              )
            ) {
              setTimeout(
                showFinal,
                1400
              );
            }

        }

        // WRONG
        else{

            // input.classList.add(
            //   "input-wrong"
            // );

            btn.classList.add(
              "wrong-option"
            );

            playWrongSound();

            showPopup(false);

            setTimeout(()=>{

                // input.value = "";

                // input.classList.remove(
                //   "input-wrong"
                // );

                btn.classList.remove(
                  "wrong-option"
                );

            },700);

        }

    },300);

};

    optionsWrap.appendChild(btn);

});

  // input.value = answers[currentQuestion] || "";
  // input.disabled = answers[currentQuestion] !== null;


  // input.classList.remove("input-wrong", "input-correct");

  // if (answers[currentQuestion] !== null) {
  //   input.classList.add("input-correct");
  // }

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
}



// function speak(t) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(t);
//   msg.lang = "en-UK";
//   msg.volume = 0.25;
//   msg.rate = 1;
//   msg.pitch = 1;
//   speechSynthesis.speak(msg);
// }


// ===== AUDIO =====
let audioCtx = null;

function playCorrectSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.2;
    oscillator.type = "sine";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.5
    );

    oscillator.stop(audioCtx.currentTime + 0.5);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

function playWrongSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.25;
    oscillator.type = "sawtooth";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.4
    );

    oscillator.stop(audioCtx.currentTime + 0.4);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

// Initialize audio
function initAudioOnFirstClick() {
  if (audioCtx) return;

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const source = audioCtx.createBufferSource();

    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();

  } catch (e) {
    console.log("Audio init error:", e);
  }
}

document.body.addEventListener(
  "click",
  initAudioOnFirstClick,
  { once: true }
);


function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}



nextBtn.onclick = function () {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
};

prevBtn.onclick = function () {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

if (isCorrect) {

  icon.textContent = "🐵";

  title.textContent = "वाह!";

  msg.textContent = "आपने कमाल कर दिया!";

} else {

  icon.textContent = "🙈";

  title.textContent = "अरे!";

  msg.textContent = "थोड़ा और सोचिए!";
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent = "आपके अंक: 29 / 29";
    // `आपके अंक: ${score} / ${questions.length}`;
 document.getElementById("stars").textContent = "👌👌👌";

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
