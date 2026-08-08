/* Build a map of data-match → right box color class BEFORE quiz starts */
const rightColorMap = {};
document.querySelectorAll("#right .box").forEach(b => {
  const m = b.dataset.match;
  const cls = Array.from(b.classList).find(c => /^c\d+$/.test(c));
  if (cls) rightColorMap[m] = cls;
});

let selected = null;
let score = 0;
let matchNumber = 1;
const left = document.querySelectorAll("#left .box");
const right = document.querySelectorAll("#right .box");
const svg = document.getElementById("lines");

const isMobile = () => window.innerWidth <= 900;

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

left.forEach(l => {
  l.onclick = () => {
    if (l.classList.contains("matched")) return;
    left.forEach(i => i.classList.remove("selected"));
    l.classList.add("selected");
    selected = l;
  };
});

right.forEach(r => {
  r.onclick = () => {
    if (!selected) return;

    if (r.dataset.match === selected.dataset.match) {

      launchConfetti();
      speak("Correct");

      const num = selected.dataset.match;

      /* Apply the right box's color class to the matched left box */
      const colorCls = rightColorMap[num];
      if (colorCls) selected.classList.add(colorCls);

      selected.classList.add("matched");
      r.classList.add("matched");

      /* Numbers ONLY on mobile (≤900px), lines ONLY on desktop (>900px) */
      if (isMobile()) {
        addNumber(selected, num);
        addNumber(r, num);
      } else {
        drawLine(selected, r);
      }

      score++;

      if (score === 4) {
        setTimeout(() => {
          showFinal();
        }, 1000);
      }

    } else {
      speak("Wrong");
    }

    selected.classList.remove("selected");
    selected = null;
  };
});

function addNumber(el, num) {
  const badge = document.createElement("span");
  badge.innerText = num;
  badge.classList.add("match-number");
  el.appendChild(badge);
}

function drawLine(a, b) {
  const rectA = a.querySelector(".dot").getBoundingClientRect();
  const rectB = b.querySelector(".dot").getBoundingClientRect();

  const svgRect = svg.getBoundingClientRect();

  // const x1 = rectA.left - svgRect.left;
  // const y1 = rectA.top - svgRect.top + 7;

  // const x2 = rectB.left - svgRect.left;
  // const y2 = rectB.top - svgRect.top + 7;
  const x1 = rectA.left - svgRect.left + rectA.width / 2;
const y1 = rectA.top - svgRect.top + rectA.height / 2;

const x2 = rectB.left - svgRect.left + rectB.width / 2;
const y2 = rectB.top - svgRect.top + rectB.height / 2;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // const curve = `M${x1},${y1} C${x1 + 150},${y1} ${x2 - 150},${y2} ${x2},${y2}`;
  const offset = Math.abs(x2 - x1) * 0.4;

const curve = `
M${x1},${y1}
C${x1 + offset},${y1}
 ${x2 - offset},${y2}
 ${x2},${y2}
`;

  path.setAttribute("d", curve);
  path.setAttribute("stroke", "#86d35c");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("fill", "none");

  svg.appendChild(path);
}

function playAgain() {
  location.reload();
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / 4`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";

  launchConfetti();
}