/* ================= QUIZ DATA ================= */
const quizData = [

{
title: "Q1. बच्चे कौन-सा खेल खेलने के लिए सोच रहे थे?",

image: "../assets/images/kidsplay.png",

options: [

{ text: "क्रिकेट" },

{ text: "एक नया खेल"},

{ text: "फुटबॉल" }

],

answer: "एक नया खेल"
},

{
title: "Q2. कविता के अनुसार बच्चे कहाँ इकट्ठा हुए थे?",

image: "../assets/images/kidstogether.png",

options: [

{ text: "आँगन में" },

{ text: "पार्क में"},

{ text: "घर के बाहर" }

],

answer: "घर के बाहर"
},

{
title: "Q3. बच्चों ने मिलकर कौन-सा खेल खेला?",

image: "../assets/images/kidrun.png",

options: [

{ text: "क्रिकेट" },

{ text: "पकड़म-पकड़ाई"},

{ text: "कबड्डी" }

],

answer: "पकड़म-पकड़ाई"
},

{
title: "Q4. उस नए खेल में क्या नहीं थी?",

image: "../assets/images/kidsfight.png",

options: [

{ text: "हार-जीत" },

{ text: "दोस्ती"},

{ text: "हँसी" }

],

answer: "हार-जीत"
},

];
/* ================= STATE ================= */

let current = 0;
let score = 0;
const answerState = quizData.map(() => ({
  answered: false,
  selected: null
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

// function speak(text) {
//   speechSynthesis.cancel();
 
//   const msg = new SpeechSynthesisUtterance(text);  
 
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


/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
 div.innerHTML = `
  <div class="img-box">
   <div class="option-img">${opt.text}</div>
  </div>
  <div class="label">${opt.text}</div>
`;
if (state.answered) {

  div.classList.add("disabled");

  if (opt.text === q.answer) {
    div.classList.add("correct-lock");
  }
  else {
    div.classList.add("fade-wrong");
  }

} else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}


/* ================= CHECK ANSWER ================= */
function checkAnswer(optionDiv, selected) {

  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  state.selected = selected; // save selected answer

  const options = document.querySelectorAll(".option");

  if (selected === correct) {

    state.answered = true;
    score++;
    scoreBox.textContent = "Score: " + score;

    options.forEach((o) => {

      const text = o.querySelector(".label").textContent;

      o.classList.add("disabled");

      if (text === correct) {
        o.classList.add("correct-lock");
      } 
      else {
        o.classList.add("fade-wrong");   // fade other options
      }

    });

    nextBtn.disabled = false;

    // speak("Correct");
    playCorrectSound();
    showPopup(true);
    fireConfetti();

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }

  } else {

    // speak("Wrong");
    playWrongSound();

    optionDiv.classList.add("wrong-shake");

    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);

  }

}

/* ================= POPUPS (NEW SYSTEM) ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

    // 🔥 RESET animation (important)
  icon.style.animation = "none";
  void icon.offsetWidth; 
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

 if (isCorrect) {
  icon.textContent = "🌟";
  title.textContent = "बहुत बढ़िया!";
  msg.textContent = "आपका उत्तर सही है।";

} else {
  icon.textContent = "😔";
  title.textContent = "ओह नहीं!";
  msg.textContent = "फिर से प्रयास करें।";
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `परिणाम: ${score}/${quizData.length}`;

   document.getElementById("stars").textContent = "🏅🏅🏅";
     fireConfettif(); 

 

 
}


/* ================= BUTTONS ================= */

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 }
  });
}

/* ================= START ================= */

loadQuestion();