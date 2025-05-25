// Функція для приховування стартового екрану та показу основного вмісту
function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('.main-content'); // Використовуємо querySelector для класу

    // Додаємо клас 'hidden' до стартового екрану, який запускає анімацію зникнення
    splashScreen.classList.add('hidden');

    // Чекаємо, поки закінчиться анімація зникнення (1 секунда, як в CSS transition)
    // Потім повністю приховуємо стартовий екран і показуємо основний вміст
    splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none'; // Повністю приховуємо елемент, щоб він не займав місце
        mainContent.classList.add('visible'); // Додаємо клас 'visible' для появи основного вмісту
    }, { once: true }); // Виконуємо обробник події лише один раз, щоб уникнути зайвих викликів
}

// Запускаємо функцію hideSplashScreen через 3 секунди (3000 мілісекунд) після завантаження сторінки
window.addEventListener('load', () => {
    setTimeout(hideSplashScreen, 3000); // Ти можеш змінити цей час (в мілісекундах)
});