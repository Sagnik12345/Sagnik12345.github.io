(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);
// typed tagline
const lines=["Experimental & computational physics","Theoretical physics","Quantum simulation · Quantum ML","Detectors, simulations & robots"];
const tEl=$('#typed');
if(RM)tEl.textContent=lines[0];else{let li=0,ci=0,del=false;(function type(){const s=lines[li];tEl.textContent=s.slice(0,ci);
 if(!del&&ci++===s.length){del=true;return setTimeout(type,1800)}
 if(del&&ci--===0){del=false;li=(li+1)%lines.length;ci=0}
 setTimeout(type,del?26:55)})()}
// toast
const toastEl=$('#toast');let tt;function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),2600)}
// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.pop').forEach(el=>io.observe(el));
document.querySelectorAll('.nav ul a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('open')));

// ---------- physics toy box ----------
const cv=$('#toy'),x=cv.getContext('2d'),hero=$('.hero'),atomEl=$('#atom'),hint=$('#hint');
const INK='#1d1a2f',COLS=['#ffd23f','#ff5d8f','#4d96ff','#2ec4a6','#ff8c42','#9b5de5'];
let W,H,D=Math.min(devicePixelRatio||1,2),mobile;
function rs(){W=innerWidth;H=innerHeight;mobile=W<860;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0)}
addEventListener('resize',rs);rs();
let G=0.45; // px/frame^2
const balls=[];
function addBall(px,py,r){const c=COLS[balls.length%COLS.length];balls.push({x:px,y:py,vx:(Math.random()-.5)*6,vy:-Math.random()*4,r:r||(mobile?16:20)+Math.random()*(mobile?10:16),c,label:['e⁻','p⁺','n','γ','ν','μ'][balls.length%6]})}
const nB=mobile?4:6;for(let i=0;i<nB;i++)addBall(W*(.15+.7*Math.random()),H*.2*Math.random());
// doodle equations
const EQ=['E=mc²','ψ','F=ma','ħ','iħ∂ψ/∂t = Ĥψ','Δx·Δp ≥ ħ/2','λ = h/p','∇·E = ρ/ε₀','PV=nRT','e^iπ + 1 = 0'];
const eqs=EQ.slice(0,mobile?6:10).map((s,i)=>({s,x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.2,a:Math.random()*6.28,sz:mobile?16:18+Math.random()*10,c:COLS[i%6]}));
// pendulum (state in angle)
const pend={th:0.6,w:0,L:0,drag:false};
let drag=null,lastP=null,zeroG=false,flipped=false,quantum=false,t=0,moved=false;

function outline(){x.lineWidth=3;x.strokeStyle=INK;x.stroke()}
function drawBall(b){x.beginPath();x.arc(b.x+3,b.y+3,b.r,0,7);x.fillStyle=INK;x.fill();
 x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fillStyle=b.c;x.fill();outline();
 x.beginPath();x.arc(b.x-b.r*.35,b.y-b.r*.35,b.r*.22,0,7);x.fillStyle='#ffffffcc';x.fill();
 x.fillStyle=INK;x.font=`700 ${b.r*.75|0}px Fredoka,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(b.label,b.x,b.y+1)}
function pivot(hr){return mobile?{x:W-34,y:hr.top+70}:{x:Math.min(W-60,hr.right-30),y:hr.top+84}}
function step(){
 const hr=hero.getBoundingClientRect();
 // equations
 for(const e of eqs){e.x+=e.vx;e.y+=e.vy;e.a+=.01;if(e.x<-120)e.x=W+20;if(e.x>W+120)e.x=-20;if(e.y<-40)e.y=H+20;if(e.y>H+40)e.y=-20}
 // balls
 const g=zeroG?0:(flipped?-G:G);
 for(const b of balls){if(b===drag)continue;b.vy+=g;b.vx*=.996;b.vy*=.996;b.x+=b.vx;b.y+=b.vy;
  if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.8}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*.8}
  if(b.y>H-b.r){b.y=H-b.r;b.vy=-Math.abs(b.vy)*.78;b.vx*=.97}if(b.y<b.r+70){b.y=b.r+70;b.vy=Math.abs(b.vy)*.78}}
 for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;
  if(d>0&&d<m){const nx=dx/d,ny=dy/d,o=(m-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;
   const p=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(p>0){a.vx-=p*nx*.9;a.vy-=p*ny*.9;b.vx+=p*nx*.9;b.vy+=p*ny*.9}}}
 // pendulum
 pend.L=mobile?110:Math.min(200,hr.height*.26);
 if(!pend.drag){const gg=zeroG?0:(flipped?-1:1)*0.0045*220/pend.L*1.6;pend.w+=-gg*Math.sin(pend.th);pend.w*=.9992;pend.th+=pend.w}
 const pv=pivot(hr),bob={x:pv.x+pend.L*Math.sin(pend.th),y:pv.y+pend.L*Math.cos(pend.th),r:mobile?18:24};pend.bob=bob;pend.pv=pv;
 // balls knock the bob
 for(const b of balls){const dx=b.x-bob.x,dy=b.y-bob.y,d=Math.hypot(dx,dy);if(d>0&&d<b.r+bob.r){const nx=dx/d,ny=dy/d;b.x=bob.x+nx*(b.r+bob.r);b.y=bob.y+ny*(b.r+bob.r);
  const p=b.vx*nx+b.vy*ny;if(p<0){b.vx-=1.6*p*nx;b.vy-=1.6*p*ny;pend.w+=p*.004*Math.cos(pend.th)*(nx>0?1:-1)}}}
 t+=1;draw(hr)}
function draw(hr){
 x.clearRect(0,0,W,H);
 // doodles
 x.textAlign='center';x.textBaseline='middle';
 for(const e of eqs){x.save();x.translate(e.x,e.y);x.rotate(Math.sin(e.a)*.15);x.font=`700 ${e.sz}px "Comic Neue",cursive`;x.globalAlpha=.35;x.lineWidth=4;x.strokeStyle='#fff';x.strokeText(e.s,0,0);x.fillStyle=e.c;x.globalAlpha=.55;x.fillText(e.s,0,0);x.restore()}
 x.globalAlpha=1;
 // wobbly sine along hero bottom
 if(hr.bottom>0){const y0=hr.bottom-18;x.beginPath();for(let i=0;i<=W;i+=8){const y=y0+8*Math.sin(i*.025-t*.06)*Math.sin(i*.004+t*.01);i?x.lineTo(i,y):x.moveTo(i,y)}x.lineWidth=4;x.strokeStyle=INK;x.lineCap='round';x.stroke();x.lineWidth=2;x.strokeStyle='#ff5d8f';x.stroke()}
 // atom orbits
 const ar=atomEl.getBoundingClientRect();
 if(ar.bottom>0&&ar.top<H){const cx=ar.left+ar.width/2,cy=ar.top+ar.height/2,R=ar.width*.44,r=R*.36,ec=['#4d96ff','#2ec4a6','#ff8c42'];
  for(let k=0;k<3;k++){const rot=k*Math.PI/3;x.save();x.translate(cx,cy);x.rotate(rot);x.beginPath();x.ellipse(0,0,R,r,0,0,7);x.lineWidth=3;x.strokeStyle=INK;x.stroke();
   const sp=[.035,-.045,.028][k]*(quantum?4:1),ph=t*sp+k*2;
   const ghosts=quantum?5:1;for(let gI=0;gI<ghosts;gI++){const p=ph-gI*.25;x.globalAlpha=quantum?(1-gI/ghosts)*.8:1;
    x.beginPath();x.arc(R*Math.cos(p),r*Math.sin(p),ar.width*.045,0,7);x.fillStyle=ec[k];x.fill();x.lineWidth=2.5;x.stroke()}
   x.globalAlpha=1;x.restore()}}
 // pendulum
 const pv=pend.pv,bob=pend.bob;if(pv&&pv.y<H+50&&bob.y>-50){
  x.beginPath();x.moveTo(pv.x-18,pv.y);x.lineTo(pv.x+18,pv.y);x.lineWidth=5;x.strokeStyle=INK;x.lineCap='round';x.stroke();
  x.beginPath();x.moveTo(pv.x,pv.y);x.lineTo(bob.x,bob.y);x.lineWidth=3;x.stroke();
  x.beginPath();x.arc(bob.x+3,bob.y+3,bob.r,0,7);x.fillStyle=INK;x.fill();x.beginPath();x.arc(bob.x,bob.y,bob.r,0,7);x.fillStyle='#ffd23f';x.fill();outline();
  x.fillStyle=INK;x.font=`700 ${bob.r*.8|0}px Fredoka,sans-serif`;x.fillText('m',bob.x,bob.y+1)}
 for(const b of balls)drawBall(b)}
window.__toy={balls,pend};let raf=0;function loop(){step();raf=requestAnimationFrame(loop)}
function start(){if(!raf&&!RM)raf=requestAnimationFrame(loop)}function stop(){cancelAnimationFrame(raf);raf=0}
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
if(RM){pend.pv=pivot(hero.getBoundingClientRect());step();addEventListener('scroll',()=>draw(hero.getBoundingClientRect()),{passive:true})}else start();
if(document.fonts)document.fonts.ready.then(()=>RM&&draw(hero.getBoundingClientRect()));

// pointer: grab balls / pendulum bob
const blocked=el=>el.closest('a,button,input,textarea,.card,.panel,.ti,.links,.cvbox,.facts,.nav,.quote');
addEventListener('pointerdown',e=>{if(RM||blocked(e.target))return;const px=e.clientX,py=e.clientY;
 const b=balls.find(b=>Math.hypot(b.x-px,b.y-py)<b.r+8);
 if(b){drag=b}else if(pend.bob&&Math.hypot(pend.bob.x-px,pend.bob.y-py)<pend.bob.r+10){drag=pend;pend.drag=true}else return;
 lastP={x:px,y:py,t:performance.now(),vx:0,vy:0};e.preventDefault();if(!moved){moved=true;hint.classList.add('gone')}});
addEventListener('pointermove',e=>{if(!drag)return;const now=performance.now(),dt=Math.max(1,now-lastP.t)/16.7;
 lastP.vx=(e.clientX-lastP.x)/dt;lastP.vy=(e.clientY-lastP.y)/dt;lastP.x=e.clientX;lastP.y=e.clientY;lastP.t=now;
 if(drag===pend){const pv=pend.pv;const nt=Math.atan2(e.clientX-pv.x,e.clientY-pv.y);pend.w=nt-pend.th;pend.th=nt}else{drag.x=e.clientX;drag.y=e.clientY}});
function end(){if(!drag)return;if(drag===pend){pend.drag=false;pend.w=Math.max(-.25,Math.min(.25,pend.w))}else{drag.vx=Math.max(-40,Math.min(40,lastP.vx));drag.vy=Math.max(-40,Math.min(40,lastP.vy))}drag=null}
addEventListener('pointerup',end);addEventListener('pointercancel',end);
document.addEventListener('touchmove',e=>{if(drag)e.preventDefault()},{passive:false});
// double-click / double-tap empty space → new particle
addEventListener('dblclick',e=>{if(RM||blocked(e.target))return;if(balls.length<14){addBall(e.clientX,e.clientY);toast('Pair production! A new particle popped into existence ✨')}else toast('Conservation of energy says that\'s enough particles 😅')});

// ---------- easter eggs ----------
atomEl.addEventListener('click',()=>{quantum=!quantum;atomEl.classList.toggle('quantum',quantum);
 toast(quantum?'Uncertainty mode ON: where are the electrons now? Nobody knows 🤷':'Wavefunction collapsed. Back to normal!')});
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;
 if(e.key==='g'||e.key==='G'){zeroG=!zeroG;if(!zeroG)balls.forEach(b=>b.vy+=1);else balls.forEach(b=>{b.vx+=(Math.random()-.5)*6;b.vy-=Math.random()*6});toast(zeroG?'Zero-g! Welcome to the ISS 🚀':'Gravity is back. Thanks, Newton 🍎')}});
const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;
addEventListener('keydown',e=>{ki=(e.key===K[ki]||e.key.toLowerCase()===K[ki])?ki+1:(e.key===K[0]?1:0);if(ki===K.length){ki=0;flipped=!flipped;document.body.classList.toggle('flip',flipped);toast(flipped?'Gravity reversed! Somebody call Einstein 🙃':'Phew, gravity points down again.')}});
let lc=0,lt=0;$('.logo').addEventListener('click',()=>{const n=performance.now();lc=n-lt<600?lc+1:1;lt=n;if(lc>=5){lc=0;for(let i=0;i<6&&balls.length<20;i++)addBall(W*Math.random(),90);toast('Particle shower incoming! ☄️')}});
console.log('%cHey, curious physicist! 👋 Try: G for zero-g, double-click to create particles, tap the atom, or the Konami code.','font:16px sans-serif;color:#ff5d8f');
})();
