const quizData = [
{
    singular: "House",
    plural: "houses",
    image: "../assets/images/house.png",
    answerImage: "../assets/images/houses.png",
    hint: "Add 's' to the word 'house'"
},
{
    singular: "Month",
    plural: "months",
    image: "../assets/images/month.png",
    answerImage: "../assets/images/months.png",
    hint: "Add 's' to the word 'month'"
},
{
    singular: "Mistake",
    plural: "mistakes",
    image: "../assets/images/mistake.png",
    answerImage: "../assets/images/puzzles.png",
    hint: "Add 's' to the word 'mistake'"
},
{
    singular: "Mason",
    plural: "masons",
    image: "../assets/images/mcq-1.png",
    answerImage: "../assets/images/masons.png",
    hint: "Add 's' to the word 'mason'"
}
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);

const qEl = document.getElementById("question");
const q2El = document.getElementById("question2");
const imgEl = document.getElementById("questionImg");
const img2El = document.getElementById("questionImg2");
const circlesEl = document.getElementById("answerCircles");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const hintText = document.getElementById("hintText");
const hintBtn = document.getElementById("hintBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

let filledLetters = [];

function toggleHint() {
    hintText.classList.toggle("show");
    if (hintText.classList.contains("show")) {
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hide Hint';
    } else {
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';
    }
}

function speak(t) {
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";
    msg.volume = 0.25;
    msg.rate = 1;
    msg.pitch = 1;
    speechSynthesis.speak(msg);
}

function playCorrectSound() {
    if (!correctSound) return;
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
}

function playWrongSound() {
    if (!wrongSound) return;
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
}

function smallConfetti() {
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        scalar: 0.9,
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    });
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function removePopout() {
    const existing = document.querySelector(".letter-popout");
    if (existing) existing.remove();
}

function buildCircles(count) {
    circlesEl.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const c = document.createElement("div");
        c.className = "answer-circle";
        c.dataset.index = i;
        c.textContent = "";
        c.onclick = () => onCircleClick(i);
        circlesEl.appendChild(c);
    }
}

function onCircleClick(index) {
    if (answered[current] === true) return;
    const circle = circlesEl.children[index];
    if (!circle) return;

    if (circle.textContent) {
        removeLetterFromCircle(index);
        return;
    }

    removePopout();

    const q = quizData[current];
    const correctLetter = q.plural[index].toLowerCase();
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let wrongLetter;
    do {
        wrongLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    } while (wrongLetter === correctLetter);

    const options = shuffle([correctLetter, wrongLetter]);

    const popout = document.createElement("div");
    popout.className = "letter-popout";

    options.forEach(letter => {
        const btn = document.createElement("div");
        btn.className = "letter-popout-btn";
        btn.textContent = letter.toUpperCase();
        btn.onclick = (e) => {
            e.stopPropagation();
            circle.textContent = letter.toUpperCase();
            circle.dataset.letter = letter;
            filledLetters[index] = letter;
            removePopout();
            checkIfComplete();
        };
        popout.appendChild(btn);
    });

    circle.appendChild(popout);
}

function removeLetterFromCircle(index) {
    if (answered[current] === true) return;
    const circle = circlesEl.children[index];
    if (!circle || !circle.textContent) return;
    circle.textContent = "";
    circle.dataset.letter = "";
    filledLetters[index] = null;
}

function checkIfComplete() {
    const circles = [...circlesEl.children];
    if (circles.every(c => c.textContent)) {
        checkAnswer();
    }
}

function checkAnswer() {
    const q = quizData[current];
    const circles = [...circlesEl.children];
    const typed = circles.map(c => (c.dataset.letter || "").toLowerCase()).join("");

    if (typed.length < q.plural.length) return;

    if (typed === q.plural.toLowerCase()) {
        answered[current] = true;
        score++;

        circles.forEach(c => {
            c.classList.remove("wrong");
            c.classList.add("correct");
            c.onclick = null;
        });

        smallConfetti();
        playCorrectSound();
        speak("correct");
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every(a => a === true)) {
            setTimeout(showFinal, 1600);
        }
    } else {
        circles.forEach(c => c.classList.add("wrong"));
        playWrongSound();
        speak("try again");
        showPopup(false);

        setTimeout(() => {
            circles.forEach(c => {
                c.classList.remove("wrong");
                c.textContent = "";
                c.dataset.letter = "";
            });
            filledLetters = [];
        }, 600);
    }
}

function renderQuestion() {
    const q = quizData[current];
    qEl.textContent = `Q${current + 1}. One ${q.singular.toLowerCase()} → ?`;
    q2El.textContent = `Many ______?`;
    imgEl.src = q.image;
    imgEl.alt = q.singular;
    img2El.src = q.answerImage;
    img2El.alt = q.plural;

    hintText.classList.remove("show");
    hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';

    removePopout();

    if (answered[current] === true) {
        buildCircles(q.plural.length);
        const circles = [...circlesEl.children];
        q.plural.split("").forEach((ch, i) => {
            circles[i].textContent = ch.toUpperCase();
            circles[i].classList.add("correct");
        });
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === quizData.length - 1;
        return;
    }

    filledLetters = Array(q.plural.length).fill(null);
    buildCircles(q.plural.length);

    prevBtn.disabled = current === 0;
    nextBtn.disabled = true;
}

prevBtn.onclick = () => {
    if (current > 0) {
        current--;
        renderQuestion();
    }
};

nextBtn.onclick = () => {
    if (current < quizData.length - 1) {
        current++;
        renderQuestion();
    }
};

function showPopup(isCorrect) {
    const popup = document.getElementById("answerPopup");
    const icon = document.getElementById("popupIcon");
    const title = document.getElementById("popupTitle");
    const msg = document.getElementById("popupMsg");

    popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
    popup.style.display = "flex";

    if (isCorrect) {
        icon.textContent = "🎉";
        title.textContent = "Great Job!";
        msg.textContent = "You got it right!";
    } else {
        icon.textContent = "🥲";
        title.textContent = "Oops!";
        msg.textContent = "Try again, you can do it!";
    }

    setTimeout(() => {
        popup.style.display = "none";
    }, 1400);
}

function showFinal() {
    const popup = document.getElementById("finalPopup");
    const total = quizData.length;

    document.getElementById("finalScore").textContent = `Your Score: ${score} / ${total}`;

    let stars = "";
    if (score === total) stars = "⭐⭐⭐⭐";
    else if (score >= total / 2) stars = "⭐⭐";
    else stars = "⭐";
    document.getElementById("stars").textContent = stars;

    popup.style.display = "flex";

    confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3']
    });

    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1']
        });
    }, 300);

    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#f9ca24', '#ff6b6b', '#4ecdc4']
        });
    }, 600);

    setTimeout(() => {
        correctSound.currentTime = 0;
        correctSound.play().catch(() => {});
    }, 200);
}

renderQuestion();

document.addEventListener('touchmove', function(e) {
    if (!e.target.closest('.quiz')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('click', function(e) {
    if (!e.target.closest('.question-top') && !e.target.closest('.hint-text')) {
        hintText.classList.remove("show");
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';
    }
    if (!e.target.closest('.answer-circle')) {
        removePopout();
    }
});
