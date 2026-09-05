// AUDIO
let audioCtx = null;

function playCorrectSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.2;
        oscillator.type = 'sine';
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.log("Audio error:", e);
    }
}

function playWrongSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.25;
        oscillator.type = 'sawtooth';
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
        oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// QUESTIONS - Each question now shows 5 full-word OPTIONS (not letter parts).
// "answer" is the correct full word for that sentence/image.
// "options" is the pool of 5 words shown as buttons (shuffled per question).

const WORD_POOL = ["आम", "शेर", "दिल्ली", "मछली", "कोयल"];

const QUESTIONS = [
    {
        id: 1,
        image: "../assets/images/delhi.png",
        sentence: "भारत की राजधानी ____ है।",
        answer: "दिल्ली",
        options: WORD_POOL
    },
    {
        id: 2,
        image: "../assets/images/fish.png",
        sentence: "____ पानी में रहती है।",
        answer: "मछली",
        options: WORD_POOL
    },
    {
        id: 3,
        image: "../assets/images/keol.png",
        sentence: "____ मीठा गाती है।",
        answer: "कोयल",
        options: WORD_POOL
    },
    {
        id: 4,
        image: "../assets/images/lion.png",
        sentence: "जंगल का राजा ____ है।",
        answer: "शेर",
        options: WORD_POOL
    },
    {
        id: 5,
        image: "../assets/images/fruits.png",
        sentence: " ____ फलों का राजा है।",
        answer: "आम",
        options: WORD_POOL
    }
];

// VARIABLES
let currentIndex = 0;
let quizCompleted = false;
let userStates = [];

function initStates() {
    userStates = [];
    for (let q = 0; q < QUESTIONS.length; q++) {
        userStates.push({
            isCorrect: false
        });
    }
}
initStates();

const meaningImage = document.getElementById("meaningImage");
const poemLine = document.getElementById("poemLine");
const partsList = document.getElementById("partsList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const popup = document.getElementById("simpleEmojiPopup");
const popupEmoji = document.getElementById("popupEmoji");
const finalPopup = document.getElementById("finalPopup");
const playAgainBtn = document.getElementById("playAgainBtn");

let popupTimeout = null;
let popupShownForCurrentQuestion = false;

function showPopup(isCorrect) {
    if (popupTimeout) clearTimeout(popupTimeout);

    if (isCorrect) {
        popupEmoji.textContent = "😊";
        playCorrectSound();
        if (typeof confetti === 'function') {
            confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
        }
    } else {
        popupEmoji.textContent = "😔";
        playWrongSound();
    }

    popup.classList.add("active");
    popupTimeout = setTimeout(() => {
        popup.classList.remove("active");
    }, 800);
}

function bigConfetti() {
    confetti({ particleCount: 200, spread: 110, origin: { y: 0.5 }, startVelocity: 28 });
    setTimeout(() => {
        confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.2 } });
        confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.8 } });
    }, 150);
    setTimeout(() => {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.7 } });
    }, 300);
}

function showFinalCelebration() {
    if (quizCompleted) return;
    quizCompleted = true;
    bigConfetti();
    setTimeout(() => {
        finalPopup.classList.add("active");
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }, 500);
}

function checkQuizComplete() {
    if (userStates.every(q => q.isCorrect)) {
        setTimeout(() => {
            showFinalCelebration();
        }, 700);
    }
}

function updateBlankDisplay() {
    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    let blankContent = state.isCorrect ? q.answer : "_____";

    poemLine.innerHTML = `Q${q.id}. ${q.sentence.replace("____", `<span class="blank-input ${state.isCorrect ? 'filled' : ''}">${blankContent}</span>`)}`;
}

function selectOption(optionValue, btnElement, allButtons) {
    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    if (state.isCorrect) return;

    if (optionValue === q.answer) {
        // Correct selection - fill the blank
        state.isCorrect = true;
        updateBlankDisplay();

        // Disable all option buttons
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.classList.add('disabled-part');
        });

        if (!popupShownForCurrentQuestion) {
            popupShownForCurrentQuestion = true;
            showPopup(true);
        }

        nextBtn.disabled = false;
        checkQuizComplete();
    } else {
        // Wrong selection
        showPopup(false);
        btnElement.classList.add('selected-wrong');
        setTimeout(() => {
            btnElement.classList.remove('selected-wrong');
        }, 500);
    }
}

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    // Reset popup flag for this question
    popupShownForCurrentQuestion = false;

    // Update image
    meaningImage.src = q.image;

    // Update poem line with blank
    updateBlankDisplay();

    // Create 5 shuffled options
    partsList.innerHTML = "";
    const shuffledOptions = shuffleArray(q.options);

    shuffledOptions.forEach(option => {
        const btn = document.createElement("div");
        btn.className = "part-btn";
        btn.textContent = option;

        if (!state.isCorrect) {
            btn.addEventListener("click", () => {
                if (state.isCorrect) return;
                const allBtns = document.querySelectorAll('.part-btn');
                selectOption(option, btn, allBtns);
            });
        } else {
            btn.style.pointerEvents = 'none';
            btn.classList.add('disabled-part');
        }

        partsList.appendChild(btn);
    });

    nextBtn.disabled = !state.isCorrect;
    prevBtn.disabled = (currentIndex === 0);
}

// Navigation
nextBtn.addEventListener("click", () => {
    if (currentIndex < QUESTIONS.length - 1) {
        currentIndex++;
        loadQuestion();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
});

// Play Again
playAgainBtn.addEventListener("click", () => {
    currentIndex = 0;
    quizCompleted = false;
    initStates();
    finalPopup.classList.remove("active");
    loadQuestion();
});

// Initialize audio on first click
function initAudioOnFirstClick() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    } catch (e) {
        console.log("Audio init error:", e);
    }
}

document.body.addEventListener('click', initAudioOnFirstClick, { once: true });

// Start
loadQuestion();