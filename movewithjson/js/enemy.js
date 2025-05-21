// js/enemy.js
let enemies = [];

function initEnemies(levelData) {
  enemies = levelData.enemies.map((enemy, index) => {
    const el = document.createElement('div');
    el.className = 'enemy';
    el.style.left = enemy.startX + 'px';
    el.style.top = enemy.startY + 'px';
    document.querySelector('.game-container').appendChild(el);
    return { el, path: enemy.path, currentStep: 0 };
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const step = enemy.path[enemy.currentStep];
    enemy.el.style.left = step.x + 'px';
    enemy.el.style.top = step.y + 'px';
    enemy.currentStep = (enemy.currentStep + 1) % enemy.path.length;
  });
}