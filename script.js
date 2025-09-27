// DOM Elements
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const mapBtn = document.getElementById("mapBtn");
const mapSelection = document.getElementById("mapSelection");
const mapOptions = document.querySelectorAll(".mapOption");
const canvas = document.getElementById("gameCanvas");
const gameUI = document.getElementById("gameUI");
const scoreDisplay = document.getElementById("scoreDisplay");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Game variables
let player = {x:50,y:300,width:30,height:30,color:"#00ff00",velocityY:0,jumpPower:12,gravity:0.6};
let obstacles = [];
let coins = [];
let score = 0;
let coinScore = 0;
let gameOver = false;
let obstacleSpeed = 5;
let selectedMap = 0;

// Map patterns
const maps = [
  {name:"Map 1", pattern:[{x:400,y:350,width:20,height:50},{x:700,y:300,width:20,height:100}]},
  {name:"Map 2", pattern:[{x:300,y:300,width:20,height:100},{x:600,y:350,width:20,height:50}]},
  {name:"Map 3", pattern:[{x:200,y:250,width:20,height:150},{x:500,y:300,width:20,height:100},{x:800,y:320,width:20,height:80}]}
];

// Functions
function startGame() {
  menu.classList.add("hidden");
  canvas.classList.remove("hidden");
  gameUI.classList.remove("hidden");
  obstacles = JSON.parse(JSON.stringify(maps[selectedMap].pattern));
  update();
}

function jump() {
  if(player.y >= canvas.height - player.height){
    player.velocityY = -player.jumpPower;
  }
}

// Event Listeners
startBtn.addEventListener("click", startGame);
mapBtn.addEventListener("click", () => { mapSelection.classList.toggle("hidden"); });
mapOptions.forEach(btn => {
  btn.addEventListener("click", e => {
    selectedMap = parseInt(e.target.dataset.map);
    mapSelection.classList.add("hidden");
  });
});
document.addEventListener("keydown", e => { if(e.code==="Space") jump(); });
canvas.addEventListener("click", jump);

// Game Loop
function update() {
  if(gameOver) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Player physics
  player.velocityY += player.gravity;
  player.y += player.velocityY;
  if(player.y > canvas.height - player.height) player.y = canvas.height - player.height;

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  obstacles.forEach((obs,index)=>{
    obs.x -= obstacleSpeed;
    ctx.fillStyle = "red";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision
    if(player.x < obs.x + obs.width && player.x + player.width > obs.x &&
       player.y < obs.y + obs.height && player.y + player.height > obs.y){
      gameOver = true;
      alert("Game Over! Score: "+score+" | Coins: "+coinScore);
      location.reload();
    }

    if(obs.x + obs.width < 0){ obstacles.splice(index,1); score++; }
  });

  // Score
  scoreDisplay.textContent = "Score: "+score+" | Coins: "+coinScore;

  requestAnimationFrame(update);
}
