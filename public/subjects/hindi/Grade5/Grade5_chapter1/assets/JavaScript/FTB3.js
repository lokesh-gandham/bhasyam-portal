const questions = [

{
  q: "Q1. ट  .........  ड",
  a: ["ठ"],
  options: ["ड", "ठ"]
},

{
  q: "Q2. ठ  .........  ढ",
  a: ["ड"],
  options: ["ड", "ढ"]
},

{
  q: "Q3. प  .........  ब",
  a: ["फ"],
  options: ["ब", "फ"]
},

{
  q: "Q4. त  .........  द",
  a: ["थ"],
  options: ["द", "थ"]
},

{
  q: "Q5. थ  .........  ध",
  a: ["द"],
  options: ["ध", "द"]
},

{
  q: "Q6. ब  .........  म",
  a: ["भ"],
  options: ["भ", "म"]
},

];
let index = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const image1 = document.getElementById("questionImage1");
const image2 = document.getElementById("questionImage2");
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
image1.innerText = q.options[0];
image2.innerText = q.options[1];

image1.onclick = () => {

  const input = document.querySelector(".input-box input");

  if (!input.disabled) {

    input.value = q.options[0];

    document.querySelector(".check-btn").disabled = false;

  }

};

image2.onclick = () => {

  const input = document.querySelector(".input-box input");

  if (!input.disabled) {

    input.value = q.options[1];

    document.querySelector(".check-btn").disabled = false;

  }

};

  prevBtn.disabled = index === 0;

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "उत्तर चुनिए";
    input.setAttribute("autocomplete", "off");
input.setAttribute("spellcheck", "false");

// ❌ block drag
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

// ❌ block paste (optional but recommended)
input.addEventListener("paste", (e) => e.preventDefault());
    input.value = userAnswers[index].boxes[i].value;

    const btn = document.createElement("button");
    btn.className = "check-btn";
    btn.textContent = "जाँच";

    btn.disabled = input.value.trim() === "";

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });

    if (userAnswers[index].boxes[i].correct) {
      box.classList.add("correct");
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);

    inputsRow.appendChild(box);
  });

  checkAllAnswered();
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
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
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