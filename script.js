document.addEventListener('DOMContentLoaded', function() {
    const mainHeader = document.getElementById('mainHeader');
    const burgerIcon = document.getElementById('burgerIcon');
    const navOverlay = document.getElementById('navOverlay');
    const closeButton = document.getElementById('closeButton');

    // Header-Schrumpf-Effekt beim Scrollen
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Burger-Menü-Funktionalität
    burgerIcon.addEventListener('click', function() {
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeButton.addEventListener('click', function() {
        navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});