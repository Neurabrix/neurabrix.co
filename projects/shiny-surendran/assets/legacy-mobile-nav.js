(() => {
  const toggle = document.querySelector('.legacy-nav-toggle');
  const nav = document.querySelector('#primary-nav');
  if (!toggle || !nav) return;

  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    nav.dataset.open = 'false';
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.textContent = willOpen ? 'Close' : 'Menu';
    nav.dataset.open = String(willOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  window.matchMedia('(min-width: 1001px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
})();
