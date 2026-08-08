const quizData = [

{
    title: "Unscramble the Material",
    a: "WOOD",
    img: "../assets/images/wood.png"
},

{
    title: "Unscramble the Material",
    a: "SAND",
    img: "../assets/images/sand.png"
},

{
    title: "Unscramble the Material",
    a: "BRICKS",
    img: "../assets/images/bricks.png"
},

{
    title: "Unscramble the Material",
    a: "WATER",
    img: "../assets/images/water.png"
},

{
    title: "Unscramble the Material",
    a: "CEMENT",
    img: "../assets/images/cement.png"
}

];

        let currentQuestionIndex = 0;
        let quizScore = 0;

        const answeredQuestions = Array(quizData.length).fill(false);
        const storedAnswers = Array(quizData.length).fill("");

        const questionTitle = document.getElementById("questionTitle");
        const questionImage = document.getElementById("questionImage");

        const nextButton = document.getElementById("nextButton");
        const previousButton = document.getElementById("previousButton");
       // const submitButton = document.getElementById("submitButton");
       const questionNumber = document.getElementById("questionNumber");

        const answerSlotsContainer = document.getElementById("answerSlots");
        const letterContainer = document.getElementById("letterContainer");

        let correctAnswer = "";
        let letterTiles = [];


        function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-UK";
            msg.volume = .25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }

        function smallConfetti() {
    confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        scalar: 0.8
    });
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
                const slot = document.createElement("div");
                slot.className = "answer-slot";
                slot.onclick = () => removeLetterFromSlot(slot);
                answerSlotsContainer.appendChild(slot);
            }
        }

        function removeLetterFromSlot(slot) {

            if (slot.classList.contains("locked")) return;
            const letter = slot.textContent;
            if (!letter) return;
            slot.textContent = "";
            const tile = letterTiles.find(t =>
                t.textContent === letter && t.classList.contains("used")
            );

            if (tile) {
                tile.classList.remove("used");
                tile.onclick = () => insertLetterIntoSlot(tile, letter);
            }

           
        }


        function generateLetterTiles(answer) {
            letterContainer.innerHTML = "";
            letterTiles = [];
            let letters = answer.split("");
            shuffleLetters(letters);
            letters.forEach(letter => {

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

            validateSlotCompletion();

        }


        function validateSlotCompletion() {

    const slots = document.querySelectorAll(".answer-slot");

    let word = [...slots].map(s => s.textContent).join("");

    if (word.length === correctAnswer.length) {

        setTimeout(checkAnswer, 200);

    }

}

function checkAnswer() {

    const slots = document.querySelectorAll(".answer-slot");

    let guess = [...slots].map(s => s.textContent).join("");

    if (guess === correctAnswer) {

        quizScore++;

        showPopup(true);
        speak("Correct");
        smallConfetti();
        answeredQuestions[currentQuestionIndex] = true;
        storedAnswers[currentQuestionIndex] = guess;

        slots.forEach(s => {
            s.classList.add("locked");
            s.classList.add("correct");
            s.onclick = null;
        });

        nextButton.disabled = false;

        if (currentQuestionIndex === quizData.length - 1) {
            setTimeout(showFinal, 1600);
        }

    } else {

        showPopup(false);
        speak("try again");

        setTimeout(() => {

            slots.forEach(s => s.textContent = "");

            letterTiles.forEach(tile => {
                tile.classList.remove("used");
                tile.onclick = () => insertLetterIntoSlot(tile, tile.textContent);
            });

        }, 800);
    }

}

        function removeLastFilledSlot() {

            const slots = document.querySelectorAll(".answer-slot");

            const filled = [...slots].filter(s => s.textContent);

            if (filled.length === 0) return;

            const last = filled[filled.length - 1];

            const letter = last.textContent;

            last.textContent = "";

            const tile = letterTiles.find(t => t.textContent === letter && t.classList.contains("used"));

            if (tile) {

                tile.classList.remove("used");
                tile.onclick = () => insertLetterIntoSlot(tile, letter);

            }

           // submitButton.disabled = true;

        }


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
            document.getElementById("finalScore").textContent =
                `Your Score: ${quizScore} / ${quizData.length}`;
            document.getElementById("stars").textContent =
                "⭐".repeat(quizScore);
            popup.style.display = "flex";
            // Big confetti celebration
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 300);
        }


        function renderQuestion() {

            const question = quizData[currentQuestionIndex];

            questionTitle.textContent = question.title;
            questionImage.src = question.img;
            // questionNumber.textContent = `Q${currentQuestionIndex + 1}.`;

            correctAnswer = question.a.toUpperCase();

            createAnswerSlots(correctAnswer);

            if (answeredQuestions[currentQuestionIndex]) {

                const slots = document.querySelectorAll(".answer-slot");
                const saved = storedAnswers[currentQuestionIndex].split("");

                saved.forEach((letter, i) => {

                    slots[i].textContent = letter;
                    slots[i].classList.add("locked");
                    slots[i].classList.add("correct");   // restore green color
                    slots[i].onclick = null;             // prevent removing letters

                });
                generateLetterTiles(correctAnswer);

                letterTiles.forEach(tile => {
                    tile.classList.add("used");
                    tile.onclick = null;
                });

               // submitButton.disabled = true;
                nextButton.disabled = false;

            } else {

                generateLetterTiles(correctAnswer);
              //  submitButton.disabled = true;
                nextButton.disabled = true;

            }

            previousButton.disabled = currentQuestionIndex === 0;

        }


       
        nextButton.onclick = () => {
            currentQuestionIndex++;
            renderQuestion();
        };

        previousButton.onclick = () => {
            currentQuestionIndex--;
            renderQuestion();
        };


        document.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                removeLastFilledSlot();
            }
        });

        renderQuestion();
