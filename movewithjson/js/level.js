// js/level.js
console.log("Level.js is loaded");

window.landscapeData = window.landscapeData || {};

function tileToPosition(index) {
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  return { x: col * 66, y: row * 66 };
}

function loadLevel(levelNumber) {
  console.log("loadLevel called for level:", levelNumber);
  const grid = document.querySelector('#grid');
  if (!grid) {
    console.error("Error: #grid not found");
    return;
  }
  grid.querySelectorAll('.coin, .door, .key, .player, .enemy, .tile').forEach(el => el.remove());

  fetch(`LVLS/LVL${levelNumber}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      return response.json();
    })
    .then(data => {
      window.landscapeData = data.landscape || {};
      // Tiles
      if (data.landscape) {
        Object.keys(data.landscape).forEach(index => {
          const tileType = data.landscape[index];
          const pos = tileToPosition(parseInt(index));
          const el = document.createElement('div');
          el.className = `tile ${tileType}`;
          el.style.left = pos.x + 'px';
          el.style.top = pos.y + 'px';
          grid.appendChild(el);
        });
      }
      // Player
      if (data.playerStart) {
        const pos = tileToPosition(data.playerStart);
        const player = document.createElement('div');
        player.className = 'player';
        player.style.left = pos.x + 'px';
        player.style.top = pos.y + 'px';
        grid.appendChild(player);
      }
      // Coins
      if (data.coinSpawns) {
        data.coinSpawns.forEach(tileIndex => {
          const pos = tileToPosition(tileIndex);
          const el = document.createElement('div');
          el.className = 'coin';
          el.style.left = pos.x + 'px';
          el.style.top = pos.y + 'px';
          grid.appendChild(el);
        });
        document.querySelector('#total-coins').textContent = data.coinSpawns.length;
      }
      // Door
      if (data.doors) {
        data.doors.forEach(tileIndex => {
          const pos = tileToPosition(tileIndex);
          const el = document.createElement('div');
          el.className = 'door';
          el.style.left = pos.x + 'px';
          el.style.top = pos.y + 'px';
          grid.appendChild(el);
        });
      }
      // Key (hidden)
      if (data.keySpawns) {
        data.keySpawns.forEach(tileIndex => {
          const pos = tileToPosition(tileIndex);
          const el = document.createElement('div');
          el.className = 'key';
          el.style.left = pos.x + 'px';
          el.style.top = pos.y + 'px';
          el.style.display = 'none';
          grid.appendChild(el);
        });
      }
      // Enemies
      initEnemies(data);
    })
    .catch(error => console.error("Fetch error:", error));
}

function spawnKey() {
  const key = document.querySelector('.key');
  if (key) key.style.display = 'block';
}

function getTileType(tileIndex) {
  const baseType = window.landscapeData[String(tileIndex)] || 'L001';
  if (baseType === 'L003' && playerInventory.icePick && playerInventory.boots) {
    return 'L002'; // Now walkable
  }
  return baseType;
}