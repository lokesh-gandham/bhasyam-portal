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
    } catch (e) { console.log("Audio error:", e); }
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
    } catch (e) { console.log("Audio error:", e); }
}

// ===== Quiz Data =====
// Each question now shows 4 full-word OPTIONS (not letter parts).
// "answer" is the correct full word for that image.
// "options" is the pool of 4 words shown as buttons (shuffled per question).

const WORD_POOL = ["सुबह", "दोपहर", "शाम", "रात"];

const QUESTIONS = [
    {
        id: 1,
        image: "../assets/images/night.png",
        answer: "रात",
        options: WORD_POOL
    },
    {
        id: 2,
        image: "../assets/images/morning.png",
        answer: "सुबह",
        options: WORD_POOL
    },
    {
        id: 3,
        image: "../assets/images/noon.png",
        answer: "दोपहर",
        options: WORD_POOL
    },
    {
        id: 4,
        image: "../assets/images/evening.png",
        answer: "शाम",
        options: WORD_POOL
    }
];

let currentIndex = 0;
let quizCompleted = false;
let finalPopupShown = false;
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

const meaningImageEl = document.getElementById("meaningImage");
const answerText = document.getElementById("answerText");
const optionsList = document.getElementById("optionsList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const simpleEmojiPopup = document.getElementById("simpleEmojiPopup");
const popupEmoji = document.getElementById("popupEmoji");
const finalPopupEl = document.getElementById("finalPopup");
const playAgainBtn = document.getElementById("playAgainBtn");

let popupTimeout = null;
let popupShownForCurrentQuestion = false;

function showSimpleEmojiPopup(isCorrect) {
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

    simpleEmojiPopup.classList.add("active");
    popupTimeout = setTimeout(() => {
        simpleEmojiPopup.classList.remove("active");
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
    if (finalPopupShown) return;
    finalPopupShown = true;
    quizCompleted = true;
    bigConfetti();
    setTimeout(() => {
        finalPopupEl.classList.add("active");
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }, 500);
}

function updateNextButtonState() {
    if (quizCompleted) {
        nextBtn.disabled = true;
        return;
    }
    const state = userStates[currentIndex];
    nextBtn.disabled = !state.isCorrect;
}

function checkAndUpdateComplete() {
    if (userStates.every(s => s.isCorrect)) {
        showFinalCelebration();
    }
}

function updateAnswerBox() {
    const state = userStates[currentIndex];
    const q = QUESTIONS[currentIndex];

    if (state.isCorrect) {
        answerText.textContent = q.answer;
        answerText.classList.add('filled');
    } else {
        answerText.textContent = "???";
        answerText.classList.remove('filled');
    }
}

function selectOption(optionValue, btnElement, allButtons) {
    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    if (state.isCorrect) return;

    if (optionValue === q.answer) {
        // Correct selection - fill the answer box
        state.isCorrect = true;
        updateAnswerBox();

        // Disable all option buttons for this question
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.classList.add('disabled-option');
        });

        if (!popupShownForCurrentQuestion) {
            popupShownForCurrentQuestion = true;
            showSimpleEmojiPopup(true);
        }

        updateNextButtonState();
        checkAndUpdateComplete();
    } else {
        // Wrong selection
        showSimpleEmojiPopup(false);
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
    if (quizCompleted) return;

    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    // Reset popup flag for this question
    popupShownForCurrentQuestion = false;

    meaningImageEl.src = q.image;

    // Update answer box
    if (state.isCorrect) {
        answerText.textContent = q.answer;
        answerText.classList.add('filled');
    } else {
        answerText.textContent = "???";
        answerText.classList.remove('filled');
    }

    // Create 4 shuffled options
    optionsList.innerHTML = '';
    const shuffledOptions = shuffleArray(q.options);

    shuffledOptions.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.textContent = option;

        if (!state.isCorrect) {
            btn.addEventListener('click', () => {
                if (state.isCorrect) return;
                const allBtns = document.querySelectorAll('.option-btn');
                selectOption(option, btn, allBtns);
            });
        } else {
            btn.style.pointerEvents = 'none';
            btn.classList.add('disabled-option');
        }

        optionsList.appendChild(btn);
    });

    updateNextButtonState();
    prevBtn.disabled = (currentIndex === 0) || quizCompleted;
}

function goPrev() {
    if (quizCompleted) return;
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}

function goNext() {
    if (quizCompleted) return;
    const state = userStates[currentIndex];
    if (state.isCorrect) {
        if (currentIndex < QUESTIONS.length - 1) {
            currentIndex++;
            loadQuestion();
        }
    }
}

function restartQuiz() {
    currentIndex = 0;
    quizCompleted = false;
    finalPopupShown = false;
    popupShownForCurrentQuestion = false;
    initStates();
    finalPopupEl.classList.remove("active");
    if (popupTimeout) clearTimeout(popupTimeout);
    simpleEmojiPopup.classList.remove("active");
    loadQuestion();
}

function initAudioOnFirstClick() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    } catch (e) { console.log("Audio init error:", e); }
}

document.body.addEventListener('click', initAudioOnFirstClick, { once: true });

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);
playAgainBtn.addEventListener('click', () => { restartQuiz(); });

loadQuestion();