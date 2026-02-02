# Video-Game
The video game I am creating for my AI & Society class.

## Game Description
**Alien Jump** is a PlayStation 1-style endless runner where you control an alien jumping over various animals. Inspired by the classic T-Rex/Dino Run game, this web-based game challenges you to successfully jump over 90 animals to complete your mission!

### Features
- 🎮 PS1-era retro graphics and styling
- 👽 Animated alien character with running and jumping animations
- 🐕 Multiple animal types with animations
- 📈 Progressive difficulty - speed increases every 15 successful jumps (up to 4x)
- 🏆 Win condition: Successfully jump over 90 animals
- 💯 Score increases by 100 points per animal

## How to Build/Run

This is a pure HTML5/JavaScript game with no build process required!

### Option 1: Open Directly in Browser
Simply open `index.html` in any modern web browser:
```bash
# On Linux/Mac
open index.html

# Or use the BROWSER variable in the dev container
"$BROWSER" index.html
```

### Option 2: Run with a Local Server
For the best experience, serve it with a simple HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have npx)
npx http-server
```

Then open your browser to `http://localhost:8000`

## How to Play

1. Click **START GAME** button
2. Press **SPACEBAR** or **UP ARROW** to make the alien jump
3. Jump over animals coming from the right
4. Each successful jump earns 100 points
5. Game speed increases every 15 successful jumps
6. Complete the mission by jumping over 90 animals!

## Game Controls
- **SPACE** or **UP ARROW**: Jump
- **START GAME**: Begin the game
- **RESTART**: Restart after game over or completion

## Files
- `index.html` - Main game page
- `styles.css` - PS1-era styling and visual effects
- `game.js` - Complete game logic and animations

Enjoy the game! 👾
