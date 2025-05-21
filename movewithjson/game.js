// Game variables
let currentLevel = 1;
const totalLevels = 2; // Adjust based on your total levels
let isPaused = false;
let mapData;
let playerPosition;
let lives = 3;
let coinsCollected = 0;
let hasKey = false;
let keyCollected = false; // New flag to prevent key re-spawning
let coinPositions = [];
const directionDeltas = [
    { row: -1, col: 0 }, // Up (direction 0)
    { row: 0, col: 1 },  // Right (direction 1)
    { row: 1, col: 0 },  // Down (direction 2)
    { row: 0, col: -1 }  // Left (direction 3)
];
let enemies = [];

// Initialize the game
function initializeGame() {
    console.log('Initializing game, resetting all state...');
    resetGame();
    loadLevel(currentLevel);
}

// Load a level
function loadLevel(level) {
    console.log(`Loading level ${level}...`);
    fetch(`LVLS/LVL${level}.json`)
        .then(response => response.json())
        .then(data => {
            mapData = data;
            resetGame();
            console.log(`Level ${level} loaded, hasKey: ${hasKey}, keyCollected: ${keyCollected}`);
            initializeLevel();
        })
        .catch(error => console.error('Error loading map data:', error));
}

// Set up the level
function initializeLevel() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear all previous elements
    playerPosition = mapData.playerStart;

    // Create grid cells
    for (let i = 1; i <= 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell ' + (mapData.landscape[i] || 'L002');
        cell.dataset.position = i;
        const { row, col } = positionToRowCol(i);
        cell.style.top = `${(row - 1) * 50}px`;
        cell.style.left = `${(col - 1) * 50}px`;
        grid.appendChild(cell);
    }

    // Place player
    const player = document.createElement('div');
    player.id = 'player';
    player.textContent = 'P';
    grid.appendChild(player);
    setElementPosition(player, playerPosition);
    console.log('Player placed at position:', playerPosition);

    // Place enemies
    enemies = mapData.enemies.map(enemyData => {
        const { row, col } = positionToRowCol(enemyData.position);
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.textContent = 'E';
        enemy.dataset.position = enemyData.position;
        grid.appendChild(enemy);
        setElementPosition(enemy, enemyData.position);
        return {
            id: enemyData.id,
            position: enemyData.position,
            row: row,
            col: col,
            direction: 0, // Facing up initially
            element: enemy,
            pattern: enemyData.pattern
        };
    });

    // Place door
    mapData.doors.forEach(pos => {
        const door = document.createElement('div');
        door.className = 'door';
        door.textContent = '🚪';
        door.dataset.position = pos;
        setElementPosition(door, pos);
        grid.appendChild(door);
    });

    // Set total coins in UI
    document.getElementById('total-coins').textContent = mapData.coinSpawns.length;

    // Spawn coins
    coinPositions = mapData.coinSpawns.slice();
    coinPositions.forEach(pos => {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.textContent = '🪙';
        coin.dataset.position = pos;
        setElementPosition(coin, pos);
        grid.appendChild(coin);
    });
    console.log('Coins spawned at positions:', coinPositions);

    // Start enemy movement
    enemies.forEach(enemy => {
        const actions = parsePattern(enemy.pattern);
        startEnemyMovement(enemy, actions);
    });

    // Update UI
    updateInfo();

    // Flash coin message
    setInterval(() => {
        const message = document.getElementById('coin-message');
        message.style.opacity = message.style.opacity === '0' ? '1' : '0';
    }, 3000);
}

// Helper functions
function positionToRowCol(position) {
    const row = Math.ceil(position / 9);
    const col = (position - 1) % 9 + 1;
    return { row, col };
}

function positionFromRowCol(row, col) {
    return (row - 1) * 9 + col;
}

function setElementPosition(element, position) {
    const { row, col } = positionToRowCol(position);
    element.style.top = `${(row - 1) * 50}px`;
    element.style.left = `${(col - 1) * 50}px`;
    element.dataset.position = position;
}

function isWalkable(position) {
    return mapData.landscape[position] === 'L002' &&
           !mapData.doors.includes(position) &&
           !coinPositions.includes(position) &&
           !enemies.some(e => e.position === position);
}

function isValidPosition(row, col) {
    return row >= 1 && row <= 9 && col >= 1 && col <= 9;
}

// Player movement
document.addEventListener('keydown', (e) => {
    if (isPaused) return;
    let newPosition;
    switch (e.key) {
        case 'ArrowUp': newPosition = playerPosition - 9; break;
        case 'ArrowDown': newPosition = playerPosition + 9; break;
        case 'ArrowLeft':
            newPosition = playerPosition - 1;
            if (Math.ceil(newPosition / 9) !== Math.ceil(playerPosition / 9)) return;
            break;
        case 'ArrowRight':
            newPosition = playerPosition + 1;
            if (Math.ceil(newPosition / 9) !== Math.ceil(playerPosition / 9)) return;
            break;
        default: return;
    }
    if (newPosition >= 1 && newPosition <= 81 && isWalkable(newPosition)) {
        playerPosition = newPosition;
        setElementPosition(document.getElementById('player'), playerPosition);
        checkCollisions();
        updateInfo();
    }
});

// Enemy movement functions (aligned with README)
function parsePattern(pattern) {
    const actions = [];
    let i = 0;
    let lastAction = null;
    while (i < pattern.length) {
        const char = pattern[i];
        if (['U', 'D', 'L', 'R', 'P'].includes(char)) {
            lastAction = { type: char, duration: 2000 };
            actions.push(lastAction);
            i++;
        } else if (char === 'S') {
            i++;
            let numStr = '';
            while (i < pattern.length && /\d/.test(pattern[i])) numStr += pattern[i++];
            if ([90, 180, 270].includes(parseInt(numStr))) {
                lastAction = { type: 'S', degrees: parseInt(numStr), duration: 2000 };
                actions.push(lastAction);
            }
        } else if (char === 'M') {
            i++;
            let numStr = '';
            while (i < pattern.length && /[\d.]/.test(pattern[i])) numStr += pattern[i++];
            if (/^\d+\.\d$/.test(numStr) && lastAction) {
                lastAction.duration = parseFloat(numStr) * 1000;
            }
        } else {
            i++;
        }
    }
    console.log('Parsed pattern:', actions);
    return actions;
}

function getRelativeDirection(currentDirection, relative) {
    const relatives = { 'U': 0, 'R': 1, 'D': 2, 'L': 3, 'F': 0, 'B': 2 };
    return (currentDirection + (relatives[relative] || 0)) % 4;
}

function tryMove(enemy, directionIndex) {
    const delta = directionDeltas[directionIndex];
    const newRow = enemy.row + delta.row;
    const newCol = enemy.col + delta.col;
    const newPosition = positionFromRowCol(newRow, newCol);
    if (isValidPosition(newRow, newCol) && isWalkable(newPosition)) {
        enemy.row = newRow;
        enemy.col = newCol;
        enemy.position = newPosition;
        setElementPosition(enemy.element, newPosition);
        return true;
    }
    return false;
}

function startEnemyMovement(enemy, actions) {
    setTimeout(() => {
        let index = 0;
        function executeAction() {
            if (isPaused || !enemy.element.parentNode) {
                setTimeout(executeAction, 100);
                return;
            }
            const action = actions[index];
            console.log(`Enemy ${enemy.id} executing action:`, action);
            if (action.type === 'S') {
                const rotationSteps = action.degrees / 90;
                enemy.direction = (enemy.direction + rotationSteps) % 4;
            } else if (action.type === 'P') {
                // Do nothing, just pause
            } else {
                // Movement (U, D, L, R)
                let moveDir = enemy.direction;
                if (action.type === 'D') moveDir = (enemy.direction + 2) % 4;
                else if (action.type === 'L') moveDir = (enemy.direction + 3) % 4;
                else if (action.type === 'R') moveDir = (enemy.direction + 1) % 4;

                // Try moving, rotate if blocked
                let attempts = 0;
                while (attempts < 4 && !tryMove(enemy, moveDir)) {
                    moveDir = (moveDir + 1) % 4;
                    enemy.direction = moveDir;
                    attempts++;
                }
            }
            checkCollisions();
            index = (index + 1) % actions.length;
            setTimeout(executeAction, action.duration);
        }
        executeAction();
    }, 1000); // 1-second initial delay
}

// Collision detection
function checkCollisions() {
    // Enemy collision
    if (enemies.some(enemy => enemy.position === playerPosition)) {
        lives--;
        console.log('Player hit by enemy, lives remaining:', lives);
        if (lives <= 0) {
            alert('Game Over');
            resetGame();
            initializeGame();
        } else {
            playerPosition = mapData.playerStart;
            setElementPosition(document.getElementById('player'), playerPosition);
        }
    }

    // Coin collection
    const coins = document.querySelectorAll('.coin');
    coins.forEach(coin => {
        const coinPos = parseInt(coin.dataset.position);
        if (coinPos === playerPosition) {
            coin.remove();
            coinsCollected++;
            coinPositions = coinPositions.filter(pos => pos !== coinPos);
            console.log(`Coin collected at ${coinPos}, remaining: ${coinPositions.length}`);
        }
    });

    // Key spawning
    if (coinPositions.length === 0 && !keyCollected && !document.querySelector('.key')) {
        const keyPosition = mapData.keySpawns[0];
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = '🗝';
        key.dataset.position = keyPosition;
        setElementPosition(key, keyPosition);
        document.getElementById('grid').appendChild(key);
        console.log(`Key spawned at position: ${keyPosition}`);
    }

    // Key collection
    const keyElement = document.querySelector('.key');
    if (keyElement && parseInt(keyElement.dataset.position) === playerPosition) {
        console.log('Collecting key at position:', playerPosition);
        keyElement.remove();
        hasKey = true;
        keyCollected = true; // Prevent re-spawning
        console.log('Key removed from DOM, hasKey:', hasKey, 'keyCollected:', keyCollected);
        // Force grid refresh
        const grid = document.getElementById('grid');
        grid.style.display = 'none';
        setTimeout(() => grid.style.display = 'block', 0);
    }

    // Door check
    if (mapData.doors.includes(playerPosition)) {
        console.log(`Player on door at ${playerPosition}, hasKey: ${hasKey}`);
        if (hasKey) {
            console.log('Level complete!');
            const levelCompleteDiv = document.getElementById('level-complete');
            levelCompleteDiv.style.display = 'block';
            setTimeout(() => {
                levelCompleteDiv.style.display = 'none';
                if (currentLevel < totalLevels) {
                    currentLevel++;
                    loadLevel(currentLevel);
                } else {
                    alert('Game Complete!');
                    currentLevel = 1;
                    initializeGame();
                }
            }, 2000);
        } else {
            const message = document.getElementById('message');
            message.textContent = 'KEY NEEDED!';
            message.style.display = 'block';
            message.style.animation = 'flash 1s infinite';
            setTimeout(() => {
                message.style.display = 'none';
                message.style.animation = 'none';
            }, 3000);
        }
    }
}

// UI update
function updateInfo() {
    document.getElementById('lives').textContent = lives;
    document.getElementById('coins').textContent = coinsCollected;
    document.getElementById('key').textContent = hasKey ? 'Yes' : 'No';
}

// Reset game state
function resetGame() {
    lives = 3;
    coinsCollected = 0;
    hasKey = false;
    keyCollected = false;
    coinPositions = [];
    enemies = [];
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    console.log('Game reset, hasKey:', hasKey, 'keyCollected:', keyCollected);
}

// Pause button
const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

// Start the game
initializeGame();