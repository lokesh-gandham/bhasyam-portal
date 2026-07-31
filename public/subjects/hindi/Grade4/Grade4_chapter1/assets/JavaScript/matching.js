
const stages = [

{
    stage:1,

    questions:[

        {
            image:"../assets/images/cow.png",
            word:"थन"
        },

        {
            image:"../assets/images/tap.png",
            word:"नल"
        },

        {
            image:"../assets/images/jug.png",
            word:"जग"
        },

        {
            image:"../assets/images/cup.png",
            word:"कप"
        },

        {
            image:"../assets/images/bas.png",
            word:"बस"
        },

        {
            image:"../assets/images/mango.png",
            word:"फल"
        },

        {
            image:"../assets/images/bucket.png",
            word:"टब"
        },

        {
            image:"../assets/images/elephant.png",
            word:"गज"
        }

    ]
},

{
    stage:2,

    questions:[

        {
            image:"../assets/images/eye.png",
            word:"नयन"
        },

        {
            image:"../assets/images/duck.png",
            word:"बतख"
        },

        {
            image:"../assets/images/kalash.png",
            word:"कलश"
        },

        {
            image:"../assets/images/foot.png",
            word:"चरण"
        },

        {
            image:"../assets/images/honey.png",
            word:"शहद"
        },

        {
            image:"../assets/images/building.png",
            word:"भवन"
        }

    ]
},

{
    stage:3,

    questions:[

        {
            image:"../assets/images/ghar.png",
            word:"घर"
        },

        {
            image:"../assets/images/bird.png",
            word:"चिड़िया"
        },

        {
            image:"../assets/images/rose.png",
            word:"गुलाब"
        },

        {
            image:"../assets/images/deer.png",
            word:"मृग"
        },

        {
            image:"../assets/images/carrot.png",
            word:"गाजर"
        },

        {
            image:"../assets/images/chita.png",
            word:"चीता"
        },

        {
            image:"../assets/images/peacock.png",
            word:"मोर"
        },

        {
            image:"../assets/images/seb.png",
            word:"सेब"
        }

    ]
}

];

let currentStage = 0;

let stageProgress = stages.map(() => ({
    completedMatches:[]
}));

const leftSide =
document.getElementById("leftSide");

const rightSide =
document.getElementById("rightSide");

const centerWords =
document.getElementById("centerWords");

const stageTitle =
document.getElementById("stageTitle");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const svg =
document.getElementById("svgLines");

/* SOUND */

// function playCorrectSound(){

//     const audio = new Audio(
//     "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
//     );

//     audio.play();
// }

// function playWrongSound(){

//     const audio = new Audio(
//     "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"
//     );

//     audio.play();
// }

function showConfetti() {
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
    });
}
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

        popupEmoji.innerHTML = "😊✨";

        popup.classList.add(
            "emoji-popup-correct"
        );

    }else{

        popupEmoji.innerHTML = "😢💔";

        popup.classList.add(
            "emoji-popup-wrong"
        );
    }

    popup.classList.add("active");

    setTimeout(()=>{

        popup.classList.remove("active");

    },1000);
}

/* LOAD */

function loadStage(){

    leftSide.innerHTML = "";
    rightSide.innerHTML = "";
    centerWords.innerHTML = "";
    svg.innerHTML = "";

    const data =
    stages[currentStage].questions;

    stageTitle.innerHTML =
    "Stage " +
    stages[currentStage].stage;

    const half =
    Math.ceil(data.length/2);

    const leftItems =
    data.slice(0,half);

    const rightItems =
    data.slice(half);

    // LEFT

    leftItems.forEach((item,index)=>{

        leftSide.innerHTML += `

        <div class="item">

            <div class="number">
                ${index+1})
            </div>

            <div class="image-box"
                 data-index="${index}">

                <img src="${item.image}">

            </div>

        </div>

        `;
    });

    // RIGHT

    rightItems.forEach((item,index)=>{

rightSide.innerHTML += `

<div class="item right-item">

<div class="number right-number">
${index+half+1})
</div>

<div class="image-box"
data-index="${index+half}">

<img src="${item.image}">

</div>

</div>

`;

});

    // WORDS

    const shuffled =
    [...data].sort(()=>Math.random()-0.5);

    shuffled.forEach(item=>{

        centerWords.innerHTML += `

        <div class="word"
             data-word="${item.word}">

             ${item.word}

        </div>

        `;
    });

    addEvents(data);

    restoreStageProgress();

    prevBtn.disabled =
    currentStage === 0;

    if(
        stageProgress[currentStage]
        .completedMatches.length
        ===
        data.length
    ){

        nextBtn.disabled = false;

    }else{

        nextBtn.disabled = true;
    }
}

/* RESTORE */

function restoreStageProgress(){

    const saved =
    stageProgress[currentStage]
    .completedMatches;

    const words =
    document.querySelectorAll(".word");

    const images =
    document.querySelectorAll(".image-box");

    saved.forEach(match=>{

        const image =
        images[match.index];

        const word =
        [...words].find(w=>
            w.dataset.word === match.word
        );

        if(word){

            word.classList.add("correct");

            image.style.border =
            "4px solid #2ecc71";

            drawLine(image,word);
        }
    });
}

/* EVENTS */

function addEvents(data){

    let selectedImage = null;

    let selectedIndex = null;

    const imageBoxes =
    document.querySelectorAll(".image-box");

    const words =
    document.querySelectorAll(".word");

    // IMAGE CLICK

    imageBoxes.forEach((imgBox)=>{

        imgBox.onclick = ()=>{

            const alreadyMatched =
            stageProgress[currentStage]
            .completedMatches
            .find(m=>
                m.index ==
                imgBox.dataset.index
            );

            if(alreadyMatched) return;

            document
            .querySelectorAll(".image-box")
            .forEach(box=>{

                if(
                    !box.style.border.includes(
                        "2ecc71"
                    )
                ){

                    box.style.border =
                    "4px solid transparent";
                }

                box.style.transform =
                "scale(1)";
            });

            imgBox.style.border =
            "4px solid #ff1493";

            imgBox.style.transform =
            "scale(1.08)";

            selectedImage = imgBox;

            selectedIndex =
            imgBox.dataset.index;
        };
    });

    // WORD CLICK

    words.forEach(word=>{

        word.onclick = ()=>{

            if(selectedImage === null)
            return;

            if(word.classList.contains("correct"))
            return;

            const correctWord =
            data[selectedIndex].word;

            // CORRECT

            if(
                correctWord ===
                word.dataset.word
            ){

                word.classList.add("correct");

                selectedImage.style.border =
                "4px solid #2ecc71";

                drawLine(
                    selectedImage,
                    word
                );

                playCorrectSound();

                showPopup(true);
showConfetti(); // <-- ADD THIS

                stageProgress[currentStage]
                .completedMatches.push({

                    index:selectedIndex,

                    word:word.dataset.word
                });

                selectedImage = null;

                selectedIndex = null;

                if(
                    stageProgress[currentStage]
                    .completedMatches.length
                    ===
                    data.length
                ){

                    nextBtn.disabled = false;

                    // FINAL POPUP

                    if(
                        currentStage ===
                        stages.length-1
                    ){

                        setTimeout(()=>{

                            document
                            .getElementById(
                                "finalPopup"
                            )
                            .classList.add(
                                "active"
                            );

                        },800);
                    }
                }

            }else{

                playWrongSound();

                showPopup(false);
            }
        };
    });
}

/* DRAW LINE */
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

   let pathData;

if (isRightSide) {

    pathData = `
        M ${x1} ${y1}
        C ${x1 - 80} ${wave1},
          ${x2 + 80} ${wave2},
          ${x2} ${y2}
    `;

} else {

    pathData = `
        M ${x1} ${y1}
        C ${x1 + 80} ${wave1},
          ${x2 - 80} ${wave2},
          ${x2} ${y2}
    `;

}

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

/* NEXT */

nextBtn.onclick = ()=>{

    const data =
    stages[currentStage].questions;

    if(
        stageProgress[currentStage]
        .completedMatches.length
        !==
        data.length
    ){

        return;
    }

    if(currentStage < stages.length-1){

        currentStage++;

        loadStage();
    }
};

/* PREVIOUS */

prevBtn.onclick = ()=>{

    if(currentStage > 0){

        currentStage--;

        loadStage();
    }
};

/* START */

loadStage();
 function speak(text) {
        speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "hi-IN";
        msg.volume = 0.25;
        speechSynthesis.speak(msg);
    }

//    speak("चित्रों को उनके सही नामों से मिलाइए।");

