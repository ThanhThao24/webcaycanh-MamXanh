document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();
    
    const navLinks = document.querySelectorAll('.nav-center .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === 'news.html') link.classList.add('active');
    });

    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const id = card.dataset.id || 'post-1';
                window.location.href = `post.html?id=${id}`;
            }
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
