// typing tagline
const lines=["Experimental & computational physics","Theoretical physics","Quantum simulation · Quantum ML","Detectors, simulations & robots"];
const el=document.getElementById('typed');let li=0,ci=0,del=false;
(function type(){const s=lines[li];el.textContent=s.slice(0,ci);
 if(!del&&ci++===s.length){del=true;return setTimeout(type,1700)}
 if(del&&ci--===0){del=false;li=(li+1)%lines.length;ci=0}
 setTimeout(type,del?28:60)})();
// quantum-wave canvas
const c=document.getElementById('wave'),x=c.getContext('2d');let W,H,t=0,pts=[];
function rs(){W=c.width=c.offsetWidth*devicePixelRatio;H=c.height=c.offsetHeight*devicePixelRatio;
 pts=Array.from({length:Math.min(70,W/25|0)},()=>({x:Math.random()*W,y:Math.random()*H,v:(Math.random()-.5)*.4,r:Math.random()*1.6+.4}))}
addEventListener('resize',rs);rs();
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){x.clearRect(0,0,W,H);
 for(let k=0;k<3;k++){x.beginPath();const amp=H*.06*(1+k*.4),y0=H*(.62+k*.07);
  for(let i=0;i<=W;i+=6){const u=i/W;const env=Math.exp(-Math.pow((u-.5-.25*Math.sin(t*.3+k))*3,2));
   const y=y0+amp*env*Math.sin(u*28-t*1.6+k*1.3);i?x.lineTo(i,y):x.moveTo(i,y)}
  const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#7c5cff00');g.addColorStop(.5,k%2?'#22d3ee88':'#7c5cff99');g.addColorStop(1,'#22d3ee00');
  x.strokeStyle=g;x.lineWidth=1.6*devicePixelRatio;x.stroke()}
 for(const p of pts){p.x+=p.v;p.y+=Math.sin(t+p.x*.01)*.2;if(p.x<0)p.x=W;if(p.x>W)p.x=0;
  x.fillStyle='#a5b4fc88';x.beginPath();x.arc(p.x,p.y,p.r*devicePixelRatio,0,7);x.fill()}
 t+=.016;if(!still)requestAnimationFrame(draw)}
draw();
// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll('.reveal').forEach(s=>io.observe(s));
// card glow follows cursor
document.querySelectorAll('.card').forEach(cd=>cd.addEventListener('mousemove',e=>{const r=cd.getBoundingClientRect();cd.style.setProperty('--x',e.clientX-r.left+'px');cd.style.setProperty('--y',e.clientY-r.top+'px')}));
document.querySelectorAll('.nav ul a').forEach(a=>a.onclick=()=>document.body.classList.remove('open'));
