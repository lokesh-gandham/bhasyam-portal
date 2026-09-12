const P={"51": [523.5, 81], "52": [536, 117], "53": [552.5, 133], "54": [576.25, 170.08], "55": [597.2, 114], "56": [671, 41], "57": [788, 6.8], "58": [842, 101.5], "59": [823, 186], "60": [776.5, 122], "61": [685, 156.5], "62": [607, 214], "63": [633.3, 260], "64": [650.1, 312.1], "65": [644, 362], "66": [604.1, 407.1], "67": [652.6, 448.6], "68": [693, 479], "69": [722.9, 519.7], "70": [762.8, 505], "71": [765.5, 525], "72": [797.6, 542.2], "73": [773.1, 565.9], "74": [773.7, 600], "75": [735.9, 593.1], "76": [707, 654], "77": [630, 690], "78": [577, 679],"79": [520, 703], "80": [503, 710.2], "81": [438, 618.5], "82": [412, 561.9], "83": [413, 529], "84": [416.8, 493.2], "85": [425, 467], "86": [423, 434], "87": [363.5, 387], "88": [333.2, 333.5], "89": [339, 269], "90": [382.3, 205], "91": [453.7, 146.7], "92": [409, 100], "93": [359.5, 128], "94": [283.9, 182.9], "95": [199, 184.3], "96": [208, 113.5], "97": [309.5, 53], "98": [385.4, 44.5], "99": [443, 67], "100": [477, 136.5]};
const START=51, END=100, HIT=15;
const svg=document.querySelector("#svg"), lines=document.querySelector("#lines");
const targets=document.querySelector("#targets"), counter=document.querySelector("#counter");
const success=document.querySelector("#success");

let next=START, previous=null;

function el(tag,a={}) {
 const x=document.createElementNS("http://www.w3.org/2000/svg",tag);
 Object.entries(a).forEach(([k,v])=>x.setAttribute(k,v));
 return x;
}
function pt(n){return P[n]}
function draw(a,b){
 lines.appendChild(el("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1]}));
}
function refresh(){
 counter.textContent=next<=END?`${next} / 100`:"100 / 100";
 document.querySelectorAll(".target").forEach(t=>{
   t.classList.toggle("active",Number(t.dataset.n)===next);
 });
}
function connect(n){
 if(n!==next||next>END)return;
 const p=pt(n);
 if(previous)draw(previous,p);
 previous=p;
 next++;
 refresh();
 if(next>END)success.classList.add("show");
}
function build(){
 for(let n=START;n<=END;n++){
   const p=pt(n);
   const t=el("circle",{class:"target",cx:p[0],cy:p[1],r:HIT,"data-n":n});
   t.addEventListener("pointerdown",e=>{e.preventDefault();connect(n)});
   targets.appendChild(t);
 }
}

function reset(){
 next=START;previous=null;lines.innerHTML="";
 success.classList.remove("show");refresh();
}
document.querySelector("#reset").onclick=reset;
document.querySelector("#again").onclick=reset;
build();refresh();
