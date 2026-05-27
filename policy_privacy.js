document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();
    
    const navLinks = document.querySelectorAll('.nav-center .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
});
