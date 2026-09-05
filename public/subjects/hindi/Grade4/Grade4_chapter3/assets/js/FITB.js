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
                image: "../assets/images/sun.png",
                imageQuestion: "चित्र में कितनी संख्या दिख रही है?",
                sentence: "दिन ____ पर चढ़ता है, ऐसे सूरज बढ़ता है।",
                options: ["सीढ़ी", "पेड़", "किताब"],
                correct: "सीढ़ी"
            },
            {
                id: 2,
                image: "../assets/images/red1.png",
                imageQuestion: "चित्र में कौन सा रंग दिख रहा है?",
                sentence: "____ रंग बिखराता है, ऐसे सूरज आता है।",
                options: [ "हरा", "नीला","लाल"],
                correct: "लाल"
            },
            {
                id: 3,
                image: "../assets/images/suraj.png",
                imageQuestion: "चित्र में क्या दिख रहा है?",
                sentence: "सूरज आगे चलता है, ऐसे ____ ढलता है।",
                options: ["सूरज", "ऊपर", "नीचे"],
                correct: "सूरज"
            },
            {
                id: 4,
                image: "../assets/images/light.png",
                imageQuestion: "चित्र में क्या चमक रहा है?",
                sentence: "____ दमकता है, ऐसे तेज चमकता है।",
                options: ["तारा","धरती-गगन","चाँद"],
                correct: "धरती-गगन"
            },
             {
                id: 5,
                image: "../assets/images/light1.png",
                imageQuestion: "चित्र में क्या चमक रहा है?",
                sentence: "गरमी कम हो जाती है,____ थकी-सी आती है।",
                options: ["तारा","धूप","चाँद"],
                correct: "धूप"
            }
        ];

        // VARIABLES
        let currentIndex = 0;
        let quizCompleted = false;
        let userStates = [];

        function initStates() {
            userStates = [];
            for (let q = 0; q < QUESTIONS.length; q++) {
                userStates.push({ isCorrect: false });
            }
        }
        initStates();

        const meaningImage = document.getElementById("meaningImage");
        const questionAboveImage = document.getElementById("questionAboveImage");
        const poemBox = document.getElementById("poemBox");
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

        function checkQuizComplete() {
            if (userStates.every(q => q.isCorrect)) {
                setTimeout(() => {
                    showFinalCelebration();
                }, 700);
            }
        }

        function loadQuestion() {
            const q = QUESTIONS[currentIndex];
            const state = userStates[currentIndex];

            // Update image and question above image
            meaningImage.src = q.image;
            questionAboveImage.textContent = q.imageQuestion;

            // Create HTML for poem box with options inside
            poemBox.innerHTML = `
                <div class="poem-line">
                    Q${q.id}. ${q.sentence.replace("____", `<span class="blank-input">${state.isCorrect ? q.correct : "_____"}</span>`)}
                </div>
                <div class="options-container">
                    <div class="options-title">✨ सही शब्द चुनिए ✨</div>
                    <div class="options-list" id="optionsList"></div>
                </div>
            `;

            // Create options
            const optionsList = document.getElementById("optionsList");
            optionsList.innerHTML = "";

            q.options.forEach(opt => {
                const btn = document.createElement("div");
                btn.className = "option-btn";
                btn.textContent = opt;

                if (!state.isCorrect) {
                    btn.addEventListener("click", () => {
                        if (state.isCorrect) return;

                        if (opt === q.correct) {
                            state.isCorrect = true;

                            // Update poem with correct answer
                            poemBox.innerHTML = `
                                <div class="poem-line">
                                    Q${q.id}. ${q.sentence.replace("____", `<span class="blank-input">${q.correct}</span>`)}
                                </div>
                                <div class="options-container">
                                    <div class="options-title">✨ सही शब्द चुनिए ✨</div>
                                    <div class="options-list" id="optionsList"></div>
                                </div>
                            `;

                            // Disable all option buttons
                            const newOptionsList = document.getElementById("optionsList");
                            newOptionsList.innerHTML = "";
                            q.options.forEach(opt2 => {
                                const newBtn = document.createElement("div");
                                newBtn.className = "option-btn disabled-option";
                                newBtn.textContent = opt2;
                                newOptionsList.appendChild(newBtn);
                            });

                            showPopup(true);
                            // speak("सही उत्तर");
                            nextBtn.disabled = false;
                            checkQuizComplete();
                        } else {
                            showPopup(false);
                            // speak("गलत उत्तर");
                            btn.classList.add("selected-wrong");
                            setTimeout(() => {
                                btn.classList.remove("selected-wrong");
                            }, 500);
                        }
                    });
                }

                optionsList.appendChild(btn);
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