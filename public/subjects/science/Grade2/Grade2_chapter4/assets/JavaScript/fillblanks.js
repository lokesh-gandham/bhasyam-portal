const questions = [
  {
   q: "Q1. Living things  need ___ to breathe.",
    a: "air",
    a_mobile: "air",
   img: "../assets/images/air.png",
  },
  {
   q: "Q2. Living things ____ hot and cold according to the seasons.",
    a: "feel",
    a_mobile: "feel",
    img: "../assets/images/feel.png",
  },
  {
    q: "Q3. Human beings and most of the animals give birth to _____.",
    a: "babies",
    a_mobile: "babies", 
  img: "../assets/images/fib-3.png",
  },
  {
   q: "Q4. Non-living things do not have _____.",
    a: "life",
    a_mobile: "life",
   img: "../assets/images/chair.png",
  },
  {
   q: "Q5. Man-made things are made in _____.",
    a: "factories",
    a_mobile: "factories",
  img: "../assets/images/fib-5.png",
  },
];
let index = 0;
let score = 0;
const answered = Array(questions.length).fill(false);

// ================= ELEMENTS =================
const qEl = document.getElementById("question");
const img = document.getElementById("image");
const letters = document.getElementById("letters");
const indicator = document.getElementById("indicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");

// After: checkBtn.disabled = true;

letters.addEventListener("dragover", (e) => {
  e.preventDefault(); // IMPORTANT
});

letters.addEventListener("drop", (e) => {
  e.preventDefault(); // IMPORTANT

  const file = e.dataTransfer.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      // ?? set image preview instead of URL text
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }
});


function isMobile() {
  return window.innerWidth <= 768;
}

// ================= INPUT FLOW =================
letters.addEventListener("input", (e) => {
  if (answered[index]) return;
  const inputs = [...letters.querySelectorAll("input:not([disabled])")];
  const idx = inputs.indexOf(e.target);

  if (e.target.value && idx < inputs.length - 1) {
    inputs[idx + 1].readOnly = false;
    inputs[idx + 1].focus();
  }

  const allInputs = [...letters.querySelectorAll("input:not([disabled])")];
checkBtn.disabled = allInputs.some((i) => !i.value);
});

// letters.addEventListener("keydown", (e) => {
//   const inputs = [...letters.querySelectorAll("input")];
//   const idx = inputs.indexOf(e.target);

//   if (e.key === "Backspace" && !e.target.value && idx > 0) {
//     inputs[idx - 1].focus();
//   }
// });
letters.addEventListener("keydown", (e) => {

  // ? Disable space
  if (
    e.key === " " ||
    e.code === "Space" ||
    e.key === "Spacebar"
  ) {
    e.preventDefault();
    return;
  }

  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(e.target);

  if (e.key === "Backspace" && !e.target.value && idx > 0) {
    inputs[idx - 1].focus();
  }
});

// ================= SPEAK =================
// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }
function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // ?? lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function fireSmallConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    scalar: 0.8
  });
}
function fireBigConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ================= POPUP (UPGRADED) =================
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  const stars = document.getElementById("popupStars");

  popup.style.display = "flex";

  if (isCorrect) {
    popup.classList.add("correct");
    popup.classList.remove("wrong");

    icon.textContent = "🎉😊";
    title.textContent = "CORRECT!";
    msg.textContent = "Awesome! Moving to next...";
    
    stars.textContent = "⭐ ⭐ ⭐";
    stars.style.display = "block";

  } else {
    popup.classList.add("wrong");
    popup.classList.remove("correct");

    icon.textContent = "🥲💭";
    title.textContent = "OOPS!";
    msg.textContent = "Try again";

    stars.style.display = "none";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

// function showFinal() {
//   const finalPopup = document.getElementById("finalPopup");
//   finalPopup.style.display = "flex";

//   document.getElementById("finalScore").textContent =
//     `Score: ${score}/${questions.length}`;

//   document.getElementById("stars").textContent = "⭐".repeat(score);
//   fireBigConfetti()
// }

// ================= LOAD QUESTION =================
function load() {
  const q = questions[index];

  qEl.textContent = q.q;
  img.src = q.img;
  indicator.textContent = `Question ${index + 1} of ${questions.length}`;

  letters.innerHTML = "";

  const answer = isMobile() ? (q.a_mobile || q.a) : q.a;
  const words = answer.split(" ");

  words.forEach((word, wi) => {

    const wordBox = document.createElement("div");
    wordBox.className = "word-group";

    [...word].forEach(() => {

      const input = document.createElement("input");
      input.maxLength = 1;

      wordBox.appendChild(input);

    });

    letters.appendChild(wordBox);

    if (wi < words.length - 1) {

      const gap = document.createElement("div");
      gap.className = "word-gap";

      letters.appendChild(gap);
    }
  });

  const allInputs = letters.querySelectorAll(".word-group input");

  // ? already answered
  if (answered[index]) {

    const groups = letters.querySelectorAll(".word-group");

    groups.forEach((group, wi) => {

      const lettersOfWord = words[wi];
      const inputs = group.querySelectorAll("input");

      inputs.forEach((input, li) => {

        input.value = lettersOfWord[li];

        input.readOnly = true;
        input.disabled = true;

        input.classList.add("correct");
      });
    });

    nextBtn.disabled = false;

    // ? disable submit permanently

    checkBtn.disabled = true;
    checkBtn.textContent = "Answered";

    // ? disabled visual
  
   

  }

  // ? not answered yet
  else {

    allInputs.forEach((input, idx) => {

      input.value = "";

      input.readOnly = idx !== 0;
      input.disabled = false;

      input.classList.remove("correct");
    });

    allInputs[0].focus();

    nextBtn.disabled = true;

    checkBtn.disabled = true;

    // ? restore normal button
    checkBtn.textContent = "Check";

   
  }

  prevBtn.disabled = index === 0;
}

// ================= CHECK ANSWER =================
checkBtn.onclick = () => {
   if (answered[index]) return;
  const user = [...letters.querySelectorAll(".word-group")]
    .map((group) =>
      [...group.querySelectorAll("input")].map((i) => i.value).join(""),
    )
    .join(" ")
    .toLowerCase();

const correctAnswer = (
  isMobile()
    ? (questions[index].a_mobile || questions[index].a)
    : questions[index].a
).toLowerCase();

if (user === correctAnswer) {
  answered[index] = true;
  score++;

  [...letters.querySelectorAll("input")].forEach((i) => {
    i.readOnly = true;
    i.disabled = true;
    i.classList.add("correct");
  });

  checkBtn.disabled = true;
  nextBtn.disabled = false;

  speak("Correct");
  fireSmallConfetti();
  showPopup(true);

  if (index === questions.length - 1) {
    setTimeout(() => {
      finalPopupShown = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      showFinal();
    }, 800);
  }
}
  else {
 [...letters.querySelectorAll("input")].forEach((i, idx) => {
  i.value = "";
  i.disabled = false;
  i.classList.remove("correct");
  i.readOnly = idx !== 0;
});
letters.querySelector("input").focus();
    checkBtn.disabled = true;

    speak("Wrong");

    showPopup(false);
  }
};

// ================= NAVIGATION =================
prevBtn.onclick = () => {
  index--;
  load();
};

nextBtn.onclick = () => {
  index++;
  load();
};
function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;  // ? fixed quizData ? questions

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
  fireBigConfetti();
}
// function nextSection() {
//   document.getElementById("finalPopup").style.display = "none";

//   // Works BOTH on server and file:// protocol
//   window.parent.postMessage({ action: "nextSection", target: "matching.html" }, "*");

//   try {
//     const parentDoc = window.parent.document;
//     const frame = parentDoc.querySelector("iframe[name='quiz-frame']");

//     if (frame) {
//       frame.src = "exercises/matching.html";
//       const links = parentDoc.querySelectorAll(".sidebar a");
//       links.forEach(link => {
//         link.classList.remove("active");
//         if (link.getAttribute("href")?.includes("matching.html")) {
//           link.classList.add("active");
//         }
//       });
//     }

//   } catch (e) {
//     // file:// fallback � store target and reload parent
//     sessionStorage.setItem("activeSection", "matching.html");
//     window.location.href = "../Grade2_lesson4.html";  // ? go to parent
//   }
// }

function restart() {

  index = 0;
  score = 0;

  answered.fill(false);

  document.getElementById("finalPopup").style.display = "none";

  load();
}

// ================= START =================
load();
