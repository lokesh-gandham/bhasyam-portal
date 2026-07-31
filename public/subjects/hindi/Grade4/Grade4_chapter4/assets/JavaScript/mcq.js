
    // ======================= AUDIO (Web Audio) =======================
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

    // ======================= QUIZ DATA =======================
  const QUESTIONS = [

    {
        id: 1,
        image: "../assets/images/raja.png",
        question: "राजा ने दरबार में किसका स्वागत किया?",
        options: ["राजकवि", "मंत्री", "रानी"],
        correct: "राजकवि"
    },

    {
        id: 2,
        image: "../assets/images/pradam1.png",
        question: "राजकवि ने शत्रु को क्या आशीर्वाद दिया?",
        options: ["दुःखी रहें", "सुखी रहें", "चिरंजीव रहें"],
        correct: "चिरंजीव रहें"
    },

    {
        id: 3,
        image: "../assets/images/raja-angry.png",
        question: "राजकवि का आशीर्वाद सुनकर राजा क्या हो गए?",
        options: ["प्रसन्न", "नाराज़", "दुःखी"],
        correct: "नाराज़"
    },

    {
        id: 4,
        image: "../assets/images/relex.png",
        question: "शत्रु के न रहने पर हम क्या हो जाते हैं?",
        options: ["शांत", "प्रसन्न", "लापरवाह"],
        correct: "लापरवाह"
    },

    {
        id: 5,
        image: "../assets/images/warning.png",
        question: "जीवन में मुश्किलें और चुनौतियाँ क्या सिखाती हैं?",
        options: ["डर", "खुशी", "सावधानी"],
        correct: "सावधानी"
    }
   

];
    // State
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

    // DOM elements
    const questionTextEl = document.getElementById("questionText");
    const questionImage = document.getElementById("questionImage");
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
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            }
        } else {
            popupEmoji.textContent = "😢";
            playWrongSound();
        }
        popup.classList.add("active");
        popupTimeout = setTimeout(() => {
            popup.classList.remove("active");
        }, 900);
    }

    // function speak(text) {
    //     try {
    //         speechSynthesis.cancel();
    //         const msg = new SpeechSynthesisUtterance(text);
    //         msg.lang = "hi-IN";
    //         msg.volume = 0.3;
    //         speechSynthesis.speak(msg);
    //     } catch(e) {}
    // }

    function bigConfetti() {
        confetti({ particleCount: 220, spread: 120, origin: { y: 0.5 }, startVelocity: 28 });
        setTimeout(() => {
            confetti({ particleCount: 130, spread: 140, origin: { y: 0.4, x: 0.2 } });
            confetti({ particleCount: 130, spread: 140, origin: { y: 0.4, x: 0.8 } });
        }, 150);
        setTimeout(() => {
            confetti({ particleCount: 90, spread: 95, origin: { y: 0.7 } });
        }, 300);
    }

    function showFinalCelebration() {
        if (quizCompleted) return;
        quizCompleted = true;
        bigConfetti();
        // speak("बहुत बहुत बधाई! आपने सभी प्रश्न सही किए!");
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

    // Handle answer selection
    function selectAnswer(selectedValue, btnElement, allButtons) {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        if (state.isCorrect) return;
        
        const isCorrect = (selectedValue === q.correct);
        
        if (isCorrect) {
            state.isCorrect = true;
            state.selectedAnswer = selectedValue;
            btnElement.classList.add("correct-selected");
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
        
        // Update question text with ID
        questionTextEl.innerHTML = `Q${q.id}. ${q.question}`;
        // Update image (handle missing images gracefully)
        questionImage.src = q.image;
        questionImage.alt = `प्रश्न ${q.id}`;
        questionImage.onerror = () => { questionImage.src = "https://via.placeholder.com/280x200?text=चित्र+उपलब्ध+नहीं"; };
        
        // Build options list
        optionsList.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <div class="option-letter">${letters[idx]}</div>
                <div class="option-text">${opt}</div>
            `;
            
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

    // Audio context init on first user interaction (required by browsers)
    function initAudioOnFirstClick() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const silentBuffer = audioCtx.createBuffer(1, 1, 22050);
            const source = audioCtx.createBufferSource();
            source.buffer = silentBuffer;
            source.connect(audioCtx.destination);
            source.start();
        } catch(e) { console.log("Audio init skipped", e); }
    }
    document.body.addEventListener('click', initAudioOnFirstClick, { once: true });

    // Start the quiz
    loadQuestion();
