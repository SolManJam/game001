// js/enemy.js
console.log("Enemy.js is loaded");

let enemies = [];

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
      path: parsePattern(enemy.pattern),
      currentStep: 0,
      currentTile: enemy.position,
      moveTimer: 0,
      moveSpeed: 1000 // 1 second per move
    };
  });
}

function parsePattern(pattern) {
  // Simple mock pattern: cycle through directions
  return ['U', 'L', 'D', 'R'];
}

function moveEnemies(deltaTime) {
  enemies.forEach(enemy => {
    enemy.moveTimer += deltaTime;
    if (enemy.moveTimer >= enemy.moveSpeed) {
      enemy.moveTimer -= enemy.moveSpeed;
      const direction = enemy.path[enemy.currentStep];
      let newTile = getAdjacentTile(enemy.currentTile, direction);
      if (getTileType(newTile) === 'L002') {
        enemy.currentTile = newTile;
        const pos = tileToPosition(newTile);
        enemy.el.style.left = pos.x + 'px';
        enemy.el.style.top = pos.y + 'px';
      } else {
        console.log("Enemy cannot move to non-L002 tile:", newTile);
      }
      enemy.currentStep = (enemy.currentStep + 1) % enemy.path.length;
    }
  });
}

function getAdjacentTile(tileIndex, direction) {
  switch (direction) {
    case 'U':
      return tileIndex > 9 ? tileIndex - 9 : tileIndex; // Stay in grid
    case 'D':
      return tileIndex <= 72 ? tileIndex + 9 : tileIndex; // Stay in grid
    case 'L':
      return tileIndex % 9 !== 1 ? tileIndex - 1 : tileIndex; // Stay in grid
    case 'R':
      return tileIndex % 9 !== 0 ? tileIndex + 1 : tileIndex; // Stay in grid
    default:
      return tileIndex;
  }
}

function getTileType(tileIndex) {
  return window.landscapeData[String(tileIndex)] || 'L001';
}