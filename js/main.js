// =====================================================
// SMITH HVAC — Main JavaScript
// =====================================================

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileNav();
  initFAQ();
  initCalculator();
  initContactForm();
  initScrollAnimations();
  initFooterYear();
});

// =====================================================
// HEADER: Sticky scroll shadow
// =====================================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// =====================================================
// MOBILE NAV: Hamburger toggle
// =====================================================
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// =====================================================
// FAQ: Accordion
// =====================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.querySelector('.faq-question')?.classList.remove('active');
        i.querySelector('.faq-answer')?.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.classList.add('active');
        answer.classList.add('open');
      }
    });
  });
}

// =====================================================
// PRICING CALCULATOR
// =====================================================
function initCalculator() {
  const steps   = document.querySelectorAll('.calc-step');
  const dots    = document.querySelectorAll('.calc-dot');
  const prevBtn = document.getElementById('calcPrev');
  const nextBtn = document.getElementById('calcNext');
  const result  = document.getElementById('calcResult');

  if (!steps.length || !prevBtn || !nextBtn) return;

  let currentStep = 1;
  const totalSteps = steps.length;

  function showStep(step) {
    steps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === step));
    dots.forEach(d => {
      const ds = parseInt(d.dataset.step);
      d.classList.toggle('active', ds === step);
      d.classList.toggle('done', ds < step);
    });
    prevBtn.disabled = (step === 1);
    nextBtn.textContent = step === totalSteps ? 'Get My Estimate →' : 'Next →';
  }

  function getSelection(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  }

  function calculateEstimate() {
    const system  = getSelection('system');
    const service = getSelection('service');
    const size    = getSelection('size');
    const age     = getSelection('age');

    const pricing = {
      repair: {
        ac:      { small: [150, 350], medium: [200, 500], large: [250, 600], xlarge: [300, 700] },
        furnace: { small: [150, 350], medium: [200, 450], large: [250, 550], xlarge: [300, 650] },
        both:    { small: [300, 650], medium: [400, 900], large: [500,1100], xlarge: [600,1300] },
      },
      replacement: {
        ac:      { small: [2800, 4500], medium: [3500, 5500], large: [4500, 7000], xlarge: [6000, 9000] },
        furnace: { small: [2500, 4000], medium: [3000, 5000], large: [4000, 6500], xlarge: [5000, 8000] },
        both:    { small: [5000, 8000], medium: [7000,11000], large: [9000,14000], xlarge:[12000,18000] },
      },
      maintenance: {
        ac:      { small: [75, 120],  medium: [90, 140],  large: [110, 160],  xlarge: [130, 190]  },
        furnace: { small: [75, 120],  medium: [90, 140],  large: [110, 160],  xlarge: [130, 190]  },
        both:    { small: [130, 200], medium: [160, 240],  large: [190, 280],  xlarge: [220, 320]  },
      },
      install: {
        ac:      { small: [3000, 5000], medium: [4000, 6500], large: [5500, 8000], xlarge: [7000,10000] },
        furnace: { small: [2800, 4500], medium: [3500, 5800], large: [5000, 7500], xlarge: [6500, 9500] },
        both:    { small: [5500, 9000], medium: [7500,12000], large:[10000,15000], xlarge:[14000,20000] },
      }
    };

    const ageFactor = { new: 0.9, mid: 1.0, old: 1.1, vold: 1.25 };
    const factor    = ageFactor[age] || 1;

    const s = system  || 'ac';
    const sv = service || 'repair';
    const sz = size    || 'medium';

    const range = (pricing[sv] && pricing[sv][s] && pricing[sv][s][sz]) || [150, 500];
    const low   = Math.round(range[0] * factor / 50) * 50;
    const high  = Math.round(range[1] * factor / 50) * 50;

    const fmt  = n => '$' + n.toLocaleString();

    const rangeValue   = document.getElementById('rangeValue');
    const resultDetails= document.getElementById('resultDetails');
    const resultSavings= document.getElementById('resultSavings');
    const savingsText  = document.getElementById('savingsText');

    if (rangeValue)    rangeValue.textContent    = `${fmt(low)} – ${fmt(high)}`;

    const details = buildDetails(s, sv, sz, age, low, high);
    if (resultDetails) resultDetails.innerHTML = details;

    // Maintenance plan savings hint
    if (sv === 'repair' && resultSavings && savingsText) {
      const save = Math.round((low * 0.15) / 10) * 10;
      savingsText.textContent = `With a Smith HVAC Maintenance Plan, you'd save 15% on this repair — that's ~${fmt(save)} off, plus free diagnostic visits and priority scheduling year-round.`;
      resultSavings.style.display = 'block';
    } else if (resultSavings) {
      resultSavings.style.display = 'none';
    }
  }

  function buildDetails(system, service, size, age, low, high) {
    const labels = {
      system:  { ac: 'Air Conditioning', furnace: 'Furnace/Heating', both: 'AC + Furnace' },
      service: { repair: 'Repair', replacement: 'Full Replacement', maintenance: 'Maintenance/Tune-Up', install: 'New Installation' },
      size:    { small: 'Under 1,200 sq ft', medium: '1,200–2,500 sq ft', large: '2,500–4,000 sq ft', xlarge: '4,000+ sq ft' },
      age:     { new: '0–5 years old', mid: '5–10 years old', old: '10–15 years old', vold: '15+ years old' }
    };

    let notes = '';
    if (service === 'repair' && age === 'vold') {
      notes = '<p style="color:#c44d22;font-weight:600;margin-top:8px;">⚠️ With a system 15+ years old, replacement may be more cost-effective than repair. We\'ll give you an honest recommendation when we visit.</p>';
    }
    if (service === 'replacement') {
      notes = '<p style="color:#166534;font-weight:600;margin-top:8px;">💡 New high-efficiency systems can reduce energy bills by 20–40% and qualify for federal tax credits. Ask us about financing options.</p>';
    }

    return `
      <div style="font-size:0.85rem;line-height:1.8;color:#64748b;">
        <strong style="color:#2c3e50;display:block;margin-bottom:4px;">Your Selections:</strong>
        System: ${labels.system[system] || system}<br/>
        Service: ${labels.service[service] || service}<br/>
        Home Size: ${labels.size[size] || size}<br/>
        System Age: ${labels.age[age] || age}
        ${notes}
      </div>
    `;
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; showStep(currentStep); }
  });

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Show result
      calculateEstimate();
      if (result) {
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        result.style.animation = 'none';
        result.offsetHeight; // reflow
        result.style.animation = '';
      }
    }
  });

  showStep(1);
}

// =====================================================
// CONTACT FORM: Validation + simulated submit
// =====================================================
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate form submission (replace with actual backend/service like Netlify Forms, Formspree, etc.)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });

  // Remove error on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// =====================================================
// SCROLL ANIMATIONS: Fade up on scroll
// =====================================================
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.service-card, .why-card, .review-card, .plan-card, .video-card, .faq-item, .contact-item, .area-list li'
  );

  targets.forEach(el => el.classList.add('fade-up'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    targets.forEach(el => el.classList.add('visible'));
  }
}

// =====================================================
// FOOTER: Dynamic year
// =====================================================
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
