/* ============================================
   LUMORA ESTATES — Shared JavaScript
   script.js
   ============================================ */

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
});

/* ---- Theme Toggle ---- */
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('lumora-theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon();

function updateThemeIcon() {
  if (themeBtn) {
    const isDark = body.getAttribute('data-theme') !== 'light';
    themeBtn.textContent = isDark ? '☀️' : '🌙';
  }
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('lumora-theme', next);
    updateThemeIcon();
  });
}

/* ---- Navbar Scroll ---- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  updateScrollProgress();
}, { passive: true });

/* ---- Scroll Progress Bar ---- */
function updateScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (scrollTop / docHeight * 100) + '%';
}

/* ---- Mobile Nav ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

/* ---- Active Nav Link ---- */
(function() {
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Particles Canvas ---- */
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      const colors = ['14,165,255', '0,212,184', '245,200,66', '168,85,247'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(14,165,255,${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });
    raf = requestAnimationFrame(animate);
  }
  animate();
})();

/* ---- Mouse Parallax ---- */
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.02;
    el.style.transform = `translate(${mx * speed * 100}px, ${my * speed * 100}px)`;
  });
});

/* ---- Card Tilt Effect ---- */
function initTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = (y - cy) / cy * -8;
      const rotY = (x - cx) / cx * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => card.style.transition = '', 400);
    });
  });
}
initTilt('.property-card');
initTilt('.agent-card');
initTilt('.project-card');

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stats-section, .hero-stats').forEach(el => counterObserver.observe(el));

/* ---- Testimonial Slider ---- */
(function() {
  const inner = document.querySelector('.testimonials-inner');
  if (!inner) return;
  const cards = inner.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dot');
  let current = 0;
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
  let autoPlay = setInterval(next, 4500);

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    const offset = current * (100 / 3 + 24 / inner.parentElement.offsetWidth * 100);
    inner.style.transform = `translateX(-${current * (100 / 3)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoPlay); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoPlay); next(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoPlay); goTo(i); }));
  goTo(0);
})();

/* ---- Property Filters ---- */
(function() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.property-card');
  if (!chips.length || !cards.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ---- Sort Properties ---- */
(function() {
  const sortSelect = document.getElementById('sortSelect');
  const grid = document.getElementById('propertiesGrid');
  if (!sortSelect || !grid) return;
  sortSelect.addEventListener('change', () => {
    const cards = [...grid.querySelectorAll('.property-card')];
    const val = sortSelect.value;
    cards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || '0');
      const priceB = parseFloat(b.dataset.price || '0');
      if (val === 'price-asc') return priceA - priceB;
      if (val === 'price-desc') return priceB - priceA;
      return 0;
    });
    cards.forEach(c => grid.appendChild(c));
  });
})();

/* ---- Wishlist Toggle ---- */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
    const msg = btn.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist';
    showToast(msg);
  });
});

/* ---- Toast Notification ---- */
function showToast(msg, type = 'info') {
  let toast = document.getElementById('lm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lm-toast';
    toast.style.cssText = `
      position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);
      background:var(--bg-glass-strong);backdrop-filter:blur(20px);
      border:1px solid var(--border-glass);border-radius:var(--radius-pill);
      padding:12px 24px;font-size:0.85rem;font-family:var(--font-body);
      color:var(--text-primary);z-index:9000;opacity:0;
      transition:all 0.3s ease;white-space:nowrap;pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}

/* ---- Chatbot ---- */
(function() {
  const btn = document.getElementById('chatbotBtn');
  const win = document.getElementById('chatbotWindow');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');
  if (!btn || !win) return;

  const responses = [
    "I'd be happy to help you find your perfect luxury property! What type of home are you looking for?",
    "Our current featured properties start from $1.2M. Would you like to schedule a private viewing?",
    "We have stunning penthouses, villas, and apartments available across prime locations.",
    "Our expert agents are available 24/7. Shall I connect you with a specialist?",
    "Lumora Estates offers exclusive properties with world-class amenities. How can I assist you today?",
    "We offer virtual 3D tours for all our properties. Would you like to explore one?"
  ];
  let rIdx = 0;

  btn.addEventListener('click', () => win.classList.toggle('open'));

  function sendMessage() {
    if (!input.value.trim()) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = input.value;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.textContent = responses[rIdx++ % responses.length];
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 800);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
})();

/* ---- Mortgage Calculator ---- */
(function() {
  const form = document.getElementById('mortgageCalc');
  if (!form) return;
  function calc() {
    const price = parseFloat(document.getElementById('calcPrice')?.value || 0);
    const down = parseFloat(document.getElementById('calcDown')?.value || 20) / 100;
    const rate = parseFloat(document.getElementById('calcRate')?.value || 4.5) / 100 / 12;
    const years = parseInt(document.getElementById('calcYears')?.value || 30);
    const principal = price * (1 - down);
    const n = years * 12;
    const monthly = principal * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1);
    const el = document.getElementById('calcMonthly');
    if (el) el.textContent = isNaN(monthly) ? '$0' : '$' + Math.round(monthly).toLocaleString();
    const totalEl = document.getElementById('calcTotal');
    if (totalEl) totalEl.textContent = isNaN(monthly) ? '$0' : '$' + Math.round(monthly * n).toLocaleString();
  }
  form.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
  calc();
})();

/* ---- Progress Bars ---- */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-bar-fill').forEach(bar => {
        const w = bar.dataset.width || '0';
        bar.style.width = w + '%';
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.project-image').forEach(el => progressObserver.observe(el));

/* ---- Newsletter Form ---- */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🎉 Subscribed successfully! Welcome to Lumora Estates.');
    newsletterForm.reset();
  });
}

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll contact you within 24 hours.');
    contactForm.reset();
  });
}

/* ---- Smooth Page Transitions ---- */
document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="tel"]):not([href^="mailto"])').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.href;
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => window.location.href = href, 300);
  });
});
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('pageshow', () => {
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
// Also trigger on DOMContentLoaded for direct loads
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

/* ---- Search Bar Live Filter ---- */
(function() {
  const searchInput = document.getElementById('propertySearch');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.property-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
})();

/* ---- Floor Plan Hotspots ---- */
document.querySelectorAll('.floor-plan-room').forEach(room => {
  room.addEventListener('click', () => {
    const name = room.dataset.room || 'Room';
    showToast(`📍 Viewing: ${name}`);
  });
});

/* ---- Tour Room Cards ---- */
document.querySelectorAll('.tour-room-card').forEach(card => {
  card.addEventListener('click', () => {
    const room = card.dataset.room || 'this room';
    showToast(`🔄 Loading 360° tour of ${room}...`);
  });
});

/* ---- Appointment Booking ---- */
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('📅 Site visit booked! Check your email for confirmation.');
    appointmentForm.reset();
  });
}

/* ---- Scroll to section ---- */
document.querySelectorAll('[data-scroll-to]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---- Scroll progress bar init ---- */
(function() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0%;
    background:linear-gradient(90deg,#0ea5ff,#00d4b8);
    z-index:1001;transition:width 0.1s linear;pointer-events:none;
  `;
  document.body.appendChild(bar);
})();

/* ---- Image lazy loading fallback ---- */
document.querySelectorAll('img[data-src]').forEach(img => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
  observer.observe(img);
});

/* ---- Glow cursor effect ---- */
(function() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;width:300px;height:300px;pointer-events:none;
    background:radial-gradient(ellipse,rgba(14,165,255,0.06) 0%,transparent 70%);
    border-radius:50%;transform:translate(-50%,-50%);z-index:1;
    transition:left 0.15s ease,top 0.15s ease;
  `;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }, { passive: true });
})();
