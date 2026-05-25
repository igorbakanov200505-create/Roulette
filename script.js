let db = [];
let spinning = false;

const r = document.getElementById("r");
const res = document.getElementById("res");
const sound = document.getElementById("sound");

/* 📦 загрузка базы */
fetch("games-db.json")
.then(r => r.json())
.then(data => {
  db = data.games;
  render();
});

/* 🎴 рендер ленты */
function render(){
  r.innerHTML = "";

  let loop = [];
  for(let i=0;i<25;i++){
    loop.push(...db);
  }

  loop.forEach(g => {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.name = g.name;

    el.innerHTML = `
      <div>${g.name}</div>
      <div class="badge">${g.rarity}</div>
    `;

    r.appendChild(el);
  });
}

/* 🎨 темы (фикс без багов) */
function setTheme(name){
  document.body.classList.remove("space","neon","dark");
  document.body.classList.add(name);
}

/* 🎲 случай */
function pickGame(){
  return db[Math.floor(Math.random()*db.length)];
}

/* 🎰 SPIN */
function spin(){
  if(spinning) return;
  spinning = true;

  res.style.opacity = 0;

  sound.currentTime = 0;
  sound.play();

  r.style.transition = "none";
  r.style.transform = "translateX(0px)";

  setTimeout(() => {

    const cards = [...document.querySelectorAll(".card")];
    const targetGame = pickGame();

    const same = cards.filter(c => c.dataset.name === targetGame.name);
    const target = same[Math.floor(Math.random()*same.length)];

    const main = document.querySelector(".main");
    const center = main.getBoundingClientRect().width / 2;

    const rect = target.getBoundingClientRect();
    const rRect = r.getBoundingClientRect();

    const offset =
      (rect.left - rRect.left) +
      rect.width/2 -
      center;

    const extraSpin = 3000 + Math.random()*1500;

    r.style.transition = "transform 5s cubic-bezier(0.12,0.85,0.1,1)";
    r.style.transform = `translateX(-${offset + extraSpin}px)`;

    setTimeout(() => {

      res.innerHTML = `🎮 ${targetGame.name}<br>${targetGame.rarity}`;
      res.style.opacity = 1;

      sound.pause();
      sound.currentTime = 0;

      spinning = false;

    }, 5000);

  }, 80);
}
