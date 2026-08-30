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

function createExclusiveSelector(buttonSelector, panelSelector, buttonKey, panelKey) {
  const buttons = [...document.querySelectorAll(buttonSelector)];
  const panels = [...document.querySelectorAll(panelSelector)];
  if (!buttons.length || !panels.length) return;

  function select(value) {
    buttons.forEach((button) => {
      const active = button.dataset[buttonKey] === value;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset[panelKey] === value;
      panel.hidden = !active;
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset[buttonKey]));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      buttons[next].focus();
      select(buttons[next].dataset[buttonKey]);
    });
  });
}

createExclusiveSelector('[data-role-button]', '[data-role-panel]', 'roleButton', 'rolePanel');
createExclusiveSelector('[data-day-button]', '[data-day-panel]', 'dayButton', 'dayPanel');
