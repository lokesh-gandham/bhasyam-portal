const leftData = [
  {
    id: "1",
    text: "Lungs",
    match: "e",
    img: "../assets/images/lungs1.png",
  },
  {
    id: "2",
    text: "Brain",
    match: "c",
    img: "../assets/images/brain.png",
  },
  {
    id: "3",
    text: "Muscles",
    match: "d",
    img: "../assets/images/muscles1.png",
  },
  {
    id: "4",
    text: "Intestines",
    match: "a",
    img: "../assets/images/intenstine.png",
  },
  {
    id: "5",
    text: "Heart",
    match: "b",
    img: "../assets/images/heart1.png",
  },
];

const rightData = [
  { match: "a", text: "Remove Waste" },
  { match: "b", text: "Pumps blood" },
  { match: "c", text: "Helps us think" },
  { match: "d", text: "Help in movement" },
  { match: "e", text: "Help us breathe" },
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

    div.innerHTML = `<span>${item.text}</span>`;

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

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 },
  });
}

function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  if (false) {
    const num = matchesFound + 1;
    leftEl.dataset.num = num;
    rightEl.dataset.num = num;
  } else {
    drawCurve(leftEl, rightEl);
    connections.push({ from: leftEl, to: rightEl });
  }

  selectedLeft = null;
  matchesFound++;
  speak("Correct");
  fireConfetti();

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
  path.setAttribute("stroke", "#576A8F");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");

  svg.appendChild(path);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: 5/5`;
  const starsHtml = "⭐".repeat(5);
  document.getElementById("stars").innerHTML = starsHtml;
  fireConfettif();
}

function restart() {
  // hide popup
  document.getElementById("finalPopup").style.display = "none";

  // reset values
  selectedLeft = null;
  matchesFound = 0;
  score = 0;
  connections = [];

  // clear svg lines
  svg.innerHTML = "";

  // rebuild game
  init();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";

  if (window.innerWidth > 768) {
    connections.forEach((c) => drawCurve(c.from, c.to));
  }
});

init();
