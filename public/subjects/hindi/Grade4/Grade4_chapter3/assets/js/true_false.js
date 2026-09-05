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

        // QUESTIONS with images
     const QUESTIONS = [
    {
        id: 1,
        image: "../assets/images/red.png",
        question: "सूरज नीला रंग बिखराता है।",
        correct: "नहीं"
    },
    {
        id: 2,
        image: "../assets/images/sun.png",
        question: "दिन सीढ़ी पर चढ़ने की तरह सूरज बढ़ता है।",
        correct: "हाँ"
    },
    {
        id: 3,
        image: "../assets/images/boy.png",
        question: "सूरज के आने पर सब पर सुस्ती छाई रहती है।",
        correct: "नहीं"
    },
    {
        id: 4,
        image: "../assets/images/light.png",
        question: "सूरज के आने पर धरती-गगन दमकता है।",
        correct: "हाँ"
    },
    {
        id: 5,
        image: "../assets/images/rat.png",
        question: "सूरज के ढलते समय गरमी कम हो जाती है।",
        correct: "हाँ"
    }
];

        // VARIABLES
        let currentIndex = 0;
        let quizCompleted = false;
        let userStates = [];

        function initStates() {
            userStates = [];
            for (let i = 0; i < QUESTIONS.length; i++) {
                userStates.push({ isCorrect: false });
            }
        }
        initStates();

        const questionImage = document.getElementById("questionImage");
        const questionText = document.getElementById("questionText");
        const answerButtons = document.getElementById("answerButtons");
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
                popupEmoji.textContent = "😔";
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
            // speak("बहुत बहुत बधाई! आपने सभी उत्तर सही दिए!");
            setTimeout(() => {
                finalPopup.classList.add("active");
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }, 500);
        }

        function checkComplete() {
            if (userStates.every(s => s.isCorrect)) {
                showFinalCelebration();
            }
        }

        function updateNavButtons() {
            prevBtn.disabled = (currentIndex === 0);
            const currentState = userStates[currentIndex];
            nextBtn.disabled = !currentState.isCorrect;
        }

        function updateButtonsState(state, q) {
            const btns = document.querySelectorAll(".answer-btn");
            
            if (state.isCorrect) {
                btns.forEach(btn => {
                    btn.classList.add("disabled-option");
                    if (btn.getAttribute("data-answer") === q.correct) {
                        btn.classList.add("correct-answer");
                    }
                });
            } else {
                btns.forEach(btn => {
                    btn.classList.remove("disabled-option", "correct-answer");
                });
            }
        }

        function loadCurrentQuestion() {
            const q = QUESTIONS[currentIndex];
            const state = userStates[currentIndex];

            // Update image
            questionImage.src = q.image;
            
            // Update question text with ID
            questionText.innerHTML = `Q${q.id}. ${q.question}`;
            
            // Reset buttons
            const btns = document.querySelectorAll(".answer-btn");
            btns.forEach(btn => {
                btn.classList.remove("correct-answer", "wrong-answer", "disabled-option");
            });
            
            // Add event listeners if not already answered
            if (!state.isCorrect) {
                btns.forEach(btn => {
                    // Remove existing listeners by cloning
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    newBtn.addEventListener("click", () => {
                        if (state.isCorrect) return;
                        
                        const answer = newBtn.getAttribute("data-answer");
                        
                        if (answer === q.correct) {
                            state.isCorrect = true;
                            newBtn.classList.add("correct-answer");
                            
                            // Disable both buttons
                            const allBtns = document.querySelectorAll(".answer-btn");
                            allBtns.forEach(b => {
                                b.classList.add("disabled-option");
                                if (b.getAttribute("data-answer") === q.correct) {
                                    b.classList.add("correct-answer");
                                }
                            });
                            
                            showPopup(true);
                            // speak("सही उत्तर");
                            
                            updateNavButtons();
                            checkComplete();
                        } else {
                            showPopup(false);
                            // speak("गलत उत्तर");
                            newBtn.classList.add("wrong-answer");
                            setTimeout(() => {
                                newBtn.classList.remove("wrong-answer");
                            }, 500);
                        }
                    });
                });
            } else {
                btns.forEach(btn => {
                    btn.classList.add("disabled-option");
                    if (btn.getAttribute("data-answer") === q.correct) {
                        btn.classList.add("correct-answer");
                    }
                });
            }
            
            updateNavButtons();
        }

        // PREV BUTTON
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                loadCurrentQuestion();
            }
        });

        // NEXT BUTTON
        nextBtn.addEventListener("click", () => {
            if (currentIndex < QUESTIONS.length - 1 && userStates[currentIndex].isCorrect) {
                currentIndex++;
                loadCurrentQuestion();
            }
        });

        // PLAY AGAIN
        playAgainBtn.addEventListener("click", () => {
            currentIndex = 0;
            quizCompleted = false;
            initStates();
            finalPopup.classList.remove("active");
            loadCurrentQuestion();
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

        // START
        loadCurrentQuestion();