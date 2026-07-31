const questions = [
  {
    q: "Q1. शब्द बनाइए।\nम + क् + खी",
    a: "मक्खी",
    eng: ["makkhi", "makkhee", "makkhi"],
    img: "../assets/images/fly.png",
  },
  {
    q: "Q2. शब्द बनाइए।\nप + या + ला",
    a: "प्याला",
    eng: ["pyaala", "pyala", "piyaala"],
    img: "../assets/images/bowl.png",
  },
  {
    q: "Q3. शब्द बनाइए।\nप + त + थ + र",
    a: "पत्थर",
    eng: ["patthar", "pathar", "patthar"],
    img: "../assets/images/stone.png",
  },
  {
    q: "Q4. शब्द बनाइए।\nचि + ट् + ठी",
    a: "चिट्ठी",
    eng: ["chitthi", "chitthee", "chitthi"],
    img: "../assets/images/letter.png",
  },
];

/* ── TRANSLITERATION ───────────────────────────────────────────────────────── */

const translitMap = [
  /* vowel matras – longest matches first */
["aa", "ा"], 
["ii", "ी"], 
["uu", "ू"],
["ai", "ै"], 
["au", "ौ"], 
["ae", "ै"],
["oo", "ू"], 
["ee", "ी"],

  /* two-letter consonant clusters */
  ["kh",  "ख"], ["gh",  "घ"], ["chh", "छ"], ["ch",  "च"],
  ["jh",  "झ"], ["th",  "थ"], ["dh",  "ध"], ["ph",  "फ"],
  ["bh",  "भ"], ["sh",  "श"], ["shh", "ष"], ["nh",  "ञ"],
  ["lh",  "ळ"], ["rh",  "ड़"], ["yh",  "य"],
  ["tta", "ट"], ["tth", "ठ"], ["dda", "ड"], ["ddh", "ढ"],
  ["nna", "ण"], ["nga", "ङ"],

  /* single consonants */
  ["k", "क"], ["g", "ग"], ["c", "क"],
  ["j", "ज"], ["t", "त"], ["d", "द"],
  ["n", "न"], ["p", "प"], ["b", "ब"],
  ["m", "म"], ["y", "य"], ["r", "र"],
  ["l", "ल"], ["v", "व"], ["w", "व"],
  ["s", "स"], ["h", "ह"], ["f", "फ"],
  ["z", "ज"], ["q", "क"],

  /* independent vowels (uppercase) */
  ["A", "अ"], ["I", "इ"], ["U", "उ"],
  ["E", "ए"], ["O", "ओ"],

  /* diacritics */
  ["M", "ं"], ["N", "ं"], ["H", "ः"], ["'", "ँ"],

  /* digits */
  ["0","०"],["1","१"],["2","२"],["3","३"],["4","४"],
  ["5","५"],["6","६"],["7","७"],["8","८"],["9","९"],
];

/**
 * Convert phonetic English string to Hindi Devanagari.
 * If the string already contains Devanagari characters it is returned as-is.
 */
function toHindi(text) {
  const str = text.trim();
  /* If already Devanagari, just return lowercase (for safe comparison) */
  if (/[\u0900-\u097F]/.test(str)) return str.toLowerCase();

  let result = "";
  let i = 0;
  const lower = str.toLowerCase();
  while (i < lower.length) {
    let matched = false;
    for (const [latin, hindi] of translitMap) {
      if (lower.startsWith(latin, i)) {
        result += hindi;
        i += latin.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += lower[i];
      i++;
    }
  }
  return result;
}

/* ── STATE ─────────────────────────────────────────────────────────────────── */

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

/* ── DOM REFS ───────────────────────────────────────────────────────────────── */

const qText          = document.getElementById("qText");
const qImg           = document.getElementById("qImg");
const input          = document.getElementById("answerInput");
const check          = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputBox       = document.getElementById("inputBox");
const instructionBtn = document.getElementById("instructionBtn");
const instructionBox = document.getElementById("instructionBox");

const input2 = document.createElement("input");
input2.type        = "text";
input2.placeholder = "Second answer";
input2.style.display = "none";
input2.className   = input.className;
inputBox.insertBefore(input2, check);

/* ── INSTRUCTION TOGGLE ────────────────────────────────────────────────────── */

instructionBtn.addEventListener("click", () => {
  instructionBox.style.display =
    instructionBox.style.display === "block" ? "none" : "block";
});

/* ── DRAG-AND-DROP IMAGE ────────────────────────────────────────────────────── */

input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (event) {
      qImg.src = event.target.result;
      input.value = "";
    };
    reader.readAsDataURL(file);
  }
});

/* ── SPEECH ─────────────────────────────────────────────────────────────────── */

function speak(t) {

  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);

  msg.lang = "hi-IN";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;

  // Optional: select Hindi voice if available
  const voices = speechSynthesis.getVoices();

  const hindiVoice =
    voices.find(v => v.lang === "hi-IN") ||
    voices.find(v => v.lang.includes("hi"));

  if (hindiVoice) {
    msg.voice = hindiVoice;
  }

  setTimeout(() => {
    speechSynthesis.speak(msg);
  }, 100);
}

/* ── PROGRESS ───────────────────────────────────────────────────────────────── */

function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", answers[i] !== null);
  });
}

/* ── LOAD QUESTION ──────────────────────────────────────────────────────────── */

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src          = q.img;

  if (Array.isArray(q.a)) {
    input2.style.display = "block";
    inputBox.classList.add("two-inputs");
  } else {
    input2.style.display = "none";
    input2.value = "";
    inputBox.classList.remove("two-inputs");
  }

  input.value  = answers[index]?.[0] || "";
  input2.value = answers[index]?.[1] || "";

  input.disabled  = answers[index] !== null;
  input2.disabled = answers[index] !== null;
  check.disabled  = answers[index] !== null;

 prevBtn.disabled = index === 0;
nextBtn.disabled = answers[index] === null;
}

/* ── INPUT LIVE VALIDATION ──────────────────────────────────────────────────── */

input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

/* ── CHECK ANSWER ───────────────────────────────────────────────────────────── */

/**
 * Returns true if the user's raw input matches the question's answer.
 * Accepts three forms:
 *   1. Direct Hindi  → मक्खी
 *   2. Phonetic transliteration → makkhi  (converted via toHindi)
 *   3. Exact English spelling listed in q.eng → makkhi / makkhee
 */
function isCorrectAnswer(raw, q) {
  const trimmed = raw.trim();
  /* 1 & 2 – Hindi (native or transliterated) */
  const hindiUser = toHindi(trimmed).toLowerCase();
  const hindiCorrect = (Array.isArray(q.a) ? q.a[0] : q.a).toLowerCase();
  if (hindiUser === hindiCorrect) return true;
  /* 3 – English spelling match */
  if (q.eng && q.eng.map(e => e.toLowerCase()).includes(trimmed.toLowerCase())) return true;
  return false;
}

/**
 * Same as isCorrectAnswer but for multi-answer questions –
 * checks a single value against a specific correct Hindi string.
 */
function matchesHindiOrEng(raw, hindiTarget, engList) {
  const trimmed = raw.trim();
  if (toHindi(trimmed).toLowerCase() === hindiTarget.toLowerCase()) return true;
  if (engList && engList.map(e => e.toLowerCase()).includes(trimmed.toLowerCase())) return true;
  return false;
}

check.onclick = () => {
  const q = questions[index];

  if (Array.isArray(q.a)) {
    /* Multi-answer question */
    const rawUser = [input.value.trim(), input2.value.trim()];
    const correct = q.a.map((a) => a.toLowerCase());

    const isCorrect =
      correct.every(c =>
        rawUser.some(u => matchesHindiOrEng(u, c, q.eng))
      );

    if (isCorrect) {
      answers[index] = rawUser.map(u => toHindi(u));
      score++;
      speak("सही");
      showPopup(true);
      load();
      if (index === questions.length - 1) {
        setTimeout(showFinal, 1600);
      }
    } else {
      speak("गलत");
      showPopup(false);
    }
  } else {
    /* Single-answer question */
    const raw = input.value.trim();

    if (isCorrectAnswer(raw, q)) {
      answers[index] = [toHindi(raw)];
      score++;
      speak("सही");
      showPopup(true);
      load();
    } else {
      speak("गलत");
      showPopup(false);
      input.value = "";
    }
  }
};

/* ── NAVIGATION ─────────────────────────────────────────────────────────────── */
prevBtn.onclick = () => {
  index--;
  load();
};

nextBtn.onclick = () => {
  index++;
  load();
};

/* ── POPUPS ─────────────────────────────────────────────────────────────────── */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon  = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg   = document.getElementById("popupMsg");

  popup.className    = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

if (isCorrect) {
  icon.textContent  = "🎉";
  title.textContent = "सही!";
  msg.textContent   = "बहुत बढ़िया!";
} else {
  icon.textContent  = "😔";
  title.textContent = "गलत!";
  msg.textContent   = "फिर से कोशिश करें!";
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent      = "⭐".repeat(score);

  if (window.innerWidth >= 769) {
    const duration = 2000;
    const end      = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

/* ── INIT ───────────────────────────────────────────────────────────────────── */

load();