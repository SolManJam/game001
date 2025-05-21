// js/player.js
let coinCount = 0;
let totalCoins = 0;
let hasKey = false;

function movePlayer(event) {
  const player = document.querySelector('.player');
  const speed = 5; // Adjust as in original game.js
  let x = parseInt(player.style.left) || 0;
  let y = parseInt(player.style.top) || 0;

  switch (event.key) {
    case 'ArrowUp':
      y -= speed;
      break;
    case 'ArrowDown':
      y += speed;
      break;
    case 'ArrowLeft':
      x -= speed;
      break;
    case 'ArrowRight':
      x += speed;
      break;
  }

  // Keep player within bounds (adjust bounds as needed)
  x = Math.max(0, Math.min(x, 600)); // Example bounds
  y = Math.max(0, Math.min(y, 400));
  player.style.left = x + 'px';
  player.style.top = y + 'px';
}

// Initialize player event listener
document.addEventListener('keydown', movePlayer);