
const puzzles = [

{
    letters:["","आ"],
    correct:"अ",
    wrong:"ए"
},

{
    letters:["","ई"],
    correct:"इ",
    wrong:"ऐ"
},

{
    letters:["","ऊ"],
    correct:"उ",
    wrong:"ऊ"
},

{
    letters:["","ए"],
    correct:"ऋ",
    wrong:"ए"
},

{
    letters:["","ऐ"],
    correct:"ए",
    wrong:"ऐ"
},

{
    letters:["","औ"],
    correct:"ओ",
    wrong:"औ"
},

{
    letters:["","अ:"],
    correct:"अं",
    wrong:"अ:"
},

{
    letters:["","उ"],
    correct:"ई",
    wrong:"उ"
},

{
    letters:["","ग","घ"],
    correct:"ख",
    wrong:"च"
},

{
    letters:["","ठ","ड"],
    correct:"ट",
    wrong:"ढ"
},

{
    letters:["","फ","ब"],
    correct:"प",
    wrong:"भ"
},

{
    letters:["","ष","स"],
    correct:"श",
    wrong:"ह"
},

{
    letters:["","छ","ज"],
    correct:"च",
    wrong:"झ"
},

{
    letters:["","द","ध"],
    correct:"थ",
    wrong:"न"
},

{
    letters:["","र","ल"],
    correct:"य",
    wrong:"व"
},

{
    letters:["","त्र","ज्ञ"],
    correct:"क्ष",
    wrong:"श्र"
}

];

const wrapper = document.getElementById("puzzleWrapper");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

let currentPage = 0;

const questionsPerPage = 8;

let score = 0;

let completed = 0;

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

/* RENDER QUESTIONS */

function renderQuestions(){

    wrapper.innerHTML = "";

    const start = currentPage * questionsPerPage;

    const end = start + questionsPerPage;

    const currentQuestions = puzzles.slice(start,end);

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

/* ENABLE NEXT ONLY AFTER 8 CORRECT */

function updateButtons(){

    prevBtn.disabled = currentPage === 0;

    const start = currentPage * questionsPerPage;

    const end = start + questionsPerPage;

    const currentQuestions = puzzles.slice(start,end);

    const allCorrect = currentQuestions.every(
        q => q.userAnswer === q.correct
    );

    if(currentPage === Math.ceil(puzzles.length/questionsPerPage)-1){

        nextBtn.disabled = true;

    }else{

        nextBtn.disabled = !allCorrect;

    }

}

/* BUTTONS */

prevBtn.addEventListener("click",()=>{

    if(currentPage > 0){

        currentPage--;

        renderQuestions();

    }

});

nextBtn.addEventListener("click",()=>{

    const start = currentPage * questionsPerPage;

    const end = start + questionsPerPage;

    const currentQuestions = puzzles.slice(start,end);

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

/* INITIAL */

renderQuestions();

 
 function speak(text) {
        speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "hi-IN";
        msg.volume = 0.25;
        speechSynthesis.speak(msg);
    }

//    speak("आगे वाला अक्षर लिखिए।");