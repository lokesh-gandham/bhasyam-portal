const quizData = [

{
  q: "Q1.The ________ is a natural source of light.",
  img: "../assets/images/candil.png",
  options: [
    "../assets/images/sun.png|Sun",
    "../assets/images/lightbulb.png|bulb",
    "../assets/images/candle.png|candle",
    "../assets/images/tube_light.png|tube light",
  ],
  a: 0
},

{
  q: "Q2. When air has been removed completely from a container, it is said that there is ________ in it.",
  img: "../assets/images/noaircontainer.png",
  options: [
    "../assets/images/Gasesak.png|gas",
    "../assets/images/vacuum.png|vacuum",
    "../assets/images/liquid.png|liquid",
    "../assets/images/none1.png|none of these",
  ],
  a: 1
},

{
  q: "Q3. Magnets have two poles, namely a north pole and a ________ pole.",
  img: "../assets/images/magnet.png",
  options: [
    "../assets/images/east.png|east",
    "../assets/images/west.png|west",
    "../assets/images/south.png|south",
    "../assets/images/none1.png|none of these",
  ],
  a: 2
},

{
  q: "Q4. The shape of the ________ part of the ear is like a funnel.",
  img: "../assets/images/funnel.png",
  options: [
    "../assets/images/middleear.png|middle",
    "../assets/images/outerear.png|outer",
    "../assets/images/innerear.png|inner",
    "../assets/images/alltheabove.png|all the above",
  ],
  a: 1
},

{
  q: "Q5. Sound vibrations make the ________ vibrate.",
  img: "../assets/images/soundvibrations.png",
  options: [
    "../assets/images/innerear.png|inner ear",
    "../assets/images/middleear.png|middle ear",
    "../assets/images/outerear.png|outer ear",
    "../assets/images/eardrum.png|eardrum",
  ],
  a: 3
}

];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  const duration = 100;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option";

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `
<div class="option-img"><img src="${img}"></div>
<div class="option-text">${text}</div>`;

    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");

        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);

        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
      } else {
        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);

        speak("Wrong");
        showPopup(false);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
  icon.textContent = "👍";
  title.textContent = "Good";
  msg.textContent = "Correct choice.";
} else {
  icon.textContent = "👎";
  title.textContent = "Retry";
  msg.textContent = "Pick again.";
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";

  bigConfetti();
}

loadQuestion();
