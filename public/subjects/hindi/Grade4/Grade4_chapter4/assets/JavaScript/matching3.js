

const questions = [

{
    number:"5",
    word:"पाँच"
},

{
    number:"30",
    word:"तीस"
},

{
    number:"18",
    word:"अठारह"
},

{
    number:"13",
    word:"तेरह"
},

{
    number:"25",
    word:"पच्चीस"
},

{
    number:"21",
    word:"इक्कीस"
}

];

const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const centerWords = document.getElementById("centerWords");
const svg = document.getElementById("svgLines");

let completedMatches = [];
let selectedCircle = null;
let selectedIndex = null;

/* SOUNDS */

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
/* POPUP */

function showPopup(isCorrect){

    const popup =
    document.getElementById("emojiPopup");

    const popupEmoji =
    document.getElementById("popupEmoji");

    popup.classList.remove(
        "emoji-popup-correct",
        "emoji-popup-wrong"
    );

    if(isCorrect){

        popupEmoji.innerHTML = "😊";
          if (typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ffb347', '#2ecc71', '#f1c40f'] });
            }
        popup.classList.add(
            "emoji-popup-correct"
        );

    }else{

        popupEmoji.innerHTML = "😢";

        popup.classList.add(
            "emoji-popup-wrong"
        );
    }

    popup.classList.add("active");

    setTimeout(()=>{

        popup.classList.remove("active");

    },1000);
}

/* LOAD GAME */

function loadGame(){

    leftSide.innerHTML = "";
    rightSide.innerHTML = "";
    centerWords.innerHTML = "";

    const leftItems = questions.slice(0,3);
    const rightItems = questions.slice(3);

    // LEFT

    leftItems.forEach((item,index)=>{

        leftSide.innerHTML += `

        <div class="item">

            <div class="circle"
            data-index="${index}">

                ${item.number}

            </div>

        </div>

        `;
    });

    // RIGHT

    rightItems.forEach((item,index)=>{

        rightSide.innerHTML += `

        <div class="item right-item">

            <div class="circle"
            data-index="${index+3}">

                ${item.number}

            </div>

        </div>

        `;
    });

    // WORDS

    const shuffled =
    [...questions].sort(()=>Math.random()-0.5);

    shuffled.forEach(item=>{

        centerWords.innerHTML += `

        <div class="word"
        data-word="${item.word}">

            ${item.word}

        </div>

        `;
    });

    addEvents();
}

/* EVENTS */

function addEvents(){

    const circles =
    document.querySelectorAll(".circle");

    const words =
    document.querySelectorAll(".word");

    // NUMBER CLICK

    circles.forEach(circle=>{

        circle.onclick = ()=>{

            const matched =
            completedMatches.find(
                m=>m.index ==
                circle.dataset.index
            );

            if(matched) return;

            circles.forEach(c=>{

                if(!c.style.border.includes("22c55e")){

                    c.style.border =
                    "4px solid transparent";
                }

                c.style.transform =
                "scale(1)";
            });

            circle.style.border =
            "4px solid #ff1493";

            circle.style.transform =
            "scale(1.08)";

            selectedCircle = circle;
            selectedIndex = circle.dataset.index;
        };
    });

    // WORD CLICK

    words.forEach(word=>{

        word.onclick = ()=>{

            if(selectedCircle == null)
            return;

            if(word.classList.contains("correct"))
            return;

            const correctWord =
            questions[selectedIndex].word;

            // CORRECT

            if(correctWord === word.dataset.word){

                word.classList.add("correct");

                selectedCircle.style.border =
                "4px solid #22c55e";

                drawLine(
                    selectedCircle,
                    word
                );

                playCorrectSound();

                showPopup(true);

                completedMatches.push({

                    index:selectedIndex,
                    word:word.dataset.word
                });

                selectedCircle = null;
                selectedIndex = null;

                // COMPLETE

                if(
                    completedMatches.length
                    ===
                    questions.length
                ){

                    setTimeout(()=>{

                        document
                        .getElementById(
                            "finalPopup"
                        )
                        .classList.add(
                            "active"
                        );
                        bigConfetti();

                    },800);
                }

            }else{

                playWrongSound();

                showPopup(false);
            }
        };
    });
}

/* DRAW LINE */
function drawLine(imageBox,word){

    const imageRect =
    imageBox.getBoundingClientRect();

    const wordRect =
    word.getBoundingClientRect();

    const svgRect =
    svg.getBoundingClientRect();

   const isRightSide =
imageRect.left > wordRect.left;

// IMAGE CORNER

const x1 = isRightSide
? imageRect.left - svgRect.left
: imageRect.right - svgRect.left;

const y1 =
imageRect.top +
imageRect.height/2 -
svgRect.top;

// WORD CORNER

const x2 = isRightSide
? wordRect.right - svgRect.left
: wordRect.left - svgRect.left;

const y2 =
wordRect.top +
wordRect.height/2 -
svgRect.top;

    // SNAKE CURVE

    const wave1 = y1 - 60;
    const wave2 = y2 + 60;

    const pathData = `
        M ${x1} ${y1}
        C ${x1 + 80} ${wave1},
          ${x2 - 80} ${wave2},
          ${x2} ${y2}
    `;

    // GLOW LINE

    const glow =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    glow.setAttribute("d", pathData);

    glow.setAttribute(
        "stroke",
        "rgba(76,175,80,0.25)"
    );

    glow.setAttribute(
        "stroke-width",
        "18"
    );

    glow.setAttribute(
        "fill",
        "none"
    );

    glow.setAttribute(
        "stroke-linecap",
        "round"
    );

    svg.appendChild(glow);

    // MAIN SNAKE BODY

    const path =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    path.setAttribute("d", pathData);

    path.setAttribute(
        "stroke",
        "#4caf50"
    );

    path.setAttribute(
        "stroke-width",
        "8"
    );

    path.setAttribute(
        "fill",
        "none"
    );

    path.setAttribute(
        "stroke-linecap",
        "round"
    );

    // SNAKE BODY STYLE

    path.setAttribute(
        "stroke-dasharray",
        "14 12"
    );

    svg.appendChild(path);

    // MOVING SNAKE EFFECT

    let offset = 0;

    function animateSnake(){

        offset += 1;

        path.style.strokeDashoffset =
        offset;

        requestAnimationFrame(
            animateSnake
        );
    }

    animateSnake();

    // SNAKE HEAD

    const head =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    head.setAttribute("cx",x2);

    head.setAttribute("cy",y2);

    head.setAttribute("r","12");

    head.setAttribute(
        "fill",
        "#2e7d32"
    );

    svg.appendChild(head);

    // EYES

    const eye1 =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    eye1.setAttribute("cx",x2 - 4);

    eye1.setAttribute("cy",y2 - 3);

    eye1.setAttribute("r","2");

    eye1.setAttribute(
        "fill",
        "white"
    );

    svg.appendChild(eye1);

    const eye2 =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    eye2.setAttribute("cx",x2 + 4);

    eye2.setAttribute("cy",y2 - 3);

    eye2.setAttribute("r","2");

    eye2.setAttribute(
        "fill",
        "white"
    );

    svg.appendChild(eye2);

    // TONGUE

    const tongue =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    tongue.setAttribute(
        "d",
        `
        M ${x2} ${y2 + 8}
        L ${x2 - 5} ${y2 + 16}
        M ${x2} ${y2 + 8}
        L ${x2 + 5} ${y2 + 16}
        `
    );

    tongue.setAttribute(
        "stroke",
        "red"
    );

    tongue.setAttribute(
        "stroke-width",
        "2"
    );

    tongue.setAttribute(
        "stroke-linecap",
        "round"
    );

    svg.appendChild(tongue);
}
/* START */

loadGame();

