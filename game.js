
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =====================================
// 1. PLAYER AND GAME SETTINGS
// =====================================

const player = {
    x: 5,
    y: 200,
    width: 45,
    height: 65,
    speed: 3,
    velocityY: 0,
    jumping: false
};

const gravity = 0.3;
const jumpForce = -8;
const keys = {};

let score = 0;
let lives = 3;
let damageCooldown = 0;
let levelNumber = 0;

let gameStarted = false;
let gameOver = false;
let gameWon = false;

let platforms = [];
let coins = [];
let spikes = [];
let goal = {};

// =====================================
// 2. FIVE LEVELS
// =====================================

const levels = [
    {
        name: "Space Training",
        colours: ["#080d27", "#201447", "#092e52"],
        planet: "#9564e8",

        platforms: [
            { x: 20, y: 370, width: 145, height: 20 },
            { x: 190, y: 330, width: 115, height: 20 },
            { x: 330, y: 290, width: 115, height: 20 },
            { x: 470, y: 330, width: 110, height: 20 },
            { x: 605, y: 275, width: 170, height: 20 }
        ],

        coins: [
            { x: 75, y: 335 },
            { x: 235, y: 295 },
            { x: 375, y: 255 },
            { x: 520, y: 295 },
            { x: 680, y: 240 }
        ],

        spikes: [
            { x: 115, y: 350, width: 25, height: 20 },
            { x: 255, y: 310, width: 25, height: 20 },
            { x: 395, y: 270, width: 25, height: 20 },
            { x: 510, y: 310, width: 25, height: 20 }
        ],

        goal: { x: 725, y: 210, width: 35, height: 65 }
    },

    {
        name: "Asteroid Field",
        colours: ["#10152f", "#352047", "#573044"],
        planet: "#d47d91",

        platforms: [
            { x: 20, y: 370, width: 125, height: 20 },
            { x: 170, y: 330, width: 105, height: 20 },
            { x: 300, y: 285, width: 105, height: 20 },
            { x: 430, y: 325, width: 105, height: 20 },
            { x: 560, y: 280, width: 100, height: 20 },
            { x: 680, y: 230, width: 100, height: 20 }
        ],

        coins: [
            { x: 70, y: 335 },
            { x: 220, y: 295 },
            { x: 350, y: 250 },
            { x: 480, y: 290 },
            { x: 610, y: 245 },
            { x: 725, y: 195 }
        ],

        spikes: [
            { x: 65, y: 350, width: 23, height: 20 },
            { x: 205, y: 310, width: 23, height: 20 },
            { x: 335, y: 265, width: 23, height: 20 },
            { x: 460, y: 305, width: 23, height: 20 },
            { x: 590, y: 260, width: 23, height: 20 },
            { x: 710, y: 210, width: 23, height: 20 }
        ],

        goal: { x: 730, y: 165, width: 35, height: 65 }
    },

    {
        name: "Alien Planet",
        colours: ["#071b24", "#123b42", "#30194c"],
        planet: "#52ffc6",

        platforms: [
            { x: 20, y: 370, width: 125, height: 20 },
            { x: 170, y: 325, width: 105, height: 20 },
            { x: 300, y: 280, width: 105, height: 20 },
            { x: 430, y: 320, width: 105, height: 20 },
            { x: 560, y: 270, width: 105, height: 20 },
            { x: 680, y: 220, width: 100, height: 20 }
        ],

        coins: [
            { x: 70, y: 335 },
            { x: 220, y: 290 },
            { x: 350, y: 245 },
            { x: 480, y: 285 },
            { x: 610, y: 235 },
            { x: 725, y: 185 }
        ],

        spikes: [
            { x: 45, y: 350, width: 23, height: 20 },
            { x: 205, y: 305, width: 23, height: 20 },
            { x: 335, y: 260, width: 23, height: 20 },
            { x: 460, y: 300, width: 23, height: 20 },
            { x: 590, y: 250, width: 23, height: 20 },
            { x: 710, y: 200, width: 23, height: 20 }
        ],

        goal: { x: 730, y: 155, width: 35, height: 65 }
    },

    {
        name: "Lava Nebula",
        colours: ["#260c20", "#59202b", "#a13d32"],
        planet: "#ff754a",

        platforms: [
            { x: 15, y: 370, width: 120, height: 20 },
            { x: 160, y: 325, width: 100, height: 20 },
            { x: 285, y: 280, width: 100, height: 20 },
            { x: 410, y: 320, width: 100, height: 20 },
            { x: 535, y: 270, width: 100, height: 20 },
            { x: 665, y: 220, width: 115, height: 20 }
        ],

        coins: [
            { x: 70, y: 335 },
            { x: 210, y: 290 },
            { x: 335, y: 245 },
            { x: 460, y: 285 },
            { x: 585, y: 235 },
            { x: 720, y: 185 }
        ],

        spikes: [
            { x: 35, y: 350, width: 23, height: 20 },
            { x: 190, y: 305, width: 23, height: 20 },
            { x: 315, y: 260, width: 23, height: 20 },
            { x: 440, y: 300, width: 23, height: 20 },
            { x: 565, y: 250, width: 23, height: 20 },
            { x: 700, y: 200, width: 23, height: 20 }
        ],

        goal: { x: 730, y: 155, width: 35, height: 65 }
    },

    {
        name: "The Final Galaxy",
        colours: ["#08051f", "#29104f", "#541b70"],
        planet: "#f1a7ff",

        platforms: [
            { x: 15, y: 370, width: 120, height: 20 },
            { x: 160, y: 325, width: 100, height: 20 },
            { x: 285, y: 280, width: 100, height: 20 },
            { x: 410, y: 320, width: 100, height: 20 },
            { x: 535, y: 270, width: 100, height: 20 },
            { x: 665, y: 220, width: 115, height: 20 }
        ],

        coins: [
            { x: 70, y: 335 },
            { x: 210, y: 290 },
            { x: 335, y: 245 },
            { x: 460, y: 285 },
            { x: 585, y: 235 },
            { x: 720, y: 185 }
        ],

        spikes: [
            { x: 35, y: 350, width: 23, height: 20 },
            { x: 190, y: 305, width: 23, height: 20 },
            { x: 315, y: 260, width: 23, height: 20 },
            { x: 440, y: 300, width: 23, height: 20 },
            { x: 565, y: 250, width: 23, height: 20 },
            { x: 700, y: 200, width: 23, height: 20 }
        ],

        goal: { x: 730, y: 155, width: 35, height: 65 }
    }
];

// =====================================
// 3. LOAD A LEVEL
// =====================================

function loadLevel() {
    const level = levels[levelNumber];

    platforms = level.platforms;
    spikes = level.spikes;
    goal = level.goal;

    coins = level.coins.map(function(coin) {
        return {
            x: coin.x,
            y: coin.y,
            collected: false
        };
    });

    player.x = 5;
    player.y = 200;
    player.velocityY = 0;
    player.jumping = false;

    damageCooldown = 0;
}

function restartGame() {
    score = 0;
    lives = 3;
    damageCooldown = 0;
    levelNumber = 0;

    gameOver = false;
    gameWon = false;
    gameStarted = true;

    for (const key in keys) {
        keys[key] = false;
    }

    loadLevel();
}

// =====================================
// 4. KEYBOARD CONTROLS
// =====================================

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (event.code === "Space") {
        event.preventDefault();
    }

    keys[key] = true;

    if (!gameStarted && key === "enter") {
        gameStarted = true;
        return;
    }

    if (
        event.code === "Space" &&
        gameStarted &&
        !gameOver &&
        !gameWon &&
        !player.jumping
    ) {
        player.velocityY = jumpForce;
        player.jumping = true;
    }

    if (key === "r" && (gameOver || gameWon)) {
        restartGame();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

// =====================================
// 5. SPACE BACKGROUND
// =====================================

function drawBackground() {
    const level = levels[levelNumber];

    const background = ctx.createLinearGradient(
        0, 0, canvas.width, canvas.height
    );

    background.addColorStop(0, level.colours[0]);
    background.addColorStop(0.5, level.colours[1]);
    background.addColorStop(1, level.colours[2]);

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nebula clouds
    ctx.save();
    ctx.globalAlpha = 0.22;

    let nebula = ctx.createRadialGradient(
        200, 130, 10, 200, 130, 180
    );

    nebula.addColorStop(0, "#b026ff");
    nebula.addColorStop(1, "transparent");

    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    nebula = ctx.createRadialGradient(
        570, 300, 10, 570, 300, 200
    );

    nebula.addColorStop(0, "#008cff");
    nebula.addColorStop(1, "transparent");

    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    // Planet
    const planetX = levelNumber % 2 === 0 ? 670 : 130;
    const planetY = 100;
    const planetRadius = 48 + levelNumber * 3;

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.shadowColor = level.planet;
    ctx.shadowBlur = 30;

    const planet = ctx.createRadialGradient(
        planetX - 18, planetY - 18, 5,
        planetX, planetY, planetRadius
    );

    planet.addColorStop(0, "#ffffff");
    planet.addColorStop(0.25, level.planet);
    planet.addColorStop(1, level.colours[2]);

    ctx.fillStyle = planet;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Stars
    for (let i = 0; i < 75; i++) {
        const x = (i * 137) % canvas.width;
        const y = (i * 73) % canvas.height;
        const size = i % 5 === 0 ? 3 : 1.5;

        ctx.fillStyle = i % 3 === 0 ? "#8feaff" : "white";
        ctx.globalAlpha = i % 2 === 0 ? 1 : 0.55;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// =====================================
// 6. DRAW PLATFORMS
// =====================================

function drawPlatforms() {
    const glowColours = [
        "#4c9dff",
        "#ff8ca5",
        "#52ffc6",
        "#ff754a",
        "#d69bff"
    ];

    platforms.forEach(function(platform) {
        ctx.save();

        const colour = ctx.createLinearGradient(
            platform.x,
            platform.y,
            platform.x,
            platform.y + platform.height
        );

        colour.addColorStop(0, glowColours[levelNumber]);
        colour.addColorStop(1, "#25234f");

        ctx.shadowColor = glowColours[levelNumber];
        ctx.shadowBlur = 12;
        ctx.fillStyle = colour;

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        // Bright top edge
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#c5f6ff";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            4
        );

        // Solid-looking lower border
        ctx.strokeStyle = "#10132e";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.restore();
    });
}

// =====================================
// 7. DRAW THE ASTRONAUT
// =====================================

function drawPlayer() {
    const moving =
        keys["a"] ||
        keys["d"] ||
        keys["arrowleft"] ||
        keys["arrowright"];

    const running = moving && !player.jumping;

    const bob = running
        ? Math.sin(Date.now() / 100) * 2
        : 0;

    const legSwing = running
        ? Math.sin(Date.now() / 100) * 4
        : 0;

    const x = player.x;
    const y = player.y + bob;

    ctx.save();

    ctx.shadowColor = "#50cfff";
    ctx.shadowBlur = 10;

    // Backpack
    ctx.fillStyle = "#7489b5";
    ctx.fillRect(x + 1, y + 28, 10, 20);

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ff7c91";
    ctx.fillRect(x + 3, y + 32, 5, 4);

    // Arms
    ctx.fillStyle = "#dceaff";
    ctx.fillRect(x + 4, y + 28, 8, 17);
    ctx.fillRect(x + 33, y + 28, 8, 17);

    // Gloves
    ctx.fillStyle = "#56dfff";
    ctx.fillRect(x + 3, y + 41, 9, 6);
    ctx.fillRect(x + 33, y + 41, 9, 6);

    // Legs
    ctx.fillStyle = "#c9d9f5";

    if (player.jumping) {
        ctx.fillRect(x + 9, y + 47, 10, 12);
        ctx.fillRect(x + 26, y + 47, 10, 12);
    } else {
        ctx.fillRect(x + 10, y + 46 + legSwing, 10, 14);
        ctx.fillRect(x + 25, y + 46 - legSwing, 10, 14);
    }

    // Boots
    ctx.fillStyle = "#50cfff";
    ctx.fillRect(x + 7, y + 57 + legSwing, 15, 7);
    ctx.fillRect(x + 23, y + 57 - legSwing, 15, 7);

    // Spacesuit
    ctx.fillStyle = "#f5f8ff";
    ctx.fillRect(x + 9, y + 24, 28, 26);

    // Chest panel
    ctx.fillStyle = "#8799bd";
    ctx.fillRect(x + 17, y + 30, 13, 10);

    ctx.fillStyle = "#58f4ff";
    ctx.fillRect(x + 19, y + 32, 4, 3);

    ctx.fillStyle = "#ff657f";
    ctx.fillRect(x + 25, y + 32, 3, 3);

    // Helmet
    ctx.fillStyle = "#f5f8ff";
    ctx.beginPath();
    ctx.ellipse(
        x + 23, y + 12, 17, 15,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Visor
    const visor = ctx.createLinearGradient(
        x + 12, y + 5, x + 33, y + 22
    );

    visor.addColorStop(0, "#8ff8ff");
    visor.addColorStop(0.5, "#25bdf4");
    visor.addColorStop(1, "#344ca8");

    ctx.fillStyle = visor;
    ctx.beginPath();
    ctx.ellipse(
        x + 25, y + 13, 11, 9,
        -0.15, 0, Math.PI * 2
    );
    ctx.fill();

    // Visor reflection
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x + 19, y + 7, 5, 2);

    // Helmet detail
    ctx.fillStyle = "#ff657f";
    ctx.beginPath();
    ctx.arc(x + 8, y + 13, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// =====================================
// 8. COINS AND SCORING
// =====================================

function drawCoins() {
    coins.forEach(function(coin) {
        if (coin.collected) return;

        ctx.save();

        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ffd700";

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fff4a3";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    });
}

function collectCoins() {
    coins.forEach(function(coin) {
        if (
            !coin.collected &&
            player.x + 7 < coin.x + 9 &&
            player.x + player.width - 7 > coin.x - 9 &&
            player.y + 5 < coin.y + 9 &&
            player.y + player.height - 5 > coin.y - 9
        ) {
            coin.collected = true;
            score += 10;
        }
    });
}

// =====================================
// 9. SPIKES AND LIVES
// =====================================

function drawSpikes() {
    spikes.forEach(function(spike) {
        ctx.save();

        ctx.shadowColor = "#ff4567";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ff4567";

        ctx.beginPath();
        ctx.moveTo(spike.x, spike.y + spike.height);
        ctx.lineTo(
            spike.x + spike.width / 2,
            spike.y
        );
        ctx.lineTo(
            spike.x + spike.width,
            spike.y + spike.height
        );
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ffb0bf";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
    });
}

function loseLife() {
    if (damageCooldown > 0 || gameOver || gameWon) {
        return;
    }

    lives--;
    damageCooldown = 90;

    if (lives <= 0) {
        lives = 0;
        gameOver = true;
    } else {
        // Return to the beginning of the current level
        player.x = 5;
        player.y = 200;
        player.velocityY = 0;
        player.jumping = false;
    }
}

function checkSpikes() {
    if (damageCooldown > 0) return;

    for (const spike of spikes) {
        // Narrower hitbox to better match the triangle.
        // The top corners of a triangle are not solid.
        const inset = spike.width * 0.25;
        const collisionLeft = spike.x + inset;
        const collisionRight = spike.x + spike.width - inset;
        const collisionTop = spike.y + spike.height * 0.45;

        const playerLeft = player.x + 9;
        const playerRight = player.x + player.width - 9;
        const playerTop = player.y + 7;
        const playerBottom = player.y + player.height - 3;

        if (
            playerRight > collisionLeft &&
            playerLeft < collisionRight &&
            playerBottom > collisionTop &&
            playerTop < spike.y + spike.height
        ) {
            loseLife();
            return;
        }
    }
}

// =====================================
// 10. FINISH PORTAL
// =====================================

function drawGoal() {
    const time = Date.now() / 1000;
    const cx = goal.x + goal.width / 2;
    const cy = goal.y + goal.height / 2;
    const radius = 25;

    ctx.save();

    // Black hole
    ctx.shadowColor = "#8a2be2";
    ctx.shadowBlur = 25;
    ctx.fillStyle = "#030014";

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 22;
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.shadowColor = "#c084fc";
    ctx.shadowBlur = 15;
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Slower swirling arcs
    for (let i = 0; i < 3; i++) {
        const angle = time * (0.7 + i * 0.2);

        ctx.beginPath();
        ctx.strokeStyle = i % 2 === 0
            ? "#ffffff"
            : "#a855f7";

        ctx.lineWidth = 2;
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 10;

        ctx.arc(
            cx,
            cy,
            10 + i * 5,
            angle,
            angle + Math.PI * 1.3
        );

        ctx.stroke();
    }

    // Orbiting particles
    for (let i = 0; i < 8; i++) {
        const angle = time * 0.9 + i * Math.PI / 4;
        const distance = radius + 8 + Math.sin(time * 1.5 + i) * 3;

        const px = cx + Math.cos(angle) * distance;
        const py = cy + Math.sin(angle) * distance;

        ctx.fillStyle = i % 2 === 0
            ? "#ffffff"
            : "#d8b4fe";

        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "white";
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 10;
    ctx.fillText("EXIT", cx, goal.y - 8);
    ctx.restore();
}

function checkGoal() {
    if (
        player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y
    ) {
        if (levelNumber < levels.length - 1) {
            levelNumber++;
            loadLevel();
        } else {
            gameWon = true;
        }
    }
}

// =====================================
// 11. SCORE, LEVEL AND LIVES DISPLAY
// =====================================

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";

    ctx.fillText("Score: " + score, 15, 30);

    ctx.fillText(
        "Level " + (levelNumber + 1) +
        ": " + levels[levelNumber].name,
        15, 55
    );

    ctx.font = "24px Arial";
    ctx.fillStyle = "#ff6688";
    ctx.textAlign = "right";
    ctx.fillText("♥".repeat(lives), canvas.width - 15, 32);

    ctx.textAlign = "left";
}

// =====================================
// 12. MENUS AND SCREENS
// =====================================

function drawOverlay() {
    ctx.fillStyle = "rgba(5, 8, 30, 0.88)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStartScreen() {
    drawOverlay();

    ctx.textAlign = "center";
    ctx.fillStyle = "#69d9ff";
    ctx.font = "bold 40px Arial";
    ctx.fillText("ASTRO ADVENTURE", 400, 145);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Explore 5 levels of space!", 400, 200);

    ctx.font = "18px Arial";
    ctx.fillText("Move: A/D or Arrow Keys", 400, 250);
    ctx.fillText("Jump: Space", 400, 280);

    ctx.fillStyle = "#ffd700";
    ctx.fillText("Press ENTER to start", 400, 345);

    ctx.textAlign = "left";
}

function drawGameOver() {
    drawOverlay();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ff4567";
    ctx.font = "bold 42px Arial";
    ctx.fillText("GAME OVER", 400, 180);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, 400, 230);
    ctx.fillText("You reached Level " + (levelNumber + 1), 400, 265);
    ctx.fillText("Press R to restart", 400, 310);

    ctx.textAlign = "left";
}

function drawWinScreen() {
    drawOverlay();

    ctx.textAlign = "center";
    ctx.fillStyle = "#69ffb4";
    ctx.font = "bold 38px Arial";
    ctx.fillText("MISSION COMPLETE!", 400, 155);

    ctx.fillStyle = "#ffd700";
    ctx.font = "26px Arial";
    ctx.fillText("You conquered all 5 levels!", 400, 210);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Final Score: " + score, 400, 260);
    ctx.fillText("Lives remaining: " + lives, 400, 295);
    ctx.fillText("Press R to play again", 400, 345);

    ctx.textAlign = "left";
}

// =====================================
// 13. MOVEMENT AND PLATFORM COLLISIONS
// =====================================

function updateGame() {
    if (damageCooldown > 0) {
        damageCooldown--;
    }

    // -----------------------------
    // Horizontal movement
    // -----------------------------

    let moveX = 0;

    if (keys["a"] || keys["arrowleft"]) {
        moveX -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        moveX += player.speed;
    }

    player.x += moveX;

    // Solid side collisions
    for (const platform of platforms) {
        const overlapsVertically =
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height;

        if (!overlapsVertically) continue;

        if (
            moveX > 0 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width
        ) {
            player.x = platform.x - player.width;
        }

        if (
            moveX < 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x
        ) {
            player.x = platform.x + platform.width;
        }
    }

    // Keep player inside the canvas
    player.x = Math.max(
        0,
        Math.min(canvas.width - player.width, player.x)
    );

    // -----------------------------
    // Vertical movement and gravity
    // -----------------------------

    const previousY = player.y;
    const previousBottom = previousY + player.height;

    player.velocityY += gravity;
    player.y += player.velocityY;

    let landed = false;

    for (const platform of platforms) {
        const overlapsHorizontally =
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width;

        if (!overlapsHorizontally) continue;

        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const currentBottom = player.y + player.height;

        // Land on the top while falling
        if (
            player.velocityY >= 0 &&
            previousBottom <= platformTop &&
            currentBottom >= platformTop
        ) {
            player.y = platformTop - player.height;
            player.velocityY = 0;
            landed = true;
        }

        // Hit the underside while jumping up
        else if (
            player.velocityY < 0 &&
            previousY >= platformBottom &&
            player.y <= platformBottom
        ) {
            player.y = platformBottom;
            player.velocityY = 0;
        }
    }

    if (landed) {
        player.jumping = false;
    } else {
        player.jumping = true;
    }

    // -----------------------------
    // Game interactions
    // -----------------------------

    collectCoins();
    checkSpikes();
    checkGoal();

    // Falling off the screen costs a life
    if (player.y > canvas.height) {
        loseLife();
    }
}

// =====================================
// 14. MAIN GAME LOOP
// =====================================

function gameLoop() {
    drawBackground();
    drawPlatforms();
    drawSpikes();
    drawCoins();
    drawGoal();

    if (gameStarted && !gameOver && !gameWon) {
        updateGame();
    }

    // Blink after damage
    if (
        damageCooldown > 0 &&
        Math.floor(damageCooldown / 6) % 2 === 0
    ) {
        // Skip drawing the astronaut this frame
    } else {
        drawPlayer();
    }

    drawScore();

    if (!gameStarted) {
        drawStartScreen();
    } else if (gameOver) {
        drawGameOver();
    } else if (gameWon) {
        drawWinScreen();
    }

    requestAnimationFrame(gameLoop);
}

// =====================================
// 15. START THE GAME
// =====================================

loadLevel();
gameLoop();