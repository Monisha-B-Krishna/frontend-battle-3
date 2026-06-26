// =============================================
// NAVBAR SCROLL
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// =============================================
// BENTO <-> ACCORDION STATE TRANSFER
// =============================================
let activeIndex = 0;

// Bento hover tracking
const bentoCards = document.querySelectorAll('.bento-card');
bentoCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    bentoCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    activeIndex = parseInt(card.dataset.index);
  });
});

// Accordion click toggle
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

// Context transfer on resize
let wasMobile = window.innerWidth < 768;

window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  if (!wasMobile && isMobile) {
    // Crossed into mobile — transfer active bento index to accordion
    openAccordion(activeIndex);
  }
  wasMobile = isMobile;
});

// =============================================
// PRICING MATRIX — Feature 1
// =============================================
const pricingMatrix = {
  USD: { symbol: '$', tariff: 1.00,    tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
  INR: { symbol: '₹', tariff: 83.5,   tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
  EUR: { symbol: '€', tariff: 0.92,   tiers: { starter: 29,  pro: 79,  enterprise: 199 } },
};

const ANNUAL_DISCOUNT = 0.8;

let currentBilling  = 'monthly';
let currentCurrency = 'USD';

function updatePrices() {
  const config   = pricingMatrix[currentCurrency];
  const discount = currentBilling === 'annual' ? ANNUAL_DISCOUNT : 1;

  const tiers = ['starter', 'pro', 'enterprise'];
  tiers.forEach(tier => {
    const base  = config.tiers[tier];
    const final = Math.round(base * config.tariff * discount);

    // Isolate update to text nodes only — no parent reflow
    document.getElementById('sym-' + tier).textContent = config.symbol;
    document.getElementById('val-' + tier).textContent = final.toLocaleString();
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

// Init on load
updatePrices();