const questions = [

{
  q: "Q1. क्",
  a: ["क"],
  options: ["क","ख","ग","घ"],
  img: "../assets/images/tomato.png",
},

{
  q: "Q2. झ्",
  a: ["झ"],
  options: ["च","छ","ज","झ"],
  img: "../assets/images/thathera.png",
},

{
  q: "Q3. द्",
  a: ["द"],
  options: ["ट","ठ","ड","द"],
  img: "../assets/images/tarbuj.png",
},

{
  q: "Q4. ल्",
  a: ["ल"],
  options: ["य","र","ल","व"],
  img: "../assets/images/bhalu.png",
},

{
  q: "Q5. ग्",
  a: ["ग"],
  options: ["क","ख","ग","घ"],
  img: "../assets/images/patang.png",
},

{
  q: "Q6. ठ्",
  a: ["ठ"],
  options: ["ट","ठ","ड","ढ"],
  img: "../assets/images/potcap.png",
},

{
  q: "Q7. ब्",
  a: ["ब"],
  options: ["प","फ","ब","भ"],
  img: "../assets/images/goat.png",
},

{
  q: "Q8. स्",
  a: ["स"],
  options: ["श","ष","स","ह"],
  img: "../assets/images/dhanush.png",
},

{
  q: "Q9. म्",
  a: ["म"],
  options: ["भ","म","ध","ब"],
  img: "../assets/images/tomato.png",
},

{
  q: "Q10. च्",
  a: ["च"],
  options: ["च","छ","ज","झ"],
  img: "../assets/images/thathera.png",
},

{
  q: "Q11. न्",
  a: ["न"],
  options: ["त","थ","द","न"],
  img: "../assets/images/tarbuj.png",
},

{
  q: "Q12. ज्",
  a: ["ज"],
  options: ["च","छ","ज","झ"],
  img: "../assets/images/bhalu.png",
},

];
let index = 0;
let score = 0;


const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputsRow = document.getElementById("inputsContainer");

const answerInput = document.getElementById("answerInput");

const checkAnswerBtn = document.getElementById("checkAnswerBtn");

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

  
if(userAnswers[index].correct){

    answerInput.value = userAnswers[index].selected;

    answerInput.disabled = true;

    checkAnswerBtn.disabled = true;

    answerInput.classList.add("correct-input");

}else{

    answerInput.value = "";

    answerInput.disabled = false;

    checkAnswerBtn.disabled = false;

    answerInput.classList.remove(
      "correct-input",
      "wrong-input"
    );

}

  questionText.innerText = q.q;

  image.innerHTML = `

<div class="matra-box">

${q.q.split(" ").pop()}

</div>

`;

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

    // already solved
    if(userAnswers[index].correct) return;

    // put clicked option into input
    answerInput.value = opt;

};

    optionsWrap.appendChild(optionBtn);

  });

  inputsRow.appendChild(optionsWrap);

}

checkAnswerBtn.onclick = () => {

    const q = questions[index];

    const value = answerInput.value;

    if(value === "") return;

    // CORRECT
    if(value === q.a[0]){

        userAnswers[index].correct = true;

        userAnswers[index].selected = value;

        if (!userAnswers[index].scored) {

            score++;

            userAnswers[index].scored = true;

        }

        answerInput.classList.remove("wrong-input");

        answerInput.classList.add("correct-input");

        answerInput.disabled = true;

        checkAnswerBtn.disabled = true;

        nextBtn.disabled = false;

        document.querySelectorAll(".option-btn").forEach((btn)=>{

            btn.disabled = true;

            btn.classList.add("disabled-option");

            if(btn.innerText === value){

                btn.classList.remove("disabled-option");

                btn.classList.add("correct-option");

            }

        });

        playCorrectSound();

        smallConfetti();

        showPopup(true);

        if(index === questions.length - 1){

            setTimeout(()=>{

                showFinal();

            },1200);

        }

    }

    // WRONG
    else{

        answerInput.classList.add("wrong-input");

        playWrongSound();

        showPopup(false);

        setTimeout(()=>{

            answerInput.value = "";

            answerInput.classList.remove("wrong-input");

        },700);

    }

};

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