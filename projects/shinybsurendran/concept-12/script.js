(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      nav.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.textContent = willOpen ? 'Close' : 'Menu';
      nav.classList.toggle('open', willOpen);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const eventType = document.querySelector('#event-type');
  document.querySelectorAll('[data-event-type]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!eventType) return;
      eventType.value = link.dataset.eventType || '';
      window.setTimeout(() => eventType.focus({ preventScroll: true }), 350);
    });
  });

  const form = document.querySelector('#speaking-form');
  const status = document.querySelector('#form-status');
  const preparedLink = document.querySelector('#prepared-enquiry');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      `Organisation: ${data.get('organisation')}`,
      `Event type: ${data.get('eventType')}`,
      `Preferred date: ${data.get('eventDate')}`,
      `Location / online: ${data.get('location')}`,
      `Audience: ${data.get('audience')}`,
      `Topic / desired outcome: ${data.get('topic')}`,
      '',
      `Contact name: ${data.get('contactName')}`,
      `Contact email: ${data.get('contactEmail')}`,
      `Contact phone: ${data.get('contactPhone')}`
    ];
    const subject = encodeURIComponent(`Speaking enquiry — ${data.get('organisation')}`);
    const body = encodeURIComponent(lines.join('\n'));
    if (preparedLink) {
      preparedLink.href = `mailto:info@shinysurendran.com?subject=${subject}&body=${body}`;
      preparedLink.hidden = false;
      preparedLink.focus();
    }
    if (status) status.textContent = 'Your enquiry is ready. Select “Open prepared email” to review and send it in your email app.';
  });
})();
