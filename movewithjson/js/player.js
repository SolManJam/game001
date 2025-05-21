// js/player.js
console.log("Player.js is loaded");

let coinCount = 0;
let totalCoins = 0;
let hasKey = false;
let playerTile = 68; // Starting tile from LVL1.json

function movePlayer(event) {
  console.log("Player moving, key pressed:", event.key);
  const player = document.querySelector('.player');
  if (!player) {
    console.error("Error: .player not found");
    return;
  }
  let newTile = playerTile;

  switch (event.key) {
    case 'ArrowUp':
      if (playerTile > 9) newTile -= 9; // Up one row
      break;
    case 'ArrowDown':
      if (playerTile <= 72) newTile += 9; // Down one row
      break;
    case 'ArrowLeft':
      if (playerTile % 9 !== 1) newTile -= 1; // Left one column
      break;
    case 'ArrowRight':
      if (playerTile % 9 !== 0) newTile += 1; // Right one column
      break;
    default:
      return; // Ignore other keys
  }

  // Check if new tile is walkable (L001, L002)
  const tileType = getTileType(newTile);
  if (tileType === 'L000') {
    console.log("Cannot move to un-walkable tile:", newTile);
    return;
  }

  // Update position
  playerTile = newTile;
  const pos = tileToPosition(playerTile);
  player.style.left = pos.x + 'px';
  player.style.top = pos.y + 'px';
  console.log("Player moved to tile:", playerTile, "pos:", pos);
}

// Placeholder: Fetch tile type (implement based on LVL1.json access)
function getTileType(tileIndex) {
  // Mock: Assume LVL1.json is accessible globally or via fetch
  // Replace with actual logic to get landscape[tileIndex]
  const landscape = {
    "1": "L001",
    "68": "L002",
    "21": "L000" // Example un-walkable
    // Add all 81 tiles or fetch from LVL1.json
  };
  return landscape[tileIndex] || 'L001'; // Default to walkable
}

function tileToPosition(index) {
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  return { x: col * 66, y: row * 66 };
}

document.addEventListener('keydown', movePlayer);