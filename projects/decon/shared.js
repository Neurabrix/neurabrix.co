document.querySelectorAll('[data-menu-button]').forEach((button) => {
  const nav = document.getElementById(button.getAttribute('aria-controls'));
  if (!nav) return;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.dataset.open = String(!open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    button.setAttribute('aria-expanded', 'false');
    nav.dataset.open = 'false';
  }));
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});
