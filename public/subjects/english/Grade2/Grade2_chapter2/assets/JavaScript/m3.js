
/* ============ DATA ============ */
const pairs = [
  { num:1, left:"Uncle's daughter", key:'cousin',      text:'Cousin' },
  { num:2, left:"Father's father",  key:'grandfather', text:'Grandfather' },
  { num:3, left:"Father's sister",  key:'aunt',         text:'Aunt' },
  { num:4, left:"Mother's mother",  key:'grandmother',  text:'Grandmother' },
  { num:5, left:"Mother's brother", key:'uncle',         text:'Uncle' },
];

const colorMap = {
  grandmother: '#FF6B9D',
  aunt: '#FF8C42',
  cousin: '#2ECC71',
  uncle: '#9B59B6',
  grandfather: '#3498DB',
};

let rightOrder = [...pairs].sort(() => Math.random() - 0.5);
const letters = ['a','b','c','d','e'];

const leftColumn = document.getElementById('leftColumn');
const rightColumn = document.getElementById('rightColumn');
const svg = document.getElementById('line-canvas');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

/* ============ SPEECH (family-member intro only, NOT match feedback) ============ */
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-us";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* ============ RENDER MATCH COLUMNS ============ */
pairs.forEach(p => {
  const div = document.createElement('div');
  div.className = 'item';
  div.dataset.key = p.key;
  div.innerHTML = `<span class="item-number">${p.num}.</span><span class="item-text">${p.left}</span><span class="dot"></span>`;
  leftColumn.appendChild(div);
});

rightOrder.forEach((p, i) => {
  const div = document.createElement('div');
  div.className = 'item';
  div.dataset.key = p.key;
  div.innerHTML = `
    <span class="dot"></span>
    <span class="item-letter">${letters[i]})</span>
    <span class="item-text">${p.text}</span>
`;
  rightColumn.appendChild(div);
});

/* ============ MATCH LOGIC ============ */
let selectedLeft = null;
let matchedCount = 0;
let wrongAttempts = 0;
const totalPairs = pairs.length;
const drawnLines = [];

leftColumn.addEventListener('click', e => {
  const item = e.target.closest('.item');
  if (!item || item.classList.contains('matched')) return;
  leftColumn.querySelectorAll('.item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');
  selectedLeft = item;
});

rightColumn.addEventListener('click', e => {
  const item = e.target.closest('.item');
  if (!item || item.classList.contains('matched') || !selectedLeft) return;

  if (item.dataset.key === selectedLeft.dataset.key) {
    handleCorrect(selectedLeft, item);
  } else {
    handleWrong(item);
  }
});

function handleCorrect(leftEl, rightEl) {
  leftEl.classList.remove('active');
  leftEl.classList.add('matched');
  rightEl.classList.add('matched');

  const color = colorMap[rightEl.dataset.key] || '#37C871';
  drawLine(leftEl.querySelector('.dot'), rightEl.querySelector('.dot'), color);

  // Sound effect only — no speech on match feedback
  // playSound(correctSound);
  speak("correct");

  burstConfettiAt(rightEl);
  highlightPortrait(rightEl.dataset.key, color);

  matchedCount++;
  selectedLeft = null; // auto-deselect the current question

  if (matchedCount === totalPairs) {
    setTimeout(showFinalPopup, 700);
  }
}

function handleWrong(rightEl) {
  wrongAttempts++;
  rightEl.classList.add('error');
  // Sound effect only — no speech on match feedback
  // playSound(wrongSound);
  speak("try again")
  setTimeout(() => rightEl.classList.remove('error'), 500);
}

function playSound(audioEl) {
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}

/* ============ FINAL POPUP ============ */
function showFinalPopup() {
  const finalPopup = document.getElementById("finalPopup");
  const scoreText = document.getElementById("finalScore");
  const starsEl = document.getElementById("stars");

  scoreText.textContent = `Your Score: ${totalPairs} / 5`;
  starsEl.textContent = "⭐".repeat(totalPairs);
  finalPopup.style.display = "flex";

  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      scalar: 0.5,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      scalar: 0.5,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  setTimeout(() => correctSound.play().catch(()=>{}), 100);
  setTimeout(() => correctSound.play().catch(()=>{}), 400);
}

/* ============ LINE DRAWING ============ */
function drawLine(dotA, dotB, color) {
  const rectContainer = document.querySelector('.game-container').getBoundingClientRect();
  const a = dotA.getBoundingClientRect();
  const b = dotB.getBoundingClientRect();

  let x1 = a.left + a.width/2 - rectContainer.left;
  let y1 = a.top + a.height/2 - rectContainer.top;
  let x2 = b.left + b.width/2 - rectContainer.left;
  let y2 = b.top + b.height/2 - rectContainer.top;

  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const gap = 6;
  const ux = dx/len, uy = dy/len;
  const gx1 = x1 + ux*gap, gy1 = y1 + uy*gap;
  const gx2 = x2 - ux*gap, gy2 = y2 - uy*gap;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', gx1);
  line.setAttribute('y1', gy1);
  line.setAttribute('x2', gx2);
  line.setAttribute('y2', gy2);
 line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '3');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('opacity', '0.95');

  const lineLen = Math.sqrt((gx2-gx1)**2 + (gy2-gy1)**2);
  line.setAttribute('stroke-dasharray', lineLen);
  line.setAttribute('stroke-dashoffset', lineLen);
  line.style.transition = 'stroke-dashoffset .45s ease';
  svg.appendChild(line);
  requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; });

  drawnLines.push({ dotA, dotB, line, color });
}

function redrawAllLines() {
  const rectContainer = document.querySelector('.game-container').getBoundingClientRect();
  drawnLines.forEach(({ dotA, dotB, line }) => {
    const a = dotA.getBoundingClientRect();
    const b = dotB.getBoundingClientRect();
    let x1 = a.left + a.width/2 - rectContainer.left;
    let y1 = a.top + a.height/2 - rectContainer.top;
    let x2 = b.left + b.width/2 - rectContainer.left;
    let y2 = b.top + b.height/2 - rectContainer.top;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const gap = 6;
    const ux = dx/len, uy = dy/len;
    line.setAttribute('x1', x1 + ux*gap);
    line.setAttribute('y1', y1 + uy*gap);
    line.setAttribute('x2', x2 - ux*gap);
    line.setAttribute('y2', y2 - uy*gap);
  });
}
window.addEventListener('resize', () => requestAnimationFrame(redrawAllLines));

/* ============ PORTRAIT HIGHLIGHT ============ */
function highlightPortrait(name, color) {
  const nodes = document.querySelectorAll(`.portrait-marker[data-name="${name}"]`);
  nodes.forEach(node => {
    node.style.setProperty('--matchColor', color);
    node.classList.add('matched');
  });
}

/* ============ CONFETTI (per-match burst) ============ */
function burstConfettiAt(el) {
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width/2) / window.innerWidth;
  const y = (rect.top + rect.height/2) / window.innerHeight;
  confetti({
    particleCount: 30,
    spread: 55,
    startVelocity: 28,
    origin: { x, y },
    colors: ['#FF8FA3','#FFC94D','#8FDDA0','#9FC4FF']
  });
}

/* ============ FRAME SIZING ============ */
// function sizeFrame() {
//   const wrap = document.querySelector('.frame-wrap');
//   const frame = document.getElementById('frame');
//   if (!wrap || !frame) return;
//   frame.style.width = wrap.clientWidth + 'px';
//   frame.style.height = wrap.clientHeight + 'px';
// }
// window.addEventListener('load', sizeFrame);
window.addEventListener('resize', () => { sizeFrame(); requestAnimationFrame(redrawAllLines); });
// sizeFrame();

/* ============ PORTRAIT SPEECH (family intro, unrelated to match feedback) ============ */
// const speechBubble = document.getElementById('speechBubble');
// let bubbleTimeout;

// document.querySelectorAll('.portrait-marker').forEach(marker => {
//   marker.addEventListener('click', () => {
//     const line = marker.dataset.line;
//     speak(line);
//     showSpeechBubble(line, marker);
//   });
// });

// function showSpeechBubble(text, markerEl) {
//   clearTimeout(bubbleTimeout);
//   speechBubble.textContent = text;
//   speechBubble.classList.add('show');

//   document.querySelectorAll('.portrait-marker.speaking').forEach(a => a.classList.remove('speaking'));
//   markerEl.classList.add('speaking');

//   bubbleTimeout = setTimeout(() => {
//     speechBubble.classList.remove('show');
//     markerEl.classList.remove('speaking');
//   }, 2400);
// }
