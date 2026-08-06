

let dragged = null;
let score = 0;
let matched = 0;

const pairs = [
  { l: "Ball and socket joint", r: "Hips" },
  { l: "Hinge joint ", r: "Elbows" },
  { l: "Pivot joint", r: "Skull and the first two vertebrae of the spine" },
  { l: "Gliding joint", r: "Wrist" }
];
;

const images = {
  "Elbows": "../assets/images/elbow.png",
  "Skull and the first two vertebrae of the spine": "../assets/images/pivotjoint.png",
  "Wrist": "../assets/images/writst.png",
  "Hips": "../assets/images/hips.png",
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
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
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
//     icon.textContent = "🎉";
//     title.textContent = "Correct!";
//     msg.textContent = "Well done!";
//   }else{
//     icon.textContent = "😔";
//     title.textContent = "Wrong!";
//     msg.textContent = "Try again!";
//   }

//   setTimeout(()=>{
//     popup.style.display="none";
//   },1200);
// }

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}


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
  [...pairs].sort(()=>Math.random()-0.5).forEach(p=>{
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
     fireConfetti();

        if(matched === pairs.length){
          setTimeout(finalPopup, 1100);
        }

      } else {
        r.classList.add("wrong");
        speak("Wrong");

        //  showPopup(false);

        setTimeout(()=> r.classList.remove("wrong"), 600);
      }
    };

    // ✅ APPEND HERE (correct place)
    rightCol.appendChild(r);
  });
}

function finalPopup(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${pairs.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif();
}

function restart(){
  score = 0;
  matched = 0;
  dragged = null;

  document.getElementById("finalPopup").style.display = "none";

  render();   // reload matching items
}





function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 140,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 }
  });
}


render();
//   function goHome(){
//   window.location.href = "../../index.html"; 
//   // or "../index.html" depending on your folder structure
// }

