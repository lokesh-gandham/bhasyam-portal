const letters = [
  { text: "अ", blank: false },
  { text: "आ", blank: true },
  { text: "इ", blank: true },
  { text: "ई", blank: true },
  { text: "उ", blank: true },
  { text: "ऊ", blank: true },
  { text: "ऋ", blank: true },
  { text: "ए", blank: true },
  { text: "ऐ", blank: true },
  { text: "ओ", blank: true },
  { text: "औ", blank: true },
];

const correctOrder = ["अ","आ","इ","ई","उ","ऊ","ऋ","ए","ऐ","ओ","औ"];
const blankIndexes = letters
  .map((item, i) => item.blank ? i : null)
  .filter(i => i !== null);

const container = document.getElementById("inputsContainer");

function normalizeText(str) {
  if (!str) return "";
  return str.trim().normalize("NFC").replace(/[\u200B-\u200D\uFEFF]/g, "");
}

function renderWorksheet() {
  const container = document.getElementById("inputsContainer");
  container.innerHTML = "";

  letters.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "letter-box";

    if (item.blank) {
      const inputWrapper = document.createElement("div");
      inputWrapper.className = "input-box";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "blank-input";
      input.dataset.index = index;
      input.placeholder = "?";
      input.autocomplete = "off";
      
      input.addEventListener("input", function(e) {
        const parentBox = this.parentElement;
        if (parentBox.classList.contains("wrong")) {
          parentBox.classList.remove("wrong");
        }
        if (parentBox.classList.contains("correct")) {
          parentBox.classList.remove("correct");
          this.disabled = false;
        }
      });
      
      inputWrapper.appendChild(input);
      div.appendChild(inputWrapper);
    } else {
      const fixedSpan = document.createElement("span");
      fixedSpan.className = "fixed";
      fixedSpan.textContent = item.text;
      div.appendChild(fixedSpan);
    }
    container.appendChild(div);
  });
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function fireConfetti() {
  if (typeof canvasConfetti === 'function') {
    canvasConfetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 }
    });
  } else if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}

function checkAnswers() {
  const inputs = document.querySelectorAll(".blank-input");
  let allCorrect = true;

  inputs.forEach((input) => {
    const actualIndex = Number(input.dataset.index);
    const correctLetter = letters[actualIndex]?.text || "";
    const cleanCorrect = normalizeText(correctLetter);
    const userValue = normalizeText(input.value);
    const isCorrect = (userValue === cleanCorrect);
    const parentBox = input.parentElement;
    
    if (isCorrect) {
      parentBox.classList.remove("wrong");
      parentBox.classList.add("correct");
      input.disabled = true;
      input.value = correctLetter;
    } else {
      if (input.value !== "") {
        input.value = "";
      }
      parentBox.classList.remove("correct");
      parentBox.classList.add("wrong");
      input.disabled = false;
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    showPopup(true);
    fireConfetti();
  } else {
    showPopup(false);
  }
}

function resetWrongAnswers() {
  const inputs = document.querySelectorAll(".blank-input");
  inputs.forEach((input) => {
    const parentBox = input.parentElement;
    if (parentBox.classList.contains("wrong")) {
      input.value = "";
      parentBox.classList.remove("wrong");
      input.disabled = false;
    }
  });
}

function init() {
  renderWorksheet();
  
  const checkBtn = document.getElementById("checkAllBtn");
  if (checkBtn) {
    const newCheckBtn = checkBtn.cloneNode(true);
    checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);
    newCheckBtn.addEventListener("click", () => {
      checkAnswers();
    });
  }
  
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    newResetBtn.addEventListener("click", () => {
      resetWrongAnswers();
    });
  }
  
  document.addEventListener('input', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('blank-input')) {
      const parent = e.target.parentElement;
      if (parent.classList.contains('wrong')) {
        parent.classList.remove('wrong');
      }
      if (parent.classList.contains('correct')) {
        parent.classList.remove('correct');
        e.target.disabled = false;
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}