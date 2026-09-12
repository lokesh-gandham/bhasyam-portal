const angleIcon = type => {
  const common='stroke="#71648f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const arc='stroke="#d7a45f" stroke-width="3" fill="none" stroke-linecap="round"';
  const svgs={
    complete:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="19" ${common}/><path d="M32 8l5 8-9 1" ${common}/><circle cx="32" cy="32" r="2.5" fill="#71648f"/></svg>`,
    zero:`<svg viewBox="0 0 64 64"><path d="M13 45L32 30L53 13" ${common}/><path d="M13 45L32 30L53 13" ${common}/><circle cx="32" cy="30" r="2.5" fill="#71648f"/></svg>`,
    reflex:`<svg viewBox="0 0 64 64"><path d="M12 46L31 31L51 39" ${common}/><path d="M48 37C43 15 18 13 12 38" ${arc}/><circle cx="31" cy="31" r="2.5" fill="#71648f"/></svg>`,
    obtuse:`<svg viewBox="0 0 64 64"><path d="M11 45L31 31L52 17" ${common}/><path d="M42 24Q31 18 20 37" ${arc}/><circle cx="31" cy="31" r="2.5" fill="#71648f"/></svg>`,
    acute:`<svg viewBox="0 0 64 64"><path d="M12 46L31 31L45 12" ${common}/><path d="M37 23Q32 20 25 36" ${arc}/><circle cx="31" cy="31" r="2.5" fill="#71648f"/></svg>`,
    right:`<svg viewBox="0 0 64 64"><path d="M13 48H32V13" ${common}/><path d="M32 36H24V44" ${arc}/><circle cx="32" cy="48" r="2.5" fill="#71648f"/></svg>`
  }; return svgs[type];
};

function polygonIcon(sides){
  const n=sides, cx=32, cy=32, r=22, pts=[];
  for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;pts.push(`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`)}
  return `<svg viewBox="0 0 64 64"><polygon points="${pts.join(' ')}" fill="#edf7f1" stroke="#71648f" stroke-width="3" stroke-linejoin="round"/></svg>`;
}

const sets=[
  {title:"Match Each Angle with Its Type",hint:"Use the size of the angle: acute is less than 90°, right is 90°, obtuse is between 90° and 180°, reflex is more than 180°, zero is 0°, and complete is 360°.",pairs:[
    {id:"a1",left:"90° < X < 180°",right:"Obtuse angle",visual:angleIcon('obtuse')},{id:"a2",left:"0° < X < 90°",right:"Acute angle",visual:angleIcon('acute')},{id:"a3",left:"90° = ∠AOB",right:"Right angle",visual:angleIcon('right')},{id:"a4",left:"180° < X < 270°",right:"Reflex angle",visual:angleIcon('reflex')},{id:"a5",left:"X = 0°",right:"Zero angle",visual:angleIcon('zero')},{id:"a6",left:"∠X = 360°",right:"Complete angle",visual:angleIcon('complete')}]},
  {title:"Match the Polygon Clues",hint:"Match each number or polygon name with the correct polygon name or number of equal sides.",pairs:[
    {id:"p1",left:"7",right:"Heptagon",visual:polygonIcon(7)},{id:"p2",left:"8",right:"Octagon",visual:polygonIcon(8)},{id:"p3",left:"10",right:"Decagon",visual:polygonIcon(10)},{id:"p4",left:"Square",right:"4 equal sides",visual:polygonIcon(4)},{id:"p5",left:"9",right:"Nonagon",visual:polygonIcon(9)},{id:"p6",left:"Regular pentagon",right:"5 equal sides",visual:polygonIcon(5)},{id:"p7",left:"4",right:"Quadrilateral",visual:polygonIcon(4)},{id:"p8",left:"6",right:"Hexagon",visual:polygonIcon(6)}]}
];

const rows=document.getElementById('rows'),board=document.getElementById('board'),svg=document.getElementById('lineCanvas'),title=document.getElementById('title'),setLabel=document.getElementById('setLabel'),nextBtn=document.getElementById('nextBtn'),hintBtn=document.getElementById('hintBtn'),hintOverlay=document.getElementById('hintOverlay'),hintText=document.getElementById('hintText'),closeHintBtn=document.getElementById('closeHintBtn'),correctSound=document.getElementById('correctSound'),wrongSound=document.getElementById('wrongSound');
let setIndex=0,selectedLeft=null,matches=0,connections=[],score=0,pairs=sets[0].pairs;
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function sound(a){a.currentTime=0;a.play().catch(()=>{})}
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-US";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}
function burst(){if(window.confetti)confetti({particleCount:34,spread:64,origin:{y:.72},scalar:.75})}
function bigBurst(){if(window.confetti){confetti({particleCount:150,spread:100,origin:{y:.55}});setTimeout(()=>confetti({particleCount:90,spread:70,origin:{y:.6}}),260)}}
function item(pair,type){const el=document.createElement('div');el.className=`match-item ${type==='left'?'left-item':'right-item'}`;el.dataset.pair=pair.id;el.dataset.type=type;if(type==='left')el.innerHTML=`<div class="left-content">${pair.left}</div><span class="dot"></span>`;else el.innerHTML=`<span class="dot"></span><div class="right-content"><span class="answer-visual">${pair.visual}</span><span class="answer-text">${pair.right}</span></div>`;return el}
function renderSet(){const set=sets[setIndex];pairs=set.pairs;title.textContent=set.title;setLabel.textContent=`Matching Set ${setIndex+1}`;hintText.textContent=set.hint;rows.innerHTML='';svg.innerHTML='';connections=[];selectedLeft=null;matches=0;nextBtn.classList.remove('show');nextBtn.hidden=true;rows.className=`rows ${set.pairs.length===8?'eight':'six'}`;const rights=shuffle(set.pairs);set.pairs.forEach((leftPair,i)=>{const row=document.createElement('div');row.className='match-row';const left=item(leftPair,'left'),center=document.createElement('div'),right=item(rights[i],'right');left.addEventListener('click',()=>selectLeft(left));right.addEventListener('click',()=>selectRight(right));row.append(left,center,right);rows.appendChild(row)})}
function selectLeft(el){if(el.classList.contains('matched'))return;document.querySelectorAll('.left-item.selected').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');selectedLeft=el}
function selectRight(el){if(el.classList.contains('matched')||!selectedLeft)return;if(el.dataset.pair===selectedLeft.dataset.pair){const left=selectedLeft;left.classList.remove('selected');left.classList.add('matched');el.classList.add('matched');selectedLeft=null;connections.push({left,right:el});drawConnection(left,el);matches++;score=matches;sound(correctSound);speak('Correct');burst();if(matches===sets[setIndex].pairs.length)setTimeout(completeSet,550)}else{el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong');sound(wrongSound);speak('wrong');setTimeout(()=>el.classList.remove('wrong'),430)}}
function drawConnection(left,right){const ld=left.querySelector('.dot').getBoundingClientRect(),rd=right.querySelector('.dot').getBoundingClientRect(),br=board.getBoundingClientRect(),x1=ld.left+ld.width/2-br.left,y1=ld.top+ld.height/2-br.top,x2=rd.left+rd.width/2-br.left,y2=rd.top+rd.height/2-br.top,m=(x1+x2)/2,p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M ${x1} ${y1} C ${m} ${y1}, ${m} ${y2}, ${x2} ${y2}`);p.setAttribute('fill','none');p.setAttribute('stroke','#9b8bb9');p.setAttribute('stroke-width','3');p.setAttribute('stroke-linecap','round');p.setAttribute('opacity','.76');svg.appendChild(p)}
function redraw(){svg.innerHTML='';connections.forEach(c=>drawConnection(c.left,c.right))}
function completeSet(){bigBurst();score=matches;if(setIndex===0){nextBtn.hidden=false;nextBtn.classList.add('show')}else showFinal()}
function showFinal(){document.getElementById('finalScore').textContent=`Your Score: ${score} / ${pairs.length}`;document.getElementById('stars').textContent='⭐⭐⭐';document.getElementById('finalPopup').style.display='flex';if(window.confetti){confetti({particleCount:150,spread:100,origin:{y:.5}});setTimeout(()=>confetti({particleCount:100,spread:70,origin:{y:.6}}),300)}}
nextBtn.addEventListener('click',()=>{if(setIndex!==0)return;nextBtn.hidden=true;nextBtn.classList.remove('show');setIndex=1;renderSet()});hintBtn.addEventListener('click',()=>hintOverlay.classList.add('show'));closeHintBtn.addEventListener('click',()=>hintOverlay.classList.remove('show'));hintOverlay.addEventListener('click',e=>{if(e.target===hintOverlay)hintOverlay.classList.remove('show')});document.getElementById('homeBtn').addEventListener('click',()=>{window.location.href='../Grade2_chapter1.html'});window.addEventListener('resize',()=>requestAnimationFrame(redraw));renderSet();
