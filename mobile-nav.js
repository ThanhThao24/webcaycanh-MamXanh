/* ============================================================
   Mobile Navigation Toggle
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.mobile-menu-btn');
    var nav = document.querySelector('.nav-center') || document.querySelector('.nav-links');
    var overlay = document.querySelector('.mobile-nav-overlay');

    if (!btn || !nav) return;

    function openMenu() {
      btn.classList.add('open');
      nav.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      btn.classList.remove('open');
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    var links = nav.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  });
})();
