const questions = [
  {
    q: "Q1. शब्द बनाइए।\nम + क् + खी",
    a: "मक्खी",
    img: "../assets/images/fly.png",
  },

  {
    q: "Q2. शब्द बनाइए।\nप + या + ला",
    a: "प्याला",
    img: "../assets/images/bowl.png",
  },

  {
    q: "Q3. शब्द बनाइए।\nप + त + थ + र",
    a: "पत्थर",
    img: "../assets/images/stone.png",
  },

  {
    q: "Q4. शब्द बनाइए।\nचि + ट् + ठी",
    a: "चिट्ठी",
    img: "../assets/images/letter.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
const input2 = document.createElement("input");
const instructionBtn = document.getElementById("instructionBtn");
const instructionBox = document.getElementById("instructionBox");

instructionBtn.addEventListener("click", () => {
  if (instructionBox.style.display === "block") {
    instructionBox.style.display = "none";
  } else {
    instructionBox.style.display = "block";
  }
});

input2.type = "text";
input2.placeholder = "Second answer";
input2.style.display = "none";


input2.className = input.className;
inputBox.insertBefore(input2, check);


// const partsProgress = document.getElementById("partsProgress");
// partsProgress.style.gridTemplateColumns = `repeat(${questions.length}, 1fr)`;

// questions.forEach(() => {
//   const part = document.createElement("div");
//   part.className = "part";
//   partsProgress.appendChild(part);
// });

// function goHome() {
//   window.location.href = "../index.html";
// }
input.addEventListener("dragover", (e) => {
  e.preventDefault(); // IMPORTANT
});

input.addEventListener("drop", (e) => {
  e.preventDefault(); // IMPORTANT

  const file = e.dataTransfer.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      // show image instead of URL
      qImg.src = event.target.result;

      // optional: clear text input
      input.value = "";
    };

    reader.readAsDataURL(file);
  }
});


function speakText(text) {

  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);

  msg.lang = "hi-IN";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;

  // Load Hindi voice properly
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
function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", answers[i] !== null);
  });
}

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src = q.img;

  // ✅ Show 2 inputs only for Question 5
if (Array.isArray(q.a)) {
  input2.style.display = "block";
  inputBox.classList.add("two-inputs"); // 👈 add this
} else {
  input2.style.display = "none";
  input2.value = "";
  inputBox.classList.remove("two-inputs"); // 👈 add this
}

  input.value = answers[index]?.[0] || "";
  input2.value = answers[index]?.[1] || "";

  input.disabled = answers[index] !== null;
  input2.disabled = answers[index] !== null;

  check.disabled = answers[index] !== null;

  prev.disabled = index === 0;
  next.disabled = answers[index] === null;
}



input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

check.onclick = () => {
  const q = questions[index];

  // ✅ Only Q5 has 2 answers
  if (Array.isArray(q.a)) {
    const user = [
      input.value.trim().toLowerCase(),
      input2.value.trim().toLowerCase(),
    ];

    const correct = q.a.map(a => a.toLowerCase());

    const isCorrect =
      user.includes(correct[0]) &&
      user.includes(correct[1]);

    if (isCorrect) {
      answers[index] = user;
      score++;
      speak("Correct");
      showPopup(true);
      load();
      if (index === questions.length - 1) {
        setTimeout(showFinal, 1600);
      }
    } else {
      speak("Wrong");
      showPopup(false);
    }
  } 
  // ✅ Other questions (single input)
  else {
    const user = input.value.trim().toLowerCase();
    const correct = q.a.toLowerCase();

    if (user === correct) {
      answers[index] = [user];
      score++;
      speak("Correct");
      showPopup(true);
      load();
    } else {
      speak("Wrong");
      showPopup(false);
      input.value = "";
    }
  }
};
prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

load();
