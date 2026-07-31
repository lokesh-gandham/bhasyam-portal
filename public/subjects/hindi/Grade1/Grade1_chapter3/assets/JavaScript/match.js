const leftData = [
  {
    id: "1",
    img: "../assets/images/tomato2.png",
    match: "c", // ऋ
  },
  {
    id: "2",
    img: "../assets/images/pillow2.png",
    match: "d", // ओ
  },
  {
    id: "3",
    img: "../assets/images/patang11.png",
    match: "b", // ए
  },
  {
    id: "4",
    img: "../assets/images/tierd22.png",
    match: "a", // उ
  },
];

const rightData = [
  {
    match: "a",
    text: "थ",
  },
  {
    match: "b",
    text: "प",
  },
  {
    match: "c",
    text: "ट",
  },
  {
    match: "d",
    text: "त",
  },
];
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
    playWrongSound();

    div.classList.add("error");

    setTimeout(() => {
      div.classList.remove("error");
    }, 400);
  }
});

    rightCol.appendChild(div);
  });
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
  playCorrectSound();
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
  path.setAttribute("stroke", "#c6c7d3");
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
    `आपका नतीजा: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  fireConfettif();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();
