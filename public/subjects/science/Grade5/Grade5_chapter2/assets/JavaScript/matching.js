let popupTimer = null;
let selectedLeft = null;
const svg = document.getElementById("lineLayer");

let score = 0;
let matched = 0;

const pairs = [
  { l: "The cerebrum", r: "Helps us think, learn and remember" },
  { l: "The auditory nerve", r: "Carries sound" },
  { l: "The spinal cord", r: "Controls the reflex actions" },
  { l: "The cerebellum", r: "Maintains the balance of the body" },
  { l: "The olfactory nerve", r: "Helps us sense smell" },
];

const leftImages = {
  "The cerebrum": "../assets/images/cerebrummm.png",
  "The auditory nerve": "../assets/images/auditorynerve.png",
  "The spinal cord": "../assets/images/spinalcord2.png",
  "The cerebellum": "../assets/images/cerebellumak.png",
  "The olfactory nerve": "../assets/images/olfactorynerve.png",
};

const images = {
  "Helps us think, learn and remember": "../assets/images/Remember.png",
  "Carries sound": "../assets/images/Gaddhi.png",
  "Controls the reflex actions": "../assets/images/Creflex.png",
  "Maintains the balance of the body": "../assets/images/Balance.png",
  "Helps us sense smell": "../assets/images/Mainpart.png",
};
const leftCol = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // ?? lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if (popupTimer) clearTimeout(popupTimer);
  if (!final)
    popupTimer = setTimeout(() => (popup.style.display = "none"), 1000);
}

function render() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  // LEFT COLUMN
  pairs.forEach((p, index) => {
    const l = document.createElement("div");
    l.className = "item";
    l.setAttribute("data-num", index + 1);
    l.innerHTML = `
  <img src="${leftImages[p.l]}" />
  <span>${p.l}</span>
`;

    l.onclick = () => {
      selectedLeft = p;
      document
        .querySelectorAll(".left .item")
        .forEach((i) => i.classList.remove("drop-over"));
      l.classList.add("drop-over");
    };

    leftCol.appendChild(l);
  });

  // RIGHT COLUMN
 [...pairs]
  .map((p, i) => ({...p, correctIndex: i + 1}))   // ? store real index
  .sort(() => Math.random() - 0.5)
  .forEach((p) => {
      const r = document.createElement("div");
      r.className = "item";
    r.setAttribute("data-num", p.correctIndex);
      r.dataset.answer = p.r;
      r.innerHTML = `
  <img src="${images[p.r]}" class="right-img">
  <span>${p.r}</span>
`;

      r.onclick = () => {
        if (!selectedLeft) return;

        if (selectedLeft.r === p.r) {
          fireConfetti();
          r.classList.add("correct");

          [...leftCol.children].forEach((l) => {
            if (l.querySelector("span").textContent === selectedLeft.l) {
              l.classList.add("correct");
              r.classList.add("correct");
              drawLine(l, r);
            }
          });
          document
            .querySelectorAll(".left .item")
            .forEach((i) => i.classList.remove("drop-over"));
          score++;
          matched++;
          speak("Correct");
          selectedLeft = null;

          if (matched === pairs.length) {
            setTimeout(finalPopup, 1100);
          }
        } else {
          r.classList.add("wrong");
          speak("Wrong");

          setTimeout(() => r.classList.remove("wrong"), 600);
        }
      };

      // ? APPEND HERE (correct place)
      rightCol.appendChild(r);
    });
}

function finalPopup() {
     setTimeout(() => {
  fireConfettif();
}, 300);
  showPopup(
    `
    <div class="popup-final-content">
      <div>?? Congratulations!</div>
      <div class="emoji">??</div>
      <div>You finished the quiz!</div>
      <div class="score">Score: <b>${score}/${pairs.length}</b></div>
      <div class="stars">?????</div>
      <div class="final-actions">
        <button class="restart" onclick="location.reload()">?? Restart</button>
        <button class="home" onclick="goHome()">?? Home</button>
      </div>
    </div>
  `,
    true,
  );
}


function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}



render();
function goHome() {
  window.location.href = "../index.html";
  // or "../index.html" depending on your folder structure
}

function drawLine(leftEl, rightEl) {

  const scale = document.querySelector(".quiz").offsetWidth /
                document.querySelector(".quiz").getBoundingClientRect().width;

  const a = leftEl.getBoundingClientRect();
  const b = rightEl.getBoundingClientRect();
  const container = svg.getBoundingClientRect();

  const x1 = (a.right - container.left) * scale;
  const y1 = (a.top + a.height / 2 - container.top) * scale;

  const x2 = (b.left - container.left) * scale;
  const y2 = (b.top + b.height / 2 - container.top) * scale;

  const midX = (x1 + x2) / 2;

  const path = document.createElementNS("http://www.w3.org/2000/svg","path");

  const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

  path.setAttribute("d", d);

  svg.appendChild(path);
}
function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}
