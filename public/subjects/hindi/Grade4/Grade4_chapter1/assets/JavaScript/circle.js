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

    // Quiz Data with text options
  const quizData = [
    {
        q: "जो एक जैसे हैं, उन पर गोला लगाइए।",
        textQuestion: "ऊ",
        options: ["अ", "आ", "उ", "ऊ"],
        a: [3]
    },

    {
        q: "जो एक जैसे हैं, उन पर गोला लगाइए।",
        textQuestion: "ऐ",
        options: ["ए", "ओ", "ऐ", "औ"],
        a: [2]
    },

    {
        q: "जो एक जैसे हैं, उन पर गोला लगाइए।",
        textQuestion: "अः",
        options: ["अ", "अः", "ऊ", "औ"],
        a: [1]
    }
];

    let current = 0;
    let score = 0;
    let answered = Array(quizData.length).fill(null);
    let popupTimeout = null;
    let finalPopupTimeout = null;
    let quizCompleted = false;

    // DOM Elements
    const qEl = document.getElementById("question");
    // const imgEl = document.getElementById("questionImg");
    
const textQuestionEl = document.getElementById("textQuestion");
    const optEl = document.getElementById("options");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const emojiPopup = document.getElementById("emojiPopup");
    const popupEmoji = document.getElementById("popupEmoji");
    const finalPopupEl = document.getElementById("finalPopup");
    const playAgainBtn = document.getElementById("playAgainBtn");

    function showEmojiPopup(isCorrect) {
        if (popupTimeout) clearTimeout(popupTimeout);
        
        if (isCorrect) {
            popupEmoji.textContent = "😊✨";
            emojiPopup.className = "emoji-popup emoji-popup-correct active";
            playCorrectSound();
            
            if (typeof confetti === 'function') {
                confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            }
        } else {
            popupEmoji.textContent = "😢💔";
            emojiPopup.className = "emoji-popup emoji-popup-wrong active";
            playWrongSound();
        }
        
        popupTimeout = setTimeout(() => {
            emojiPopup.classList.remove("active");
        }, 1000);
    }

    function bigConfetti() {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.7 } });
    }

    function speak(text) {
        speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "hi-IN";
        msg.volume = 0.25;
        speechSynthesis.speak(msg);
    }

    function showFinalCelebration() {
        if (quizCompleted) return;
        quizCompleted = true;
        
        bigConfetti();
        // speak("बहुत बहुत बधाई! आपने सभी प्रश्न सही किए!");
        
        finalPopupTimeout = setTimeout(() => {
            finalPopupEl.classList.add("active");
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }, 500);
    }

    function loadQuestion() {
        const q = quizData[current];
        qEl.textContent = q.q;
        // imgEl.src = q.img;
        textQuestionEl.innerHTML = `
    <span>${q.textQuestion}</span>
`;
        optEl.innerHTML = "";
        
        nextBtn.disabled = answered[current] === null;

        q.options.forEach((optText, i) => {
            const btn = document.createElement("button");
            btn.className = `option o${(i % 4) + 1}`;
            btn.textContent = optText;

            if (answered[current] !== null) {
                // if (i === q.a) {
                if (q.a.includes(i)){
                    btn.classList.add("correct");
                } else {
                    btn.classList.add("disabled");
                }
            }

         btn.onclick = () => {

    if(answered[current] !== null) return;

    if(q.a.includes(i)){

        answered[current] = i;

        score++;

        btn.classList.add("correct");

        const allOptions = [...optEl.children];

        allOptions.forEach(opt => {

            if(opt !== btn){

                opt.classList.add("disabled");

            }

        });

        showEmojiPopup(true);

        // speak("सही");

        nextBtn.disabled = false;

        if(answered.every(ans => ans !== null)){

            showFinalCelebration();

        }

    }else{

        showEmojiPopup(false);

        // speak("गलत");

        btn.classList.add("wrong");

        setTimeout(()=>{

            btn.classList.remove("wrong");

        },700);

    }

};

            optEl.appendChild(btn);
        });

        prevBtn.disabled = current === 0;
    }

    function goPrev() {
        if (current > 0 && !quizCompleted) {
            current--;
            loadQuestion();
        }
    }

    function goNext() {
        if (current < quizData.length - 1 && answered[current] !== null && !quizCompleted) {
            current++;
            loadQuestion();
        }
    }

    function restartQuiz() {
        current = 0;
        score = 0;
        answered = Array(quizData.length).fill(null);
        quizCompleted = false;
        if (finalPopupTimeout) clearTimeout(finalPopupTimeout);
        finalPopupEl.classList.remove("active");
        loadQuestion();
    }

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

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);
    playAgainBtn.addEventListener('click', () => {
        restartQuiz();
    });

    // Initialize
    loadQuestion();

//   speak("जो एक जैसे हैं, उन पर गोला लगाइए।");