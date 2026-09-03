(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const modal = document.querySelector('#callback-modal');
  const leadForm = document.querySelector('#lead-form');
  const formSuccess = document.querySelector('#form-success');
  const modalTitle = document.querySelector('#modal-title');
  const deviceSelect = leadForm?.querySelector('[name="device"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation.
  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mainNav?.classList.toggle('is-open', isOpen);
  });

  mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (!mainNav?.classList.contains('is-open')) return;
    if (!mainNav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  // Add a subtle shadow after scrolling.
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Reveal blocks as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -28px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Consultation dialog.
  const resetFormState = () => {
    leadForm?.removeAttribute('hidden');
    formSuccess?.setAttribute('hidden', '');
    leadForm?.reset();
  };

  const openModal = (event) => {
    event?.preventDefault();
    const trigger = event?.currentTarget;
    const requestedTitle = trigger?.getAttribute('data-modal-title');
    const requestedDevice = trigger?.getAttribute('data-device');
    if (requestedTitle && modalTitle) modalTitle.textContent = requestedTitle;
    resetFormState();
    if (requestedDevice && deviceSelect) deviceSelect.value = requestedDevice;

    if (typeof modal?.showModal === 'function') {
      modal.showModal();
    } else {
      modal?.setAttribute('open', '');
    }
    body.classList.add('modal-open');
  };

  const closeModal = () => {
    if (typeof modal?.close === 'function' && modal.open) modal.close();
    else modal?.removeAttribute('open');
    body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => trigger.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-modal]').forEach((trigger) => trigger.addEventListener('click', closeModal));

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });

  leadForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    leadForm.setAttribute('hidden', '');
    formSuccess?.removeAttribute('hidden');
  });

  // Footer year.
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
