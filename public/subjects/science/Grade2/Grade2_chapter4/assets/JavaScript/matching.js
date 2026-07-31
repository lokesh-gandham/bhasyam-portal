

let dragged = null;
let score = 0;
let matched = 0;

const pairs = [
  { l: "Natural-living thing", r: "Plant" },
  { l: "Man-made thing", r: "Book" },
  { l: "Natural non-living thing", r: "Sun" },
  
];
;

const images = {
  "Sun": "../assets/images/sunlight1.png",
  "Plant": "../assets/images/plant.png",
  "Book": "../assets/images/book.png",
  
};


const leftCol  = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");


// function speak(t){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }



function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // ?? lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
// function showPopup(isCorrect){
//   const popup = document.getElementById("answerPopup");
//   const icon = document.getElementById("popupIcon");
//   const title = document.getElementById("popupTitle");
//   const msg = document.getElementById("popupMsg");

//   popup.style.display = "flex";

//   if(isCorrect){
//     icon.textContent = "??";
//     title.textContent = "Correct!";
//     msg.textContent = "Well done!";
//   }else{
//     icon.textContent = "??";
//     title.textContent = "Wrong!";
//     msg.textContent = "Try again!";
//   }

//   setTimeout(()=>{
//     popup.style.display="none";
//   },1200);
// }

// function showFinal(){
//   const finalPopup = document.getElementById("finalPopup");
//   finalPopup.style.display = "flex";

//   document.getElementById("finalScore").textContent =
//     `Score: ${score}/${quizData.length}`;

//   document.getElementById("stars").textContent =
//     "?".repeat(score);
// }


function render(){
  leftCol.innerHTML="";
  rightCol.innerHTML="";

  // LEFT COLUMN
  pairs.forEach(p=>{
    const l = document.createElement("div");
    l.className = "item";
    l.textContent = p.l;
    // l.draggable = true;

    // l.ondragstart = ()=>{
    //   dragged = p;
    //   l.classList.add("dragging");
    // };
    // l.ondragend = ()=> l.classList.remove("dragging");
    l.onclick = ()=>{
  dragged = p;

  document.querySelectorAll(".left .item")
    .forEach(i=>i.classList.remove("drop-over"));

  l.classList.add("drop-over");
};


    leftCol.appendChild(l);
  });

  // RIGHT COLUMN
  // const shuffled = [...pairs].sort(() => Math.random() - 0.5);
  function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffled = shuffle([...pairs]);
shuffled.forEach(p=>{
    const r = document.createElement("div");
    r.className = "item";
    r.dataset.answer = p.r;
    r.innerHTML = `<img src="${images[p.r]}"><span>${p.r}</span>`;

    // r.ondragover = e=>{
    //   e.preventDefault();
    //   r.classList.add("drop-over");
    // };
    // r.ondragleave = ()=> r.classList.remove("drop-over");

    // r.ondrop = ()=>{

      r.onclick = ()=>{

      r.classList.remove("drop-over");

      if(dragged && dragged.r === p.r){
        r.classList.add("correct");

        [...leftCol.children].forEach(l=>{
  if(l.textContent === dragged.l){
    l.classList.add("correct");
    l.draggable = false;

    // add image on left item
    l.innerHTML = `
    <span>${dragged.l}</span>
    <img src="${images[p.r]}" style="width:60px;height:40px;" class="left-img">
    `;
  }
});


        score++;
        matched++;
        dragged = null;
        speak("Correct");
    // showPopup(true);

        if(matched === pairs.length){
          setTimeout(showFinal, 1100);
        }

      } else {
        r.classList.add("wrong");
        speak("Wrong");

        //  showPopup(false);

        setTimeout(()=> r.classList.remove("wrong"), 600);
      }
    };

    // ? APPEND HERE (correct place)
    rightCol.appendChild(r);
  });
}
function fireBigConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${pairs.length}`;

  document.getElementById("stars").textContent =
    "?".repeat(score);
     fireBigConfetti();
}
// function nextSection() {
  
//   document.getElementById("finalPopup").style.display = "none";

  
//   const frame = window.parent.document.querySelector("iframe[name='quiz-frame']");


//   frame.src = "exercises/fillblanks.html";

  
//   const links = window.parent.document.querySelectorAll(".sidebar a");
//   links.forEach(l => l.classList.remove("active"));
//   if (links[1]) links[1].classList.add("active");
// }
function nextSection() {
   document.getElementById("finalPopup").style.display = "none";

  // Works BOTH on server and file:// protocol
 window.parent.postMessage({ action: "nextSection", target: "fillblanks.html" }, "*");

  try {
    const parentDoc = window.parent.document;
    const frame = parentDoc.querySelector("iframe[name='quiz-frame']");

    if (frame) {
      frame.src = "exercises/matching.html";
      const links = parentDoc.querySelectorAll(".sidebar a");
      links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href")?.includes("fillblanks.html")) {
          link.classList.add("active");
        }
      });
    }

  } catch (e) {
    // file:// fallback — store target and reload parent
    sessionStorage.setItem("activeSection", "fillblanks.html");
    window.location.href = "../Grade2_lesson4.html";  // ? go to parent
  }
}


function restart(){
  score = 0;
  matched = 0;
  dragged = null;

  document.getElementById("finalPopup").style.display = "none";

  render();   // reload matching items
}

render();
//   function goHome(){
//   window.location.href = "../../index.html"; 
//   // or "../index.html" depending on your folder structure
// }

