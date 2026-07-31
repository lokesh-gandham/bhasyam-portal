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

    // Quiz Data - Each question has letters/matras to build the word
 const QUESTIONS = [

 {
    id: 1,
    image: "../assets/images/night.png",
    parts: ["रा", "त"],
    correctOrder: ["रा", "त"],
    fullWord: "रात"
},

   {
    id: 2,
    image: "../assets/images/morning.png",
    parts: ["सु", "बह"],
    correctOrder: ["सु", "बह"],
    fullWord: "सुबह"
},

{
    id: 3,
    image: "../assets/images/noon.png",
    parts: ["दो", "प", "हर"],
    correctOrder: ["दो", "प", "हर"],
    fullWord: "दोपहर"
},

{
    id: 4,
    image: "../assets/images/evening.png",
    parts: ["शा", "म"],
    correctOrder: ["शा", "म"],
    fullWord: "शाम"
},


    

];

    let currentIndex = 0;
    let quizCompleted = false;
    let finalPopupShown = false;
    let userStates = [];

    function initStates() {
        userStates = [];
        for(let q = 0; q < QUESTIONS.length; q++) {
            userStates.push({
                selectedParts: [],
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
            popupEmoji.textContent = "😢";
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

    // function speak(text) {
    //     speechSynthesis.cancel();
    //     const msg = new SpeechSynthesisUtterance(text);
    //     msg.lang = "hi-IN";
    //     msg.volume = 0.25;
    //     speechSynthesis.speak(msg);
    // }

    function showFinalCelebration() {
        if (finalPopupShown) return;
        finalPopupShown = true;
        quizCompleted = true;
        bigConfetti();
        // speak("बहुत बहुत बधाई! आपने सभी शब्द सही बनाए!");
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

    function buildCurrentWord() {
        const state = userStates[currentIndex];
        if (state.selectedParts.length === 0) return "";
        return state.selectedParts.join('');
    }

    function updateAnswerBox() {
        const state = userStates[currentIndex];
        const currentWord = buildCurrentWord();
        
        if (state.isCorrect) {
            answerText.textContent = QUESTIONS[currentIndex].fullWord;
            answerText.classList.add('filled');
        } else if (currentWord) {
            answerText.textContent = currentWord;
            answerText.classList.remove('filled');
        } else {
            answerText.textContent = "???";
            answerText.classList.remove('filled');
        }
    }

    function selectPart(partValue, btnElement, allButtons) {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        
        if (state.isCorrect) return;
        
        const nextExpectedIndex = state.selectedParts.length;
        const expectedPart = q.correctOrder[nextExpectedIndex];
        
        if (partValue === expectedPart) {
            // Correct selection
            state.selectedParts.push(partValue);
            
            // Update answer box
            updateAnswerBox();
            
            // Disable the clicked button
            btnElement.style.pointerEvents = 'none';
            btnElement.classList.add('disabled-option');
            
            // Check if word is complete
            if (state.selectedParts.length === q.correctOrder.length) {
                // Word is fully built correctly
                state.isCorrect = true;
                updateAnswerBox();
                
                // Update all option buttons to disabled
                allButtons.forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.classList.add('disabled-option');
                });
                
                // Show success popup only once when word is complete
                if (!popupShownForCurrentQuestion) {
                    popupShownForCurrentQuestion = true;
                    showSimpleEmojiPopup(true);
                    // speak("बहुत अच्छा! शब्द पूरा हुआ!");
                }
                
                updateNextButtonState();
                checkAndUpdateComplete();
            } else {
                // Show correct sound but no popup for intermediate selections
                playCorrectSound();
            }
        } else {
            // Wrong selection - show wrong popup
            showSimpleEmojiPopup(false);
            // speak("गलत");
            btnElement.classList.add('selected-wrong');
            setTimeout(() => {
                btnElement.classList.remove('selected-wrong');
            }, 500);
        }
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
            answerText.textContent = q.fullWord;
            answerText.classList.add('filled');
        } else if (state.selectedParts.length > 0) {
            answerText.textContent = state.selectedParts.join('');
            answerText.classList.remove('filled');
        } else {
            answerText.textContent = "???";
            answerText.classList.remove('filled');
        }
        
        // Create options (shuffle for variety)
        optionsList.innerHTML = '';
        const shuffledParts = [...q.parts].sort(() => Math.random() - 0.5);
        
        shuffledParts.forEach(part => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.textContent = part;
            
            const isUsed = state.selectedParts.includes(part);
            
            if (!state.isCorrect && !isUsed) {
                btn.addEventListener('click', () => {
                    if (state.isCorrect) return;
                    const allBtns = document.querySelectorAll('.option-btn');
                    selectPart(part, btn, allBtns);
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
        } catch(e) { console.log("Audio init error:", e); }
    }
    
    document.body.addEventListener('click', initAudioOnFirstClick, { once: true });
    
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);
    playAgainBtn.addEventListener('click', () => { restartQuiz(); });
    
    loadQuestion();