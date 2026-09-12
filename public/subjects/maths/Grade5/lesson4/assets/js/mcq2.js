const quizData = [
{
    singular: "House",
    plural: "houses",
    image: "../assets/images/house.png",
    answerImage: "../assets/images/houses.png",
    options: ["houses", "housies", "housis", "housas"],
    hint: "Add 's' to the word 'house'"
},
{
    singular: "Month",
    plural: "months",
    image: "../assets/images/month.png",
    answerImage: "../assets/images/months.png",
    options: ["months", "monthes", "monthies", "monthas"],
    hint: "Add 's' to the word 'month'"
},
{
    singular: "Mistake",
    plural: "mistakes",
    image: "../assets/images/mistake.png",
    answerImage: "../assets/images/puzzles.png",
    options: ["mistakes", "mistaks", "mistackes", "mistakis"],
    hint: "Add 's' to the word 'mistake'"
},
{
    singular: "Mason",
    plural: "masons",
    image: "../assets/images/mcq-1.png",
    answerImage: "../assets/images/masons.png",
    options: ["masons", "masones", "masonies", "masonas"],
    hint: "Add 's' to the word 'mason'"
}
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);

// Tracks the letters typed into the circles for the current question
let currentLetters = [];
// Index of the circle currently focused/active for typing
let activeCircleIndex = 0;

const qEl = document.getElementById("question");
const q2El = document.getElementById("question2");
const imgEl = document.getElementById("questionImg");
const img2El = document.getElementById("questionImg2");
const optEl = document.getElementById("options"); // kept for backward compatibility, may be null if removed from HTML
const circlesEl = document.getElementById("answerCircles");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const hintText = document.getElementById("hintText");
const hintBtn = document.getElementById("hintBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

/* ==============================================
   Hidden input used to trigger the mobile/tablet
   on-screen keyboard. Desktop keeps working via
   the existing document-level keydown listener.
   ============================================== */
const mobileInput = document.createElement("input");
mobileInput.type = "text";
mobileInput.setAttribute("autocomplete", "off");
mobileInput.setAttribute("autocorrect", "off");
mobileInput.setAttribute("autocapitalize", "off");
mobileInput.setAttribute("spellcheck", "false");
mobileInput.setAttribute("inputmode", "text");
mobileInput.style.position = "absolute";
mobileInput.style.opacity = "0";
mobileInput.style.height = "1px";
mobileInput.style.width = "1px";
mobileInput.style.padding = "0";
mobileInput.style.border = "none";
mobileInput.style.left = "-9999px";
document.body.appendChild(mobileInput);

function focusMobileInput() {
    // Keep it empty so every keystroke reads as a fresh single character
    mobileInput.value = "";
    mobileInput.focus({ preventScroll: true });
}

mobileInput.addEventListener("input", () => {
    if (answered[current] === true) return;
    const val = mobileInput.value;
    if (!val) return;

    const lastChar = val[val.length - 1];
    if (/^[a-zA-Z]$/.test(lastChar)) {
        setLetter(activeCircleIndex, lastChar);
        moveActive(1);
    }
    mobileInput.value = "";
});

mobileInput.addEventListener("keydown", (e) => {
    if (answered[current] === true) return;
    if (e.key === "Backspace") {
        e.preventDefault();
        if (currentLetters[activeCircleIndex]) {
            setLetter(activeCircleIndex, "");
        } else {
            moveActive(-1);
            setLetter(activeCircleIndex, "");
        }
    } else if (e.key === "Enter") {
        checkAnswer();
    }
});

function toggleHint() {
    hintText.classList.toggle("show");
    if (hintText.classList.contains("show")) {
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hide Hint';
    } else {
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';
    }
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-US";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function playCorrectSound() {
    if (!correctSound) return;
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
}

function playWrongSound() {
    if (!wrongSound) return;
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
}

function smallConfetti() {
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        scalar: 0.9,
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    });
}

function getTwoOptions(q) {
    const wrongPool = q.options.filter((o) => o !== q.plural);
    const wrong = wrongPool[Math.floor(Math.random() * wrongPool.length)];
    const two = [q.plural, wrong];
    for (let i = two.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [two[i], two[j]] = [two[j], two[i]];
    }
    return two;
}

/* ==============================================
   Circle-based letter input, replaces the
   old two-button MCQ rendering. getTwoOptions()
   above is kept (unused) in case you want to fall
   back to it later.
   ============================================== */

function buildCircles(count) {
    circlesEl.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const c = document.createElement("div");
        c.className = "answer-circle";
        c.dataset.index = i;
        c.textContent = "";
        c.onclick = () => {
            if (answered[current] === true) return;
            activeCircleIndex = i;
            highlightActiveCircle();
            focusMobileInput();
        };
        circlesEl.appendChild(c);
    }
}

function highlightActiveCircle() {
    const circles = [...circlesEl.children];
    circles.forEach((c, i) => {
        c.classList.toggle("active", i === activeCircleIndex && answered[current] !== true);
    });
}

function renderAnswerCircles(q) {
    const len = q.plural.length;
    currentLetters = Array(len).fill("");
    activeCircleIndex = 0;
    buildCircles(len);
    highlightActiveCircle();
}

function fillPrefilledCircles(q) {
    // Used when revisiting an already-answered question
    const len = q.plural.length;
    buildCircles(len);
    const circles = [...circlesEl.children];
    q.plural.split("").forEach((ch, i) => {
        circles[i].textContent = ch.toUpperCase();
        circles[i].classList.add("correct");
    });
}

function handleCircleKeydown(e) {
    // Ignore this listener when the hidden mobile input already has focus,
    // to avoid double-processing the same keystroke.
    if (document.activeElement === mobileInput) return;
    if (answered[current] === true) return;
    if (!circlesEl || circlesEl.children.length === 0) return;

    const key = e.key;

    if (/^[a-zA-Z]$/.test(key)) {
        setLetter(activeCircleIndex, key);
        moveActive(1);
    } else if (key === "Backspace") {
        if (currentLetters[activeCircleIndex]) {
            setLetter(activeCircleIndex, "");
        } else {
            moveActive(-1);
            setLetter(activeCircleIndex, "");
        }
    } else if (key === "ArrowLeft") {
        moveActive(-1);
    } else if (key === "ArrowRight") {
        moveActive(1);
    } else if (key === "Enter") {
        checkAnswer();
    }
}

function setLetter(index, letter) {
    if (index < 0 || index >= currentLetters.length) return;
    currentLetters[index] = letter;
    const circle = circlesEl.children[index];
    if (circle) circle.textContent = letter.toUpperCase();

    // Auto-check once every circle has a letter
    if (currentLetters.every((l) => l !== "")) {
        checkAnswer();
    }
}

function moveActive(delta) {
    const next = activeCircleIndex + delta;
    if (next < 0 || next >= currentLetters.length) return;
    activeCircleIndex = next;
    highlightActiveCircle();
}

function checkAnswer() {
    const q = quizData[current];
    const typed = currentLetters.join("").toLowerCase();

    if (typed.length < q.plural.length) return; // not complete yet

    const circles = [...circlesEl.children];

    if (typed === q.plural.toLowerCase()) {
        answered[current] = true;
        score++;

        circles.forEach((c) => {
            c.classList.remove("wrong", "active");
            c.classList.add("correct");
        });

        smallConfetti();
        playCorrectSound();
        speak("correct");
        showPopup(true);
        nextBtn.disabled = false;
        mobileInput.blur();

        if (answered.every((a) => a === true)) {
            setTimeout(showFinal, 1600);
        }
    } else {
        circles.forEach((c) => c.classList.add("wrong"));
        playWrongSound();
        speak("try again");
        showPopup(false);

        setTimeout(() => {
            circles.forEach((c) => c.classList.remove("wrong"));
            currentLetters = Array(q.plural.length).fill("");
            circles.forEach((c) => (c.textContent = ""));
            activeCircleIndex = 0;
            highlightActiveCircle();
            focusMobileInput();
        }, 600);
    }
}

function loadQuestion() {
    const q = quizData[current];
    qEl.textContent = `Q${current + 1}. One ${q.singular.toLowerCase()} → ?`;
    q2El.textContent = `Many ______?`;
   // Question Image (Singular)
imgEl.src = q.image;
imgEl.alt = q.singular;

// Answer Image (Plural)
img2El.src = q.answerImage;
img2El.alt = q.plural;

    // Hide hint when changing question
    hintText.classList.remove("show");
    hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';

    // Check if question was already answered correctly
    if (answered[current] === true) {
        fillPrefilledCircles(q);
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === quizData.length - 1;
        return;
    }

    renderAnswerCircles(q);

    prevBtn.disabled = current === 0;
    nextBtn.disabled = true; // Disabled until user answers correctly
}

prevBtn.onclick = () => {
    if (current > 0) {
        current--;
        loadQuestion();
    }
};

nextBtn.onclick = () => {
    if (current < quizData.length - 1) {
        current++;
        loadQuestion();
    }
};

function showPopup(isCorrect) {
    const popup = document.getElementById("answerPopup");
    const icon = document.getElementById("popupIcon");
    const title = document.getElementById("popupTitle");
    const msg = document.getElementById("popupMsg");

    popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
    popup.style.display = "flex";

    if (isCorrect) {
        icon.textContent = "🎉";
        title.textContent = "Great Job!";
        msg.textContent = "You got it right!";
    } else {
        icon.textContent = "🥲";
        title.textContent = "Oops!";
        msg.textContent = "Try again, you can do it!";
    }

    setTimeout(() => {
        popup.style.display = "none";
    }, 1400);
}

function showFinal() {
    const popup = document.getElementById("finalPopup");
    const total = quizData.length;

    document.getElementById("finalScore").textContent = `Your Score: ${score} / ${total}`;

    // Stars based on score
    let stars = "";
    if (score === total) stars = "⭐⭐⭐⭐";
    else if (score >= total / 2) stars = "⭐⭐";
    else stars = "⭐";
    document.getElementById("stars").textContent = stars;

    popup.style.display = "flex";

    // Big confetti celebration
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3']
    });

    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1']
        });
    }, 300);

    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#f9ca24', '#ff6b6b', '#4ecdc4']
        });
    }, 600);

    // Play celebration sound
    setTimeout(() => {
        correctSound.currentTime = 0;
        correctSound.play().catch(() => {});
    }, 200);
}

// Load first question
loadQuestion();
focusMobileInput();

// Listen for keyboard input to fill the answer circles (desktop)
document.addEventListener("keydown", handleCircleKeydown);

// Re-focus the hidden input whenever the circles area is tapped,
// so mobile keyboards open reliably even after a blur.
circlesEl.addEventListener("click", () => {
    if (answered[current] !== true) focusMobileInput();
});

// Prevent body scroll
document.addEventListener('touchmove', function(e) {
    if (!e.target.closest('.quiz')) {
        e.preventDefault();
    }
}, { passive: false });

// Close hint when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.question-top') && !e.target.closest('.hint-text')) {
        hintText.classList.remove("show");
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';
    }
});