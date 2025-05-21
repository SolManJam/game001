// js/game.js
console.log("Game.js is loaded and running");

function checkCoinCollision() {
  const player = document.querySelector('.player');
  if (!player) {
    console.error("Error: .player not found");
    return;
  }
  const coins = document.querySelectorAll('.coin');
  totalCoins = coins.length;
  if (totalCoins > 0) {
    console.log("Coins found:", totalCoins);
  }
  coins.forEach(coin => {
    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();
    if (
      playerRect.x < coinRect.x + coinRect.width &&
      playerRect.x + playerRect.width > coinRect.x &&
      playerRect.y < coinRect.y + coinRect.height &&
      playerRect.y + playerRect.height > coinRect.y
    ) {
      console.log("Coin collected");
      coin.remove();
      coinCount++;
      document.querySelector('#coins').textContent = coinCount; // Update UI
      if (coinCount >= totalCoins) {
        console.log("All coins collected, spawning key");
        spawnKey();
        document.querySelector('#key').textContent = 'Yes'; // Update UI
      }
    }
  });
}

function checkCollisions() {
  const player = document.querySelector('.player');
  if (!player) {
    console.error("Error: .player not found");
    return;
  }
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
      console.log("Player hit enemy, game over");
      document.querySelector('#lives').textContent = parseInt(document.querySelector('#lives').textContent) - 1;
      if (parseInt(document.querySelector('#lives').textContent) <= 0) {
        alert('Game Over!');
        location.reload();
      }
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
    ) {
      console.log("Key collected");
      hasKey = true;
      key.remove();
      document.querySelector('#key').textContent = 'Yes'; // Update UI
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
      console.log("Door opened, loading next level");
      document.querySelector('#level-complete').style.display = 'block';
      setTimeout(() => loadLevel(currentLevel + 1), 2000);
    }
  }
}

function gameLoop() {
  if (Math.random() < 0.016) {
    console.log("Game loop running");
  }
  moveEnemies();
  checkCollisions();
  checkCoinCollision();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  console.log("Starting game, loading level: 1");
  currentLevel = 1;
  coinCount = 0;
  hasKey = false;
  document.querySelector('#coins').textContent = '0';
  document.querySelector('#key').textContent = 'No';
  loadLevel(currentLevel);
  gameLoop();
}

// Ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, starting game");
  startGame();
});