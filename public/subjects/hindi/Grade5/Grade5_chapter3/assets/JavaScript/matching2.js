let popupTimer = null;

// const pairs = [
//  { l:"ख ", r:"ख " },
//  { l:"घ ", r:"घ " },
//  { l:"झ ", r:"झ " },
//  { l:"छ ", r:"छ " },

// ];

// const images = {
//  "छ ": "../assets/images/brain_function.png",
//  "झ ": "../assets/images/digestion.png",
//  "ख ": "../assets/images/breathing.png",
//  "घ ": "../assets/images/heart_pumping.png",

// };

const pairs = [
  { l: "गिल्ली", r: "डंडा" },

  { l: "गेंद", r: "बल्ला" },

  { l: "पकड़म", r: "पकड़ाई" },

  { l: "रस्सी", r: "कूद" },

  { l: "मल्ल", r: "खंभ" },

  { l: "तलवार", r: "बाजी" },
];

/* =========================
   LEFT SIDE IMAGES
========================= */

const leftImages = {
  गिल्ली: "../assets/images/gilli.png",

  गेंद: "../assets/images/ball.png",

  पकड़म: "../assets/images/pakadam.png",

  रस्सी: "../assets/images/rope.png",

  मल्ल: "../assets/images/mall.png",

  तलवार: "../assets/images/sword.png",
};

/* =========================
   RIGHT SIDE IMAGES
========================= */

const rightImages = {
  डंडा: "../assets/images/danda.png",

  बल्ला: "../assets/images/bat.png",

  पकड़ाई: "../assets/images/pakadai.png",

  कूद: "../assets/images/jump.png",

  खंभ: "../assets/images/pole.png",

  बाजी: "../assets/images/baji.png",
};

/* =========================
   CORRECT ANSWERS
========================= */

const correctPairs = {
  गिल्ली: "डंडा",

  गेंद: "बल्ला",

  पकड़म: "पकड़ाई",

  रस्सी: "कूद",

  मल्ल: "खंभ",

  तलवार: "बाजी",
};

let armed = null;
let score = 0;
let matched = 0;
const letters = ["a", "b", "c", "d", "e"];
const letterColors = ["#f4b6b6", "#f7d58a", "#cfe5a6"];
const leftCol = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const scoreBox = document.getElementById("scoreBox");

function updateScore() {
  scoreBox.textContent = "Score: " + score;
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
      audioCtx.currentTime + 0.5,
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
      audioCtx.currentTime + 0.4,
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
document.body.addEventListener("click", initAudioOnFirstClick, { once: true });

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;

  if (popupTimer) clearTimeout(popupTimer);

  if (!final) {
    popupTimer = setTimeout(() => (popup.style.display = "none"), 1000);
  }
}

function render() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  pairs.forEach((p, index) => {
    const l = document.createElement("div");
    l.className = "item";
    l.innerHTML = `

<div class="text-bg">${p.l}</div>

<div class="dot"></div>
`;
    l.onclick = () => arm(l, p);
    leftCol.appendChild(l);
  });

  [...pairs]
    .sort(() => Math.random() - 0.5)
    .forEach((p, index) => {
      const r = document.createElement("div");
      r.className = "item";
      r.innerHTML = `
<div class="dot"></div>
<div class="text-bg">${p.r}</div>
`;
      r.onclick = () => attempt(r, p);
      rightCol.appendChild(r);
    });
}

function arm(el, p) {

    if (el.classList.contains("correct")) return;

    document.querySelectorAll(".left .item").forEach(item=>{
        item.classList.remove("active");
    });

    el.classList.add("active");

    armed = {
        el,
        p
    };
}

function attempt(el, p) {
  if (!armed || el.classList.contains("correct")) return;

  showRightClickEffect(el);

  if (correctPairs[armed.p.l] === p.r) {
    drawLine(armed.el, el);
    armed.el.classList.remove("active");
    // remove active highlight
    el.classList.remove("active");

    armed.el.classList.add("correct");
    el.classList.add("correct");

    // ⭐ show letter on left item
    // const letter = el.querySelector(".letter").textContent;

    score++;
    matched++;
    updateScore();

    // speak("Correct");
    playCorrectSound();

    fireConfetti();

    document
      .querySelectorAll(".left .item")
      .forEach((i) => i.classList.remove("armed"));
    armed = null;

    if (matched === pairs.length) {
      setTimeout(finalPopup, 1100);
    }
  } else {
    // speak("Wrong");
    playWrongSound();

    // ⬅️ LEFT QUESTION STAYS SELECTED (NO RESET)
  }
}

function finalPopup() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `परिणाम: ${score} / ${pairs.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);
  fireConfettif();
}

render();

// const leftItems = document.querySelectorAll(".left .item");

// leftItems.forEach((item) => {
//   item.addEventListener("click", () => {
//     leftItems.forEach((i) => i.classList.remove("active"));

//     item.classList.add("active");
//     setTimeout(() => {
//       item.classList.remove("active");
//     }, 100);
//   });
// });

function drawLine(leftEl, rightEl) {
  const svg = document.getElementById("lineLayer");

  svg.setAttribute("width", svg.clientWidth);
  svg.setAttribute("height", svg.clientHeight);
  svg.setAttribute("viewBox", `0 0 ${svg.clientWidth} ${svg.clientHeight}`);

  const leftRect = leftEl.getBoundingClientRect();
  const rightRect = rightEl.getBoundingClientRect();
  const svgRect = document.getElementById("lineLayer").getBoundingClientRect();

  const gap = 14; // distance from box

  /* start + end points */

  const leftDot = leftEl.querySelector(".dot");
  const rightDot = rightEl.querySelector(".dot");

  const leftDotRect = leftDot.getBoundingClientRect();
  const rightDotRect = rightDot.getBoundingClientRect();

  const startX = leftDotRect.left + leftDotRect.width / 2 - svgRect.left;

  const startY = leftDotRect.top + leftDotRect.height / 2 - svgRect.top;

  const endX = rightDotRect.left + rightDotRect.width / 2 - svgRect.left;

  const endY = rightDotRect.top + rightDotRect.height / 2 - svgRect.top;

  /* smaller curve for better shape */

  const curve = (endX - startX) * 0.35;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  const d = `
M ${startX} ${startY}
C ${startX + curve} ${startY},
  ${endX - curve} ${endY},
  ${endX} ${endY}
`;

  path.setAttribute("d", d);
  path.setAttribute("class", "match-line");

  svg.appendChild(path);
  // LEFT ARROW ◀

  // const startArrow = document.createElementNS("http://www.w3.org/2000/svg","text");

  // startArrow.setAttribute("x", startX - 6);
  // startArrow.setAttribute("y", startY + 5);
  // startArrow.setAttribute("text-anchor", "middle");
  // startArrow.setAttribute("font-size", "18");
  // startArrow.setAttribute("fill", "#6ecbff");

  // startArrow.textContent = "✦";

  // svg.appendChild(startArrow);

  // // RIGHT ARROW ▶
  // const endArrow = document.createElementNS("http://www.w3.org/2000/svg","text");

  // endArrow.setAttribute("x", endX + 1);
  // endArrow.setAttribute("y", endY + 5);
  // endArrow.setAttribute("text-anchor", "middle");
  // endArrow.setAttribute("font-size", "18");
  // endArrow.setAttribute("fill", "#6ecbff");

  // endArrow.textContent = "✦";

  // svg.appendChild(endArrow);
}
function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function showRightClickEffect(el) {
  el.classList.add("temp-active");

  setTimeout(() => {
    el.classList.remove("temp-active");
  }, 500);
}
