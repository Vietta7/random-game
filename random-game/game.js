const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameStarted = false;

const pusheenImage = new Image();
pusheenImage.src = './img/modal-img.png';

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


// Модальное окно
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

document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter' && !gameStarted) {
        gameStarted = true;
        startGame(); 
    } else if (event.code === 'Space' && gameStarted) {
        catVelocity = jump; 
    }
});

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    catY = canvas.height / 2; // Сбрасываем позицию котика
    catVelocity = 0; // Сбрасываем скорость
    obstacles.length = 0; // Очищаем массив препятствий
    score = 0; // Сбрасываем счет

    
}

showModal() 