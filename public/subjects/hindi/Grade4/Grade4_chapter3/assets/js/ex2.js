
/* QUESTIONS */

const QUESTIONS = [

{
    options:[
        "ऐसे",
        "आता",
        "सूरज"
    ],
    correct:"सूरज"
},

{
    options:[
        "चिड़ियाँ",
        "पर",
        "बढ़ता"
    ],
    correct:"चिड़ियाँ"
},

{
    options:[
        "धरती",
        "आगे",
        "चलता"
    ],
    correct:"धरती"
},

{
    options:[
        "कलियाँ",
        "तब",
        "कहीं"
    ],
    correct:"कलियाँ"
}

];

/* VARIABLES */

let currentIndex = 0;

let finalPopupShown = false;

let userStates = [];

function initStates(){

    userStates = [];

    for(
        let q = 0;
        q < QUESTIONS.length;
        q++
    ){

        userStates.push({
            isCorrect:false
        });

    }

}

initStates();

/* ELEMENTS */

const optionsList =
document.getElementById(
    "optionsList"
);

const prevBtn =
document.getElementById(
    "prevBtn"
);

const nextBtn =
document.getElementById(
    "nextBtn"
);

const finalPopupEl =
document.getElementById(
    "finalPopup"
);

/* AUDIO */

let audioCtx = null;

function playCorrectSound(){

    try{

        if(!audioCtx){

            audioCtx =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        }

        const oscillator =
        audioCtx.createOscillator();

        const gainNode =
        audioCtx.createGain();

        oscillator.connect(gainNode);

        gainNode.connect(
            audioCtx.destination
        );

        oscillator.frequency.value =
        880;

        gainNode.gain.value =
        0.2;

        oscillator.type =
        "sine";

        oscillator.start();

        gainNode.gain
        .exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.5
        );

        oscillator.stop(
            audioCtx.currentTime + 0.5
        );

    }catch(e){}

}

function playWrongSound(){

    try{

        if(!audioCtx){

            audioCtx =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        }

        const oscillator =
        audioCtx.createOscillator();

        const gainNode =
        audioCtx.createGain();

        oscillator.connect(gainNode);

        gainNode.connect(
            audioCtx.destination
        );

        oscillator.frequency.value =
        440;

        gainNode.gain.value =
        0.25;

        oscillator.type =
        "sawtooth";

        oscillator.start();

        gainNode.gain
        .exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.4
        );

        oscillator.stop(
            audioCtx.currentTime + 0.4
        );

    }catch(e){}

}

/* POPUP */

function showPopup(correct=true){

    const popup =
    document.getElementById(
        "simpleEmojiPopup"
    );

    const emoji =
    document.getElementById(
        "popupEmoji"
    );

    if(correct){

        emoji.innerHTML =
        "😊";

        playCorrectSound();

        confetti({
            particleCount:80,
            spread:70,
            origin:{y:0.6}
        });

    }else{

        emoji.innerHTML =
        "😔";

        playWrongSound();

    }

    popup.classList.add(
        "active"
    );

    setTimeout(()=>{

        popup.classList.remove(
            "active"
        );

    },1000);

}

/* BIG CONFETTI */

function bigConfetti(){

    confetti({
        particleCount:200,
        spread:110,
        origin:{y:0.5}
    });

    setTimeout(()=>{

        confetti({
            particleCount:120,
            spread:130,
            origin:{
                y:0.4,
                x:0.2
            }
        });

        confetti({
            particleCount:120,
            spread:130,
            origin:{
                y:0.4,
                x:0.8
            }
        });

    },150);

}

/* FINAL */

function showFinalCelebration(){

    if(finalPopupShown)
    return;

    finalPopupShown = true;

    bigConfetti();

    setTimeout(()=>{

        finalPopupEl
        .classList.add(
            "active"
        );

    },500);

}

/* LOAD QUESTION */

function loadQuestion(){

    const q =
    QUESTIONS[currentIndex];

    const state =
    userStates[currentIndex];

    optionsList.innerHTML =
    "";

    nextBtn.disabled =
    !state.isCorrect;

    q.options.forEach(opt=>{

        const btn =
        document.createElement(
            "div"
        );

        btn.className =
        "option-btn";

        btn.innerHTML =
        opt;

        if(
            state.isCorrect &&
            opt === q.correct
        ){

            btn.classList.add(
                "correct-highlight"
            );

        }

        btn.onclick = ()=>{

            if(state.isCorrect)
            return;

            const isCorrect =
            opt === q.correct;

            if(isCorrect){

                state.isCorrect =
                true;

                btn.classList.add(
                    "correct-highlight"
                );

                document
                .querySelectorAll(
                    ".option-btn"
                )
                .forEach(b=>{

                    b.style.pointerEvents =
                    "none";

                });

                showPopup(true);

                nextBtn.disabled =
                false;

                if(
                    userStates.every(
                        s=>s.isCorrect
                    )
                ){

                    showFinalCelebration();

                }

            }else{

                btn.classList.add(
                    "wrong-flash"
                );

                showPopup(false);

                setTimeout(()=>{

                    btn.classList.remove(
                        "wrong-flash"
                    );

                },500);

            }

        };

        optionsList.appendChild(
            btn
        );

    });

    prevBtn.disabled =
    currentIndex === 0;

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
        currentIndex <
        QUESTIONS.length - 1
    ){

        currentIndex++;

        loadQuestion();

    }

};

/* START */

loadQuestion();
