const questions = [
  {
    q: "Q1. The _____ help us know the world around us.",
    a: "SENSE ORGANS",
    a_mobile: "SENSE ORGANS",
    img: "../assets/images/TF-1.png",
  },
  {
    q: "Q2. The skin is an ____ part of our body.",
    a: "EXTERNAL",
    a_mobile: "EXTERNAL",
    img: "../assets/images/Skin1.png",
  },
  {
    q: "Q3. Our ___ help us write.",
    a: "HANDS",
    a_mobile: "HANDS",
    img: "../assets/images/hand1.png",
  },
  {
    q: "Q4. The ____ helps us remember.",
    a: "BRAIN",
    a_mobile: "BRAIN",
    img: "../assets/images/girl.png",
  },
  {
    q: "Q5. The ___ is located inside the chest.",
    a: "HEART",
    a_mobile: "HEART",
    img: "../assets/images/ribcage.webp",
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
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const checkBtn = document.getElementById("checkBtn");



/* IMAGE DRAG & DROP */

img.addEventListener("dragover", (e) => {
  e.preventDefault();
});

img.addEventListener("drop", (e) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (file && file.type.startsWith("image/")) {

    const reader = new FileReader();

    reader.onload = function (event) {
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }
});

/* PREVENT RANDOM TEXT IN INPUTS */

letters.addEventListener("dragover", (e) => {
  e.preventDefault();
});

letters.addEventListener("drop", (e) => {
  e.preventDefault();
});

function isMobile() {
  return window.innerWidth <= 768;
}

// ================= INPUT FLOW =================
// letters.addEventListener("input", (e) => {
//   const inputs = [...letters.querySelectorAll("input")];
//   const idx = inputs.indexOf(e.target);

//   if (e.target.value && idx < inputs.length - 1) {
//     // inputs[idx + 1].readOnly = false;
//     inputs[idx + 1].focus();
//   }

//   checkBtn.disabled = inputs.some((i) => !i.value);
// });

// letters.addEventListener("keydown", (e) => {
//   // Block Backspace
//   if (e.key === "Backspace") {
//     e.preventDefault();
//     e.stopPropagation();

//     // restore current value
//     const currentValue = e.target.value;

//     setTimeout(() => {
//       e.target.value = currentValue;
//     }, 0);

//     return false;
//   }
// });
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

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "??";
    title.textContent = "Correct!";
    msg.textContent = "Well done! ??";
  } else {
    icon.textContent = "??";
    title.textContent = "Wrong!";
    msg.textContent = "Try again! ??";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/${questions.length}`;
  const starsHtml = "?".repeat(score) + "?".repeat(questions.length - score);
  document.getElementById("stars").innerHTML = starsHtml;
  fireConfettif();
}

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

      input.type = "text";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.spellcheck = false;
      input.readOnly = false;

input.addEventListener("input", () => {

  // remove spaces
  input.value = input.value.replace(/\s/g, "");

  // convert to CAPITAL letter
  input.value = input.value.toUpperCase();

  // allow only one character
  if (input.value.length > 1) {
    input.value = input.value.charAt(0).toUpperCase();
  }

  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(input);

  // move to next box
  if (input.value && idx < inputs.length - 1) {
    inputs[idx + 1].focus();
  }

  // enable check button
  checkBtn.disabled = inputs.some((i) => !i.value);
});

      // KEYDOWN EVENT
 // KEYDOWN EVENT
input.addEventListener("keydown", (e) => {

  // ? Block space completely
  if (
    e.key === " " ||
    e.code === "Space" ||
    e.key === "Spacebar"
  ) {
    e.preventDefault();
    return;
  }

  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(input);

  // ? Backspace support
  if (e.key === "Backspace") {

    // if current box empty -> go previous
    if (input.value === "" && idx > 0) {

      inputs[idx - 1].focus();

      // optional: clear previous box also
      // inputs[idx - 1].value = "";
    }
  }
});

      wordBox.appendChild(input);
    });

    letters.appendChild(wordBox);

    // gap between words
    if (wi < words.length - 1) {

      const gap = document.createElement("div");
      gap.className = "word-gap";

      letters.appendChild(gap);
    }
  });

  // ALREADY ANSWERED
  if (answered[index]) {

    const groups = letters.querySelectorAll(".word-group");

    groups.forEach((group, wi) => {

      const lettersOfWord = words[wi];
      const inputs = group.querySelectorAll("input");

      inputs.forEach((input, li) => {

        input.value = lettersOfWord[li];
        input.readOnly = true;
        input.classList.add("correct");

      });
    });

    nextBtn.disabled = false;
    checkBtn.disabled = true;

  } else {

    [...letters.querySelectorAll("input")].forEach((input) => {

      input.value = "";
      input.readOnly = false;
      input.classList.remove("correct");

    });

    letters.querySelector("input").focus();

    nextBtn.disabled = true;
    checkBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
}
// ================= CHECK ANSWER =================
checkBtn.onclick = () => {
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
      i.classList.add("correct");
    });

    checkBtn.disabled = true;
    nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
     fireConfetti();

    if (index === questions.length - 1) {
      setTimeout(() => {
        finalPopupShown = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;

        showFinal();
      }, 800);
    }
  } else {
    [...letters.querySelectorAll("input")].forEach((input, idx) => {
  input.value = "";
 input.readOnly = false;
  input.classList.remove("correct");
});
    // letters.children[0].focus();
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

function restart() {

  index = 0;
  score = 0;

  answered.fill(false);

  document.getElementById("finalPopup").style.display = "none";

  load();
}



function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 }
  });
}




// ================= START =================
load();
