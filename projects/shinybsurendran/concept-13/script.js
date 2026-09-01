(() => {
  const icons = {
    individual: '<circle cx="32" cy="21" r="9"/><path d="M16 52c1-12 7-18 16-18s15 6 16 18M13 14h8m-4-4v8"/>',
    online: '<rect x="9" y="12" width="46" height="32" rx="4"/><path d="M24 53h16M32 44v9"/><circle cx="32" cy="27" r="6"/><path d="M21 39c2-5 6-8 11-8s9 3 11 8"/>',
    corporate: '<path d="M12 54V21h18v33M30 12h22v42M18 28h6m-6 8h6m-6 8h6m19-24h3m-3 8h3m-3 8h3M8 54h48"/>',
    school: '<path d="m8 25 24-13 24 13-24 13L8 25Z"/><path d="M17 31v14c8 7 22 7 30 0V31M56 25v17"/><circle cx="56" cy="46" r="3"/>',
    wellness: '<path d="M32 53V27M32 38C20 37 13 30 13 18c12-1 19 6 19 18M32 32c10-1 17-7 18-18-11-1-18 5-18 16"/><path d="M20 53h24"/>',
    weight: '<rect x="11" y="14" width="42" height="40" rx="7"/><path d="M22 28a10 10 0 0 1 20 0M32 28l7-6"/><circle cx="32" cy="28" r="2"/>',
    women: '<circle cx="32" cy="25" r="14"/><path d="M32 39v16m-8-8h16M24 21c4 1 6 4 8 8 2-4 4-7 8-8"/>',
    insulin: '<path d="M19 45c-7-8-5-20 4-25 6-3 13 0 16 6 7-2 14 3 15 10 1 8-6 15-14 14H24"/><path d="m14 52 10-10m-4 0h4v4"/>',
    prediabetes: '<path d="M32 10c10 13 16 22 16 30a16 16 0 0 1-32 0c0-8 6-17 16-30Z"/><path d="M24 40h16M28 34l-4 6 4 6m8-12 4 6-4 6"/>',
    pcos: '<path d="M22 17c-8 4-11 14-7 22 4 9 12 13 17 13s13-4 17-13c4-8 1-18-7-22"/><path d="M24 13c2 7 14 7 16 0M25 36c4-4 10-4 14 0"/><circle cx="22" cy="31" r="2"/><circle cx="42" cy="31" r="2"/>',
    performance: '<path d="M12 47h40M18 47V31m9 16V23m10 24V16m9 31V28"/><path d="m14 23 10-8 9 5 14-10"/>',
    recovery: '<path d="M17 24a19 19 0 1 1 1 22"/><path d="M17 12v12h12"/><path d="m26 40 6-6 6 6"/>',
    injury: '<path d="M19 14c7 8 19 8 26 0M19 50c7-8 19-8 26 0M24 20l16 24M40 20 24 44"/><circle cx="32" cy="32" r="6"/>',
    muscle: '<path d="M12 39h8m24 0h8M20 31v16m24-16v16M26 27v24m12-24v24M20 39h24"/><path d="M8 35v8m48-8v8"/>'
  };
  const services = [
    ['Direct routes', 'individual', 'Individual Consultation', 'Personal guidance for adults seeking metabolic health or sports and fitness support.', '#consultation', 'Consultation enquiry →'],
    ['Direct routes', 'online', 'Online Consultation', 'Remote consultations for people who prefer online access or live beyond the in-person area.', '#consultation', 'Online enquiry →'],
    ['Direct routes', 'corporate', 'Corporate Nutrition', 'Practical nutrition sessions and programmes for workplaces, teams and employee communities.', '#speaking', 'Corporate enquiry →', 'Corporate nutrition programme'],
    ['Direct routes', 'school', 'School Health Talks', 'Age-appropriate food and health talks for students, educators and parent communities.', '#speaking', 'School enquiry →', 'School health talk'],
    ['Metabolic Health', 'wellness', 'Wellness', 'Practical food habits that support everyday wellbeing and sustainable routines.', '#consultation', 'Explore fit →'],
    ['Metabolic Health', 'weight', 'Weight Management', 'A sustainable, context-aware approach to weight-related goals without quick-fix promises.', '#consultation', 'Explore fit →'],
    ['Metabolic Health', 'women', 'Women’s & Hormonal Health', 'Food-first support shaped around women’s health context and hormonal concerns.', '#consultation', 'Explore fit →'],
    ['Metabolic Health', 'insulin', 'Insulin Resistance', 'Practical meal and routine guidance within an appropriate health-care context.', '#consultation', 'Explore fit →'],
    ['Metabolic Health', 'prediabetes', 'Prediabetes', 'Food and lifestyle guidance that complements advice from the relevant medical team.', '#consultation', 'Explore fit →'],
    ['Metabolic Health', 'pcos', 'PCOS', 'Personalised, practical nutrition support within a multidisciplinary care plan when needed.', '#consultation', 'Explore fit →'],
    ['Sports & Fitness', 'performance', 'Performance', 'Fuel and hydration planning aligned with training, competition and performance demands.', '#consultation', 'Explore fit →'],
    ['Sports & Fitness', 'recovery', 'Recovery', 'Nutrition strategies to support recovery between sessions and across demanding schedules.', '#consultation', 'Explore fit →'],
    ['Sports & Fitness', 'injury', 'Injury Prevention', 'Nutrition considered alongside training load, recovery and the wider professional team.', '#consultation', 'Explore fit →'],
    ['Sports & Fitness', 'muscle', 'Muscle Building', 'Food-first intake and recovery planning matched to training goals and day-to-day life.', '#consultation', 'Explore fit →']
  ];
  const serviceRoot = document.querySelector('#service-grid');
  if (serviceRoot) {
    const groups = [...new Set(services.map(([group]) => group))];
    serviceRoot.innerHTML = groups.map((group) => {
      const cards = services.filter(([itemGroup]) => itemGroup === group).map(([, icon, name, text, href, action, eventType]) => `<article class="service-card" data-icon="${icon}"><div class="service-icon" aria-hidden="true"><svg viewBox="0 0 64 64">${icons[icon]}</svg></div><h4>${name}</h4><p>${text}</p><a href="${href}"${eventType ? ` data-event-type="${eventType}"` : ''}>${action}</a></article>`).join('');
      const id = group === 'Metabolic Health' ? 'metabolic-services' : group === 'Sports & Fitness' ? 'sports-services' : 'direct-services';
      return `<section class="service-group" id="${id}"><div class="group-heading"><span>${group === 'Direct routes' ? 'Start here' : 'Practice pillar'}</span><h3>${group}</h3></div><div class="service-grid">${cards}</div></section>`;
    }).join('');
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; nav.classList.remove('open'); };
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; nav.classList.toggle('open', open); });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  }
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  const eventType = document.querySelector('#event-type');
  document.querySelectorAll('[data-event-type]').forEach((link) => link.addEventListener('click', () => { if (eventType) { eventType.value = link.dataset.eventType || ''; window.setTimeout(() => eventType.focus({ preventScroll: true }), 350); } }));
  const form = document.querySelector('#speaking-form');
  const status = document.querySelector('#form-status');
  const preparedLink = document.querySelector('#prepared-enquiry');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [`Organisation: ${data.get('organisation')}`, `Event type: ${data.get('eventType')}`, `Preferred date: ${data.get('eventDate')}`, `Location / online: ${data.get('location')}`, `Audience: ${data.get('audience')}`, `Topic / desired outcome: ${data.get('topic')}`, '', `Contact name: ${data.get('contactName')}`, `Contact email: ${data.get('contactEmail')}`, `Contact phone: ${data.get('contactPhone')}`];
    if (preparedLink) { preparedLink.href = `mailto:info@shinysurendran.com?subject=${encodeURIComponent(`Speaking enquiry — ${data.get('organisation')}`)}&body=${encodeURIComponent(lines.join('\n'))}`; preparedLink.hidden = false; preparedLink.focus(); }
    if (status) status.textContent = 'Your enquiry is ready. Select “Open prepared email” to review and send it in your email app.';
  });
})();
