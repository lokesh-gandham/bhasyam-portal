
    // ----------------------------- AUDIO (exactly like previous code - web audio beeps) -----------------------------
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

    // ----------------------------- IMAGES FOR EACH OPTION (using free, cute, kid-friendly image URLs) -----------------------------
    // We'll use reliable emoji-style PNGs from CDN that visually represent the Hindi word.
    // This makes each option colorful and understandable.
   // const wordImageMap = {
    //     "राजा": "../assets/images/king.png",
    //     "आप": "../assets/images/rajkavi.png",
    //     "करते": "../assets/images/doing.png",
    //     "लिया": "../assets/images/take.png",
    //     "सभा": "../assets/images/raja.png",
    //     "हो": "../assets/images/king.png",
    //     "हम": "../assets/images/me.png",
    //     "प्रणाम": "../assets/images/pradam.png",
    //     "राजकवि": "../assets/images/kavi.png",
    //     "आना":"../assets/images/come.png",
    //     "गए": "../assets/images/gone.png",
    //     "शत्रु": "../assets/images/satru.png",
    //     "वाह!": "../assets/images/king.png",
    //     "पूछो": "../assets/images/toking.png"
    // };
    // const DEFAULT_IMG = "https://cdn-icons-png.flaticon.com/512/1380/1380338.png";

    // function getImageForWord(optionText) {
    //     return wordImageMap[optionText] || DEFAULT_IMG;
    // }

const QUESTIONS = [
    {
        id: 1,
        question: "दिए गए शब्दों में से संज्ञा शब्द पर क्लिक कीजिए।",
        options: ["राजा", "आए", "में", "करते", "दरबार"],
        correct: ["राजा", "दरबार"]
    },
    {
        id: 2,
        question: "दिए गए शब्दों में से संज्ञा शब्द पर क्लिक कीजिए।",
        options: ["उन्हें", "राजकवि", "लिया", "करें", "प्रणाम"],
        correct: ["राजकवि"]
    },
    {
        id: 3,
        question: "दिए गए शब्दों में से संज्ञा शब्द पर क्लिक कीजिए।",
        options: ["सभा", "यह", "सुनकर", "मैंने", "शत्रु"],
        correct: ["सभा", "शत्रु"]
    },
    {
        id: 4,
        question: "दिए गए शब्दों में से संज्ञा शब्द पर क्लिक कीजिए।",
        options: ["हम", "सावधानी", "लापरवाही", "हो", "नहीं"],
        correct: ["सावधानी"]
    }
];
    // Global variables (same as previous code)
    let currentIndex = 0;
    let quizCompleted = false;
    let userStates = [];

function initStates() {
    userStates = [];

    for (let i = 0; i < QUESTIONS.length; i++) {
        userStates.push({
            selectedAnswers: [],
            isCorrect: false
        });
    }
}
    initStates();

    // DOM elements
    const questionBox = document.getElementById("questionBox");
    const optionsList = document.getElementById("optionsList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const popup = document.getElementById("simpleEmojiPopup");
    const popupEmoji = document.getElementById("popupEmoji");
    const finalPopup = document.getElementById("finalPopup");
    const playAgainBtn = document.getElementById("playAgainBtn");

    let popupTimeout = null;

    // Show emoji popup exactly like previous code
    function showPopup(isCorrect) {
        if (popupTimeout) clearTimeout(popupTimeout);
        if (isCorrect) {
            popupEmoji.textContent = "😊";
            playCorrectSound();
            if (typeof confetti === 'function') {
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
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

    // Speech function for vocal feedback
    // function speak(text) {
    //     speechSynthesis.cancel();
    //     const msg = new SpeechSynthesisUtterance(text);
    //     msg.lang = "hi-IN";
    //     msg.volume = 0.3;
    //     speechSynthesis.speak(msg);
    // }

    // Final celebration with big confetti
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

    // Answer selection logic (exactly as previous, but with images support)
function selectAnswer(selectedValue, btnElement, allButtons) {

    const q = QUESTIONS[currentIndex];
    const state = userStates[currentIndex];

    if (state.isCorrect) return;

    const isCorrect = q.correct.includes(selectedValue);

    // Prevent duplicate click
    if (state.selectedAnswers.includes(selectedValue)) return;

    if (isCorrect) {

        state.selectedAnswers.push(selectedValue);

        btnElement.classList.add("correct-selected");

        showPopup(true);
        // speak("सही उत्तर! बहुत बढ़िया!");

        // ✅ Check if all correct answers selected
        if (state.selectedAnswers.length === q.correct.length) {

            state.isCorrect = true;

            allButtons.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.classList.add('disabled-option');
            });

            updateNavButtons();
            checkAndUpdateComplete();
        }

    } else {

        showPopup(false);
        // speak("गलत उत्तर, पुनः प्रयास करें!");

        btnElement.classList.add("wrong-selected");

        setTimeout(() => {
            btnElement.classList.remove("wrong-selected");
        }, 500);
    }
}
    // Load question with images for each option (each option gets an <img> tag)
    function loadQuestion() {
        const q = QUESTIONS[currentIndex];
        const state = userStates[currentIndex];
        questionBox.textContent = q.question;
        optionsList.innerHTML = '';
        
        // Shuffle options for variety
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach((opt) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            
            // Create img element for the option
            // const img = document.createElement('img');
            // img.className = 'option-image';
            // const imageUrl = getImageForWord(opt);
            // img.src = imageUrl;
            // img.alt = opt;
            // img.loading = "lazy";
            // // Fallback if image fails
            // img.onerror = function() {
            //     if (this.src !== DEFAULT_IMG) {
            //         this.src = DEFAULT_IMG;
            //     }
            // };
            
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = opt;
            
            // btn.appendChild(img);
            btn.appendChild(textSpan);
            
            if (!state.isCorrect) {
                btn.addEventListener('click', () => {
                    if (state.isCorrect) return;
                    const allBtns = document.querySelectorAll('.option-btn');
                    selectAnswer(opt, btn, allBtns);
                });
            } else {
                btn.style.pointerEvents = 'none';
               if (q.correct.includes(opt)) {
                    btn.classList.add('correct-selected');
                }
            }
            optionsList.appendChild(btn);
        });
        updateNavButtons();
    }

    // Event listeners (same as previous)
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

    playAgainBtn.addEventListener("click", () => {
        currentIndex = 0;
        quizCompleted = false;
        initStates();
        finalPopup.classList.remove("active");
        loadQuestion();
    });

    // Initialize audio on first click anywhere (same as previous)
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
    
    // Start the quiz
    loadQuestion();
