// typed tagline
const lines=["Experimental & computational physics","Theoretical physics","Quantum simulation · Quantum ML","Detectors, simulations & robots"];
const el=document.getElementById('typed');let li=0,ci=0,del=false;
(function type(){const s=lines[li];el.textContent=s.slice(0,ci);
 if(!del&&ci++===s.length){del=true;return setTimeout(type,1700)}
 if(del&&ci--===0){del=false;li=(li+1)%lines.length;ci=0}
 setTimeout(type,del?28:60)})();
// two-source interference field (low-res buffer, scaled up)
const cv=document.getElementById('field'),cx=cv.getContext('2d'),S=5;
const buf=document.createElement('canvas'),bx=buf.getContext('2d');let w,h,img,t=0;
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
const src=[{x:.72,y:.35},{x:.86,y:.7,tx:.86,ty:.7}];
function rs(){if(innerWidth<820){src[0].x=.2;src[0].y=.12;src[1].tx=src[1].x=.8;src[1].ty=src[1].y=.9}cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;w=buf.width=Math.ceil(cv.width/S);h=buf.height=Math.ceil(cv.height/S);img=bx.createImageData(w,h);cx.imageSmoothingEnabled=true}
addEventListener('resize',rs);rs();
function mv(e){const r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;src[1].tx=(p.clientX-r.left)/r.width;src[1].ty=(p.clientY-r.top)/r.height}
cv.parentElement.addEventListener('pointermove',mv);cv.parentElement.addEventListener('touchstart',mv,{passive:true});
let vis=true;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(cv);
function frame(){
 if(vis){const s1=src[1];s1.x+=(s1.tx-s1.x)*.06;s1.y+=(s1.ty-s1.y)*.06;
  const k=.32*S/5,d=img.data,ax=src[0].x*w,ay=src[0].y*h,bxp=s1.x*w,byp=s1.y*h;let i=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const r1=Math.hypot(x-ax,y-ay),r2=Math.hypot(x-bxp,y-byp);
   const a=Math.sin(r1*k-t)/Math.sqrt(1+r1*.08)+Math.sin(r2*k-t)/Math.sqrt(1+r2*.08);
   const m=Math.min(1,a*a*.35);
   d[i++]=47;d[i++]=111;d[i++]=222;d[i++]=m*150}
  bx.putImageData(img,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.drawImage(buf,0,0,cv.width,cv.height);
  for(const p of src){cx.beginPath();cx.arc(p.x*cv.width,p.y*cv.height,6,0,7);cx.fillStyle='#e4572e';cx.fill();cx.beginPath();cx.arc(p.x*cv.width,p.y*cv.height,12,0,7);cx.strokeStyle='#e4572e88';cx.stroke()}
  t+=.12}
 if(!still)requestAnimationFrame(frame)}
frame();
// scroll reveal + progress
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),io.unobserve(e.target))),{threshold:.1});
document.querySelectorAll('.reveal').forEach(s=>io.observe(s));
const pr=document.getElementById('progress');addEventListener('scroll',()=>{const m=document.documentElement;pr.style.width=(m.scrollTop/(m.scrollHeight-m.clientHeight)*100)+'%'},{passive:true});
document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));
document.querySelectorAll('.nav ul a').forEach(a=>a.onclick=()=>document.body.classList.remove('open'));
