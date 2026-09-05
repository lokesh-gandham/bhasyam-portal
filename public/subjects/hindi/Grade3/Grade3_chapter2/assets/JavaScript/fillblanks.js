const questions = [

  {
    q: "चित्र देखिए और सही विकल्प पर क्लिक कीजिए।",
    a: "चम्मच",
    a_mobile: "चम्मच",
    img: "../assets/images/spoon.png",
  },

  {
    q: "चित्र देखिए और सही विकल्प पर क्लिक कीजिए।",
    a: "पुस्तक",
    a_mobile: "पुस्तक",
    img: "../assets/images/book.png",
  },

  {
    q: "चित्र देखिए और सही विकल्प पर क्लिक कीजिए।",
    a: "मिट्टी",
    a_mobile: "मिट्टी",
    img: "../assets/images/sand.png",
  },

  {
    q: "चित्र देखिए और सही विकल्प पर क्लिक कीजिए।",
    a: "बच्चा",
    a_mobile: "बच्चा",
    img: "../assets/images/bacchi.png",
  },

  {
    q: "चित्र देखिए और सही विकल्प पर क्लिक कीजिए।",
    a: "गड्ढा",
    a_mobile: "गड्ढा",
    img: "../assets/images/manhole.png",
  },

];

let index = 0;
let score = 0;
let selectedAnswer = "";

const answered =
Array(questions.length).fill(false);

// ================= ELEMENTS =================

const optionsRow =
document.getElementById("optionsRow");

const qEl =
document.getElementById("question");

const img =
document.getElementById("image");

const letters =
document.getElementById("letters");

const indicator =
document.getElementById("indicator");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const checkBtn =
document.getElementById("checkBtn");

// ================= DRAG IMAGE =================

letters.addEventListener("dragover", (e) => {
  e.preventDefault();
});

letters.addEventListener("drop", (e) => {

  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if(file && file.type.startsWith("image/")){

    const reader = new FileReader();

    reader.onload = function(event){

      img.src = event.target.result;

    };

    reader.readAsDataURL(file);

  }

});

// ================= MOBILE =================

function isMobile() {

  return window.innerWidth <= 768;

}

// ================= OPTIONS =================

function generateOptions(correctAnswer){

  const allAnswers =
    questions.map(q =>
      isMobile()
      ? (q.a_mobile || q.a)
      : q.a
    );

  const distractors =
    allAnswers.filter(
      a => a.toLowerCase() !==
      correctAnswer.toLowerCase()
    );

  const shuffled =
    distractors
    .sort(() => Math.random() - 0.5)
    .slice(0,2);

  return [...shuffled, correctAnswer]
    .sort(() => Math.random() - 0.5);

}

function fillInputsWithAnswer(answer){

  const input =
    document.querySelector(".single-input");

  input.value = answer;
  selectedAnswer = answer;
  checkBtn.disabled = false;
  
  // Remove any wrong class if present
  input.classList.remove("wrong");
  
  // Show backspace button
  const backspaceBtn = document.getElementById("backspaceBtn");
  if (backspaceBtn) {
    backspaceBtn.style.display = "flex";
  }
}

function clearSelectedAnswer() {
  const input = document.querySelector(".single-input");
  input.value = "";
  selectedAnswer = "";
  checkBtn.disabled = true;
  input.classList.remove("wrong");
  
  // Hide backspace button
  const backspaceBtn = document.getElementById("backspaceBtn");
  if (backspaceBtn) {
    backspaceBtn.style.display = "none";
  }
  
  // Re-enable all option buttons
  optionsRow.querySelectorAll(".option-btn").forEach(b => {
    b.classList.remove("selected");
    b.disabled = false;
  });
}

function renderOptions(correctAnswer){

  optionsRow.innerHTML = "";

  const options =
    generateOptions(correctAnswer);

  options.forEach(opt => {

    const btn =
      document.createElement("button");

    btn.className = "option-btn";

    btn.textContent = opt;

    btn.onclick = () => {

      // If question is already answered correctly, don't allow changes
      if (answered[index]) return;

      optionsRow
      .querySelectorAll(".option-btn")
      .forEach(b => {

        b.classList.remove("selected");
        b.disabled = false;

      });

      btn.classList.add("selected");

      fillInputsWithAnswer(opt);

      optionsRow
      .querySelectorAll(".option-btn")
      .forEach(b => b.disabled = true);

    };

    optionsRow.appendChild(btn);

  });

}

// ================= AUDIO =================

let audioCtx = null;

function playCorrect() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 880;

        gain.gain.value = 0.2;

        osc.type = "sine";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.45
        );

        osc.stop(audioCtx.currentTime + 0.45);

    } catch(e) {}

}

function playWrong() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 480;

        gain.gain.value = 0.2;

        osc.type = "triangle";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.4
        );

        osc.stop(audioCtx.currentTime + 0.4);

    } catch(e) {}

}

function initAudioOnce() {

    if (audioCtx) return;

    try {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const buffer = audioCtx.createBuffer(1, 1, 22050);

        const src = audioCtx.createBufferSource();

        src.buffer = buffer;

        src.connect(audioCtx.destination);

        src.start();

    } catch(e) {}

}

// ================= CONFETTI =================

function fireSmallConfetti(){

  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    scalar: 0.8
  });

}

function fireBigConfetti(){

  const duration = 2000;

  const end =
    Date.now() + duration;

  (function frame(){

    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if(Date.now() < end){

      requestAnimationFrame(frame);

    }

  })();

}

// ================= POPUP =================

function showPopup(isCorrect){

  const popup =
    document.getElementById("answerPopup");

  const icon =
    document.getElementById("popupIcon");

  const title =
    document.getElementById("popupTitle");

  const msg =
    document.getElementById("popupMsg");

  const stars =
    document.getElementById("popupStars");

  popup.style.display = "flex";

  if(isCorrect){

    popup.classList.add("correct");
    popup.classList.remove("wrong");

    icon.textContent = "✔";
    title.textContent = "सही जवाब!";
    msg.textContent = "बहुत बढ़िया!";

    stars.textContent = "⭐ ⭐ ⭐";

    stars.style.display = "block";

  } else {

    popup.classList.add("wrong");
    popup.classList.remove("correct");

    icon.textContent = "✖";
    title.textContent = "गलत जवाब!";
    msg.textContent = "फिर से कोशिश करें";

    stars.style.display = "none";

  }

  setTimeout(() => {

    popup.style.display = "none";

  },1200);

}

// ================= LOAD =================

function load(){

  const q = questions[index];

  qEl.textContent = q.q;

  img.src = q.img;

  indicator.textContent =
    `Question ${index + 1} of ${questions.length}`;

  letters.innerHTML = "";

  const answer =
    isMobile()
    ? (q.a_mobile || q.a)
    : q.a;

  // ===== SINGLE INPUT - READ ONLY (NO TYPING) =====

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";
  inputWrapper.style.cssText = "display: flex; align-items: center; gap: 10px;";

  const input =
    document.createElement("input");

  input.type = "text";

  input.className = "single-input";

  input.placeholder = "विकल्प चुनें";
  // input.style.fontSize = "18px"

  input.readOnly = true;
  input.style.cursor = "default";
  input.style.pointerEvents = "none";
  input.style.userSelect = "none";

  // ===== BACKSPACE BUTTON =====
  const backspaceBtn = document.createElement("button");
  backspaceBtn.id = "backspaceBtn";
  backspaceBtn.className = "backspace-btn";
  backspaceBtn.innerHTML = "⌫";
  backspaceBtn.style.cssText = `
    width: 50px;
    height: 50px;
    border-radius: 12px;
    border: 2px solid #cbd5e1;
    background: #f1f5f9;
    color: #2F4F4F;
    font-size: 24px;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    outline: none;
  `;
  
  backspaceBtn.onmouseover = () => {
    backspaceBtn.style.background = "#e2e8f0";
    backspaceBtn.style.transform = "scale(1.05)";
  };
  
  backspaceBtn.onmouseout = () => {
    backspaceBtn.style.background = "#f1f5f9";
    backspaceBtn.style.transform = "scale(1)";
  };
  
  backspaceBtn.onclick = () => {
    if (!answered[index]) {
      clearSelectedAnswer();
      // Focus on options
      const firstBtn = optionsRow.querySelector(".option-btn");
      if (firstBtn) {
        firstBtn.focus();
      }
    }
  };

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(backspaceBtn);
  letters.appendChild(inputWrapper);

  // ===== ANSWERED =====

  if(answered[index]){

    input.value = answer;

    input.readOnly = true;

    input.classList.add("correct");

    nextBtn.disabled = false;

    checkBtn.disabled = true;

    optionsRow.innerHTML = "";
    
    // Hide backspace button when answered
    backspaceBtn.style.display = "none";

  }

  // ===== NEW =====

  else {

    input.value = "";

    input.readOnly = true;

    input.classList.remove("correct");
    input.classList.remove("wrong");

    nextBtn.disabled = true;

    checkBtn.disabled = true;

    selectedAnswer = "";

    backspaceBtn.style.display = "none";

    renderOptions(answer);

  }

  prevBtn.disabled = index === 0;

}

// ================= CHECK =================

checkBtn.onclick = () => {

  const user =
    document
    .querySelector(".single-input")
    .value
    .trim()
    .toLowerCase();

  const correctAnswer = (

    isMobile()

    ? (questions[index].a_mobile || questions[index].a)

    : questions[index].a

  ).toLowerCase();

  const input =
    document.querySelector(".single-input");
  
  const backspaceBtn = document.getElementById("backspaceBtn");

  // ===== CORRECT =====

  if(user === correctAnswer){

    answered[index] = true;

    score++;

    input.classList.add("correct");
    input.classList.remove("wrong");

    input.readOnly = true;

    checkBtn.disabled = true;

    nextBtn.disabled = false;

    // Hide backspace button
    if (backspaceBtn) {
      backspaceBtn.style.display = "none";
    }

    playCorrect();

    fireSmallConfetti();

    showPopup(true);

    // Disable all option buttons
    optionsRow.querySelectorAll(".option-btn").forEach(b => {
      b.disabled = true;
    });

    if(index === questions.length - 1){

      setTimeout(() => {

        prevBtn.disabled = true;

        nextBtn.disabled = true;

        showFinal();

      },800);

    }

  }

  // ===== WRONG =====

  else {

    // Show wrong popup
    playWrong();
    showPopup(false);

    // Add wrong class to input
    input.classList.add("wrong");
    
    // Clear the input and reset after animation
    setTimeout(() => {
      clearSelectedAnswer();
      // Hide backspace button after clearing
      if (backspaceBtn) {
        backspaceBtn.style.display = "none";
      }
    }, 500);

  }

};

// ================= KEYBOARD BACKSPACE SUPPORT =====

document.addEventListener('keydown', function(e) {
  // Check if Backspace key is pressed (keyCode 8 or key 'Backspace')
  if (e.key === 'Backspace' || e.keyCode === 8) {
    
    // Check if any question is answered - don't allow backspace on answered questions
    if (answered[index]) return;
    
    const input = document.querySelector('.single-input');
    
    // If input has a value (selected answer), clear it
    if (input && input.value.trim() !== '') {
      e.preventDefault(); // Prevent browser back navigation
      clearSelectedAnswer();
      // Hide backspace button
      const backspaceBtn = document.getElementById("backspaceBtn");
      if (backspaceBtn) {
        backspaceBtn.style.display = "none";
      }
    }
  }
});

// ================= NAVIGATION =================

prevBtn.onclick = () => {

  index--;

  load();

};

nextBtn.onclick = () => {

  index++;

  load();

};

// ================= FINAL =================

function showFinal(){

  const finalPopup =
    document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  finalPopup.classList.add("active");

  document.getElementById("finalScore")
  .textContent =
    `🎯 ${score}/${questions.length}`;

  document.getElementById("stars")
  .textContent =
    "⭐".repeat(score);

  fireBigConfetti();

}

// ================= RESTART =================

function restart(){

  index = 0;

  score = 0;

  answered.fill(false);

  document
  .getElementById("finalPopup")
  .style.display = "none";

  load();

}

// ================= START =================

load();