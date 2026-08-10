/**
 * KOMAKA — articles.js
 * Charge /data/articles.json et alimente la liste et la page article.
 * Pour publier : éditer uniquement /data/articles.json (voir README).
 */
(function () {
  'use strict';

  // articles.js n'est chargé que depuis /articles/, donc chemins relatifs à ce dossier
  const DATA_URL = '../data/articles.json';
  const PER_PAGE = 6;

  function fmtDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function initials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }

  function cardHTML(a) {
    return `
    <a class="article-card reveal" href="article.html?slug=${encodeURIComponent(a.slug)}">
      <div class="article-cover" style="--c:${a.cover}"></div>
      <div class="article-body">
        <div class="article-meta">
          <span class="tag" style="padding:4px 12px; font-size:0.7rem;">${a.category}</span>
          <span class="dot"></span><span>${fmtDate(a.date)}</span>
          <span class="dot"></span><span>${a.readTime} min</span>
        </div>
        <h3>${a.title}</h3>
        <p class="article-excerpt">${a.excerpt}</p>
        <div class="article-footer">
          <div class="author-chip"><span class="author-avatar"></span><span>${a.author}</span></div>
        </div>
      </div>
    </a>`;
  }

  function initList(articles) {
    const grid = document.querySelector('[data-articles-grid]');
    const searchInput = document.querySelector('[data-articles-search]');
    const chipsWrap = document.querySelector('[data-articles-chips]');
    const pagination = document.querySelector('[data-articles-pagination]');
    const empty = document.querySelector('[data-articles-empty]');
    if (!grid) return;

    const categories = ['Tous', ...Array.from(new Set(articles.map((a) => a.category)))];
    let activeCategory = 'Tous', query = '', page = 1;

    if (chipsWrap) {
      chipsWrap.innerHTML = categories.map((c, i) => `<button class="chip${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
      chipsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        activeCategory = btn.getAttribute('data-cat');
        page = 1;
        chipsWrap.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === btn));
        render();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => { query = searchInput.value.trim().toLowerCase(); page = 1; render(); });
    }
    function filtered() {
      return articles.filter((a) => {
        const matchesCat = activeCategory === 'Tous' || a.category === activeCategory;
        const haystack = (a.title + ' ' + a.excerpt + ' ' + a.tags.join(' ')).toLowerCase();
        return matchesCat && (!query || haystack.includes(query));
      });
    }
    function render() {
      const results = filtered();
      const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
      page = Math.min(page, totalPages);
      const start = (page - 1) * PER_PAGE;
      grid.innerHTML = results.slice(start, start + PER_PAGE).map(cardHTML).join('');
      if (empty) empty.style.display = results.length ? 'none' : 'block';
      if (pagination) {
        pagination.innerHTML = totalPages <= 1 ? '' :
          Array.from({ length: totalPages }, (_, i) => i + 1)
            .map((i) => `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`).join('');
      }
      window.dispatchEvent(new Event('load'));
    }
    if (pagination) {
      pagination.addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn');
        if (!btn) return;
        page = parseInt(btn.getAttribute('data-page'), 10);
        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    render();
  }

  function renderContentBlocks(blocks) {
    return blocks.map((b) => (b.type === 'h2' ? `<h2>${b.text}</h2>` : `<p>${b.text}</p>`)).join('');
  }

  function initArticle(articles) {
    const wrap = document.querySelector('[data-article-wrap]');
    if (!wrap) return;
    const params = new URLSearchParams(window.location.search);
    const article = articles.find((a) => a.slug === params.get('slug')) || articles[0];
    if (!article) return;

    document.title = article.title + ' — Blog KOMAKA';
    const setMeta = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    setMeta('meta[name="description"]', 'content', article.excerpt);
    setMeta('meta[property="og:title"]', 'content', article.title + ' — KOMAKA');
    setMeta('meta[property="og:description"]', 'content', article.excerpt);
    setMeta('link[rel="canonical"]', 'href', 'https://www.komaka.tech/articles/article.html?slug=' + article.slug);

    document.querySelector('[data-a-category]').textContent = article.category;
    document.querySelector('[data-a-title]').textContent = article.title;
    document.querySelector('[data-a-date]').textContent = fmtDate(article.date);
    document.querySelector('[data-a-readtime]').textContent = article.readTime + ' min de lecture';
    document.querySelector('[data-a-author]').textContent = article.author;
    document.querySelector('[data-a-author-initials]').textContent = initials(article.author);
    document.querySelector('[data-a-cover-wrap]').style.setProperty('--c', article.cover);
    document.querySelector('[data-a-content]').innerHTML = renderContentBlocks(article.content);
    document.querySelector('[data-a-tags]').innerHTML = article.tags.map((t) => `<span class="tag">${t}</span>`).join('');

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(article.title);
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      whatsapp: `https://wa.me/?text=${pageTitle}%20${pageUrl}`
    };
    document.querySelectorAll('[data-share]').forEach((el) => {
      const key = el.getAttribute('data-share');
      if (shareLinks[key]) el.setAttribute('href', shareLinks[key]);
    });

    const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
    const fallback = related.length ? related : articles.filter((a) => a.slug !== article.slug).slice(0, 3);
    const relatedGrid = document.querySelector('[data-a-related]');
    if (relatedGrid) relatedGrid.innerHTML = fallback.map(cardHTML).join('');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article',
      headline: article.title, description: article.excerpt,
      datePublished: article.date, dateModified: article.date,
      author: { '@type': 'Person', name: article.author },
      publisher: { '@type': 'Organization', name: 'KOMAKA', logo: { '@type': 'ImageObject', url: 'https://www.komaka.tech/images/favicon.svg' } },
      mainEntityOfPage: window.location.href, articleSection: article.category, keywords: article.tags.join(', ')
    });
    document.head.appendChild(ld);
    window.dispatchEvent(new Event('load'));
  }

  function boot() {
    fetch(DATA_URL).then((r) => r.json()).then((articles) => {
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      initList(articles);
      initArticle(articles);
    }).catch((err) => {
      console.error(err);
      const grid = document.querySelector('[data-articles-grid]');
      if (grid) grid.innerHTML = '<p style="color:var(--muted)">Les articles n\'ont pas pu être chargés.</p>';
    });
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
