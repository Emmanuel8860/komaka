/**
 * KOMAKA — main.js
 * Comportements partagés : révélation au scroll, FAQ accordéon,
 * barres de compétences animées. Aucune dépendance externe.
 */
(function () {
  'use strict';

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
    });
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  }

  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-level') + '%';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
  }

  function initFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0px';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initSkillBars();
    initFaq();
  });
})();
