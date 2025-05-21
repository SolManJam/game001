// js/level.js
function loadLevel(levelNumber) {
  fetch(`../LVLS/LVL${levelNumber}.json`)
    .then(response => response.json())
    .then(data => {
      // Clear previous level
      document.querySelectorAll('.coin, .door, .key').forEach(el => el.remove());

      // Initialize coins
      data.coins.forEach(coin => {
        const el = document.createElement('div');
        el.className = 'coin';
        el.style.left = coin.x + 'px';
        el.style.top = coin.y + 'px';
        document.querySelector('.game-container').appendChild(el);
      });

      // Initialize door
      const door = document.createElement('div');
      door.className = 'door';
      door.style.left = data.door.x + 'px';
      door.style.top = data.door.y + 'px';
      document.querySelector('.game-container').appendChild(door);

      // Initialize enemies
      initEnemies(data);
    });
}

function spawnKey() {
  const key = document.createElement('div');
  key.className = 'key';
  key.style.left = '500px'; // Adjust based on your game
  key.style.top = '300px';
  document.querySelector('.game-container').appendChild(key);
}