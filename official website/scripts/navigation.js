const menuButton = document.querySelector('.menu-btn');
const siteNavigation = document.querySelector('#site-nav');
const mobileBreakpoint = window.matchMedia('(max-width: 1000px)');

if (menuButton && siteNavigation) {
  const setMenuState = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    siteNavigation.classList.toggle('is-open', isOpen);
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  siteNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isOpen) {
      setMenuState(false);
      menuButton.focus();
    }
  });

  const sectionLinks = [...siteNavigation.querySelectorAll('a[href^="#"]')]
    .filter((link) => !link.classList.contains('nav__cta'));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveSection = (sectionId) => {
    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.addEventListener('click', (event) => {
    if (
      mobileBreakpoint.matches &&
      menuButton.getAttribute('aria-expanded') === 'true' &&
      !siteNavigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  mobileBreakpoint.addEventListener('change', () => setMenuState(false));
}