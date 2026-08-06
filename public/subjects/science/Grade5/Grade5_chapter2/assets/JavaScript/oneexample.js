const questions = [
  {
    q: "Q1. Type of nerve ",
    a: "sensory nerve",
    img: "../assets/images/nerves.png",
  },
  {
    q: "Q2. Voluntary action ",
    a: "walking",
    img: "../assets/images/voluntary-action.png",
  },
  {
    q: "Q3. Involuntary action ",
    a: "heartbeat",
    img: "../assets/images/voluntaryactions.png",
  },
  {
    q: "Q4. Sense organ ",
    a: "skin",
    img: "../assets/images/boyskintouch.png",
  },
  {
    q: "Q5. Reflex action ",
    a: "pulling back hand from a hot plate",
    img: "../assets/images/reflexactions.png",
  }
];

// function speak(text){
//   if(!("speechSynthesis" in window)) return;
//   speechSynthesis.cancel();
//   const utter = new SpeechSynthesisUtterance(text);
//   utter.rate = 1;
//   utter.pitch = 1;
//   utter.volume = 1;
//   speechSynthesis.speak(utter);
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

let index = 0;
let score = 0;
let popupTimer = null;

// Only store "correct"
const answers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const input2 = document.getElementById("answerInput2");

// 🔒 restrict both inputs
[input, input2].forEach((inp) => {
  if (!inp) return;

  inp.setAttribute("autocomplete", "off");
  inp.setAttribute("spellcheck", "false");

  // ❌ block drag & drop
  inp.addEventListener("dragover", (e) => e.preventDefault());
  inp.addEventListener("drop", (e) => e.preventDefault());

  // ❌ block paste
  inp.addEventListener("paste", (e) => e.preventDefault());

  // ✅ allow only letters + space
  inp.addEventListener("input", () => {
    inp.value = inp.value.replace(/[^a-zA-Z\s]/g, "");
  });
});
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupBox = document.getElementById("popupBox");

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src = q.img;

  const isDouble = Array.isArray(q.a);

  input2.style.display = isDouble ? "block" : "none";

  if (answers[index] === "correct") {

    if (isDouble) {
      input.value = q.a[0];
      input2.value = q.a[1];
      input2.disabled = true;
    } else {
      input.value = q.a;
    }

    input.disabled = true;

  } else {

    input.value = "";
    input2.value = "";

    input.disabled = false;
    input2.disabled = false;
  }

  check.disabled = true;

  prev.disabled = index === 0;
  next.disabled = answers[index] !== "correct";
}

function showPopup(html, final = false) {
  if (popupTimer) clearTimeout(popupTimer);

  popup.style.display = "flex";
  popupBox.className = final ? "popup-box popup-final" : "popup-box";
  popupBox.innerHTML = html;

  if (!final) {
    popupTimer = setTimeout(() => {
      popup.style.display = "none";
    }, 1000);
  }

  updateButton();
}

check.onclick = () => {

  const q = questions[index];

  const user1 = input.value.trim().toLowerCase();

  if (Array.isArray(q.a)) {

    const user2 = input2.value.trim().toLowerCase();

    if (user1 === q.a[0] && user2 === q.a[1]) {

      if (answers[index] !== "correct") score++;

      answers[index] = "correct";

      speak("Correct");

      showPopup(`
        <div class="popup-correct">
          <div>✅ Correct</div>
          <div class="happy">😊</div>
          <div class="stars">${"⭐".repeat(score)}</div>
        </div>
      `);

      input.disabled = true;
      input2.disabled = true;

      check.disabled = true;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1400); // show final popup after correct popup
      } else {
        next.disabled = false;
      }

    } else {

      speak("Wrong");
      input.value = "";
      input2.value = "";

      showPopup(`
        <div>
          <div class="popup-title" style="color:#c62828;">❌ Wrong!</div>
          <span class="popup-emoji">😢</span>
          <div class="popup-tip">💡 Try again!</div>
        </div>
      `);
    }

  } else {

    if (user1 === q.a.toLowerCase()) {

      if (answers[index] !== "correct") score++;

      answers[index] = "correct";

      speak("Correct");
   fireConfetti();
      showPopup(`
        <div class="popup-correct">
          <div>✅ Correct</div>
          <div class="happy">😊</div>
          <div class="stars">${"⭐".repeat(score)}</div>
        </div>
      `);

      input.disabled = true;

      check.disabled = true;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1400); // show final popup after correct popup
      } else {
        next.disabled = false;
      }

    } else {

      speak("Wrong");
      input.value = "";

      showPopup(`
        <div>
          <div class="popup-title" style="color:#c62828;">❌ Wrong!</div>
          <span class="popup-emoji">😢</span>
          <div class="popup-tip">💡 Try again!</div>
        </div>
      `);
    }
  }
};

function showFinal() {
     fireConfettif(); 
  showPopup(
    `
    <div class="popup-final-content">
      🎉 Congratulations!
      <span class="emoji">🏆</span>
      <div>You finished the quiz!</div>
      <div class="final-score">
        Score: ${score}/${questions.length}
      </div>
      <div class="stars">${"⭐".repeat(score)}</div>
      <div class="final-actions">
        <button class="restart" onclick="location.reload()">🔄 Restart</button>
        <button class="home" onclick="location.href='../index.html'">🏠 Home</button>
      </div>
    </div>
  `,
    true,
  );
}

prev.onclick = () => {
  index--;
  load();
};

next.onclick = () => {
  index++;
  load();
};

function updateButton() {

  const q = questions[index];

  if (Array.isArray(q.a)) {

    check.disabled =
      input.disabled ||
      input2.disabled ||
      !input.value.trim() ||
      !input2.value.trim();

  } else {

    check.disabled =
      input.disabled ||
      !input.value.trim();

  }
}

input.oninput = updateButton;
input2.oninput = updateButton;

// Initial state
prev.disabled = true;
next.disabled = true;


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



load();

// ❌ block drag/drop on full page
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());