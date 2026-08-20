let SITE={settings:{},timeline:[],memories:[],gallery:[]},photos=[],photoIndex=0;
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function formatDate(v){if(!v)return "";const d=new Date(v+"T00:00:00");return isNaN(d)?"":d.toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"})}
function render(){
 const s=SITE.settings||{};
 $("sub").textContent=s.subtitle||"Hai người, một hành trình, vô vàn khoảnh khắc.";
 $("letter").textContent=s.letter||"Một câu chuyện đẹp được viết bằng những điều rất nhỏ: một ánh mắt, một cuộc trò chuyện, một lần nắm tay và thật nhiều ngày tháng cùng nhau.";
 $("year").textContent=(s.startDate||"2020").slice(0,4);$("footerYear").textContent=new Date().getFullYear();
 document.title=(s.coupleName||"Hồng Nhật × Thu Trang")+" — Our Story";
 if(s.heroImage)document.querySelector(".hero").style.setProperty("--hero-image",`url("${s.heroImage}")`);
 const timeline=SITE.timeline||[];
 $("timelineList").innerHTML=timeline.map((x,i)=>`<article class="event reveal"><time>${esc(formatDate(x.date)||x.date||"")}</time><h3>${esc(x.title||"")}</h3><p>${esc(x.description||"")}</p></article>`).join("")||`<div class="empty">Câu chuyện đang được viết tiếp... ♥</div>`;
 const memories=SITE.memories||[];
 $("memoriesGrid").innerHTML=memories.map((x,i)=>`<article class="memory-card reveal"><div class="num">${String(i+1).padStart(2,"0")}</div><small>${esc(formatDate(x.date)||x.date||"MEMORY")}</small><h3>${esc(x.title||"Một kỷ niệm")}</h3><p>${esc(x.description||"")}</p></article>`).join("")||`<div class="empty">Những kỷ niệm đẹp sẽ xuất hiện ở đây.</div>`;
 photos=SITE.gallery||[];
 $("galleryGrid").innerHTML=photos.map((x,i)=>`<div class="gallery-item reveal" onclick="openLightbox(${i})"><img loading="lazy" src="${esc(x.src)}" alt="${esc(x.title||"Khoảnh khắc")}"><div class="gallery-caption"><b>${esc(x.title||"Khoảnh khắc")}</b><span>${esc(x.caption||"")}</span></div></div>`).join("")||`<div class="empty">Album đang chờ những khoảnh khắc đầu tiên.</div>`;
 observe();
}
function updateCounter(){
 const start=new Date((SITE.settings?.startDate||"2020-12-14")+"T00:00:00"),diff=Math.max(0,Date.now()-start);
 let sec=Math.floor(diff/1000),days=Math.floor(sec/86400);sec%=86400;let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);sec%=60;
 $("days").textContent=days.toLocaleString("vi-VN");$("hours").textContent=String(h).padStart(2,"0");$("minutes").textContent=String(m).padStart(2,"0");$("seconds").textContent=String(sec).padStart(2,"0");
}
function observe(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll(".reveal").forEach(x=>io.observe(x))}
function openLightbox(i){if(!photos.length)return;photoIndex=i;let x=photos[i];$("lbImg").src=x.src;$("lbImg").alt=x.title||"Kỷ niệm";$("lbCaption").textContent=[x.title,x.caption].filter(Boolean).join(" · ");$("lightbox").classList.add("open");$("lightbox").setAttribute("aria-hidden","false")}
function closeLightbox(){$("lightbox").classList.remove("open");$("lightbox").setAttribute("aria-hidden","true")}
function nextPhoto(n){if(!photos.length)return;photoIndex=(photoIndex+n+photos.length)%photos.length;openLightbox(photoIndex)}
$("lbClose").onclick=closeLightbox;$("lbPrev").onclick=()=>nextPhoto(-1);$("lbNext").onclick=()=>nextPhoto(1);$("lightbox").onclick=e=>{if(e.target.id==="lightbox")closeLightbox()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();if(e.key==="ArrowRight")nextPhoto(1);if(e.key==="ArrowLeft")nextPhoto(-1)});
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("loveTheme",document.body.classList.contains("dark")?"dark":"light");$("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾"};
if(localStorage.getItem("loveTheme")==="dark")$("themeBtn").click();
window.addEventListener("scroll",()=>{let h=document.documentElement.scrollHeight-innerHeight; $("progress").style.width=(h?scrollY/h*100:0)+"%"});
const glow=document.querySelector(".cursor-glow");window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
function touchSwipe(){let sx=0;document.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});document.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)nextPhoto(dx<0?1:-1)},{passive:true})}
async function load(){try{SITE=await fetch("/api/site").then(r=>r.json());render();updateCounter();setInterval(updateCounter,1000);setTimeout(()=>document.querySelector(".hero").classList.add("loaded"),100);touchSwipe()}catch(e){console.error(e)}}
load();