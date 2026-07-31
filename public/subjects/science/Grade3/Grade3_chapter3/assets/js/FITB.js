  const quizData = [
            { q: "Q1. Nuts and beans are rich in ______.", a: "MINERALS", img: "../assets/images/minerals.png" },
            { q: "Q2. Potatoes and rice are rich in ______.", a: "CARBOHYDRATES", img: "../assets/images/carbohydrates.png" },
            { q: "Q3. Pizza and French fries are considered ______ food.", a: "JUNK", img: "../assets/images/junkfood.png" },
            { q: "Q4. Vitamins and minerals are also called ______ food.", a: "PROTECTIVE", img: "../assets/images/protective.png" },
            { q: "Q5. Food rich in ______ include oil, butter, nuts, coconut, ghee, cheese, cream, etc.", a: "FATS", img: "../assets/images/fats_1.png" },
        ];

        let currentQuestionIndex = 0;
        let quizScore = 0;
        let autoCheckTimeout = null;
        const answeredQuestions = Array(quizData.length).fill(false);
        const storedAnswers = Array(quizData.length).fill("");
        let letterTiles = [];

        const questionTitle = document.getElementById("questionTitle");
        const questionImage = document.getElementById("questionImage");
        const nextButton = document.getElementById("nextButton");
        const previousButton = document.getElementById("previousButton");
        const backspaceBtn = document.getElementById("backspaceBtn");
        const answerSlotsContainer = document.getElementById("answerSlots");
        const letterContainer = document.getElementById("letterContainer");

        let correctAnswer = "";

        function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-UK";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }

        function launchConfetti() {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }

        function shuffleLetters(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function createAnswerSlots(word) {
            answerSlotsContainer.innerHTML = "";
            for (let i = 0; i < word.length; i++) {
                if (word[i] === " ") {
                    const gap = document.createElement("div");
                    gap.className = "answer-gap";
                    answerSlotsContainer.appendChild(gap);
                } else {
                    const slot = document.createElement("div");
                    slot.className = "answer-slot";
                    slot.dataset.index = i;
                    slot.onclick = () => removeLetterFromSlot(slot);
                    answerSlotsContainer.appendChild(slot);
                }
            }
        }

        function removeLetterFromSlot(slot) {
            if (slot.classList.contains("locked")) return;
            const letter = slot.textContent;
            if (!letter) return;
            slot.textContent = "";
            const tile = letterTiles.find(t => t.textContent === letter && t.classList.contains("used"));
            if (tile) {
                tile.classList.remove("used");
                tile.onclick = () => insertLetterIntoSlot(tile, letter);
            }
        }

        function generateLetterTiles(answer) {
            letterContainer.innerHTML = "";
            letterTiles = [];
            let letters = answer.replace(/\s/g, "").split("");
            shuffleLetters(letters);
            letters.forEach((letter) => {
                const tile = document.createElement("div");
                tile.className = "letter-tile";
                tile.textContent = letter;
                tile.onclick = () => insertLetterIntoSlot(tile, letter);
                letterContainer.appendChild(tile);
                letterTiles.push(tile);
            });
        }

        function insertLetterIntoSlot(tile, letter) {
            const slots = document.querySelectorAll(".answer-slot");
            const empty = [...slots].find(s => !s.textContent);
            if (!empty) return;
            empty.textContent = letter;
            tile.classList.add("used");
            tile.onclick = null;
            
            // Auto-check when all slots are filled
            checkIfAllSlotsFilled();
        }

        function checkIfAllSlotsFilled() {
            const slots = document.querySelectorAll(".answer-slot");
            const allFilled = [...slots].every(slot => slot.textContent !== "");
            
            if (allFilled && !answeredQuestions[currentQuestionIndex]) {
                // Clear any existing timeout
                if (autoCheckTimeout) clearTimeout(autoCheckTimeout);
                
                // Add small delay for better UX
                autoCheckTimeout = setTimeout(() => {
                    checkAnswer();
                }, 100);
            }
        }

        function getCurrentGuess() {
            const slots = document.querySelectorAll(".answer-slot");
            return [...slots].map(s => s.textContent).join("");
        }

        function checkAnswer() {
            const guess = getCurrentGuess();
            const slots = document.querySelectorAll(".answer-slot");
            
            if (guess === correctAnswer.replace(/\s/g, "")) {
                // Correct answer
                quizScore++;
                showPopup(true);
                speak("Correct");
                answeredQuestions[currentQuestionIndex] = true;
                storedAnswers[currentQuestionIndex] = guess;
                
                slots.forEach(s => {
                    s.classList.add("locked");
                    s.classList.add("correct");
                    s.onclick = null;
                });
                
                // Disable all letter tiles
                letterTiles.forEach(tile => {
                    tile.classList.add("used");
                    tile.onclick = null;
                });
                
                nextButton.disabled = false;
                
                if (currentQuestionIndex === quizData.length - 1) {
                    setTimeout(showFinal, 1600);
                }
            } else {
                // Wrong answer
                showPopup(false);
                speak("Wrong");
                
                // Reset all slots and tiles
                setTimeout(() => {
                    slots.forEach(s => s.textContent = "");
                    letterTiles.forEach(tile => {
                        tile.classList.remove("used");
                        tile.onclick = () => insertLetterIntoSlot(tile, tile.textContent);
                    });
                }, 800);
            }
        }

        function showPopup(isCorrect) {
            const popup = document.getElementById("answerPopup");
            const icon = document.getElementById("popupIcon");
            const title = document.getElementById("popupTitle");
            const msg = document.getElementById("popupMsg");

            popup.className = "popup " + (isCorrect ? "correct" : "wrong");
            popup.style.display = "flex";

            if (isCorrect) {
                icon.textContent = "??";
                title.textContent = "Correct!";
                msg.textContent = "Well done!";
                launchConfetti();
            } else {
                icon.textContent = "??";
                title.textContent = "Wrong!";
                msg.textContent = "Try again!";
            }

            setTimeout(() => {
                popup.style.display = "none";
            }, 1200);
        }

        function showFinal() {
            const popup = document.getElementById("finalPopup");
            document.getElementById("finalScore").innerHTML = `Your Score: ${quizScore} / ${quizData.length}`;
            popup.style.display = "block";
            launchConfetti();
        }

        function renderQuestion() {
            // Clear any pending timeout
            if (autoCheckTimeout) clearTimeout(autoCheckTimeout);
            
            const question = quizData[currentQuestionIndex];
            questionTitle.textContent = question.q;
            questionImage.src = question.img;
            correctAnswer = question.a.toUpperCase();
            createAnswerSlots(correctAnswer);

            if (answeredQuestions[currentQuestionIndex]) {
                const slots = document.querySelectorAll(".answer-slot");
                const saved = storedAnswers[currentQuestionIndex].split("");
                saved.forEach((letter, i) => {
                    slots[i].textContent = letter;
                    slots[i].classList.add("locked");
                    slots[i].classList.add("correct");
                    slots[i].onclick = null;
                });
                generateLetterTiles(correctAnswer);
                letterTiles.forEach(tile => {
                    tile.classList.add("used");
                    tile.onclick = null;
                });
                nextButton.disabled = false;
            } else {
                generateLetterTiles(correctAnswer);
                nextButton.disabled = true;
            }
            previousButton.disabled = currentQuestionIndex === 0;
        }

        nextButton.onclick = () => {
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            }
        };

        previousButton.onclick = () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        };

   document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
        removeLastLetter();
    }
});

backspaceBtn.onclick = removeLastLetter;


        function removeLastLetter() {
    const slots = document.querySelectorAll(".answer-slot");
    const filled = [...slots].filter(
        s => s.textContent && !s.classList.contains("locked")
    );

    if (filled.length === 0) return;

    const last = filled[filled.length - 1];
    const letter = last.textContent;

    last.textContent = "";

    const tile = letterTiles.find(
        t => t.textContent === letter && t.classList.contains("used")
    );

    if (tile) {
        tile.classList.remove("used");
        tile.onclick = () => insertLetterIntoSlot(tile, letter);
    }
}

        renderQuestion();