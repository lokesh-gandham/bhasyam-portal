const quizData = [

{
  q: " ",
  img: "../assets/images/thakan.png",
  options: [
    { text: "ट" },
    { text: "ठ" },
    { text: "ड" },
    { text: "ढ" }
  ],
  a: 1
},

{
  q: "",
  img: "../assets/images/thakan2.png",
  options: [
    { text: "ट" },
    { text: "ड" },
    { text: "ढ" },
    { text: "थ" }
  ],
  a: 2
},

{
  q: "",
  img: "../assets/images/tota.png",
  options: [
    { text: "त" },
    { text: "थ" },
    { text: "द" },
    { text: "ध" }
  ],
  a: 0
},

{
  q: "",
  img: "../assets/images/pa.png",
  options: [
    { text: "प" },
    { text: "द" },
    { text: "ध" },
    { text: "न" }
  ],
  a: 0
}

];


let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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
  const duration = 100;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((opt, i) => {
    const d = document.createElement("div");
    d.className = "option";

    d.innerHTML = `

<div class="img-box">

  <div class="option-img">
    ${opt.text}
  </div>

</div>

<div class="label">
  ${opt.text}
</div>

`;

    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");

        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        // speak("Correct");
         playCorrectSound();
        smallConfetti();
        showPopup(true);

        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
      } else {
        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);

        // speak("Wrong");
         playWrongSound();
        showPopup(false);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
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

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपका नतीजा: ${score} / ${quizData.length}`;

document.getElementById("stars").textContent = "🌟🌟🌟";

  popup.style.display = "flex";

  bigConfetti();
}

loadQuestion();
