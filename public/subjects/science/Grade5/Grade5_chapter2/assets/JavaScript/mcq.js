
    // const correctSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3");
    // const wrongSound   = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3");

    // function speakText(text){
    //   if(!("speechSynthesis" in window)) return;
    //   window.speechSynthesis.cancel();
    //   const utter = new SpeechSynthesisUtterance(text);
    //   utter.rate = 1;
    //   utter.pitch = 1.08;
    //   utter.volume = 1;
    //   window.speechSynthesis.speak(utter);
    // }

    function speakText(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // ?? lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

const quizData = [

{
  title: "Correct Option",
  question: "Q1. The __________ is the part of the brain which controls the heartbeat.",
  image: "../assets/images/hearcontroll.png",
  options: [
    { id: "a", label: "Cerebrum", image: "../assets/images/Cerebrums.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "Cerebellum", image: "../assets/images/cerebellumak.png", correct: false, theme: "bg-orange" },
    { id: "c", label: "Medulla", image: "../assets/images/medulla2.png", correct: true, theme: "bg-green" },
    { id: "d", label: "Spinal cord", image: "../assets/images/spinal-cord.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  title: "Correct Option",
  question: "Q2. The organ which is enclosed in the skull is the __________.",
  image: "../assets/images/skulll.png",
  options: [
    { id: "a", label: "Head", image: "../assets/images/head.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "Brain", image: "../assets/images/brain.png", correct: true, theme: "bg-green" },
    { id: "c", label: "Cerebrum", image: "../assets/images/cerebrum.png", correct: false, theme: "bg-orange" },
    { id: "d", label: "Medulla", image: "../assets/images/medulla.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  title: "Correct Option",
  question: "Q3. The __________ help keep the dust and dirt out of the eye.",
  image: "../assets/images/eyeprotector.png",
  options: [
    { id: "a", label: "Cornea", image: "../assets/images/cornea.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "Eyelids", image: "../assets/images/eyelids.png", correct: true, theme: "bg-green" },
    { id: "c", label: "Iris", image: "../assets/images/iris.png", correct: false, theme: "bg-orange" },
    { id: "d", label: "Eyeballs", image: "../assets/images/eyeballs.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  title: "Correct Option",
  question: "Q4. The part of the ear that amplifies the sound is the __________.",
  image: "../assets/images/amplifiessound.png",
  options: [
    { id: "a", label: "Middle ear", image: "../assets/images/middleear.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "Inner ear", image: "../assets/images/innerear.png", correct: false, theme: "bg-orange" },
    { id: "c", label: "Outer ear", image: "../assets/images/outerear.png", correct: false, theme: "bg-yellow" },
    { id: "d", label: "Eardrum", image: "../assets/images/eardrum.png", correct: true, theme: "bg-green" },
  ]
},

{
  title: "Correct Option",
  question: "Q5. The __________ protects the pupil and the iris.",
  image: "../assets/images/protectspupilandiris.png",
  options: [
    { id: "a", label: "Cornea", image: "../assets/images/cornea.png", correct: true, theme: "bg-green" },
    { id: "b", label: "Eyelash", image: "../assets/images/eyelash.png", correct: false, theme: "bg-blue" },
    { id: "c", label: "Lens", image: "../assets/images/lens.png", correct: false, theme: "bg-orange" },
    { id: "d", label: "Eyelid", image: "../assets/images/eyelid.png", correct: false, theme: "bg-yellow" },
  ]
}

];
    let current = 0;
    let score = 0;
    const solvedMap = {};

    const quizTitleEl = document.getElementById("quizTitle");
    const questionTextEl = document.getElementById("questionText");
    const questionImageEl = document.getElementById("questionImage");
    const optionsWrapEl = document.getElementById("optionsWrap");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    const popup = document.getElementById("popup");
    const popupBox = document.getElementById("popupBox");

    function showPopup(html, final=false){
      popup.style.display = "flex";
      popupBox.className = final ? "popup-box popup-final" : "popup-box";
      popupBox.innerHTML = html;
      if(!final) setTimeout(() => popup.style.display = "none", 1000);
    }

    function renderQuestion(){
      const q = quizData[current];
      const solved = solvedMap[current]?.solved === true;
      const correctId = solvedMap[current]?.correctId || null;

      quizTitleEl.textContent = q.title;
      questionTextEl.textContent = q.question;
      questionImageEl.src = q.image;

      prevBtn.disabled = current === 0;
      nextBtn.disabled = !solved;

      optionsWrapEl.innerHTML = "";

      q.options.forEach(opt => {
        const optionDiv = document.createElement("div");
        optionDiv.className = `option ${opt.theme}`;

     optionDiv.innerHTML = `
  <div class="opt-top">
    <img src="${opt.image}" class="opt-img">
  </div>
  <div class="opt-name">${opt.label}</div>
`;



        if(solved){
          optionDiv.classList.add("disabled");
          if(opt.id === correctId){
            optionDiv.classList.remove("disabled");
            optionDiv.classList.add("correct-highlight");
          }
        }

        optionDiv.addEventListener("click", () => selectOption(opt));
        optionsWrapEl.appendChild(optionDiv);
      });
    }

    function selectOption(opt){
      if(solvedMap[current]?.solved) return;

      if(opt.correct){
        solvedMap[current] = { solved:true, correctId: opt.id };
        score++;

        speakText("Correct");
        correctSound.currentTime = 0;
        correctSound.play();

       showPopup(`
  <div class="popup-correct">
    <span class="check">? Correct</span>
    <span class="happy">??</span>
    <div class="stars">${"?".repeat(score)}</div>
  </div>
`);
  fireConfetti();


        renderQuestion();

        if(current === quizData.length - 1){
          setTimeout(() => {
               fireConfettif(); 
            showPopup(`
          <div class="popup-final-content">
            ?? Congratulations!
            <span class="emoji">??</span>
             <div>You finished the quiz!</div>
            <div class="final-score">
              Score: 5/5
            </div>

            <div class="stars">?????</div>

             <div class="final-actions">
            <button class="restart" onclick="location.reload()">?? Restart</button>
           <button class="home" onclick="goHome()">?? Home</button>
          </div>
          </div>
        `, true);
          }, 1100);
        }
      

      } else {
        speakText("Wrong");
        wrongSound.currentTime = 0;
        wrongSound.play();

        showPopup(`
          <div>
            <div class="popup-title" style="color:#c62828;">? Wrong!</div>
            <span class="popup-emoji">??</span>
            <div class="popup-tip">?? Try again!</div>
          </div>
        `);
      }
    }

    prevBtn.addEventListener("click", () => {
      if(current > 0){
        current--;
        renderQuestion();
      }
    });

    nextBtn.addEventListener("click", () => {
      if(!solvedMap[current]?.solved) return;
      if(current < quizData.length - 1){
        current++;
        renderQuestion();
      }
    });


function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}




    renderQuestion();
  function goHome() {
  window.location.href = "../index.html";
}
