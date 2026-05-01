export function initBurgerMenu(){
const burgerBtn = document.getElementById('burgerBtn');
    const menuContainer = document.getElementById('menuContainer');

    burgerBtn.addEventListener('click', () => {
        menuContainer.classList.toggle('open');
        
        // Анімація перетворення полосок у хрестик
        burgerBtn.classList.toggle('active');
    });
}
