
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
        } catch(e) { console.log("Audio error:", e); }
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
        } catch(e) { console.log("Audio error:", e); }
    }

    // QUESTIONS with images
  const QUESTIONS = [
    {
        id: 1,
        hindiWord: "स्वागत",
        image: "../assets/images/welcome.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["आगत", "विदाई", "क्रोध", "दुख"],
        correct: "आगत"
    },
    {
        id: 2,
        hindiWord: "प्रणाम",
        image: "../assets/images/pradam1.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["नमस्कार", "इनाम", "झगड़ा", "खुशी"],
        correct: "इनाम"
    },
    {
        id: 3,
        hindiWord: "बल",
        image: "../assets/images/angry1.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["शक्ति", "कमज़ोरी", "कल", "दर्द"],
        correct: "कल"
    },
    {
        id: 4,
        hindiWord: "संतुष्ट",
        image: "../assets/images/gift.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["खुश", "नाराज़", "तंदरूस्त", "परेशान"],
        correct: "तंदरूस्त"
    },
    {
        id: 5,
        hindiWord: "उपहार",
        image: "../assets/images/uphar.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["भेंट", "उपकार", "सज़ा", "डर"],
        correct: "उपकार"
    },
    {
        id: 6,
        hindiWord: "लापरवाह",
        image: "../assets/images/relex.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["बेपरवाह", "सावधान", "चालाक", "शांत"],
        correct: "बेपरवाह"
    },
    {
        id: 7,
        hindiWord: "बुद्धि",
        image: "../assets/images/welcome.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["अक्ल", "मूर्खता", "शुद्धि", "गुस्सा"],
        correct: "शुद्धि"
    },
    {
        id: 8,
        hindiWord: "विचित्र",
        image: "../assets/images/come1.png",
        imageText: "इस शब्द का सही अर्थ क्या है?",
        options: ["अनोखा", "मित्र", "साधारण", "सुंदर"],
        correct: "मित्र"
    }
];
    // VARIABLES
    let currentIndex = 0;
    let quizCompleted = false;
    let userStates = [];

    function initStates() {
        userStates = [];
        for (let i = 0; i < QUESTIONS.length; i++) {
            userStates.push({ selectedAnswer: null, isCorrect: false });
        }
    }
    initStates();

    const questionAboveImage = document.getElementById("questionAboveImage");
    const wordImage = document.getElementById("wordImage");
    const hindiWordEl = document.getElementById("hindiWord");
    const optionsList = document.getElementById("optionsList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const popup = document.getElementById("simpleEmojiPopup");
    const popupEmoji = document.getElementById("popupEmoji");
    const finalPopup = document.getElementById("finalPopup");
    const playAgainBtn = document.getElementById("playAgainBtn");

    let popupTimeout = null;

    function showPopup(isCorrect) {
        if (popupTimeout) clearTimeout(popupTimeout);

        if (isCorrect) {
            popupEmoji.textContent = "😊";
            playCorrectSound();
            if (typeof confetti === 'function') {
                confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            }
        } else {
            popupEmoji.textContent = "😢";
            playWrongSound();
        }

        popup.classList.add("active");
        popupTimeout = setTimeout(() => {
            popup.classList.remove("active");
        }, 800);
    }

    // function speak(text) {
    //     speechSynthesis.cancel();
    //     const msg = new SpeechSynthesisUtterance(text);
    //     msg.lang = "hi-IN";
    //     msg.volume = 0.25;
    //     speechSynthesis.speak(msg);
    // }

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
        // speak("बहुत बहुत बधाई! आपने सभी शब्दों के सही अर्थ दिए!");
        setTimeout(() => {
            finalPopup.classList.add("active");
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }, 500);
    }

    function updateNavButtons() {
        prevBtn.disabled = (currentIndex === 0);
        const currentState = userStates[currentIndex];
        nextBtn.disabled = !currentState.isCorrect;
    }

    function checkAndUpdateComplete() {
        if (userStates.every(s => s.isCorrect)) {
            showFinalCelebration();
        }
    }

    function selectAnswer(selectedValue, btnElement, allButtons) {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        
        if (state.isCorrect) return;
        
        const isCorrect = (selectedValue === q.correct);
        
        if (isCorrect) {
            state.isCorrect = true;
            state.selectedAnswer = selectedValue;
            
            // Highlight correct button
            btnElement.classList.add("correct-selected");
            
            // Disable all buttons
            allButtons.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            });
            
            showPopup(true);
            // speak("सही उत्तर");
            
            updateNavButtons();
            checkAndUpdateComplete();
        } else {
            showPopup(false);
            // speak("गलत उत्तर");
            btnElement.classList.add("wrong-selected");
            setTimeout(() => {
                btnElement.classList.remove("wrong-selected");
            }, 500);
        }
    }

    function loadQuestion() {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        
        // Update text above image
        questionAboveImage.textContent = q.imageText;
        
        // Update image and Hindi word
        wordImage.src = q.image;
        wordImage.alt = q.hindiWord;
        hindiWordEl.textContent = q.hindiWord;
        
        // Create options
        optionsList.innerHTML = '';
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.textContent = opt;
            
            if (!state.isCorrect) {
                btn.addEventListener('click', () => {
                    if (state.isCorrect) return;
                    const allBtns = document.querySelectorAll('.option-btn');
                    selectAnswer(opt, btn, allBtns);
                });
            } else {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
                if (opt === q.correct) {
                    btn.classList.add('correct-selected');
                }
            }
            
            optionsList.appendChild(btn);
        });
        
        updateNavButtons();
    }

    // Navigation
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadQuestion();
        }
    });

    nextBtn.addEventListener("click", () => {
        const state = userStates[currentIndex];
        if (state.isCorrect && currentIndex < QUESTIONS.length - 1) {
            currentIndex++;
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
        } catch(e) { console.log("Audio init error:", e); }
    }

    document.body.addEventListener('click', initAudioOnFirstClick, { once: true });

    // START
    loadQuestion();
