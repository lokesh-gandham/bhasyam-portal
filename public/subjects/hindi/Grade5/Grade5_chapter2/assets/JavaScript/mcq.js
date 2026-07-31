
const quizData = [

{
  q: "1)",
  imgText: "ो",

  options: [

    { text:"झंडा" },

    { text:"भोर" },

    { text:"किताब" },

    { text:"तोता" }

  ],

  a: [1,3]
},

{
  q: "2)",
   imgText: "ौ",

  options: [

    { text:"लौकी" },
   
    { text:"टोकरी" },
   
    { text:"दौलत" },
   
    { text:"टेबल" },




  ],

   a: [0,2]
},



{
  q: "3)",
  imgText: "ै",

  options: [

    { text:"चोर" },
   
    { text:"नैया" },
   
    { text:"मोर" },
   
    { text:"पैसा" },




  ],

   a: [1,3]
},

{
  q: "4)",
  imgText: "ी",

  options: [

    { text:"तीन" },
   
    { text:"दिन" },
   
    { text:"सिर" },
   
    { text:"सीढ़ी" },




  ],

   a: [0,3]
},

{
  q: "5)",
  imgText: "ू",

  options: [

    { text:"पुल" },
   
    { text:"फूल" },
   
    { text:"आलू" },
   
    { text:"बगुला" },




  ],

   a: [1,2]
},

];


let current = 0;
let score = 0;
let answered = Array(quizData.length)
.fill()
.map(()=>[]);

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

imgEl.innerHTML = "";

if(q.imgText){

  imgEl.innerHTML = `
    <div class="matra-box">
      ${q.imgText}
    </div>
  `;
}
  optEl.innerHTML = "";
  nextBtn.disabled =
answered[current].length
!== q.a.length;

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

    if (
answered[current].length > 0
) {
     if (q.a.includes(i))
d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
    if(
answered[current].includes(i)
) return;

      if (q.a.includes(i)) {
       answered[current].push(i);
        score++;

        d.classList.add("correct");

      

        // speak("Correct");
         playCorrectSound();
        smallConfetti();
        showPopup(true);

if(
answered[current].length
===
q.a.length
){

nextBtn.disabled = false;

[...optEl.children].forEach((o,index)=>{

if(
!q.a.includes(index)
){
o.classList.add("disabled");
}

});

}

        if(
answered.every(
(a,index)=>
a.length ===
quizData[index].a.length
)
)setTimeout(showFinal, 1600);
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

if(current > 0){
current--;
loadQuestion();
}

};

nextBtn.onclick = () => {

if(
current <
quizData.length - 1
){
current++;
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

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपका नतीजा: 5/5`;

document.getElementById("stars").textContent = "🌟🌟🌟";

  popup.style.display = "flex";

  bigConfetti();
}

loadQuestion();
