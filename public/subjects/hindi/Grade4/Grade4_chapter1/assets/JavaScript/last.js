
const puzzles = [

{
    letters:["अ",""],
    correct:"आ",
    wrong:"इ"
},

{
    letters:["इ",""],
    correct:"ई",
    wrong:"उ"
},

{
    letters:["उ",""],
    correct:"ऊ",
    wrong:"ऋ"
},

{
    letters:["ऋ",""],
    correct:"ए",
    wrong:"ऐ"
},

{
    letters:["ए",""],
    correct:"ऐ",
    wrong:"ओ"
},

{
    letters:["ओ",""],
    correct:"औ",
    wrong:"अं"
},

{
    letters:["अं",""],
    correct:"अ:",
    wrong:"आ"
},

{
    letters:["आ",""],
    correct:"इ",
    wrong:"ई"
},

{
    letters:["र","ल",""],
    correct:"व",
    wrong:"श"
},

{
    letters:["क्ष","त्र",""],
    correct:"ज्ञ",
    wrong:"श्र"
},

{
    letters:["ज","झ",""],
    correct:"ञ",
    wrong:"ट"
},

{
    letters:["ब","भ",""],
    correct:"म",
    wrong:"य"
},

{
    letters:["श","ष",""],
    correct:"स",
    wrong:"ह"
},

{
    letters:["ग","घ",""],
    correct:"ङ",
    wrong:"च"
},

{
    letters:["ड","ढ",""],
    correct:"ण",
    wrong:"त"
},

{
    letters:["द","ध",""],
    correct:"न",
    wrong:"प"
}

];

const wrapper = document.getElementById("puzzleWrapper");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

let score = 0;

let completed = 0;

let currentPage = 0;

/* 8 QUESTIONS FIRST PAGE + 8 SECOND PAGE */

const pageSizes = [8,8];

/* SAVE ANSWERS */

puzzles.forEach(item=>{

    item.userAnswer = "";

});

/* AUDIO */

let audioCtx = null;

function playCorrectSound(){

    if(!audioCtx){

        audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    }

    const oscillator = audioCtx.createOscillator();

    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 880;

    gainNode.gain.value = 0.2;

    oscillator.type = "sine";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + 0.5
    );

    oscillator.stop(audioCtx.currentTime + 0.5);

}

function playWrongSound(){

    if(!audioCtx){

        audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    }

    const oscillator = audioCtx.createOscillator();

    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 300;

    gainNode.gain.value = 0.25;

    oscillator.type = "sawtooth";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + 0.4
    );

    oscillator.stop(audioCtx.currentTime + 0.4);

}

/* GET CURRENT QUESTIONS */

function getCurrentQuestions(){

    let start = 0;

    for(let i=0;i<currentPage;i++){

        start += pageSizes[i];

    }

    const end = start + pageSizes[currentPage];

    return puzzles.slice(start,end);

}

/* RENDER QUESTIONS */

function renderQuestions(){

    wrapper.innerHTML = "";

    const currentQuestions = getCurrentQuestions();

    currentQuestions.forEach((item)=>{

        const wordBox = document.createElement("div");

        wordBox.className = "word-box";

        item.letters.forEach((letter)=>{

            const box = document.createElement("div");

            box.className = "letter-box";

            if(letter === ""){

                box.classList.add("blank");

                if(item.userAnswer){

                    box.innerHTML = item.userAnswer;

                    if(item.userAnswer === item.correct){

                        box.classList.add("correct");

                    }

                }

                box.addEventListener("click",()=>showOptions(box,item));

            }else{

                box.innerHTML = letter;

            }

            wordBox.appendChild(box);

        });

        wrapper.appendChild(wordBox);

    });

    updateButtons();

}

/* SHOW OPTIONS */

function showOptions(box,item){

    if(box.classList.contains("correct")) return;

    document.querySelectorAll(".options").forEach(el=>el.remove());

    const options = document.createElement("div");

    options.className = "options";

    const arr = [item.correct,item.wrong]
    .sort(()=>Math.random()-0.5);

    arr.forEach(letter=>{

        const btn = document.createElement("button");

        btn.className = "option-btn";

        btn.innerHTML = letter;

        btn.onclick = ()=>checkAnswer(letter,box,item,options);

        options.appendChild(btn);

    });

    box.appendChild(options);

}

/* CHECK ANSWER */

function checkAnswer(letter,box,item,options){

    if(letter === item.correct){

        if(item.userAnswer !== item.correct){

            score++;

            completed++;

        }

        item.userAnswer = letter;

        showEmojiPopup(true);

        confetti({

            particleCount:120,
            spread:90,
            origin:{ y:0.6 }

        });

        box.innerHTML = letter;

        box.classList.add("correct");

        options.remove();

        updateButtons();

        if(completed === puzzles.length){

            setTimeout(()=>{

                confetti({

                    particleCount:300,
                    spread:160,
                    origin:{ y:0.5 }

                });

                document
                .getElementById("finalPopup")
                .classList.add("active");

                document
                .getElementById("finalScore")
                .innerHTML =
                "Final Score : " +
                score +
                " / " +
                puzzles.length;

            },700);

        }

    }else{

        showEmojiPopup(false);

        setTimeout(()=>{

            options.remove();

        },700);

    }

}

/* UPDATE BUTTONS */

function updateButtons(){

    prevBtn.disabled = currentPage === 0;

    const currentQuestions = getCurrentQuestions();

    const allCorrect = currentQuestions.every(

        q => q.userAnswer === q.correct

    );

    if(currentPage === pageSizes.length-1){

        nextBtn.disabled = true;

    }else{

        nextBtn.disabled = !allCorrect;

    }

}

/* BUTTON EVENTS */

prevBtn.addEventListener("click",()=>{

    if(currentPage > 0){

        currentPage--;

        renderQuestions();

    }

});

nextBtn.addEventListener("click",()=>{

    const currentQuestions = getCurrentQuestions();

    const allCorrect = currentQuestions.every(

        q => q.userAnswer === q.correct

    );

    if(allCorrect){

        currentPage++;

        renderQuestions();

    }

});

/* POPUP */

function showEmojiPopup(isCorrect){

    const popup = document.getElementById("emojiPopup");

    const emoji = document.getElementById("popupEmoji");

    if(isCorrect){

        emoji.innerHTML = "😊✨";

        popup.className =
        "emoji-popup emoji-popup-correct active";

        playCorrectSound();

    }else{

        emoji.innerHTML = "😢💔";

        popup.className =
        "emoji-popup emoji-popup-wrong active";

        playWrongSound();

    }

    setTimeout(()=>{

        popup.classList.remove("active");

    },1000);

}

/* START */

renderQuestions();

 function speak(text) {
        speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "hi-IN";
        msg.volume = 0.25;
        speechSynthesis.speak(msg);
    }

//    speak("बाद वाला अक्षर लिखिए।");