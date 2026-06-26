// =============================================
// NAVBAR SCROLL + ACTIVE LINK
// =============================================
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 50) mainNav.classList.add('scrolled');
  else mainNav.classList.remove('scrolled');

  // Active nav link
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav-active');
    }
  });
}, { passive: true });

// =============================================
// BENTO <-> ACCORDION STATE TRANSFER
// =============================================
let activeIndex = 0;

const bentoCards = document.querySelectorAll('.bento-card');
bentoCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    bentoCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    activeIndex = parseInt(card.dataset.index);
  });
});

const accItems = document.querySelectorAll('.acc-item');

function openAccordion(index) {
  accItems.forEach(item => {
    const isTarget = parseInt(item.dataset.index) === index;
    item.classList.toggle('open', isTarget);
    item.querySelector('.acc-trigger').setAttribute('aria-expanded', isTarget);
  });
}

accItems.forEach(item => {
  item.querySelector('.acc-trigger').addEventListener('click', () => {
    const idx = parseInt(item.dataset.index);
    const isOpen = item.classList.contains('open');
    accItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.acc-trigger').setAttribute('aria-expanded', false);
    });
    if (!isOpen) openAccordion(idx);
  });
});

let wasMobile = window.innerWidth < 768;
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  if (!wasMobile && isMobile) openAccordion(activeIndex);
  wasMobile = isMobile;
});

// =============================================
// PRICING MATRIX — Feature 1
// =============================================
const pricingMatrix = {
  USD: { symbol: '$', tariff: 1.00,  tiers: { starter: 29, pro: 79, enterprise: 199 } },
  INR: { symbol: '₹', tariff: 83.5,  tiers: { starter: 29, pro: 79, enterprise: 199 } },
  EUR: { symbol: '€', tariff: 0.92,  tiers: { starter: 29, pro: 79, enterprise: 199 } },
};

const ANNUAL_DISCOUNT = 0.8;
let currentBilling  = 'monthly';
let currentCurrency = 'USD';

function updatePrices() {
  const config   = pricingMatrix[currentCurrency];
  const discount = currentBilling === 'annual' ? ANNUAL_DISCOUNT : 1;
  const tiers    = ['starter', 'pro', 'enterprise'];

  tiers.forEach(tier => {
    const final     = Math.round(config.tiers[tier] * config.tariff * discount);
    const symEl     = document.getElementById('sym-' + tier);
    const valEl     = document.getElementById('val-' + tier);

    // WAAPI fade — isolates to text nodes only, no parent reflow
    valEl.animate(
      [{ opacity: 1, transform: 'translateY(0)' },
       { opacity: 0, transform: 'translateY(-6px)' }],
      { duration: 150, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => {
      symEl.textContent = config.symbol;
      valEl.textContent = final.toLocaleString();
      valEl.animate(
        [{ opacity: 0, transform: 'translateY(6px)' },
         { opacity: 1, transform: 'translateY(0)' }],
        { duration: 175, easing: 'ease-out', fill: 'forwards' }
      );
    };
  });
}

function setBilling(cycle) {
  currentBilling = cycle;
  document.getElementById('btnMonthly').classList.toggle('active', cycle === 'monthly');
  document.getElementById('btnAnnual').classList.toggle('active',  cycle === 'annual');
  updatePrices();
}

function setCurrency(currency) {
  currentCurrency = currency;
  updatePrices();
}

updatePrices();

// =============================================
// NUMBER COUNTER ON SCROLL
// =============================================
function animateCounter(el, target, duration, suffix) {
  const start     = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = isDecimal
      ? (target * ease).toFixed(1)
      : Math.floor(target * ease);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const statEls = entry.target.querySelectorAll('.stat-number');
    const data = [
      { value: 99.9, suffix: '%' },
      { value: 10,   suffix: 'x' },
      { value: 500,  suffix: '+' },
    ];

    statEls.forEach((el, i) => {
      const d = data[i];
      if (!d) return;
      // Clear current text, animate
      el.textContent = '0' + d.suffix;
      animateCounter(el, d.value, 1200, d.suffix);
    });

    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// =============================================
// SECTION ENTRANCE ANIMATIONS
// =============================================
const animateSections = document.querySelectorAll('section, footer');
animateSections.forEach(el => el.classList.add('section-animate'));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

animateSections.forEach(el => sectionObserver.observe(el));