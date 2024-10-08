const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameStarted = false;

const jumpSound = new Audio('jump.mp3');

const backgroundMusic = new Audio('main-theme.mp3');
backgroundMusic.loop = true; 

const pusheenImage = new Image();
pusheenImage.src = './img/modal-img.png';

const soundOffImage = new Image();
soundOffImage.src = './img/sound-off.png';

const soundOnImage = new Image();
soundOnImage.src = './img/sound-on.png';

let soundEnabled = true;

const soundButtonSize = 50;
const soundButtonX = canvas.width - soundButtonSize - 20;
const soundButtonY = 20;

// Начальные параметры котика
let catY; // Высота котика
let catVelocity = 0; // Скорость движения
const gravity = 0.5; // Гравитация
const jump = -10; // Сила прыжка

// Массив для препятствий
const obstacles = [];
const obstacleWidth = 100; // Ширина мороженого
const obstacleHeight = 200; // Высота мороженого
const pipeGap = 260; // Расстояние между морожеными

let score = 0; 

const pusheen = new Image();
pusheen.src = './img/cat.png';

const icecreamTop = new Image();
icecreamTop.src = './img/icecream-top.png';

const icecreamBottom = new Image();
icecreamBottom.src = './img/icecream-bottom.png';

// Модальное окно 'Start game
function showModal() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px "Indie Flower", cursive';
    ctx.textAlign = 'center';

    ctx.fillText('WELCOME to Pusheen Jump Game!', canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText("Press ENTER to start game", canvas.width / 2, canvas.height / 2 - 20);

    pusheenImage.onload = function() {
        const imageWidth = 350; 
        const imageHeight = 350; 
        ctx.drawImage(pusheenImage, (canvas.width - imageWidth) / 2, canvas.height / 2 + 40, imageWidth, imageHeight);
    };
}


canvas.addEventListener('click', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (mouseX >= soundButtonX && mouseX <= soundButtonX + soundButtonSize &&
        mouseY >= soundButtonY && mouseY <= soundButtonY + soundButtonSize) {
        toggleSound(); 
    }
});

function toggleSound() {
    if (soundEnabled) {
        backgroundMusic.pause();
        jumpSound.muted = true;
        soundEnabled = false;
    } else {
        backgroundMusic.play();
        jumpSound.muted = false;
        soundEnabled = true;
    }
}

// для получения данных о последних играх из localStorage
function getPreviousGames() {
    let savedGames = localStorage.getItem('gameScores'); 
    if (savedGames) {
        return JSON.parse(savedGames);
    } else {
        return [];
    }
}
// Сохряем новый результат
function saveGameScore(score) {
    let previousGames = getPreviousGames(); 

    previousGames.push({ score: score, date: new Date().toLocaleString() }); 

    if (previousGames.length > 10) {
        previousGames.shift(); 
    }

    localStorage.setItem('gameScores', JSON.stringify(previousGames)); 
}

// лучший результат
function getBestScore() {
    let previousGames = getPreviousGames(); 

    if (previousGames.length === 0) {
        return 0; 
    }

    let bestGame = previousGames[0]; 

    for (let i = 1; i < previousGames.length; i++) {
        if (previousGames[i].score > bestGame.score) {
            bestGame = previousGames[i]; 
        }
    }

    return bestGame.score; 
}

function drawBestScore() {
    const bestScore = getBestScore();

    ctx.fillStyle = 'white';
    ctx.font = '24px "Indie Flower", cursive';
    ctx.fillText(`best score: ${bestScore}`, 80, 70); 
}

// таблица с результатами
function drawScoreTable() {
    const previousGames = getPreviousGames();

    ctx.fillStyle = 'white';
    ctx.font = '20px "Indie Flower", cursive';
    ctx.textAlign = 'left';

    ctx.fillText('Previous Games:', 10, 40);

    previousGames.forEach((game, index) => {
        ctx.fillText(`${index + 1}. Score: ${game.score}, ${game.date}`, 20, 70 + index * 30);
    });
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter' && !gameStarted) {
        gameStarted = true;
        startGame(); 
    } else if (event.code === 'Space' && gameStarted) {
        catVelocity = jump; 
        if (soundEnabled) jumpSound.play(); 
    }
});

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    catY = canvas.height / 2; // Сбрасываем позицию котика
    catVelocity = 0; // Сбрасываем скорость
    obstacles.length = 0; // Очищаем массив препятствий
    score = 0; // Сбрасываем счет

    if (soundEnabled) backgroundMusic.play(); 

    gameLoop();
}

// Создаем препятствия
function createObstacle() {
    const obstacleX = canvas.width; 
    const obstacleY = Math.random() * (canvas.height - obstacleHeight - pipeGap) + 50;
    obstacles.push({ x: obstacleX, y: obstacleY }); 
}

// Проверяем столкнулись ли котик и мороженое
function checkCollision() {
    const pusheenPaddingX = 20; 
    const pusheenPaddingY = 5; 
    const obstaclePadding = 5; 

    for (let obstacle of obstacles) {
        // Проверяем столкновение с верхним мороженым
        if (
            50 + 100 - pusheenPaddingX > obstacle.x + obstaclePadding &&  
            50 + pusheenPaddingX < obstacle.x + obstacleWidth - obstaclePadding &&  
            catY + pusheenPaddingY < obstacle.y - obstaclePadding 
        ) {
            showGameOverModal();
            return true; 
        }

        // Проверяем столкновение с нижним мороженым
        if (
            50 + 100 - pusheenPaddingX > obstacle.x + obstaclePadding &&  
            50 + pusheenPaddingX < obstacle.x + obstacleWidth - obstaclePadding &&  
            catY + 70 - pusheenPaddingY > obstacle.y + pipeGap + obstaclePadding 
        ) {
            showGameOverModal(); 
            return true; 
        }
    }
    return false; 
}


const gameOverImage = new Image();
gameOverImage.src = './img/game-over.png'; 

let gameOverImageLoaded = false;

gameOverImage.onload = function() {
    gameOverImageLoaded = true;
};

// Модальное окно "Game Over"
function showGameOverModal() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px "Indie Flower", cursive';
    ctx.textAlign = 'center';

    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Press ENTER to restart", canvas.width / 2, canvas.height / 2 + 40);
    
    if (gameOverImageLoaded) {
        const imageWidth = 250; 
        const imageHeight = 250; 
        ctx.drawImage(gameOverImage, (canvas.width - imageWidth) / 2, canvas.height / 2 + 60, imageWidth, imageHeight); 
    }

    // Сохраняем текущий результат
    saveGameScore(score);

    // Отображаем таблицу с результатами
    drawScoreTable();

    gameStarted = false; 
}


function update() {
    catVelocity += gravity; 
    catY += catVelocity; 

    if (catY + 80 > canvas.height) {
        catY = canvas.height - 80; 
        catVelocity = 0; 
    }

    if (catY < 0) {
        catY = 0; 
        catVelocity = 0; 
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= 3; 
        if (obstacle.x + obstacleWidth < 0) {
            obstacles.shift(); 
            score++; 
        }
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        createObstacle(); 
    }

    if (checkCollision()) {
        alert(`Игра окончена! Ваши очки: ${score}, Прыжки: ${jumpCount}`); 
        resetGame(); 
    }
}

// Сбрасываем игру
function resetGame() {
    catY = canvas.height / 2; 
    catVelocity = 0; 
    obstacles.length = 0; 
    score = 0; 
}

// Рисуем котика и мороженые
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    ctx.drawImage(pusheen, 50, catY, 100, 70); // Котик

    // Препятствия
    obstacles.forEach(obstacle => {
        ctx.drawImage(icecreamTop, obstacle.x, obstacle.y - obstacleHeight, obstacleWidth, obstacleHeight); // Верхнее мороженое
        ctx.drawImage(icecreamBottom, obstacle.x, obstacle.y + pipeGap, obstacleWidth, obstacleHeight); // Нижнее мороженое
    });

    // Счет
    ctx.fillStyle = 'white';
    ctx.font = '36px "Indie Flower", cursive';
    ctx.fillText(`score: ${score}`, 80, 30);
}


// Звук
function drawSoundButton() {
    if (soundEnabled) {
        ctx.drawImage(soundOffImage, soundButtonX, soundButtonY, soundButtonSize, soundButtonSize);
    } 
    else {
        ctx.drawImage(soundOnImage, soundButtonX, soundButtonY, soundButtonSize, soundButtonSize);
    }
}


// Основной игровой цикл
function gameLoop() {
    update(); 
    draw(); 
    drawSoundButton(); 
    drawBestScore(); 
    requestAnimationFrame(gameLoop); 
}


showModal();

// Игра запистится после загрузки котика
pusheen.onload = function() {
    console.log('Pusheen загружен'); 
};

pusheen.onerror = function() {
    console.error('Не удалось загрузить изображение Pusheen'); 
};
