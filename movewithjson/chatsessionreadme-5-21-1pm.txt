Game Project README
Date: May 21, 2025
Branch: fix-movewithjson
Repository: https://github.com/SolManJam/game001  
Project Overview
This is a grid-based game where the player navigates a 9x9 tile grid, avoiding enemies, collecting coins to reveal a key, and unlocking a door to progress to the next level. The game is built using JavaScript with modular files (player.js, enemy.js, level.js, game.js) and styled with CSS (game.css). Levels are defined in JSON files (LVLS/LVL1.json, etc.).
Accomplishments
We’ve made significant strides in structuring and implementing core game mechanics during this chat:
Modularization:
The original game.js file was split into smaller, manageable modules:
player.js: Handles player movement and state.

enemy.js: Manages enemy placement and (intended) movement.

level.js: Loads and renders the level, including tiles and objects.

game.js: Coordinates the game loop, collisions, and overall logic.

game.css: Centralizes styling for tiles, objects, and UI.

Tile Rendering:
The game renders an 81-tile grid (9x9) with distinct tile types (L000, L001, L002), each styled with unique colors in game.css.

Player Movement:
The player can move across the grid using arrow keys, with movement restricted to walkable tiles (L002). The player snaps to the grid and cannot traverse non-walkable tiles (L000).

Enemy Placement:
Enemies are correctly placed on the grid based on the level data (LVL1.json), though their movement isn’t yet functional.

Coin and Key Mechanics:
Coins are rendered on the grid and can be collected by the player. Collecting coins updates the UI, and the key is intended to appear once all coins are collected.

UI Elements:
The game displays lives, coin count, and key status in the #info div, though positioning needs refinement.

Current Challenges
Despite our progress, several issues remain that are causing problems, including the specific breakage you mentioned:
Game Breakage (Grey Square Issue):  
Updates to level.js and game.js broke the game, resulting in only a giant grey square appearing.  

These updates reduced each file’s size by about two-thirds, suggesting critical logic or rendering code was removed or altered incorrectly.  

This could indicate syntax errors, missing DOM references, or infinite loops preventing proper rendering.

Enemy Movement:  
Enemies are placed but don’t move. They’re supposed to patrol specific paths (e.g., based on patterns like "XU3,2.5S90UUUS90P"), but this logic isn’t implemented.  

Previous attempts at movement resulted in enemies moving too fast or off the grid.

Walkability Rules:  
L001 tiles are incorrectly walkable; only L002 tiles should allow movement for both the player and enemies.  

L000 tiles are correctly non-walkable, but the rules need consistency.

Key Appearance Timing:  
The key sometimes appears before all coins are collected (e.g., after 2 coins instead of all 3 in Level 1).  

It should only appear when all coins are gone.

Performance and Stability:  
Beyond the grey square issue, the game has shown fragility, breaking with some updates.  

Better error handling and debugging are needed to prevent crashes.

CSS and Layout:  
The #info UI (lives, coins, key status) can overlap the game board or appear misaligned.  

Tiles and objects (player, enemies, coins) should be uniformly sized (66x66px) and grid-aligned.

Next Steps
To address these challenges and get the game back on track, here are some suggested actions as you debug via GitHub:
Fix the Grey Square Issue:  
Revert or review the recent changes to level.js and game.js that reduced their size. Compare with previous commits to identify what was lost.  

Check for missing render calls, broken DOM references (e.g., document.getElementById), or unhandled errors.

Implement Enemy Movement:  
Add logic in enemy.js to parse movement patterns and animate enemies at a controlled speed (e.g., every 1 second) on L002 tiles only.

Correct Walkability:  
Update player.js and enemy.js to block movement on L001 tiles, ensuring only L002 tiles are walkable.  

Use window.landscapeData to consistently check tile types.

Fix Key Timing:  
Modify game.js to show the key only when document.querySelectorAll('.coin').length === 0, ensuring all coins are collected first.

Stabilize the Game:  
Add try-catch blocks and console.log statements in level.js and game.js to trace execution and catch errors.  

Test incrementally after each change to isolate breaking points.

Polish CSS and Layout:  
Adjust #info in game.css to position it below the grid without overlap.  

Ensure all objects are 66x66px and snap to the grid properly.

Summary
We’ve accomplished a lot in this chat, including modularizing the codebase, rendering the grid, enabling player movement, placing enemies, and setting up coin/key mechanics and UI elements. However, updates to level.js and game.js broke the game (grey square issue), and we’re still stuck on enemy movement, walkability, key timing, stability, and layout. As you debug via GitHub, focus on restoring the broken files and tackling the listed issues one by one. Use version control to track changes and test frequently. Good luck, and happy coding! 

