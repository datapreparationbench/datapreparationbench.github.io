// Smooth-scroll for nav anchor links (in addition to CSS scroll-behavior),
// and minor UI niceties. Respects prefers-reduced-motion.

(function () {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll with sticky-nav offset
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      // Update URL hash without re-triggering scroll
      history.replaceState(null, '', id);
    });
  });

  // Tabs
  const tabbars = document.querySelectorAll('.tabbar[data-tab-group]');
  tabbars.forEach(tabbar => {
    const group = tabbar.getAttribute('data-tab-group');
    if (!group) return;
    const tabs = tabbar.querySelectorAll('.tab[data-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        if (!targetId) return;
        tabs.forEach(t => {
          const active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        const panes = document.querySelectorAll(`.tabpane[data-tab-group="${group}"]`);
        panes.forEach(p => p.classList.toggle('active', p.id === targetId));
      });
      // expose initial aria state
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    });
    tabbar.setAttribute('role', 'tablist');
  });

  // Intersection-based reveal animation for cards (skip if reduced motion)
  const revealEls = document.querySelectorAll(
    '.stat-card, .track-card, .method-step, .finding-card, .resource-card, .info-card, .details, .plugin-card, .domain-pill'
  );
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // Reading-progress bar — updates a thin top bar based on how far the
  // user has scrolled through the document
  const progressBar = document.getElementById('read-progress');
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
      progressBar.style.width = (pct * 100).toFixed(2) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // Mark the nav link of the section currently in view as active
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    const idToLink = new Map();
    navLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      if (id) idToLink.set(id, a);
    });
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'))
      .filter(s => idToLink.has(s.id));
    let currentId = null;
    const setActive = (id) => {
      if (id === currentId) return;
      currentId = id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };
    const navIO = new IntersectionObserver(entries => {
      // pick the section whose top is closest to (but past) the nav's bottom
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-90px 0px -65% 0px', threshold: 0 });
    sections.forEach(s => navIO.observe(s));
  }
})();

// BibTeX copy button
function copyBibtex() {
  const block = document.getElementById('bibtex-block');
  const label = document.getElementById('copy-label');
  if (!block) return;
  const text = block.innerText;
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  };
  const onSuccess = () => {
    if (label) {
      const original = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(() => { label.textContent = original; }, 1500);
    }
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => { fallback(); onSuccess(); });
  } else {
    fallback();
    onSuccess();
  }
}
