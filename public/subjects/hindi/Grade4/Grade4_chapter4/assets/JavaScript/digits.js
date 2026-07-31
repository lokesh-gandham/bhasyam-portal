
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
/* QUESTIONS */

const QUESTIONS = [

{
    hindiWord:"तीन",
    options:["3","5","8"],
    correct:"3"
},

{
    hindiWord:"सात",
    options:["4","7","9"],
    correct:"7"
},

{
    hindiWord:"नौ",
    options:["6","2","9"],
    correct:"9"
},

{
    hindiWord:"बारह",
    options:["12","15","10"],
    correct:"12"
},

{
    hindiWord:"पन्द्रह",
    options:["11","15","18"],
    correct:"15"
},

{
    hindiWord:"उन्नीस",
    options:["17","21","19"],
    correct:"19"
},

{
    hindiWord:"बाईस",
    options:["20","22","25"],
    correct:"22"
},

{
    hindiWord:"चौबीस",
    options:["24","26","28"],
    correct:"24"
},

{
    hindiWord:"सत्ताईस",
    options:["23","27","30"],
    correct:"27"
},

{
    hindiWord:"उनतीस",
    options:["26","31","29"],
    correct:"29"
}

];

/* VARIABLES */

let currentIndex = 0;
let quizCompleted = false;

let userStates = [];

function initStates(){

    userStates = [];

    for(let i=0;i<QUESTIONS.length;i++){

        userStates.push({

            selectedAnswer:null,
            isCorrect:false

        });
    }
}

initStates();

const hindiWordEl =
document.getElementById("hindiWord");

const optionsList =
document.getElementById("optionsList");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const popup =
document.getElementById("emojiPopup");

const popupEmoji =
document.getElementById("popupEmoji");

const finalPopup =
document.getElementById("finalPopup");

const playAgainBtn =
document.getElementById("playAgainBtn");

/* POPUP */

function showPopup(isCorrect){

    if(isCorrect){

        popupEmoji.innerHTML = "😊";

        playCorrectSound();

        confetti({

            particleCount:60,
            spread:70,
            origin:{y:0.6}

        });

    }else{

        popupEmoji.innerHTML = "😢";

        playWrongSound();
    }

    popup.classList.add("active");

    setTimeout(()=>{

        popup.classList.remove("active");

    },800);
}

/* FINAL */

function showFinalCelebration(){

    if(quizCompleted) return;

    quizCompleted = true;

    confetti({
        particleCount:250,
        spread:120,
        origin:{y:0.5}
    });

    setTimeout(()=>{

        finalPopup.classList.add("active");

    },500);
}

/* BUTTONS */

function updateNavButtons(){

    prevBtn.disabled =
    currentIndex === 0;

    nextBtn.disabled =
    !userStates[currentIndex]
    .isCorrect;
}

/* SELECT */

function selectAnswer(
    value,
    btn,
    allBtns
){

    const q =
    QUESTIONS[currentIndex];

    const state =
    userStates[currentIndex];

    if(state.isCorrect) return;

    const isCorrect =
    value === q.correct;

    if(isCorrect){

        state.isCorrect = true;

        state.selectedAnswer =
        value;

        btn.classList.add(
            "correct-selected"
        );

        allBtns.forEach(b=>{

            b.classList.add(
                "disabled-option"
            );

            b.style.pointerEvents =
            "none";
        });

        showPopup(true);

        updateNavButtons();

        if(
            userStates.every(
                s=>s.isCorrect
            )
        ){

            showFinalCelebration();
        }

    }else{

        btn.classList.add(
            "wrong-selected"
        );

        showPopup(false);

        setTimeout(()=>{

            btn.classList.remove(
                "wrong-selected"
            );

        },500);
    }
}

/* LOAD */

function loadQuestion(){

    const q =
    QUESTIONS[currentIndex];

    const state =
    userStates[currentIndex];

    hindiWordEl.innerHTML =
    q.hindiWord;

    optionsList.innerHTML = "";

    q.options.forEach(opt=>{

        const btn =
        document.createElement("button");

        btn.className =
        "option-btn";

        btn.innerHTML = opt;

        if(state.isCorrect){

            btn.classList.add(
                "disabled-option"
            );

            btn.style.pointerEvents =
            "none";

            if(opt === q.correct){

                btn.classList.add(
                    "correct-selected"
                );
            }
        }

        btn.onclick = ()=>{

            const allBtns =
            document.querySelectorAll(
                ".option-btn"
            );

            selectAnswer(
                opt,
                btn,
                allBtns
            );
        };

        optionsList.appendChild(btn);

    });

    updateNavButtons();
}

/* NAVIGATION */

prevBtn.onclick = ()=>{

    if(currentIndex > 0){

        currentIndex--;

        loadQuestion();
    }
};

nextBtn.onclick = ()=>{

    if(
        userStates[currentIndex]
        .isCorrect
        &&
        currentIndex <
        QUESTIONS.length-1
    ){

        currentIndex++;

        loadQuestion();
    }
};

/* PLAY AGAIN */

playAgainBtn.onclick = ()=>{

    currentIndex = 0;

    quizCompleted = false;

    initStates();

    finalPopup.classList.remove(
        "active"
    );

    loadQuestion();
};

/* START */

loadQuestion();

