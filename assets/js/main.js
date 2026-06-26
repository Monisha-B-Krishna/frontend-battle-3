// =============================================
// PAGE LOADER — must complete within 500ms
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
  }, 450);
});

// =============================================
// NAVBAR SCROLL + ACTIVE LINK
// =============================================
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) mainNav.classList.add('scrolled');
  else mainNav.classList.remove('scrolled');

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
// TYPEWRITER ON HERO BADGE
// =============================================
const badgeText = document.querySelector('.hero-badge span');
if (badgeText) {
  const text = badgeText.textContent;
  badgeText.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      badgeText.textContent += text.charAt(i);
      i++;
      setTimeout(type, 55);
    }
  }
  setTimeout(type, 500);
}

// =============================================
// BENTO STAGGER ON SCROLL
// =============================================
let activeIndex = 0;

const bentoCards = document.querySelectorAll('.bento-card');

const bentoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('bento-visible');
    }
  });
}, { threshold: 0.1 });

bentoCards.forEach(card => {
  bentoObserver.observe(card);
  card.addEventListener('mouseenter', () => {
    bentoCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    activeIndex = parseInt(card.dataset.index);
  });
});

// =============================================
// ACCORDION
// =============================================
const accItems = document.querySelectorAll('.acc-item');

function openAccordion(index) {
  accItems.forEach(item => {
    const isTarget = parseInt(item.dataset.index) === index;
    item.classList.toggle('open', isTarget);
    item.querySelector('.acc-trigger')
        .setAttribute('aria-expanded', isTarget);
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
}, { passive: true });

// =============================================
// PRICING MATRIX — WAAPI isolated updates
// =============================================
const pricingMatrix = {
  USD: { symbol: '$', tariff: 1.00,  tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
  INR: { symbol: '₹', tariff: 83.5,  tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
  EUR: { symbol: '€', tariff: 0.92,  tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
};

const ANNUAL_DISCOUNT = 0.8;
let currentBilling  = 'monthly';
let currentCurrency = 'USD';

function updatePrices() {
  const config   = pricingMatrix[currentCurrency];
  const discount = currentBilling === 'annual' ? ANNUAL_DISCOUNT : 1;

  ['starter', 'pro', 'enterprise'].forEach(tier => {
    const final = Math.round(config.tiers[tier] * config.tariff * discount);
    const symEl = document.getElementById('sym-' + tier);
    const valEl = document.getElementById('val-' + tier);

    valEl.animate(
      [{ opacity: 1, transform: 'translateY(0)' },
       { opacity: 0, transform: 'translateY(-8px)' }],
      { duration: 150, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => {
      symEl.textContent = config.symbol;
      valEl.textContent = final.toLocaleString();
      valEl.animate(
        [{ opacity: 0, transform: 'translateY(8px)' },
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
// NUMBER COUNTER
// =============================================
function animateCounter(el, target, duration, suffix) {
  const start     = performance.now();
  const isDecimal = target % 1 !== 0;
  const inner     = el.querySelector('span') || null;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = isDecimal
      ? (target * ease).toFixed(1)
      : Math.floor(target * ease);
    if (inner) {
      el.childNodes[0].textContent = current;
    } else {
      el.textContent = current + suffix;
    }
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
      if (!data[i]) return;
      animateCounter(el, data[i].value, 1500, data[i].suffix);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// =============================================
// SECTION ENTRANCE
// =============================================
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('section, footer').forEach(el => {
  el.classList.add('section-animate');
  sectionObs.observe(el);
});

// =============================================
// FAQ ACCORDION
// =============================================
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-trigger').setAttribute('aria-expanded', false);
    });
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', true);
    }
  });
});

// Testimonial switcher
function switchReview(index) {
  document.querySelectorAll('.trust-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.review-card').forEach(r => r.classList.remove('active'));
  document.querySelector(`.trust-btn[data-review="${index}"]`).classList.add('active');
  document.querySelector(`.review-card[data-review="${index}"]`).classList.add('active');
}