const leftData = [
  {
    id: "1",
    text: "1. Earth",
    match: "b",
    img: "../assets/images/earth.png",
  },
  {
    id: "2",
    text: "2. Well",
    match: "d",
    img: "../assets/images/well.png",
  },
  {
    id: "3",
    text: "3. Rain",
    match: "a",
    img: "../assets/images/rain.png",
  },
  {
    id: "4",
    text: "4. Water vapour",
    match: "e",
    img: "../assets/images/watervapour.png",
  },
  {
    id: "5",
    text: "5. Ice",
    match: "c",
    img: "../assets/images/ice.png",
  },


  
];

const rightData = [
  { match: "a", text: "Main source of water" },
  { match: "b", text: "Blue planet" },
  { match: "c", text: "Solid state of water" },
  { match: "d", text: "Underground water" },
  { match: "e", text: "Gaseous state of water" },
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

 leftData.forEach((item) => {
  const div = document.createElement("div");
  div.className = "item";
  div.dataset.match = item.match;

  div.innerHTML = `
      <img src="${item.img}" class="left-img">
      <span>${item.text}</span>
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

 rightData.forEach((item) => {
  const div = document.createElement("div");
  div.className = "item";
  div.dataset.id = item.match;

  div.innerHTML = `
      <div class="answer-box"></div>
      <span>${item.text}</span>
  `;

  div.onclick = () => {
    if (!selectedLeft || div.classList.contains("matched")) return;

    if (selectedLeft.dataset.match === div.dataset.id) {
      handleMatch(selectedLeft, div);
    } else {
      speak("Wrong");
      div.classList.add("error");
      setTimeout(() => div.classList.remove("error"), 400);
    }
  };

  rightCol.appendChild(div);
});
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function bigConfetti() {
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

  // ? get image from LEFT
  const img = leftEl.querySelector("img").cloneNode(true);

  // ? put image into RIGHT answer box
  const box = rightEl.querySelector(".answer-box");
  box.appendChild(img);

  drawCurve(leftEl, rightEl);

  connections.push({ from: leftEl, to: rightEl });

  selectedLeft = null;
  matchesFound++;
  speak("Correct");
  bigConfetti();
  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 700);
  }
}

function drawCurve(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

  const x1 = rect1.right - containerRect.left;
  const y1 = rect1.top + rect1.height / 2 - containerRect.top;

  const x2 = rect2.left - containerRect.left;
  const y2 = rect2.top + rect2.height / 2 - containerRect.top;

  const cx = (x1 + x2) / 2;

  const pathData = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#22c55e");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-dasharray", "8 6"); // dashed line

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
