// ==========================================================
// English Matching Game (Animals -> Body Parts)
// Data derived from reference image:
//   1. elephant -> d. trunk
//   2. eagle    -> a. claws
//   3. deer     -> b. horns
//   4. lion     -> c. mane
// ==========================================================

const leftData = [
  {
    id: "1",
    match: "d",
    img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f418.svg", // elephant
    alt: "elephant",
  },
  {
    id: "2",
    match: "a",
    img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f985.svg", // eagle
    alt: "eagle",
  },
  {
    id: "3",
    match: "b",
    img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98c.svg", // deer
    alt: "deer",
  },
  {
    id: "4",
    match: "c",
    img: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f981.svg", // lion
    alt: "lion",
  },
];

const rightData = [
  { match: "a", text: "claws" },
  { match: "b", text: "horns" },
  { match: "c", text: "mane" },
  { match: "d", text: "trunk" },
];

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const svg = document.getElementById("line-canvas");

function init() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  // ---------- LEFT COLUMN: [image] [dot] ----------
  leftData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item left-item";
    div.dataset.match = item.match;

    div.innerHTML = `
        <img src="${item.img}" alt="${item.alt}" class="left-img">
        <div class="dot"></div>
    `;

    div.onclick = () => {
      if (div.classList.contains("matched")) return;

      document
        .querySelectorAll(".left .item")
        .forEach((i) => i.classList.remove("active"));

      div.classList.add("active");
      selectedLeft = div;
    };

    leftCol.appendChild(div);
  });

  // ---------- RIGHT COLUMN: [dot] [orange rounded text box] ----------
  rightData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item right-item";
    div.dataset.id = item.match;

    div.innerHTML = `
        <div class="dot"></div>
        <div class="text-box">${item.text}</div>
    `;

    div.onclick = () => {
      if (!selectedLeft || div.classList.contains("matched")) return;

      if (selectedLeft.dataset.match === div.dataset.id) {
        handleMatch(selectedLeft, div);
      } else {
        playSound("wrongSound");
        speak("Wrong");
        div.classList.add("error");
        setTimeout(() => div.classList.remove("error"), 400);
      }
    };

    rightCol.appendChild(div);
  });
}

function playSound(id) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    el.currentTime = 0;
    el.play();
  } catch (e) { /* no-op */ }
}

function speak(t) {
  try {
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";
    msg.volume = 0.25;
    msg.rate = 1;
    msg.pitch = 1;
    speechSynthesis.speak(msg);
  } catch (e) { /* no-op */ }
}

function bigConfetti() {
  if (typeof confetti !== "function") return;
  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 40,
    origin: { y: 0.6 },
  });
}

function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  drawCurve(leftEl, rightEl);
  connections.push({ from: leftEl, to: rightEl });

  selectedLeft = null;
  matchesFound++;

  playSound("correctSound");
  speak("Correct");
  bigConfetti();

  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 700);
  }
}

function drawCurve(el1, el2) {
  // Anchor lines to the dots for a clean connection like the reference image
  const dot1 = el1.querySelector(".dot") || el1;
  const dot2 = el2.querySelector(".dot") || el2;

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
  path.setAttribute("stroke", "#22c55e");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-dasharray", "8 6");

  svg.appendChild(path);
}

function showFinal() {
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  document.getElementById("finalPopup").style.display = "flex";
  bigConfetti();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();