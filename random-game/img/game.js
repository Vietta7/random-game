// Ждем, пока документ загрузится
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элемент canvas и его контекст
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Создаем изображения
    const pusheen = new Image();
    pusheen.src = 'cat.png';

    const icecreamTop = new Image();
    icecreamTop.src = 'icecream-top.png';

    const icecreamBottom = new Image();
    icecreamBottom.src = 'icecream-bottom.png';

    // Начальные параметры котика
    let catY = canvas.height / 2; // Высота котика
    let catVelocity = 0; // Скорость движения
    const gravity = 0.5; // Гравитация
    const jump = -10; // Сила прыжка

    // Массив для препятствий
    const obstacles = [];
    const obstacleWidth = 100; // Ширина мороженого
    const obstacleHeight = 200; // Высота мороженого
    const pipeGap = 260; // Расстояние между мороженым

    let score = 0; // Счет игры
    let jumpCount = 0; // Количество прыжков

    // Обработчик нажатия клавиш для прыжка
    document.addEventListener('keydown', () => {
        catVelocity = jump; // Устанавливаем скорость на прыжок
        jumpCount++; // Увеличиваем количество прыжков
    });

    // Функция для создания препятствий
    function createObstacle() {
        const obstacleX = canvas.width; // Позиция по X
        // Случайная позиция по Y
        const obstacleY = Math.random() * (canvas.height - obstacleHeight - pipeGap) + 50;
        obstacles.push({ x: obstacleX, y: obstacleY }); // Добавляем препятствие в массив
    }

    // Функция для проверки столкновения
    function checkCollision() {
        const pusheenPadding = 10; // Отступы внутри котика для более точной проверки
        const obstaclePadding = 10; // Отступы для мороженого
    
        for (let obstacle of obstacles) {
            // Проверяем столкновение с верхним мороженым
            if (
                50 + 100 - pusheenPadding > obstacle.x + obstaclePadding &&  // Правая граница котика ближе к левой границе мороженого с учетом отступов
                50 + pusheenPadding < obstacle.x + obstacleWidth - obstaclePadding &&  // Левая граница котика ближе к правой границе мороженого
                catY + pusheenPadding < obstacle.y - obstaclePadding // Котик выше верхней границы мороженого
            ) {
                return true; // Столкновение с верхним мороженым
            }
    
            // Проверяем столкновение с нижним мороженым
            if (
                50 + 100 - pusheenPadding > obstacle.x + obstaclePadding &&  // Правая граница котика ближе к левой границе мороженого
                50 + pusheenPadding < obstacle.x + obstacleWidth - obstaclePadding &&  // Левая граница котика ближе к правой границе мороженого
                catY + 70 - pusheenPadding > obstacle.y + pipeGap + obstaclePadding // Котик ниже верхней границы нижнего мороженого
            ) {
                return true; // Столкновение с нижним мороженым
            }
        }
        return false; // Нет столкновения
    }

    // Функция обновления состояния игры
    function update() {
        catVelocity += gravity; // Применяем гравитацию
        catY += catVelocity; // Обновляем положение котика

        // Ограничиваем движение котика
        if (catY + 80 > canvas.height) {
            catY = canvas.height - 80; // Не даем выйти за нижнюю границу
            catVelocity = 0; // Сбрасываем скорость
        }

        if (catY < 0) {
            catY = 0; // Не даем выйти за верхнюю границу
            catVelocity = 0; // Сбрасываем скорость
        }

        // Двигаем препятствия
        obstacles.forEach(obstacle => {
            obstacle.x -= 2; // Двигаем препятствия влево
            // Проверяем, если препятствие вышло за экран
            if (obstacle.x + obstacleWidth < 0) {
                obstacles.shift(); // Удаляем препятствие
                score++; // Увеличиваем счет
            }
        });

        // Создаем новое препятствие
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width / 2) {
            createObstacle(); // Создаем новое препятствие
        }

        // Проверяем на столкновение
        if (checkCollision()) {
            alert(`Игра окончена! Ваши очки: ${score}, Прыжки: ${jumpCount}`); 
            resetGame(); // Сбрасываем игру
        }
    }

    // Функция сброса игры
    function resetGame() {
        catY = canvas.height / 2; // Сбрасываем позицию котика
        catVelocity = 0; // Сбрасываем скорость
        obstacles.length = 0; // Очищаем массив препятствий
        score = 0; // Сбрасываем счет
        jumpCount = 0; // Сбрасываем количество прыжков
    }

    // Функция отрисовки
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

        ctx.drawImage(pusheen, 50, catY, 100, 70); // Отрисовываем котика

        // Отрисовываем препятствия
        obstacles.forEach(obstacle => {
            ctx.drawImage(icecreamTop, obstacle.x, obstacle.y - obstacleHeight, obstacleWidth, obstacleHeight); // Верхнее мороженое
            ctx.drawImage(icecreamBottom, obstacle.x, obstacle.y + pipeGap, obstacleWidth, obstacleHeight); // Нижнее мороженое
        });

        // Отображаем счет
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText(`Очки: ${score}`, 10, 30);
        ctx.fillText(`Прыжки: ${jumpCount}`, 10, 60);
    }

    // Основной игровой цикл
    function gameLoop() {
        update(); // Обновляем состояние игры
        draw(); // Отрисовываем все элементы
        requestAnimationFrame(gameLoop); // Запускаем следующий кадр
    }

    // Запускаем игру после загрузки изображения котика
    pusheen.onload = function() {
        console.log('Pusheen загружен'); // Лог для отладки
        gameLoop(); // Запускаем игровой цикл
    };

    pusheen.onerror = function() {
        console.error('Не удалось загрузить изображение Pusheen'); // Сообщение об ошибке
    };
});
