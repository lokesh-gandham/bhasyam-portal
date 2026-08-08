const leftData = [
  {
    id: "1",
    text: "1. same",
    match: "e",
    img: "assets/images/same.png",
  },
  {
    id: "2",
    text: "2. direct",
    match: "d",
    img: "assets/images/straight.png",
  },
  {
    id: "3",
    text: "3. near",
    match: "b",
    img: "assets/images/near.png",
  },
  {
    id: "4",
    text: "4. difficult",
    match: "a",
    img: "assets/images/difficult.png",
  },
  {
    id: "5",
    text: "5. asleep",
    match: "c",
    img: "assets/images/sleep.png",
  },
];

const rightData = [
  { match: "a", text: "easy", img: "assets/images/easy.png" },
  { match: "b", text: "far", img: "assets/images/far.png" },
  { match: "c", text: "awake", img: "assets/images/awake.png" },
  { match: "d", text: "indirect", img: "assets/images/uturn.png" },
  { match: "e", text: "different", img: "assets/images/different.png" },
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
    div.dataset.img = item.img; // Store the image path for later use

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

  // ✅ Get the right side image path from dataset
  const rightImgPath = rightEl.dataset.img;
  
  // ✅ Create image element for right side
  const rightImg = document.createElement("img");
  rightImg.src = rightImgPath;
  rightImg.alt = "matched image";
  rightImg.className = "right-img";
  rightImg.style.width = "50px";
  rightImg.style.height = "50px";
  rightImg.style.objectFit = "contain";

  // ✅ Put ONLY right image into the answer box
  const box = rightEl.querySelector(".answer-box");
  box.innerHTML = ""; // Clear existing content
  box.appendChild(rightImg);

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