// js/game.js
function checkCoinCollision() {
  const player = document.querySelector('.player');
  const coins = document.querySelectorAll('.coin');
  totalCoins = coins.length;
  coins.forEach(coin => {
    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();
    if (
      playerRect.x < coinRect.x + coinRect.width &&
      playerRect.x + playerRect.width > coinRect.x &&
      playerRect.y < coinRect.y + coinRect.height &&
      playerRect.y + playerRect.height > coinRect.y
    ) {
      coin.remove();
      coinCount++;
      if (coinCount >= totalCoins) {
        spawnKey();
      }
    }
  });
}

function checkCollisions() {
  const player = document.querySelector('.player');
  const enemies = document.querySelectorAll('.enemy');
  const door = document.querySelector('.door');
  const key = document.querySelector('.key');

  // Player-enemy collision
  enemies.forEach(enemy => {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    if (
      playerRect.x < enemyRect.x + enemyRect.width &&
      playerRect.x + playerRect.width > enemyRect.x &&
      playerRect.y < enemyRect.y + enemyRect.height &&
      playerRect.y + playerRect.height > enemyRect.y
    ) {
      // Game over (adjust as needed)
      alert('Game Over!');
      location.reload();
    }
  });

  // Player-key collision
  if (key) {
    const playerRect = player.getBoundingClientRect();
    const keyRect = key.getBoundingClientRect();
    if (
      playerRect.x < keyRect.x + keyRect.width &&
      playerRect.x + playerRect.width > keyRect.x &&
      playerRect.y < keyRect.y + keyRect.height &&
      playerRect.y + playerRect.height > keyRect.y
    ) MOMENTOUS
      hasKey = true;
      key.remove();
    }
  }

  // Player-door collision
  if (door && hasKey) {
    const playerRect = player.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();
    if (
      playerRect.x < doorRect.x + doorRect.width &&
      playerRect.x + playerRect.width > doorRect.x &&
      playerRect.y < doorRect.y + doorRect.height &&
      playerRect.y + playerRect.height > doorRect.y
    ) {
      // Load next level
      loadLevel(currentLevel + 1);
    }
  }


function gameLoop() {
  moveEnemies();
  checkCollisions();
  checkCoinCollision();
  requestAnimationFrame(gameLoop);
}

// Start game
let currentLevel = 1;
loadLevel(currentLevel);
gameLoop();