const leftData = [
  {
    id: "1",
    img: "../assets/images/tub.png",
    match: "f",
  },
  {
    id: "2",
    img: "../assets/images/tap.png",
    match: "e",
  },
  {
    id: "3",
    img: "../assets/images/sky.png",
    match: "b",
  },
  {
    id: "4",
    img: "../assets/images/bear.png",
    match: "d",
  },
  {
    id: "5",
    img: "../assets/images/crocodile.png",
    match: "a",
  },
  {
    id: "6",
    img: "../assets/images/batakh.png",
    match: "c",
  },
];

const rightData = [
  {
    match: "a",
    text: "मगर",
  },
  {
    match: "b",
    text: "गगन",
  },
  {
    match: "c",
    text: "बतख",
  },
  {
    match: "d",
    text: "ऋक्ष",
  },
  {
    match: "e",
    text: "नल",
  },
  {
    match: "f",
    text: "टब",
  },
];

let audioCtx = null;

function playCorrect() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume().then(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.2;
            osc.type = "sine";
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.45);
            osc.stop(audioCtx.currentTime + 0.45);
        });
    } catch(e) {}
}

function playWrong() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume().then(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 480;
            gain.gain.value = 0.2;
            osc.type = "triangle";
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
            osc.stop(audioCtx.currentTime + 0.4);
        });
    } catch(e) {}
}

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];
let matchNumber = 1;

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const svg = document.getElementById("line-canvas");

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function init() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  leftData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.match = item.match;

div.innerHTML = `

  <div class="img-box">

    <img src="${item.img}" class="left-icon">

  </div>

  <div class="dot"></div>

`;
  div.addEventListener("click", (e) => {
  e.preventDefault();

  if (div.classList.contains("matched")) return;

  document
    .querySelectorAll(".left .item")
    .forEach((i) => i.classList.remove("active"));

  div.classList.add("active");
  selectedLeft = div;
});

    leftCol.appendChild(div);
  });

  rightData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = item.match;

   div.innerHTML = `
  <div class="dot"></div>
  <div class="circle">${item.text}</div>
`;

 div.addEventListener("click", (e) => {
  e.preventDefault();

  if (!selectedLeft || div.classList.contains("matched")) return;

  if (selectedLeft.dataset.match === div.dataset.id) {
    handleMatch(selectedLeft, div);
  } else {
    // speak("गलत");
    playWrong()

    div.classList.add("error");

    setTimeout(() => {
      div.classList.remove("error");
    }, 400);
  }
});

    rightCol.appendChild(div);
  });
}



function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  // speak("Correct");
  //  speak("सही");
  playCorrect();
  fireConfetti();

  // ✅ ALWAYS DRAW LINE (mobile + desktop)
  drawCurve(leftEl, rightEl);
  connections.push({ from: leftEl, to: rightEl });

  selectedLeft = null;
  matchesFound++;

  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 900);
  }
}

function drawCurve(el1, el2) {
  const dot1 = el1.querySelector(".dot");
const dot2 = el2.querySelector(".dot");

const rect1 = dot1.getBoundingClientRect();
const rect2 = dot2.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

 const x1 = rect1.left + rect1.width / 2 - containerRect.left;
const y1 = rect1.top + rect1.height / 2 - containerRect.top;

const x2 = rect2.left + rect2.width / 2 - containerRect.left;
const y2 = rect2.top + rect2.height / 2 - containerRect.top;

  const cx = (x1 + x2) / 2;

  const pathData = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#E9B63B");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");

  svg.appendChild(path);
}

function showFinal() {
  svg.style.zIndex = "0";
  leftCol.style.zIndex = "0";
  rightCol.style.zIndex = "0";
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `आपका परिणाम: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐⭐⭐";

  popup.style.display = "flex";
   const duration = 2000;

  const end =
    Date.now() + duration;

 (function frame(){

    confetti({

      particleCount:6,

      angle:60,

      spread:55,

      origin:{x:0}

    });

    confetti({

      particleCount:6,

      angle:120,

      spread:55,

      origin:{x:1}

    });

    if(Date.now() < end){

      requestAnimationFrame(frame);

    }

  })();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();
