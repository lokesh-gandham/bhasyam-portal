

        const QUESTIONS = [

            {
                image: "../assets/images/bikhari.png",
                correct: "हाँ"
            },

            {
                image: "../assets/images/masti.png",
                correct: "नहीं"
            },

            {
                image: "../assets/images/roadcross.png",
                correct: "हाँ"
            },

            {
                image: "../assets/images/khelna.png",
                correct: "नहीं"
            },

            {
                image: "../assets/images/kachra.png",
                correct: "नहीं"
            },

            {
                image: "../assets/images/giftboy.png",
                correct: "हाँ"
            }

        ];

        const quizGrid = document.getElementById("quizGrid");

        let answeredCount = 0;

        /* =========================
           AUDIO
        ========================== */

       let audioCtx = null;

async function initAudio() {

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
}

document.addEventListener("pointerdown", initAudio, { once: true });

        function playCorrectSound() {

            if (!audioCtx) return;
              if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = 880;
            oscillator.type = "sine";

            gainNode.gain.value = 0.2;

            oscillator.start();

            gainNode.gain.exponentialRampToValueAtTime(
                0.00001,
                audioCtx.currentTime + 0.5
            );

            oscillator.stop(audioCtx.currentTime + 0.5);
        }

        function playWrongSound() {

            if (!audioCtx) return;
            if (audioCtx.state === "suspended") {
    audioCtx.resume();
}
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = 250;
            oscillator.type = "sawtooth";

            gainNode.gain.value = 0.2;

            oscillator.start();

            gainNode.gain.exponentialRampToValueAtTime(
                0.00001,
                audioCtx.currentTime + 0.4
            );

            oscillator.stop(audioCtx.currentTime + 0.4);
        }

        /* =========================
           POPUP
        ========================== */

        function showPopup(correct) {

            const emojiPopup = document.getElementById("emojiPopup");
            const popupEmoji = document.getElementById("popupEmoji");

            if (correct) {

                popupEmoji.innerHTML = "😊";

                playCorrectSound();

                confetti({
                    particleCount: 70,
                    spread: 70,
                    origin: { y: 0.6 }
                });

            } else {

                popupEmoji.innerHTML = "😢";

                playWrongSound();
            }

            emojiPopup.classList.add("active");

            setTimeout(() => {
                emojiPopup.classList.remove("active");
            }, 800);
        }

        /* =========================
           FINAL POPUP
        ========================== */

        function showFinalPopup() {

            confetti({
                particleCount: 250,
                spread: 140,
                origin: { y: 0.6 }
            });

            document
                .getElementById("finalPopup")
                .classList.add("show");
        }

        /* =========================
           CREATE QUIZ
        ========================== */

        QUESTIONS.forEach((q) => {

            const card = document.createElement("div");

            card.className = "quiz-card";

            card.innerHTML = `

                <img src="${q.image}" class="quiz-image">

                <div class="answer-row">

                    <div class="answer-box yes">
                        हाँ
                    </div>

                    <div class="answer-box no">
                        नहीं
                    </div>

                </div>

            `;

            const boxes = card.querySelectorAll(".answer-box");

            boxes.forEach(box => {

                box.addEventListener("click", () => {

                    if (card.classList.contains("done")) return;

                    const answer = box.innerText.trim();

                    if (answer === q.correct) {

                        box.classList.add("correct");

                        showPopup(true);

                        card.classList.add("done");

                        answeredCount++;

                        boxes.forEach(b => {
                            b.classList.add("disabled");
                        });

                        if (answeredCount === QUESTIONS.length) {

                            setTimeout(() => {
                                showFinalPopup();
                            }, 700);
                        }

                    } else {

                        box.classList.add("wrong");

                        showPopup(false);

                        setTimeout(() => {
                            box.classList.remove("wrong");
                        }, 500);
                    }

                });

            });

            quizGrid.appendChild(card);

        });

        /* =========================
           PLAY AGAIN
        ========================== */

        document.getElementById("playAgainBtn")
            .addEventListener("click", () => {

                location.reload();

            });

