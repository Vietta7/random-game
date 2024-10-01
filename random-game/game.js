const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameStarted = false;

const pusheenImage = new Image();
pusheenImage.src = './img/modal-img.png';

// Модальное окно
function showModal() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px "Indie Flower", cursive';
    ctx.textAlign = 'center';

    ctx.fillText('WELCOME to Pusheen Jump Game!', canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText("Press SPACE to start game", canvas.width / 2, canvas.height / 2 - 20);

    pusheenImage.onload = function() {
        const imageWidth = 250; 
        const imageHeight = 250; 
        ctx.drawImage(pusheenImage, (canvas.width - imageWidth) / 2, canvas.height / 2 + 40, imageWidth, imageHeight);
    };
}
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        startGame(); 
    }
});

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

showModal();
