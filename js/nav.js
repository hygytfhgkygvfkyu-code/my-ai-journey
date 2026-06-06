// Navbar scroll effect & smooth scroll & active highlight
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allLinks = navLinks.querySelectorAll('a');
  const sections = [];

  // Collect sections
  allLinks.forEach(link => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#')) {
      const el = document.getElementById(id.slice(1));
      if (el) sections.push({ el, link });
    }
  });

  // Scroll: navbar background
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active highlight
    const scrollPos = window.scrollY + 100;
    let current = null;
    sections.forEach(({ el, link }) => {
      if (el.offsetTop <= scrollPos) {
        current = link;
      }
    });
    allLinks.forEach(l => l.classList.remove('active'));
    if (current) current.classList.add('active');
  }, { passive: true });

  // Smooth scroll
  allLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      const target = document.getElementById(id.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu
        navLinks.classList.remove('open');
      }
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
})();
