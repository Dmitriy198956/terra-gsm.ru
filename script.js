(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const announcement = document.querySelector('[data-dismiss-announcement]');
  const modal = document.querySelector('#callback-modal');
  const leadForm = document.querySelector('#lead-form');
  const formSuccess = document.querySelector('#form-success');
  const modalTitle = document.querySelector('#modal-title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compact mobile navigation.
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

  // Keep the header quiet once the visitor starts exploring the page.
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // The announcement can be dismissed for this visit.
  announcement?.addEventListener('click', () => {
    document.querySelector('#announcement')?.classList.add('is-hidden');
  });

  // Reveal content as it enters the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Callback / consultation dialog.
  const resetFormState = () => {
    leadForm?.removeAttribute('hidden');
    formSuccess?.setAttribute('hidden', '');
    leadForm?.reset();
  };

  const openModal = (event) => {
    event?.preventDefault();
    const trigger = event?.currentTarget;
    const requestedTitle = trigger?.getAttribute('data-modal-title');
    if (requestedTitle && modalTitle) modalTitle.textContent = requestedTitle;
    resetFormState();
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

  // A small, keyboard-friendly review carousel. Desktop shows all cards; mobile shows one.
  const reviewCards = [...document.querySelectorAll('[data-review-index]')];
  const reviewDots = [...document.querySelectorAll('[data-review-dot]')];
  const prevReview = document.querySelector('[data-review-prev]');
  const nextReview = document.querySelector('[data-review-next]');
  let currentReview = 0;

  const setReview = (index) => {
    if (!reviewCards.length) return;
    currentReview = (index + reviewCards.length) % reviewCards.length;
    reviewCards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === currentReview);
      card.setAttribute('aria-hidden', String(cardIndex !== currentReview));
    });
    reviewDots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentReview;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  prevReview?.addEventListener('click', () => setReview(currentReview - 1));
  nextReview?.addEventListener('click', () => setReview(currentReview + 1));
  reviewDots.forEach((dot) => dot.addEventListener('click', () => setReview(Number(dot.dataset.reviewDot))));
  setReview(0);

  // Current year in the footer.
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
