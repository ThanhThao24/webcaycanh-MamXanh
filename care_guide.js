document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();
    
    const navLinks = document.querySelectorAll('.nav-center .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === 'care_guide.html') link.classList.add('active');
    });

    initGuideCards();
    initSearch();
    initFilters();
});

function initGuideCards() {
    const cards = document.querySelectorAll('.guide-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent;
            if (title) {
                card.querySelector('.guide-content')?.classList.toggle('expanded');
            }
        });
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.guide-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const cards = document.querySelectorAll('.guide-card');
            
            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = '';
                } else {
                    const category = card.dataset.category;
                    card.style.display = category === filter ? '' : 'none';
                }
            });
        });
    });
}
