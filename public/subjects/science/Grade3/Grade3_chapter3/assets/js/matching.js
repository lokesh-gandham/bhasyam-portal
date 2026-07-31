
let selected=null
let score=0
let matchNumber = 1;
const left=document.querySelectorAll("#left .box")
const right=document.querySelectorAll("#right .box")
const svg=document.getElementById("lines")



function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

left.forEach(l=>{

l.onclick=()=>{

if(l.classList.contains("matched")) return

left.forEach(i=>i.classList.remove("selected"))
l.classList.add("selected")

selected=l

}

})


right.forEach(r=>{

r.onclick=()=>{

if(!selected) return

if(r.dataset.match===selected.dataset.match){

launchConfetti();
speak("Correct")

const num = selected.dataset.match

addNumber(selected, num)
addNumber(r, num)

selected.classList.add("matched")
r.classList.add("matched")

/* DRAW LINE ONLY DESKTOP */
if(window.innerWidth > 900){
drawLine(selected, r)
}

score++;

if(score===5){
setTimeout(()=>{
document.getElementById("final").style.display="block"
document.getElementById("score").innerText="Your Score 5/5"
launchConfetti(); 
},1000)
}
}else{


speak("Wrong")

}

selected.classList.remove("selected")
selected=null

}

})


function addNumber(el, num){
    const badge = document.createElement("span")
    badge.innerText = num
    badge.classList.add("match-number")
    el.appendChild(badge)
}

function drawLine(a,b){

const rectA=a.querySelector(".dot").getBoundingClientRect()
const rectB=b.querySelector(".dot").getBoundingClientRect()

const svgRect=svg.getBoundingClientRect()

const x1=rectA.left-svgRect.left
const y1=rectA.top-svgRect.top+7

const x2=rectB.left-svgRect.left
const y2=rectB.top-svgRect.top+7

const path=document.createElementNS("http://www.w3.org/2000/svg","path")

const curve=`M${x1},${y1} C${x1+150},${y1} ${x2-150},${y2} ${x2},${y2}`

path.setAttribute("d",curve)
path.setAttribute("stroke","#5dd532")
path.setAttribute("stroke-width","3")
path.setAttribute("fill","none")

svg.appendChild(path)

}

function playAgain(){
location.reload()
}
