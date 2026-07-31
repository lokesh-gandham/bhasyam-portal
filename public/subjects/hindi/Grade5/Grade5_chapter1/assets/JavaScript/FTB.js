const questions = [

{
  q: "Q1. .........ठ",
  a: ["ट"],
  options: ["च","ठ","ट","ड"],
  img: "../assets/images/tomato.png",
},

{
  q: "Q2. .........ढ",
  a: ["ठ"],
  options: ["ण","ठ","ढ","त"],
  img: "../assets/images/thathera.png",
},

{
  q: "Q3. .........थ",
  a: ["त"],
  options: ["द","त","थ","न"],
  img: "../assets/images/tarbuj.png",
},

{
  q: "Q4. .........म",
  a: ["भ"],
  options: ["ब","म","भ","ध"],
  img: "../assets/images/bhalu.png",
},

{
  q: "Q5. .........फ",
  a: ["प"],
  options: ["ढ","प","ट","फ"],
  img: "../assets/images/patang.png",
},

{
  q: "Q6. .........ण",
  a: ["ढ"],
  options: ["छ","भ","त","ढ"],
  img: "../assets/images/potcap.png",
},

{
  q: "Q7. .........भ",
  a: ["ब"],
  options: ["ध","भ","ब","म"],
  img: "../assets/images/goat.png",
},

{
  q: "Q8. .........न",
  a: ["ध"],
  options: ["न","ध","थ","द"],
  img: "../assets/images/dhanush.png",
},

];
let index = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputsRow = document.getElementById("inputsContainer");

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({ value: "", correct: false })),
}));

// function speak(t) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(t);
//   msg.lang = "en-UK";
//   msg.volume = 0.25;
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
  const duration = 100;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
function loadQuestion() {

  const q = questions[index];

  questionText.innerText = q.q;

  image.src = q.img;

  prevBtn.disabled = index === 0;

  nextBtn.disabled = !userAnswers[index].correct;

  inputsRow.innerHTML = "";

  const optionsWrap = document.createElement("div");

  optionsWrap.className = "options-wrap";

  q.options.forEach((opt) => {

 

const optionBtn = document.createElement("button");

optionBtn.className = "option-btn";

optionBtn.innerText = opt;


// ===== RESTORE PREVIOUS SOLVED QUESTION =====

if (userAnswers[index].correct) {

  optionBtn.disabled = true;

  if (userAnswers[index].selected === opt) {

    optionBtn.classList.add("correct-option");

  } else {

    optionBtn.classList.add("disabled-option");

  }

}

   optionBtn.onclick = () => {

  // already solved question
  if (userAnswers[index].correct) return;

  if (opt === q.a[0]) {
    nextBtn.disabled = false;

    // SAVE CORRECT ANSWER
    userAnswers[index].correct = true;

    userAnswers[index].selected = opt;

    // LOCK BUTTONS
    document.querySelectorAll(".option-btn").forEach((btn) => {

      btn.disabled = true;

      btn.classList.add("disabled-option");

      if (btn.innerText === opt) {

        btn.classList.remove("disabled-option");

        btn.classList.add("correct-option");

      }

    });

    playCorrectSound();

    smallConfetti();

    showPopup(true);

    if (index === questions.length - 1) {

  setTimeout(() => {

    showFinal();

  }, 1200);

}

    if (!userAnswers[index].scored) {

      score++;

      userAnswers[index].scored = true;

    }

   

  } else {

    optionBtn.classList.add("wrong-option");

    playWrongSound();

    showPopup(false);

    setTimeout(() => {

      optionBtn.classList.remove("wrong-option");

    }, 700);

  }

};

    optionsWrap.appendChild(optionBtn);

  });

  inputsRow.appendChild(optionsWrap);

}
function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answers = questions[index].a;
  const state = userAnswers[index];

  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;

    state.used.push(value);
    state.boxes[i] = { value, correct: true };

    // speak("Correct");
     playCorrectSound();
    smallConfetti();
    showPopup(true);
  } else {
    input.value = "";
    btn.disabled = true;

    // speak("Wrong");
     playWrongSound();
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const done = userAnswers[index].boxes.every((b) => b.correct);
  nextBtn.disabled = !done;

  if (done && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  }
}

nextBtn.onclick = () => {

  // LAST QUESTION
  if (index === questions.length - 1) {

    showFinal();

    return;

  }

  // NEXT QUESTION
  index++;

  loadQuestion();

};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
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

  icon.textContent = "🥳";

  title.textContent = "बहुत बढ़िया!";

  msg.textContent = "आपने सही उत्तर चुना ";

} else {

  icon.textContent = "😢";

  title.textContent = "कोई बात नहीं!";

  msg.textContent = "फिर से प्रयास कीजिए ";
}


  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपका नतीजा: ${score} / ${questions.length}`;

 document.getElementById("stars").textContent = "🌟🌟🌟";

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();

document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());