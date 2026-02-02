// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameRunning = false;
let score = 0;
let successfulJumps = 0;
let baseSpeed = 3;
let currentSpeed = 1;
let animationFrame;

// Game Elements
const alien = {
    x: 100,
    y: 300,
    width: 40,
    height: 60,
    velocityY: 0,
    jumping: false,
    grounded: true,
    animFrame: 0,
    animSpeed: 0
};

const ground = {
    y: 360,
    height: 40
};

const gravity = 0.6;
const jumpStrength = -13;

let animals = [];
let nextAnimalTimer = 0;
let animalSpawnInterval = getRandomInterval(); // frames between animals

function getRandomInterval() {
    // Random interval between 60 and 150 frames (1-2.5 seconds at 60fps)
    return Math.floor(Math.random() * 90) + 60;
}

// Animal types
const animalTypes = [
    { name: 'dog', width: 50, height: 40, color: '#8B4513' },
    { name: 'cat', width: 45, height: 35, color: '#FFA500' },
    { name: 'rabbit', width: 40, height: 45, color: '#FFB6C1' },
    { name: 'fox', width: 55, height: 42, color: '#FF4500' }
];

// PS1-style colors
const colors = {
    alien: '#00FF00',
    alienDark: '#008800',
    ground: '#444444',
    groundLine: '#666666',
    sky1: '#0f0f1e',
    sky2: '#1a1a2e',
    star: '#ffffff'
};

// Stars for background
let stars = [];
for (let i = 0; i < 50; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - ground.height),
        size: Math.random() * 2
    });
}

// UI Elements
const scoreEl = document.getElementById('score');
const jumpsEl = document.getElementById('jumps');
const speedEl = document.getElementById('speed');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverDiv = document.getElementById('gameOver');
const collisionDiv = document.getElementById('collision');
const finalScoreEl = document.getElementById('finalScore');
const collisionScoreEl = document.getElementById('collisionScore');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && gameRunning) {
        e.preventDefault();
        jump();
    }
});

// Drawing Functions
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - ground.height);
    gradient.addColorStop(0, colors.sky1);
    gradient.addColorStop(1, colors.sky2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - ground.height);
    
    // Stars
    ctx.fillStyle = colors.star;
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

function drawGround() {
    // Ground base
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
    
    // Ground lines (PS1 style grid)
    ctx.strokeStyle = colors.groundLine;
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, ground.y);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
}

function drawAlien() {
    const baseY = alien.y;
    
    // Animation frame counter
    if (alien.grounded && gameRunning) {
        alien.animSpeed += 0.2;
        if (alien.animSpeed >= 1) {
            alien.animFrame = (alien.animFrame + 1) % 4;
            alien.animSpeed = 0;
        }
    }
    
    // Body
    ctx.fillStyle = colors.alien;
    ctx.fillRect(alien.x + 10, baseY + 20, 20, 30);
    
    // Head
    ctx.fillStyle = colors.alien;
    ctx.fillRect(alien.x + 8, baseY, 24, 24);
    
    // Eyes (big alien eyes)
    ctx.fillStyle = '#000000';
    ctx.fillRect(alien.x + 10, baseY + 6, 8, 10);
    ctx.fillRect(alien.x + 22, baseY + 6, 8, 10);
    
    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(alien.x + 12, baseY + 8, 3, 3);
    ctx.fillRect(alien.x + 24, baseY + 8, 3, 3);
    
    // Antennae
    ctx.fillStyle = colors.alien;
    ctx.fillRect(alien.x + 12, baseY - 6, 2, 8);
    ctx.fillRect(alien.x + 26, baseY - 6, 2, 8);
    ctx.fillRect(alien.x + 10, baseY - 8, 4, 4);
    ctx.fillRect(alien.x + 26, baseY - 8, 4, 4);
    
    // Arms
    const armOffset = alien.animFrame % 2 === 0 ? 0 : 2;
    ctx.fillStyle = colors.alienDark;
    ctx.fillRect(alien.x + 4, baseY + 24 + armOffset, 6, 12);
    ctx.fillRect(alien.x + 30, baseY + 24 - armOffset, 6, 12);
    
    // Legs (running animation)
    if (alien.grounded) {
        const leg1Y = alien.animFrame < 2 ? 0 : 3;
        const leg2Y = alien.animFrame < 2 ? 3 : 0;
        ctx.fillStyle = colors.alienDark;
        ctx.fillRect(alien.x + 12, baseY + 50 + leg1Y, 6, 10 - leg1Y);
        ctx.fillRect(alien.x + 22, baseY + 50 + leg2Y, 6, 10 - leg2Y);
    } else {
        // Jumping pose - legs together
        ctx.fillStyle = colors.alienDark;
        ctx.fillRect(alien.x + 14, baseY + 50, 6, 10);
        ctx.fillRect(alien.x + 20, baseY + 50, 6, 10);
    }
}

function drawAnimal(animal) {
    // Animation frame
    const animOffset = Math.floor(Date.now() / 200) % 2 === 0 ? 0 : 2;
    
    // Body
    ctx.fillStyle = animal.color;
    ctx.fillRect(animal.x + 5, animal.y + 10, animal.width - 10, animal.height - 15);
    
    // Head
    ctx.fillRect(animal.x + animal.width - 15, animal.y + 5, 15, 15);
    
    // Ears
    ctx.fillRect(animal.x + animal.width - 14, animal.y, 4, 6);
    ctx.fillRect(animal.x + animal.width - 6, animal.y, 4, 6);
    
    // Legs
    const darkColor = shadeColor(animal.color, -30);
    ctx.fillStyle = darkColor;
    ctx.fillRect(animal.x + 8, animal.y + animal.height - 5 - animOffset, 5, 5 + animOffset);
    ctx.fillRect(animal.x + 18, animal.y + animal.height - 5 + animOffset, 5, 5 - animOffset);
    ctx.fillRect(animal.x + animal.width - 18, animal.y + animal.height - 5 + animOffset, 5, 5 - animOffset);
    ctx.fillRect(animal.x + animal.width - 8, animal.y + animal.height - 5 - animOffset, 5, 5 + animOffset);
    
    // Tail
    ctx.fillRect(animal.x, animal.y + 12, 8, 4);
}

function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
           (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
           .toString(16).slice(1);
}

// Game Logic
function jump() {
    if (alien.grounded && gameRunning) {
        alien.velocityY = jumpStrength;
        alien.jumping = true;
        alien.grounded = false;
    }
}

function updateAlien() {
    // Apply gravity
    alien.velocityY += gravity;
    alien.y += alien.velocityY;
    
    // Ground collision
    if (alien.y >= ground.y - alien.height) {
        alien.y = ground.y - alien.height;
        alien.velocityY = 0;
        alien.jumping = false;
        alien.grounded = true;
    }
}

function spawnAnimal() {
    const type = animalTypes[Math.floor(Math.random() * animalTypes.length)];
    animals.push({
        x: canvas.width,
        y: ground.y - type.height,
        width: type.width,
        height: type.height,
        color: type.color,
        passed: false
    });
}

function updateAnimals() {
    nextAnimalTimer++;
    
    if (nextAnimalTimer >= animalSpawnInterval && gameRunning) {
        spawnAnimal();
        nextAnimalTimer = 0;
        animalSpawnInterval = getRandomInterval(); // Set new random interval
    }
    
    // Move animals
    for (let i = animals.length - 1; i >= 0; i--) {
        animals[i].x -= baseSpeed * currentSpeed;
        
        // Check if alien successfully jumped over animal
        if (!animals[i].passed && animals[i].x + animals[i].width < alien.x) {
            animals[i].passed = true;
            successfulJumps++;
            score += 100;
            updateUI();
            
            // Increase speed every 15 jumps, max 4x
            if (successfulJumps % 15 === 0 && currentSpeed < 4) {
                currentSpeed = Math.min(4, currentSpeed + 0.5);
                updateUI();
            }
            
            // Check win condition
            if (successfulJumps >= 90) {
                winGame();
            }
        }
        
        // Remove off-screen animals
        if (animals[i].x + animals[i].width < 0) {
            animals.splice(i, 1);
        }
    }
}

function checkCollision() {
    for (let animal of animals) {
        if (alien.x < animal.x + animal.width - 10 &&
            alien.x + alien.width - 10 > animal.x &&
            alien.y < animal.y + animal.height - 5 &&
            alien.y + alien.height - 5 > animal.y) {
            gameOver();
        }
    }
}

function updateUI() {
    scoreEl.textContent = score;
    jumpsEl.textContent = successfulJumps;
    speedEl.textContent = currentSpeed.toFixed(1);
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw everything
    drawBackground();
    drawGround();
    drawAlien();
    animals.forEach(drawAnimal);
    
    // Update game state
    updateAlien();
    updateAnimals();
    checkCollision();
    
    // Continue loop
    animationFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
    gameRunning = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    gameLoop();
}

function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    
    // Reset all values
    score = 0;
    successfulJumps = 0;
    currentSpeed = 1;
    animals = [];
    nextAnimalTimer = 0;
    animalSpawnInterval = getRandomInterval();
    alien.y = 300;
    alien.velocityY = 0;
    alien.jumping = false;
    alien.grounded = true;
    alien.animFrame = 0;
    
    // Hide overlays
    gameOverDiv.style.display = 'none';
    collisionDiv.style.display = 'none';
    
    // Update UI
    updateUI();
    
    // Restart
    startGame();
}

function winGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    finalScoreEl.textContent = score;
    gameOverDiv.style.display = 'block';
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    collisionScoreEl.textContent = score;
    collisionDiv.style.display = 'block';
}

// Initial draw
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBackground();
drawGround();
drawAlien();
