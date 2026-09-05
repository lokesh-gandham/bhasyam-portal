   // Audio Context for sounds
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
            audioCtx.resume().catch(e=>null);
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
            audioCtx.resume().catch(e=>null);
        } catch(e) { console.log("Audio error:", e); }
    }

    // Quiz Data
    const QUESTIONS = [
        {
            id: 1,
            english: "Q1. सूरज का आकार कैसा है ?",
            image: "../assets/images/sun1.png",
            options: ["a) लंबा", "b) चौड़ा", "c) गोल"],
            correct: "c) गोल"
        },
        {
            id: 2,
            english: "Q2. सूरज के आने पर चिड़ियाँ क्या करती हैं ?",
            image: "../assets/images/bird.png",
            options: ["a) खाती हैं", "b) गाती हैं", "c) उड़ती हैं"],
            correct: "b) गाती हैं"
        },
        {
            id: 3,
            english: "Q3. सूरज के आने पर क्या नहीं रहती ?",
            image: "../assets/images/boy.png",
            options: ["a) सुस्ती", "b) याद", "c) जोश"],
            correct: "a) सुस्ती"
        },
        {
            id: 4,
            english: "Q4. जब गरमी कम हो जाती है तो धूप कैसे आती है ?",
            image: "../assets/images/cloud.png",
            options: ["a) पीछे से", "b) धीरे से", "c) थकी-सी"],
            correct: "c) थकी-सी"
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

    const englishWordEl = document.getElementById("englishWord");
    const meaningImageEl = document.getElementById("meaningImage");
    const optionsList = document.getElementById("optionsList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const simpleEmojiPopup = document.getElementById("simpleEmojiPopup");
    const popupEmoji = document.getElementById("popupEmoji");
    const finalPopupEl = document.getElementById("finalPopup");
    const playAgainBtn = document.getElementById("playAgainBtn");

    let popupTimeout = null;

    function showSimpleEmojiPopup(isCorrect) {
        if (popupTimeout) clearTimeout(popupTimeout);
        
        if (isCorrect) {
            popupEmoji.textContent = "😊";
            playCorrectSound();
            
            if (typeof canvasConfetti === 'function') {
                canvasConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            } else if (typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            }
        } else {
            popupEmoji.textContent = "😔";
            playWrongSound();
        }
        
        simpleEmojiPopup.classList.add("active");
        
        popupTimeout = setTimeout(() => {
            simpleEmojiPopup.classList.remove("active");
        }, 1000);
    }

    function bigConfetti() {
        if (typeof canvasConfetti === 'function') {
            canvasConfetti({ particleCount: 200, spread: 110, origin: { y: 0.5 }, startVelocity: 28 });
            setTimeout(() => {
                canvasConfetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.2 } });
                canvasConfetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.8 } });
            }, 150);
        } else if (typeof confetti === 'function') {
            confetti({ particleCount: 200, spread: 110, origin: { y: 0.5 }, startVelocity: 28 });
            setTimeout(() => {
                confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.2 } });
                confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.8 } });
            }, 150);
        }
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

    function showFinalCelebration() {
        if (finalPopupShown) return;
        finalPopupShown = true;
        quizCompleted = true;
        
        bigConfetti();
        // speak("बहुत बहुत बधाई! आपने सभी प्रश्नों के सही उत्तर दिए!");
        
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

    function selectAnswer(selectedValue, btnElement, allButtons) {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        
        if (state.isCorrect) return;
        
        const isCorrect = (selectedValue === q.correct);
        
        if (isCorrect) {
            // Mark as correct
            state.isCorrect = true;
            
            // Highlight the correct option in green
            btnElement.classList.add("correct-highlight");
            
            // Disable all option buttons
            allButtons.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            });
            
            // Show success popup and sound
            showSimpleEmojiPopup(true);
            // speak("सही उत्तर! बहुत बढ़िया!");
            
            // Update next button
            updateNextButtonState();
            
            // Check if all questions completed
            checkAndUpdateComplete();
        } else {
            // Show wrong flash on the clicked button
            btnElement.classList.add('wrong-flash');
            
            // Show wrong popup and sound
            showSimpleEmojiPopup(false);
            // speak("गलत उत्तर, फिर से प्रयास करें");
            
            // Remove the flash class after animation
            setTimeout(() => {
                btnElement.classList.remove('wrong-flash');
            }, 500);
        }
    }

    function loadQuestion() {
        if (quizCompleted) return;
        
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        
        // Update left section
        englishWordEl.textContent = q.english;
        meaningImageEl.src = q.image;
        meaningImageEl.alt = q.english;
        
        // Create options
        optionsList.innerHTML = '';
        const allBtns = [];
        
        q.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.setAttribute('data-option', opt);
            
            // If this question was already answered correctly, highlight the correct answer
            if (state.isCorrect && opt === q.correct) {
                btn.classList.add('correct-highlight');
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            } 
            // If not answered yet, add click event
            else if (!state.isCorrect) {
                btn.addEventListener('click', () => {
                    if (state.isCorrect) return;
                    const currentBtns = document.querySelectorAll('.option-btn');
                    selectAnswer(opt, btn, currentBtns);
                });
            } else {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            }
            
            optionsList.appendChild(btn);
            allBtns.push(btn);
        });
        
        // If already answered, disable all buttons
        if (state.isCorrect) {
            allBtns.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            });
        }
        
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
        } catch(e) { console.log("Audio init error:", e); }
    }
    
    document.body.addEventListener('click', initAudioOnFirstClick, { once: true });
    
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);
    playAgainBtn.addEventListener('click', () => {
        restartQuiz();
    });
    
    loadQuestion();