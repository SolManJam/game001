// js/enemy.js
console.log("Enemy.js is loaded");

let enemies = [];
let lastEnemyMoveTime = 0;
const enemyMoveInterval = 1000; // Move every 1 second

function tileToPosition(index) {
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  return { x: col * 66, y: row * 66 };
}

function initEnemies(levelData) {
  console.log("initEnemies called with enemies:", levelData.enemies);
  const grid = document.querySelector('#grid');
  if (!grid) {
    console.error("Error: #grid not found");
    return;
  }
  enemies = levelData.enemies.map((enemy, index) => {
    const pos = tileToPosition(enemy.position);
    const el = document.createElement('div');
    el.className = 'enemy';
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    grid.appendChild(el);
    return {
      el,
      currentTile: enemy.position,
      path: parsePattern(enemy.pattern),
      pathIndex: 0
    };
  });
}

function parsePattern(pattern) {
  // Simple default pattern: cycle through directions
  return pattern ? pattern.split(',').map(step => step.trim()) : ['U', 'L', 'D', 'R'];
}

function moveEnemies(timestamp) {
  if (timestamp - lastEnemyMoveTime >= enemyMoveInterval) {
    lastEnemyMoveTime = timestamp;
    enemies.forEach(enemy => {
      const direction = enemy.path[enemy.pathIndex];
      let newTile = getAdjacentTile(enemy.currentTile, direction);
      if (getTileType(newTile) === 'L002') {
        enemy.currentTile = newTile;
        const pos = tileToPosition(newTile);
        enemy.el.style.left = pos.x + 'px';
        enemy.el.style.top = pos.y + 'px';
      } else {
        console.log("Enemy blocked at tile:", newTile);
      }
      enemy.pathIndex = (enemy.pathIndex + 1) % enemy.path.length;
    });
  }
}

function getAdjacentTile(tileIndex, direction) {
  switch (direction) {
    case 'U': return tileIndex > 9 ? tileIndex - 9 : tileIndex;
    case 'D': return tileIndex <= 72 ? tileIndex + 9 : tileIndex;
    case 'L': return tileIndex % 9 !== 1 ? tileIndex - 1 : tileIndex;
    case 'R': return tileIndex % 9 !== 0 ? tileIndex + 1 : tileIndex;
    default: return tileIndex;
  }
}

function getTileType(tileIndex) {
  return window.landscapeData[String(tileIndex)] || 'L001';
}