const leftBoxes = document.querySelectorAll(".left-side .text-box");
const answers = document.querySelectorAll(".answer");
const svg = document.getElementById("svgLines");

let audioCtx = null;

function playCorrect() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 880;

        gain.gain.value = 0.2;

        osc.type = "sine";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.45
        );

        osc.stop(audioCtx.currentTime + 0.45);

    } catch(e) {}

}

function playWrong() {

    try {

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioCtx.resume();

        const osc = audioCtx.createOscillator();

        const gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        osc.frequency.value = 480;

        gain.gain.value = 0.2;

        osc.type = "triangle";

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            audioCtx.currentTime + 0.4
        );

        osc.stop(audioCtx.currentTime + 0.4);

    } catch(e) {}

}

function initAudioOnce() {

    if (audioCtx) return;

    try {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const buffer = audioCtx.createBuffer(1, 1, 22050);

        const src = audioCtx.createBufferSource();

        src.buffer = buffer;

        src.connect(audioCtx.destination);

        src.start();

    } catch(e) {}

}


  

let selectedBox = null;
let completed = 0;
const totalMatches = answers.length;


// Use base64 sounds if external files not available, or use Web Audio API






// SELECT LEFT BOX
leftBoxes.forEach(box => {
    box.onclick = () => {
        if (box.classList.contains("matched")) return;
        
        // Remove active class from all boxes
        leftBoxes.forEach(b => {
            b.classList.remove("active");
        });
        
        box.classList.add("active");
        selectedBox = box;
    };
});

// Function to show hint (without sound)
function showHint(message) {
    const hintPopup = document.createElement('div');
    hintPopup.textContent = message;
    hintPopup.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b6b;
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        z-index: 9999;
        animation: fadeOut 2s ease;
        font-size: 1rem;
        white-space: nowrap;
    `;
    document.body.appendChild(hintPopup);
    setTimeout(() => hintPopup.remove(), 2000);
}

// ANSWER CLICK
answers.forEach(answer => {
    answer.onclick = () => {
        if (!selectedBox) {
            showHint('⚠️ पहले बाईं तरफ का शब्द चुनें!');
            return;
        }
        
        if (answer.classList.contains("correct")) return;
        
        // Get the correct match from the selected left box
        const connectorElement = selectedBox.querySelector('.match-connector');
        const correctMatch = connectorElement ? connectorElement.getAttribute('data-match') : null;
        const selectedAnswer = answer.innerText.trim();
        
        const isCorrect = correctMatch === selectedAnswer;
        
        // CORRECT MATCH
        if (isCorrect) {
            // Play correct sound
            // speak("सही जवाब");
            playCorrect();
            
            answer.classList.add("correct");
            drawLine(selectedBox, answer);
            
            completed++;
            
            // Mark left box as matched
            selectedBox.classList.remove("active");
            selectedBox.classList.add("matched");
            
            // Update connector colors
            if (connectorElement) {
                connectorElement.style.opacity = '0.7';
            }
            
            // Update right connector
            const rightConnector = answer.querySelector('.right-connector');
            if (rightConnector) {
                rightConnector.style.opacity = '0.7';
            }
            
            selectedBox = null;
            
            // Confetti effect for correct answer
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#4fd67f', '#ffb4d6']
            });
            
            // Check if game completed
            if (completed === totalMatches) {
                console.log("GAME COMPLETED");
                setTimeout(() => {
                    showFinalPopup();
                }, 500);
            }
        } 
        // WRONG MATCH
        else {
            // Play wrong sound
            // speak("गलत जवाब");
            playWrong();
            
            answer.classList.add("wrong");
            
            setTimeout(() => {
                answer.classList.remove("wrong");
            }, 400);
            
            // Shake the selected box
            if (selectedBox) {
                selectedBox.style.animation = 'shake 0.4s ease';
                setTimeout(() => {
                    if (selectedBox) selectedBox.style.animation = '';
                }, 400);
            }
        }
    };
});

// DRAW LINE BETWEEN MATCHED PAIRS
function drawLine(leftBox, answer) {
    const leftConnector = leftBox.querySelector('.match-connector');
    const rightConnector = answer.querySelector('.right-connector');
    
    if (!leftConnector || !rightConnector) return;
    
    const leftRect = leftConnector.getBoundingClientRect();
    const rightRect = rightConnector.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const x1 = leftRect.left + leftRect.width / 2 - svgRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
    const x2 = rightRect.left + rightRect.width / 2 - svgRect.left;
    const y2 = rightRect.top + rightRect.height / 2 - svgRect.top;
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#ff4da0");
    line.setAttribute("stroke-width", "4");
    line.setAttribute("stroke-dasharray", "8, 4");
    
    svg.appendChild(line);
    
    // Animate line drawing
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    line.setAttribute("stroke-dasharray", length);
    line.setAttribute("stroke-dashoffset", length);
    
    let start = null;
    function animateLine(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min(1, (timestamp - start) / 500);
        const offset = length * (1 - progress);
        line.setAttribute("stroke-dashoffset", offset);
        
        if (progress < 1) {
            requestAnimationFrame(animateLine);
        } else {
            line.setAttribute("stroke-dasharray", "8, 4");
            line.setAttribute("stroke-dashoffset", "0");
        }
    }
    
    requestAnimationFrame(animateLine);
}

function showFinalPopup(){
    console.log("POPUP FUNCTION RUNNING");

    const finalPopup =
        document.getElementById("finalPopup");

    finalPopup.style.display = "flex";

    

    document.getElementById("finalScore")
    .textContent =
        `Score ${completed}/${totalMatches}`;

    document.getElementById("stars")
    .textContent =
        "⭐".repeat(totalMatches);

    // BIG CONFETTI
    confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 }
    });

    setTimeout(() => {

        confetti({
            particleCount: 180,
            angle: 60,
            spread: 80,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 180,
            angle: 120,
            spread: 80,
            origin: { x: 1 }
        });

    },250);

}
// RESTART FUNCTION
function restart() {
    location.reload();
}

// NEXT SECTION FUNCTION (You can customize this)
// function nextSection() {
//     // Play success sound
//     playCorrectSound();
    
//     // Show message or redirect to next page
//     alert("अगले भाग में आपका स्वागत है! 🎉");
//     // window.location.href = "next-page.html"; // Uncomment to redirect
// }

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) scale(1); }
        70% { opacity: 1; transform: translateX(-50%) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.9); visibility: hidden; }
    }
    
    @keyframes starPop {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        80% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .next-section-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 50px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        margin-left: 10px;
    }
    
    .next-section-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .finalpopup-box {
        background: white;
        padding: 40px;
        border-radius: 50px;
        width: 90%;
        max-width: 500px;
        text-align: center;
        
    }
    
   
    
    .medals {
        font-size: 50px;
        margin-bottom: 15px;
        
    }
    
   
    
    .final-heading {
        color: #ff4da0;
        font-size: 1.8rem;
        margin-bottom: 10px;
    }
    
    .final-sub {
        font-size: 1rem;
        color: #666;
        margin-bottom: 20px;
    }
    
    .final-buttons {
        margin-top: 25px;
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .playAgain-btn {
        background: linear-gradient(135deg, #ff4da0, #ff6b6b);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 50px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
    }
    
    .playAgain-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 77, 160, 0.4);
    }
`;
document.head.appendChild(style);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        location.reload();
    }, 500);
});

// Preload audio context on first user interaction
document.body.addEventListener('click', function initAudio() {
    // Create a silent audio context to enable audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    document.body.removeEventListener('click', initAudio);
}, { once: true });