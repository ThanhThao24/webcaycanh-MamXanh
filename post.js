document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();
    
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id') || 'post-1';
    
    loadPost(postId);
    initShare();
    loadRelatedPosts(postId);
});

const MOCK_POSTS = [
    { id: 'post-1', title: 'Cách chăm sóc cây Bàng Singapore', category: 'Hướng dẫn', date: '2026-04-20', author: 'Lan Anh', image: 'assets/figma/a4d48eeb-4e4f-4871-9d8c-a42c92e93185.png', content: 'Bàng Singapore là loại cây cần ánh sáng gián tiếp và tưới nước đều đặn. Tránh để cây dưới ánh nắng trực tiếp vì có thể làm cháy lá...' },
    { id: 'post-2', title: 'Top 10 cây lọc không khí', category: 'Tin tức', date: '2026-04-18', author: 'Minh Tuấn', image: 'assets/figma/b9fd2a9b-86fe-4044-995d-2ef87b05ad2d.png', content: 'Cây xanh không chỉ làm đẹp không gian mà còn giúp lọc không khí hiệu quả...' },
    { id: 'post-3', title: 'Phong thủy cây xanh', category: 'Phong thủy', date: '2026-04-15', author: 'Thu Hà', image: 'assets/figma/31cdb8bd-315e-481d-8ce7-6b37fda3cec3.png', content: 'Theo phong thủy, cây xanh mang lại năng lượng tích cực và thu hút tài lộc...' }
];

function loadPost(id) {
    const post = MOCK_POSTS.find(p => p.id === id) || MOCK_POSTS[0];
    
    document.title = `${post.title} - Mầm Xanh`;
    
    const titleEl = document.querySelector('.post-title, h1');
    const categoryEl = document.querySelector('.post-category');
    const dateEl = document.querySelector('.post-date');
    const authorEl = document.querySelector('.post-author');
    const imageEl = document.querySelector('.post-image img, .post-hero img');
    const contentEl = document.querySelector('.post-content, .post-body');
    
    if (titleEl) titleEl.textContent = post.title;
    if (categoryEl) categoryEl.textContent = post.category;
    if (dateEl) dateEl.textContent = new Date(post.date).toLocaleDateString('vi-VN');
    if (authorEl) authorEl.textContent = post.author;
    if (imageEl) imageEl.src = post.image;
    if (contentEl) contentEl.innerHTML = `<p>${post.content}</p>`;
}

function initShare() {
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href);
                showToast('Đã copy link bài viết');
            }
        });
    }
}

function loadRelatedPosts(currentId) {
    const container = document.querySelector('.related-posts');
    if (!container) return;
    
    const related = MOCK_POSTS.filter(p => p.id !== currentId).slice(0, 3);
    container.innerHTML = related.map(post => `
        <article class="related-post-card" data-id="${post.id}">
            <img src="${post.image}" alt="${post.title}">
            <h4>${post.title}</h4>
            <span>${new Date(post.date).toLocaleDateString('vi-VN')}</span>
        </article>
    `).join('');
    
    container.querySelectorAll('.related-post-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `post.html?id=${card.dataset.id}`;
        });
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #154212; color: white; padding: 12px 16px; border-radius: 8px; z-index: 9999;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}
