
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

        // QUESTIONS with WORKING IMAGE URLs (free online images)
      const QUESTIONS = [
    {
        id: 1,
        image: "../assets/images/welcome.png",
        sentence: "राजा ने राजकवि को प्रणाम करते हुए ____ किया।",
        parts: ["स्वा", "गत"],
        correctOrder: ["स्वा", "गत"],
        fullWord: "स्वागत"
    },
    {
        id: 2,
        image: "../assets/images/raja-angry.png",
        sentence: "आशीर्वाद सुनकर राजा भी ____ से नाराज़ हो गए।",
        parts: ["रा", "ज", "क","वि"],
        correctOrder: ["रा", "ज", "क","वि"],
        fullWord: "राजकवि"
    },
    {
        id: 3,
        image: "../assets/images/pradam1.png",
        sentence: "आप मेरे शत्रुओं की ____ कर रहे हैं।",
        parts: ["मं", "गल", "का", "म", "ना"],
        correctOrder: ["मं", "गल", "का", "म", "ना"],
        fullWord: "मंगल कामना"
    },
    {
        id: 4,
        image: "../assets/images/come1.png",
        sentence: "मैंने यह ____ दे कर, आपका भला ही चाहा है।",
        parts: ["आ", "शी", "र्वा", "द"],
        correctOrder: ["आ", "शी", "र्वा", "द"],
        fullWord: "आशीर्वाद"
    },
    {
        id: 5,
        image: "../assets/images/gift.png",
        sentence: "राजा ने संतुष्ट होकर राजकवि को ____ दिया।",
        parts: ["उ", "प", "हार"],
        correctOrder: ["उ", "प", "हार"],
        fullWord: "उपहार"
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
                    selectedParts: [],
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
                popupEmoji.textContent = "😢";
                playWrongSound();
            }

            popup.classList.add("active");
            popupTimeout = setTimeout(() => {
                popup.classList.remove("active");
            }, 800);
        }

        function bigConfetti() {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 200, spread: 110, origin: { y: 0.5 }, startVelocity: 28 });
                setTimeout(() => {
                    confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.2 } });
                    confetti({ particleCount: 120, spread: 130, origin: { y: 0.4, x: 0.8 } });
                }, 150);
                setTimeout(() => {
                    confetti({ particleCount: 80, spread: 90, origin: { y: 0.7 } });
                }, 300);
            }
        }

        // function speak(text) {
        //     speechSynthesis.cancel();
        //     const msg = new SpeechSynthesisUtterance(text);
        //     msg.lang = "hi-IN";
        //     msg.volume = 0.25;
        //     speechSynthesis.speak(msg);
        // }

        function showFinalCelebration() {
            if (quizCompleted) return;
            quizCompleted = true;
            bigConfetti();
            // speak("बहुत बहुत बधाई! आपने सभी शब्द सही बनाए!");
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
            
            let blankContent = "";
            if (state.isCorrect) {
                blankContent = q.fullWord;
            } else if (state.selectedParts.length > 0) {
                blankContent = state.selectedParts.join('');
            } else {
                blankContent = "_____";
            }
            
            poemLine.innerHTML = `Q${q.id}. ${q.sentence.replace("____", `<span class="blank-input ${state.selectedParts.length === q.correctOrder.length ? 'filled' : ''}">${blankContent}</span>`)}`;
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
                
                // Update blank display
                updateBlankDisplay();
                
                // Disable the clicked button
                btnElement.style.pointerEvents = 'none';
                btnElement.classList.add('disabled-part');
                
                // Play sound for correct selection
                playCorrectSound();
                
                // Check if word is complete
                if (state.selectedParts.length === q.correctOrder.length) {
                    state.isCorrect = true;
                    updateBlankDisplay();
                    
                    // Disable all remaining buttons
                    allButtons.forEach(btn => {
                        btn.style.pointerEvents = 'none';
                        btn.classList.add('disabled-part');
                    });
                    
                    if (!popupShownForCurrentQuestion) {
                        popupShownForCurrentQuestion = true;
                        showPopup(true);
                        // speak("शब्द पूरा हुआ! बहुत अच्छा!");
                    }
                    
                    nextBtn.disabled = false;
                    checkQuizComplete();
                }
            } else {
                // Wrong selection
                showPopup(false);
                // speak("गलत अक्षर");
                btnElement.classList.add('selected-wrong');
                setTimeout(() => {
                    btnElement.classList.remove('selected-wrong');
                }, 500);
            }
        }

        function loadQuestion() {
            const q = QUESTIONS[currentIndex];
            const state = userStates[currentIndex];
            
            // Reset popup flag for this question
            popupShownForCurrentQuestion = false;
            
            // Update image with error handling
            meaningImage.src = q.image;
            meaningImage.alt = q.fullWord + " का चित्र";
            meaningImage.onerror = function() {
                this.src = "https://cdn-icons-png.flaticon.com/512/1380/1380338.png";
            };
            
            // Update poem line with blank
            let blankContent = "";
            if (state.isCorrect) {
                blankContent = q.fullWord;
            } else if (state.selectedParts.length > 0) {
                blankContent = state.selectedParts.join('');
            } else {
                blankContent = "_____";
            }
            
            poemLine.innerHTML = `Q${q.id}. ${q.sentence.replace("____", `<span class="blank-input ${state.selectedParts.length === q.correctOrder.length ? 'filled' : ''}">${blankContent}</span>`)}`;
            
            // Create parts buttons (shuffled)
            partsList.innerHTML = "";
            const shuffledParts = [...q.parts].sort(() => Math.random() - 0.5);
            
            shuffledParts.forEach(part => {
                const btn = document.createElement("div");
                btn.className = "part-btn";
                btn.textContent = part;
                
                const isUsed = state.selectedParts.includes(part);
                
                if (!state.isCorrect && !isUsed) {
                    btn.addEventListener("click", (e) => {
                        if (state.isCorrect) return;
                        const allBtns = document.querySelectorAll('.part-btn');
                        selectPart(part, btn, allBtns);
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

        // Start the quiz
        loadQuestion();
