const questions = [
  {
    text: "Q1. Kutcha houses are not cooler compared to pucca houses.",
    answer: false,
    img: "../images/TF-1.png"
  },
  {
    text: "Q2. 15 major kinds of mineral deposits are found in desert regions.",
    answer: false,
    img: "../images/minerals.png"
  },
  {
    text: "Q3. People in the deserts use less water for their day-to-day needs.",
    answer: true,
    img: "../images/save-water.png"
  },
  {
    text: "Q4. Diamond is a semi-precious gemstone.",
    answer: false,
    img: "../images/w.png"
  },
  {
    text: "Q5. Desert regions are either too hot or too cold.",
    answer: true,
    img: "../images/sahara.png"
  },
];
function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    scalar: 1
  });

  // Small second burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.5 },
      scalar: 0.8
    });
  }, 180);
}



let index = 0;
let score = 0;
const solvedMap = {};

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");

const btnTrue = document.getElementById("btnTrue");
const btnFalse = document.getElementById("btnFalse");
const nextBtn = document.getElementById("nextBtn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// function speak(text) {
//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

// function speak(t) {
//   if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

//   window.speechSynthesis.cancel();

//   const msg = new SpeechSynthesisUtterance(t);
//   msg.lang = "en-GB";
//   msg.volume = 1;
//   msg.rate = 1;
//   msg.pitch = 1;

//   window.speechSynthesis.speak(msg);
// }

// function playFeedback(isCorrect) {
//   speak(isCorrect ? "Correct" : "Wrong");

//   const sound = isCorrect ? correctSound : wrongSound;
//   if (sound) {
//     sound.currentTime = 0;
//     const playPromise = sound.play();
//     if (playPromise) playPromise.catch(() => {});
//   }

// }
function playFeedback(isCorrect) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(
    isCorrect ? "Correct!" : "Try again"
  );

  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = isCorrect ? 1.2 : 0.9;

  window.speechSynthesis.speak(msg);
}
speechSynthesis.getVoices();

speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

    function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-US";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }
function render() {
  qText.textContent = questions[index].text;
  qImg.src = questions[index].img;

  // Reset UI states
 
  btnTrue.className = "btn true";
  btnFalse.className = "btn false";
// Prev button
document.getElementById("prevBtn").disabled = index === 0;

// Next button enabled only if question solved
nextBtn.disabled = !solvedMap[index];


  if (solvedMap[index]) {
    const q = questions[index];

    if (q.answer === true) {
      btnTrue.classList.add("correct", "no-click");
      btnFalse.classList.add("disabled-look");
    } else {
      btnFalse.classList.add("correct", "no-click");
      btnTrue.classList.add("disabled-look");
    }

   
  }
}


function answer(val) {
  if (solvedMap[index]) return;
  const correct = questions[index].answer;

  if (val === correct) {
    fireConfetti()
    solvedMap[index] = true;
    score++;
    speak("Correct");
    showPopup(true);

    // Trigger the fill animation
 

    // if (val) {
    //   btnTrue.classList.add("correct", "no-click");
    //   btnFalse.classList.add("disabled-look");
    // } else {
    //   btnFalse.classList.add("correct", "no-click");
    //   btnTrue.classList.add("disabled-look");
    // }
    if (correct === true) {
  btnTrue.classList.add("correct", "no-click");
  btnFalse.classList.add("disabled-look");
} else {
  btnFalse.classList.add("correct", "no-click");
  btnTrue.classList.add("disabled-look");
}


    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    } else {
      nextBtn.disabled = false;
    }
  } else {
     speak("Try again");
    showPopup(false);
    const btn = val ? btnTrue : btnFalse;
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 400);
  }
}

function next() {
  if (index < questions.length - 1) {
    index++;
    render();
  }
}
function prev() {
  if (index > 0) {
    index--;
    render();
  }
}

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

// function showFinal() {
//     console.log("showFinal");

//     const finalPopup = document.getElementById("finalPopup");
//     const finalScore = document.getElementById("finalScore");
//     const stars = document.getElementById("stars");

//     console.log(finalPopup);
//     console.log(finalScore);
//     console.log(stars);
//     console.log(score);

//     finalPopup.style.display = "flex";
//     finalScore.textContent = `You scored ${score} out of ${questions.length}`;
//     stars.textContent = "⭐".repeat(score);
    
// }
function showFinal() {
    console.log("showFinal");

    const finalPopup = document.getElementById("finalPopup");
    const finalScore = document.getElementById("finalScore");
    const stars = document.getElementById("stars");

    finalPopup.style.display = "flex";

    finalScore.textContent = `You scored ${score} out of ${questions.length}`;
    stars.textContent = "⭐".repeat(score);

    // 🎉 Final popup confetti
    const duration = 2200;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 6,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 6,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

render();
