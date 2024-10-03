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

// Звук
function drawSoundButton() {
    if (soundEnabled) {
        ctx.drawImage(soundOffImage, soundButtonX, soundButtonY, soundButtonSize, soundButtonSize);
    } 
    else {
        ctx.drawImage(soundOnImage, soundButtonX, soundButtonY, soundButtonSize, soundButtonSize);
    }
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


showModal();

// Игра запистится после загрузки котика
pusheen.onload = function() {
    console.log('Pusheen загружен'); 
};

pusheen.onerror = function() {
    console.error('Не удалось загрузить изображение Pusheen'); 
};
