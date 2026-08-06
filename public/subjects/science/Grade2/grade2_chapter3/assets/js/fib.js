// BLOCK browser default drag/drop everywhere
document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
});

const questions = [
  {
    q: "Q1. ____ food keeps us fit and healthy.",
    a: "Protective",
    img: "../assets/images/tf2.png",
  },
  {
    q: "Q2. ___ is required to work and play.",
    a: "Energy",
    img: "../assets/images/weak.png",
  },
  {
    q: "Q3.We should drink ___ glasses of water daily.",
    a: ["6-8", "six-eight", "six to eight"],
    img: "../assets/images/water.png",
  },
  {
    q: "Q4.We have ___ in the afternoon.",
    a: "Lunch",
    img: "../assets/images/lunch.png",
  },
  {
    q: "Q5.Body-building food make our _______ strong.",
    a: ["bones", "muscles"],
    img: "../assets/images/food.png",
  },
];

let index = 0,
  score = 0;

const answers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const inputBox = document.getElementById("inputBox");

// ================= IMAGE DROP =================

input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const file = e.dataTransfer.files[0];

  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    qImg.src = event.target.result;
    input.value = "";
  };

  reader.readAsDataURL(file);
});

// ================= SPEAK =================

function speak(t) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);

  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

// ================= LOAD =================

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src = q.img;

  // ✅ Question 5
  if (Array.isArray(q.a) && q.a.length === 2) {

    inputBox.innerHTML = `
      <div class="single-input">
        <input id="answerInput1" placeholder="Type answer...">
        <button id="checkBtn1">Submit</button>
      </div>

      <div class="single-input">
        <input id="answerInput2" placeholder="Type answer...">
        <button id="checkBtn2">Submit</button>
      </div>
    `;

    inputBox.classList.add("two-inputs");

    const input1 = document.getElementById("answerInput1");
    const input2 = document.getElementById("answerInput2");

    input1.value = answers[index]?.[0] || "";
    input2.value = answers[index]?.[1] || "";

  } else {

    // ✅ Normal Question
    inputBox.innerHTML = `
      <input id="answerInput" placeholder="Type your answer...">
      <button id="checkBtn">Submit</button>
    `;

    inputBox.classList.remove("two-inputs");

    const input = document.getElementById("answerInput");

    input.value = answers[index]?.[0] || "";

    if (answers[index] !== null) {
      input.disabled = true;
      document.getElementById("checkBtn").disabled = true;
    } else {
      input.disabled = false;
      document.getElementById("checkBtn").disabled = true;
    }
  }

  prev.disabled = index === 0;
  next.disabled = answers[index] === null;
}

// ================= INPUT =================

inputBox.addEventListener("input", (e) => {

  if (e.target.tagName !== "INPUT") return;

  // ✅ First Letter Capital
  e.target.value =
    e.target.value.charAt(0).toUpperCase() +
    e.target.value.slice(1).toLowerCase();

  // ✅ Normal button
  const normalBtn = document.getElementById("checkBtn");

  if (normalBtn) {
    const value =
      document.getElementById("answerInput").value.trim();

    normalBtn.disabled = !value;
  }

  // ✅ Question 5 buttons
  const btn1 = document.getElementById("checkBtn1");
  const btn2 = document.getElementById("checkBtn2");

  const input1 = document.getElementById("answerInput1");
  const input2 = document.getElementById("answerInput2");

  if (btn1 && btn2 && input1 && input2) {

    btn1.disabled =
      input1.disabled ? true : !input1.value.trim();

    btn2.disabled =
      input2.disabled ? true : !input2.value.trim();
  }
});

// ================= CLICK EVENTS =================

document.addEventListener("click", (e) => {

  const q = questions[index];

  // ================= QUESTION 5 =================

  if (Array.isArray(q.a) && q.a.length === 2) {

    // ✅ First input
    if (e.target.id === "checkBtn1") {

      const input1 =
        document.getElementById("answerInput1");

      const user1 =
        input1.value.trim().toLowerCase();

      if (user1 === "bones") {

        // ✅ Show first letter capital
        input1.value = "Bones";

        input1.disabled = true;
        document.getElementById("checkBtn1").disabled = true;

        speak("Correct");
        showPopup(true);

      } else {

        speak("Wrong");
        showPopup(false);

        input1.value = "";
      }
    }

    // ✅ Second input
    if (e.target.id === "checkBtn2") {

      const input2 =
        document.getElementById("answerInput2");

      const user2 =
        input2.value.trim().toLowerCase();

      if (user2 === "muscles") {

        // ✅ Show first letter capital
        input2.value = "Muscles";

        input2.disabled = true;
        document.getElementById("checkBtn2").disabled = true;

        speak("Correct");
        showPopup(true);

      } else {

        speak("Wrong");
        showPopup(false);

        input2.value = "";
      }
    }

    // ✅ Both correct
    const done1 =
      document.getElementById("answerInput1").disabled;

    const done2 =
      document.getElementById("answerInput2").disabled;

    if (done1 && done2 && answers[index] === null) {

      answers[index] = ["Bones", "Muscles"];

      score++;

      next.disabled = false;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1500);
      }
    }
  }

  // ================= NORMAL QUESTIONS =================

  if (e.target.id === "checkBtn") {

    if (answers[index] !== null) return;

    const input =
      document.getElementById("answerInput");

    const user =
      input.value.trim().toLowerCase();

    let isCorrect = false;

    if (Array.isArray(q.a)) {

      isCorrect = q.a.includes(user);

    } else {

      isCorrect =
        q.a.toLowerCase() === user;
    }

    if (isCorrect) {

      // ✅ Show answer in first capital
      input.value =
        user.charAt(0).toUpperCase() +
        user.slice(1).toLowerCase();

      answers[index] = [input.value];

      score++;

      input.disabled = true;
      document.getElementById("checkBtn").disabled = true;

      speak("Correct");
      showPopup(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      next.disabled = false;

    } else {

      speak("Wrong");
      showPopup(false);

      input.value = "";
    }
  }
});

// ================= NAVIGATION =================

prev.onclick = () => {
  index--;
  load();
};

next.onclick = () => {
  index++;
  load();
};

// ================= POPUP =================

function showPopup(isCorrect) {

  const popup =
    document.getElementById("answerPopup");

  const icon =
    document.getElementById("popupIcon");

  const title =
    document.getElementById("popupTitle");

  const msg =
    document.getElementById("popupMsg");

  popup.className =
    "popup " + (isCorrect ? "correct" : "wrong");

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

// ================= FINAL =================

function showFinal() {

  const finalPopup =
    document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/5`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  // 🎉 Confetti
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

// ================= START =================

load();