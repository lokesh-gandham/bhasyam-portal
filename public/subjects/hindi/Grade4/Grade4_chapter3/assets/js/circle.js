   // ===== HOW TO PLAY FUNCTIONALITY =====
        const howToBtn = document.getElementById("howToPlayBtn");
        const howToPopup = document.getElementById("howToPlayPopup");
        const closeHowTo = document.getElementById("closeHowToBtn");

        howToBtn.onclick = () => {
            howToPopup.style.display = "flex";
        };

        closeHowTo.onclick = () => {
            howToPopup.style.display = "none";
        };

        howToPopup.onclick = (e) => {
            if (e.target === howToPopup) {
                howToPopup.style.display = "none";
            }
        };

        // ===== GAME LOGIC =====
        const gameData = {
            gridLetters: [
                ["क", "द", "र", "वा", "जा", "झ"],
                ["व", "सू", "च", "चि", "ड़ि", "या"],
                ["ग", "र", "छ", "सी", "ढ़ी", "ट"],
                ["घ", "ज", "ज", "ग", "ग", "न"],
                ["ग", "र", "मी", "ठ", "ड", "ढ"]
            ],
            answers: [
                { number: 1, word: "दरवाजा" },
                { number: 2, word: "चिड़िया" },
                { number: 3, word: "गगन" },
                { number: 6, word: "गरमी" },
                { number: 5, word: "सीढ़ी" },
                { number: 4, word: "सूरज" }
            ]
        };

        const grid = document.getElementById("grid");
        let currentSelection = [];
        let solvedWords = 0;
        const totalWords = gameData.answers.length;
        const solvedSet = new Set();

        // Build grid
        gameData.gridLetters.forEach((row) => {
            row.forEach((letter) => {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = letter;
                cell.onclick = () => selectLetter(cell, letter);
                grid.appendChild(cell);
            });
        });

        function selectLetter(cell, letter) {
            if (cell.classList.contains("correct")) return;
            if (cell.classList.contains("selected")) return;

            const cells = [...document.querySelectorAll(".cell")];
            const currentIndex = cells.indexOf(cell);
            const cols = 6;
            const currentRow = Math.floor(currentIndex / cols);
            const currentCol = currentIndex % cols;

            if (currentSelection.length > 0) {
                const lastCell = currentSelection[currentSelection.length - 1].element;
                const lastIndex = cells.indexOf(lastCell);
                const lastRow = Math.floor(lastIndex / cols);
                const lastCol = lastIndex % cols;
                const isNextHorizontal = currentRow === lastRow && currentCol === lastCol + 1;
                const isNextVertical = currentCol === lastCol && currentRow === lastRow + 1;
                if (!isNextHorizontal && !isNextVertical) {
                    return;
                }
            }

            cell.classList.add("selected");
            currentSelection.push({ letter, element: cell });
            checkWord();
        }

        function checkWord() {
            const formedWord = currentSelection.map(x => x.letter).join("");
            let matched = false;

            gameData.answers.forEach((ans) => {
                if (formedWord === ans.word) {
                    matched = true;
                    const cells = [...document.querySelectorAll(".cell")];
                    const cols = 6;
                    const firstIndex = cells.indexOf(currentSelection[0].element);
                    const lastIndex = cells.indexOf(currentSelection[currentSelection.length - 1].element);
                    const firstRow = Math.floor(firstIndex / cols);
                    const firstCol = firstIndex % cols;
                    const lastRow = Math.floor(lastIndex / cols);
                    const lastCol = lastIndex % cols;
                    const isHorizontal = firstRow === lastRow;
                    const isVertical = firstCol === lastCol;

                    currentSelection.forEach((x, index) => {
                        x.element.classList.remove("selected");
                        x.element.classList.add("correct");

                        if (index === 0) {
                            if (isHorizontal) {
                                x.element.classList.add("row-start");
                            } else if (isVertical) {
                                x.element.classList.add("col-start");
                            }
                            const badge = document.createElement("div");
                            badge.className = "inside-number solved";
                            badge.textContent = ans.number;
                            x.element.appendChild(badge);
                        }

                        if (index === currentSelection.length - 1) {
                            if (isHorizontal) {
                                x.element.classList.add("row-end");
                            } else if (isVertical) {
                                x.element.classList.add("col-end");
                            }
                        }
                    });

                    solvedWords++;
                    solvedSet.add(ans.number);

                    // ===== RED → GREEN for number badge =====
                    const numBadge = document.getElementById('numBadge' + ans.number);
                    if (numBadge) {
                        numBadge.classList.add('solved');
                    }

                    showPopup(true);
                    currentSelection = [];

                    if (solvedWords === totalWords) {
                        setTimeout(showFinal, 1000);
                    }
                }
            });

            const possible = gameData.answers.some(a => a.word.startsWith(formedWord));
            if (!matched && !possible) {
                wrongSelection();
            }
        }

        function wrongSelection() {
            currentSelection.forEach((x) => {
                x.element.classList.add("wrong");
                setTimeout(() => {
                    x.element.classList.remove("wrong");
                    x.element.classList.remove("selected");
                }, 500);
            });
            showPopup(false);
            currentSelection = [];
        }

        /* AUDIO */
        let audioCtx = null;

        function playCorrectSound() {
            try {
                if (!audioCtx) {
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
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
                oscillator.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
        }

        function playWrongSound() {
            try {
                if (!audioCtx) {
                    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
                }
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.25;
                oscillator.type = "sawtooth";
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
                oscillator.stop(audioCtx.currentTime + 0.4);
            } catch (e) {}
        }

        /* POPUP */
        function showPopup(correct = true) {
            const popup = document.getElementById("simpleEmojiPopup");
            const emoji = document.getElementById("popupEmoji");

            if (correct) {
                emoji.innerHTML = "😊";
                playCorrectSound();
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                emoji.innerHTML = "😔";
                playWrongSound();
            }

            popup.classList.add("active");
            setTimeout(() => {
                popup.classList.remove("active");
            }, 1000);
        }

        /* BIG CONFETTI */
        function bigConfetti() {
            confetti({
                particleCount: 200,
                spread: 110,
                origin: { y: 0.5 }
            });
            setTimeout(() => {
                confetti({
                    particleCount: 120,
                    spread: 130,
                    origin: { y: 0.4, x: 0.2 }
                });
                confetti({
                    particleCount: 120,
                    spread: 130,
                    origin: { y: 0.4, x: 0.8 }
                });
            }, 150);
        }

        /* FINAL POPUP */
        let finalPopupShown = false;

        function showFinal() {
            if (finalPopupShown) return;
            finalPopupShown = true;
            bigConfetti();
            setTimeout(() => {
                document.getElementById("finalPopup").classList.add("active");
            }, 500);
        }