/* ============================================================
   Admin Sidebar Toggle — Mobile
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.admin-sidebar-toggle');
    var sidebar = document.querySelector('.admin-sidebar');
    var overlay = document.querySelector('.admin-sidebar-overlay');

    if (!btn || !sidebar) return;

    function openSidebar() {
      btn.classList.add('open');
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      btn.classList.remove('open');
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    // Close on nav link click
    var links = sidebar.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', closeSidebar);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  });
})();
