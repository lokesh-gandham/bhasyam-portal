const quizData = [
    {
        singular: "Bus",
        plural: "buses",
        image: "../assets/images/bus.png",
        options: ["buses", "buseses", "busis", "busas"],
        hint: "Add 'es' to the word 'bus'"
    },
    {
        singular: "Brush",
        plural: "brushes",
        image: "../assets/images/brush.png",
        options: ["brushes", "brushs", "brushis", "brushas"],
        hint: "Add 'es' to the word 'brush'"
    },
    {
        singular: "Box",
        plural: "boxes",
        image: "../assets/images/box.png",
        options: ["boxes", "boxs", "boxis", "boxas"],
        hint: "Add 'es' to the word 'box'"
    },
    {
        singular: "Dress",
        plural: "dresses",
        image: "../assets/images/clothes.png",
        options: ["dresses", "dresss", "dressis", "dressas"],
        hint: "Add 'es' to the word 'dress'"
    },
    {
        singular: "Dish",
        plural: "dishes",
        image: "../assets/images/dish.png",
        options: ["dishes", "dishs", "dishis", "dishas"],
        hint: "Add 'es' to the word 'dish'"
    }
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const hintText = document.getElementById("hintText");
const hintBtn = document.getElementById("hintBtn");


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

function smallConfetti() {
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        scalar: 0.9,
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    });
}

function loadQuestion() {
    const q = quizData[current];
    qEl.textContent = `Q${current + 1}. Write the plural form for: ${q.singular}`;
    imgEl.src = q.image;
    imgEl.alt = q.singular;
    optEl.innerHTML = "";

    // Hide hint when changing question
    hintText.classList.remove("show");
    hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';

    // Check if question was already answered correctly
    if (answered[current] === true) {
        optEl.style.gridTemplateColumns = "1fr";
        optEl.style.justifyItems = "center";
        optEl.style.alignItems = "center";

        const text = q.plural;
        const d = document.createElement("div");
        d.className = "option correct centered";
        d.textContent = text;
        optEl.appendChild(d);

        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === quizData.length - 1;
        return;
    }

    optEl.style.gridTemplateColumns = "1fr 1fr";
    optEl.style.justifyItems = "stretch";
    optEl.style.alignItems = "stretch";

    // Shuffle options for variety
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    shuffledOptions.forEach((text, i) => {
        const d = document.createElement("div");
        d.className = "option";
        d.textContent = text;

        d.onclick = () => {
            if (answered[current] === true) return;

            if (text === q.plural) {
                answered[current] = true;
                score++;

                const allOptions = [...optEl.children];
                allOptions.forEach((o) => {
                    if (o !== d) {
                        o.classList.add("hidden");
                    }
                });

                d.classList.add("correct", "centered");
                optEl.style.gridTemplateColumns = "1fr";
                optEl.style.justifyItems = "center";
                optEl.style.alignItems = "center";

                smallConfetti();
                speak("correct")
                showPopup(true);
                nextBtn.disabled = false;

                if (answered.every((a) => a === true)) {
                    setTimeout(showFinal, 1600);
                }
            } else {
                d.classList.add("wrong");
               speak("wrong")
                showPopup(false);
                
                // Remove wrong class after animation
                setTimeout(() => {
                    d.classList.remove("wrong");
                }, 600);
            }
        };

        optEl.appendChild(d);
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = true; // Disabled until user answers correctly
}

prevBtn.onclick = () => {
    if (current > 0) {
        current--;
        loadQuestion();
    }
};

nextBtn.onclick = () => {
    if (current < quizData.length - 1) {
        current++;
        loadQuestion();
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

    // Stars based on score
    let stars = "";
    if (score === total) stars = "⭐⭐⭐⭐";
    else if (score >= total / 2) stars = "⭐⭐";
    else stars = "⭐";
    document.getElementById("stars").textContent = stars;

    popup.style.display = "flex";

    // Big confetti celebration
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

    // Play celebration sound
    setTimeout(() => {
        correctSound.currentTime = 0;
        correctSound.play().catch(() => {});
    }, 200);
}

// Load first question
loadQuestion();

// Prevent body scroll
document.addEventListener('touchmove', function(e) {
    if (!e.target.closest('.quiz')) {
        e.preventDefault();
    }
}, { passive: false });

// Close hint when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.question-top') && !e.target.closest('.hint-text')) {
        hintText.classList.remove("show");
        hintBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Hint';
    }
});