const questions = [

{
  question: "Q1. य ______",
  answer: "र",

  options:["र","ष","य","ल"],

  image: "../assets/images/rath.png",
},

{
  question: "Q2. ष ______",
  answer: "स",

  options:["य","स","ह","ष"],

  image: "../assets/images/sun.png",
},

{
  question: "Q3. त्र ______",
  answer: "ज्ञ",

  options:["त्र","ज्ञ","र","ल"],

  image: "../assets/images/gyani.png",
},

{
  question: "Q4. र ______",
  answer: "ल",

  options:["व","र","ष","ल"],

  image: "../assets/images/laddu.png",
},

{
  question: "Q5. स ______",
  answer: "ह",

  options:["ज्ञ","स","ह","य"],

  image: "../assets/images/hal.png",
},

{
  question: "Q6. त्र ______",
  answer: "ज्ञ",

  options:["त्र","ह","क्ष","ज्ञ"],

  image: "../assets/images/gyani.png",
},

];

let currentQuestion = 0;
let score = 0;
const answers = new Array(questions.length).fill(null);
const optionsWrap = document.getElementById("optionsWrap");

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const input = document.getElementById("answerInput");

input.readOnly = true;

// hide cursor
input.style.caretColor = "transparent";

// stop mobile keyboard
input.setAttribute("inputmode", "none");

// disable typing
input.addEventListener("keydown", (e) => {
  e.preventDefault();
});

// disable paste
input.addEventListener("paste", (e) => {
  e.preventDefault();
});

// disable drag/drop
input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
});

// disable manual input
input.addEventListener("beforeinput", (e) => {
  e.preventDefault();
});
input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
});

input.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;

  for (let item of items) {
    if (item.type.indexOf("image") !== -1) {
      e.preventDefault();
    }
  }
});

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

    input.value =
      answers[currentQuestion];

    input.disabled = true;

    input.classList.add(
      "input-correct"
    );

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
    input.value = opt;

    // remove old styles
    input.classList.remove(
      "input-wrong",
      "input-correct"
    );

    // wait little then check
    setTimeout(() => {

        // CORRECT
        if(opt === q.answer){

            answers[currentQuestion] = opt;

            score++;

            input.disabled = true;

            input.classList.add(
              "input-correct"
            );

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

            input.classList.add(
              "input-wrong"
            );

            btn.classList.add(
              "wrong-option"
            );

            playWrongSound();

            showPopup(false);

            setTimeout(()=>{

                input.value = "";

                input.classList.remove(
                  "input-wrong"
                );

                btn.classList.remove(
                  "wrong-option"
                );

            },700);

        }

    },300);

};

    optionsWrap.appendChild(btn);

});

  input.value = answers[currentQuestion] || "";
  input.disabled = answers[currentQuestion] !== null;


  input.classList.remove("input-wrong", "input-correct");

  if (answers[currentQuestion] !== null) {
    input.classList.add("input-correct");
  }

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

  document.getElementById("finalScore").textContent =
    `आपके अंक: ${score} / ${questions.length}`;
 document.getElementById("stars").textContent = "👌👌👌";

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
