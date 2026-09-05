
/* ELEMENTS */

const leftBoxes =
document.querySelectorAll(".left-side .text-box");

const leftDots =
document.querySelectorAll(".left-side .dot");

const answers =
document.querySelectorAll(".answer");

const svg =
document.getElementById("svgLines");

/* VARIABLES */

let selectedDot = null;

let completed = 0;

let audioCtx = null;

/* AUDIO INIT */

document.body.addEventListener(
    "click",
    ()=>{

        if(audioCtx) return;

        audioCtx =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    },
    {once:true}
);

/* CORRECT SOUND */

function playCorrectSound(){

    try{

        const oscillator =
        audioCtx.createOscillator();

        const gainNode =
        audioCtx.createGain();

        oscillator.connect(gainNode);

        gainNode.connect(
            audioCtx.destination
        );

        oscillator.frequency.value = 880;

        gainNode.gain.value = 0.2;

        oscillator.type = "sine";

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

/* WRONG SOUND */

function playWrongSound(){

    try{

        const oscillator =
        audioCtx.createOscillator();

        const gainNode =
        audioCtx.createGain();

        oscillator.connect(gainNode);

        gainNode.connect(
            audioCtx.destination
        );

        oscillator.frequency.value = 300;

        gainNode.gain.value = 0.25;

        oscillator.type = "sawtooth";

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

function showPopup(correct = true){

    const popup =
    document.getElementById("emojiPopup");

    const emoji =
    popup.querySelector(".popup-emoji");

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

    popup.classList.add("active");

    setTimeout(()=>{

        popup.classList.remove("active");

    },1000);

}

/* BIG CONFETTI */

function bigConfetti(){

    confetti({
        particleCount:200,
        spread:120,
        origin:{y:0.6}
    });

    setTimeout(()=>{

        confetti({
            particleCount:120,
            spread:140,
            origin:{x:0.2,y:0.5}
        });

        confetti({
            particleCount:120,
            spread:140,
            origin:{x:0.8,y:0.5}
        });

    },200);

}

/* SELECT LEFT */

leftBoxes.forEach(box=>{

    box.onclick = ()=>{

        if(
            box.classList.contains(
                "matched"
            )
        ) return;

        leftBoxes.forEach(b=>{

            b.classList.remove("active");

        });

        leftDots.forEach(d=>{

            d.style.transform =
            "translateY(-50%) scale(1)";

        });

        box.classList.add("active");

        const dot =
        box.querySelector(".dot");

        dot.style.transform =
        "translateY(-50%) scale(1.4)";

        selectedDot = dot;

    };

});

/* ANSWER CLICK */

answers.forEach(answer=>{

    answer.onclick = ()=>{

        if(!selectedDot) return;

        if(
            answer.classList.contains(
                "correct"
            )
        ) return;

        const correct =
        selectedDot.dataset.match ===
        answer.innerText.trim();

        /* CORRECT */

        if(correct){

            answer.classList.add(
                "correct"
            );

            drawLine(
                selectedDot,
                answer
            );

            showPopup(true);

            completed++;

            selectedDot.parentElement
            .classList.remove("active");

            selectedDot.parentElement
            .classList.add("matched");

            selectedDot = null;

            if(
                completed === answers.length
            ){

                setTimeout(()=>{

                    bigConfetti();

                    document
                    .getElementById(
                        "finalPopup"
                    )
                    .classList.add(
                        "active"
                    );

                },1000);

            }

        }

        /* WRONG */

        else{

            answer.classList.add(
                "wrong"
            );

            showPopup(false);

            setTimeout(()=>{

                answer.classList.remove(
                    "wrong"
                );

            },400);

        }

    };

});

/* DRAW LINE */

function drawLine(dot,answer){

    const dotRect =
    dot.getBoundingClientRect();

    const answerRect =
    answer.querySelector(".right-dot")
    .getBoundingClientRect();

    const svgRect =
    svg.getBoundingClientRect();

    const x1 =
    dotRect.left +
    dotRect.width/2 -
    svgRect.left;

    const y1 =
    dotRect.top +
    dotRect.height/2 -
    svgRect.top;

    const x2 =
    answerRect.left +
    answerRect.width/2 -
    svgRect.left;

    const y2 =
    answerRect.top +
    answerRect.height/2 -
    svgRect.top;

    const line =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1",x1);
    line.setAttribute("y1",y1);

    line.setAttribute("x2",x2);
    line.setAttribute("y2",y2);

    line.setAttribute(
        "stroke",
        "#333"
    );

    line.setAttribute(
        "stroke-width",
        "3"
    );

    svg.appendChild(line);

}
