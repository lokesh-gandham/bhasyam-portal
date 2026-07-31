const quizData = [
  {
    title: "Q1. Food makes us ________ and healthy.",
    image: "../assets/images/BoyFoodExited.png",
    options: [
      { text: "strong", img: "../assets/images/StrongMan.png" },
      { text: "weak", img: "../assets/images/WeakMan.png" },
      { text: "thin", img: "../assets/images/ThinMan.png" },
      { text: "tall", img: "../assets/images/TallMan.png" },
    ],
    answer: "strong",
  },
  {
    title: "Q2. We get pulses from ________.",
    image: "../assets/images/Pulsesak.png",
    options: [
      { text: "animals", img: "../assets/images/Sheepak.png" },
      { text: "plants", img: "../assets/images/Planttak.png" },
      { text: "birds", img: "../assets/images/bird-img.png" },
      { text: "insects", img: "../assets/images/Antt.png" },
    ],
    answer: "plants",
  },
  {
    title: "Q3. People eat ________ kinds of food.",
    image: "../assets/images/ChildMorning.png",
    options: [
      { text: "same", img: "../assets/images/same.png" },
      { text: "different", img: "../assets/images/Breakfastak.png" },
      { text: "two", img: "../assets/images/two.png" },
      { text: "five", img: "../assets/images/Snacksak.png" },
    ],
    answer: "different",
  },
  {
    title: "Q4. Vegetarians don't eat ________.",
    image: "../assets/images/VegGirl.png",
    options: [
      { text: "cereals", img: "../assets/images/careal.png" },
      { text: "vegetables", img: "../assets/images/vegetable.png" },
      { text: "fish", img: "../assets/images/fish.png" },
      { text: "fruits", img: "../assets/images/fruits-img.png" },
    ],
    answer: "fish",
  },
  {
    title: "Q5. We eat ________ meals a day.",
    image: "../assets/images/BoyFirstMeal.png",
    options: [
      { text: "three", img: "../assets/images/BoyF3.png" },
      { text: "two", img: "../assets/images/BoyF2.png" },
      { text: "four", img: "../assets/images/BoyF4.png" },
      { text: "seven", img: "../assets/images/boy-7.png" },
    ],
    answer: "three",
  },
];

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered: false,
  wrong: [],
}));

const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function preloadImages(callback) {
  const loader = document.getElementById("imgLoader");
  loader.textContent = "Loading images...";

  let images = [];

  quizData.forEach((q) => {
    images.push(q.image);
    q.options.forEach((opt) => {
      images.push(opt.img);
    });
  });

  let loaded = 0;

  images.forEach((src) => {
    const img = new Image();
    img.src = src;

    img.onload = img.onerror = () => {
      loaded++;

      if (loaded === images.length) {
        loader.textContent = "";
        callback();
      }
    };
  });
}

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;

  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");

    div.className = "option";

    div.innerHTML = `<img src="${opt.img}" class="option-img"> <span class="label">${opt.text}</span>`;

    if (state.answered) {
      div.classList.add("disabled");

      if (opt.text === q.answer) {
        div.classList.add("correct-lock");
      } else {
        div.classList.add("wrong-faded");
      }
    }

    if (state.wrong.includes(opt.text)) {
      div.classList.add("wrong-faded");
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}

function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  if (selected === correct) {
    state.answered = true;
    score++;

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");

      if (o !== optionDiv) {
        o.classList.add("wrong-faded");
      }

      o.onclick = null;
    });

    optionDiv.classList.add("correct-lock");

    nextBtn.disabled = false;

    speak("Correct");

    showPopup(true);

    fireConfetti();

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");

    optionDiv.classList.add("wrong-shake");
    optionDiv.classList.add("wrong-faded");

    state.wrong.push(selected);

    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);
  }
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");

  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "????";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "????";
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "?".repeat(score);

  popup.style.display = "flex";
  fireConfettif();
}

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

preloadImages(loadQuestion);
