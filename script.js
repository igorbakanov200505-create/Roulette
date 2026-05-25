let db=[];
let spinning=false;

let settings={
  time:5,
  theme:"space"
};

const r=document.getElementById("r");
const win=document.getElementById("win");
const sound=document.getElementById("sound");

fetch("games-db.json")
.then(r=>r.json())
.then(d=>{
  db=d.games;
  render();
});

function render(){
  r.innerHTML="";
  let loop=[];
  for(let i=0;i<20;i++) loop.push(...db);

  loop.forEach(g=>{
    let el=document.createElement("div");
    el.className="card";
    el.dataset.name=g.name;
    el.innerHTML=`${g.name}<div>${g.rarity}</div>`;
    r.appendChild(el);
  });
}

/* 🎰 SPIN */
function spin(){
  if(spinning)return;
  spinning=true;

  win.style.opacity=0;

  sound.currentTime=0;
  sound.play();

  r.style.transition="none";
  r.style.transform="translateX(0px)";

  setTimeout(()=>{

    const cards=[...document.querySelectorAll(".card")];
    const target=db[Math.floor(Math.random()*db.length)];
    const el=cards.find(c=>c.dataset.name===target.name);

    const center=document.querySelector(".main").offsetWidth/2;
    const rect=el.getBoundingClientRect();
    const wrap=r.getBoundingClientRect();

    const offset=(rect.left-wrap.left)+rect.width/2-center;

    r.style.transition=`transform ${settings.time}s cubic-bezier(.1,.8,.1,1)`;
    r.style.transform=`translateX(-${offset+2000}px)`;

    setTimeout(()=>{

      /* 🎮 FULLSCREEN RESULT */
      win.innerHTML=target.name;
      win.style.opacity=1;

      setTimeout(()=>{
        win.style.opacity=0;
      },2000);

      spinning=false;

    },settings.time*1000);

  },50);
}

/* ⚙️ sidebar */
function toggleSettings(){
  document.getElementById("sidebar").classList.toggle("active");
}

function apply(){
  settings.time=parseInt(document.getElementById("time").value);
  settings.theme=document.getElementById("theme").value;

  document.body.className=settings.theme;
}
