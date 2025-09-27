const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Player
let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: "#00ff00",
  velocityY: 0,
  jumpPower: 12,
  gravity: 0.6,
  skinIndex: 0,
  skins: ["#00ff00", "#ff0044", "#00ffff", "#ffdd00", "#ff00ff"]
};

// Obstacles
let obstacles = [];
let obstacleSpeed = 5;

// Coins
let coins = [];
let coinScore = 0;

// Score
let score = 0;
let gameOver = false;

// Sounds
const jumpSound = new Audio('https://freesound.org/data/previews/331/331912_3248244-lq.mp3');
const coinSound = new Audio('https://freesound.org/data/previews/146/146725_2615115-lq.mp3');
const hitSound = new Audio('https://freesound.org/data/previews/459/459587_838627-lq.mp3');

// Spawn Obstacles
function spawnObstacle() {
  let height = Math.random() * 50 + 20;
  obstacles.push({x: canvas.width, y: canvas.height - height, width: 20, height: height, color: "red"});
}

// Spawn Coins
function spawnCoin() {
  let size = 15;
  let yPos = Math.random() * (canvas.height - 100) + 50;
  coins.push({x: canvas.width, y: yPos, width: size, height: size, color: "gold"});
}

// Jump
function jump() {
  if(player.y >= canvas.height - player.height){
    player.velocityY = -player.jumpPower;
    jumpSound.play();
  }
}

// Update game
function update() {
  if(gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  player.velocityY += player.gravity;
  player.y += player.velocityY;
  if(player.y > canvas.height - player.height) player.y = canvas.height - player.height;

  // Draw player
  ctx.fillStyle = player.skins[player.skinIndex];
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstacles
  if(Math.random() < 0.02) spawnObstacle();
  obstacles.forEach((obs, index) => {
    obs.x -= obstacleSpeed;
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision
    if(player.x < obs.x + obs.width && player.x + player.width > obs.x &&
       player.y < obs.y + obs.height && player.y + player.height > obs.y){
      hitSound.play();
      gameOver = true;
      alert("Game Over! Score: " + score + " + Coins: " + coinScore);
      location.reload();
    }

    if(obs.x + obs.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // Coins
  if(Math.random() < 0.01) spawnCoin();
  coins.forEach((coin, index) => {
    coin.x -= obstacleSpeed;
    ctx.fillStyle = coin.color;
    ctx.beginPath();
    ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI*2);
    ctx.fill();

    // Collision with player
    if(player.x < coin.x + coin.width && player.x + player.width > coin.x &&
       player.y < coin.y + coin.height && player.y + player.height > coin.y){
      coinSound.play();
      coins.splice(index, 1);
      coinScore++;
    }
  });

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Coins: " + coinScore, 10, 60);

  requestAnimationFrame(update);
}

// Controls
document.addEventListener("keydown", (e) => { if(e.code === "Space") jump(); });
canvas.addEventListener("click", jump);

update();
