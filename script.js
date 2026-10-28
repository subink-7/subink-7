(function () {
  'use strict';

  // ----- Mobile menu -----
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ----- Header border after scrolling -----
  const header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Highlight the nav link of the section in view -----
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ----- Project filter (office-work rows + project cards) -----
  const filterButtons = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.project, .case');
  const groups = document.querySelectorAll('.group');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;

      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      items.forEach(function (item) {
        item.hidden = !(filter === 'all' || item.dataset.category === filter);
      });

      // Hide a group's heading when everything inside it is hidden
      groups.forEach(function (group) {
        group.hidden = !group.querySelector('.project:not([hidden]), .case:not([hidden])');
      });
    });
  });

  // ----- Footer year -----
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
