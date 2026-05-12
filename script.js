'use strict';

/* ══ LOADER ════════════════════════════════════ */
document.fonts.ready.then(() => {
    /* Font is confirmed loaded — now trigger the fade-in animation */
    document.getElementById('loaderContent').classList.add('ready');

    /* Hide the loader after the animation finishes (name 1.6s + tagline 0.7s+1.2s = 1.9s, hold 0.5s) */
    setTimeout(() => {
        document.getElementById('loader').classList.add('gone');
    }, 2000);
});

/* ══ HEADER SCROLL ══════════════════════════════ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 60);
    document.getElementById('topBtn').classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ══ MOBILE MENU ════════════════════════════════ */
const burger  = document.getElementById('burger');
const burgerIcon = document.getElementById('burgerIcon');
const nav     = document.getElementById('nav');

burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burgerIcon.className = open ? 'fas fa-times' : 'fas fa-bars';
    document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('.nav-a').forEach(a => {
    a.addEventListener('click', () => {
        nav.classList.remove('open');
        burgerIcon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    });
});

/* ══ ACTIVE NAV LINK ════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-a');

window.addEventListener('scroll', () => {
    const y = window.scrollY + 120;
    sections.forEach(s => {
        if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active-link'));
            const match = document.querySelector(`.nav-a[href="#${s.id}"]`);
            if (match) match.classList.add('active-link');
        }
    });
}, { passive: true });

/* ══ HERO CAROUSEL ══════════════════════════════ */
(function () {
    const slides  = document.querySelectorAll('.slide');
    const dots    = document.querySelectorAll('.sdot');
    const numEl   = document.getElementById('slideNum');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const heroEl  = document.querySelector('.hero');

    let current = 0;
    let timer;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function goTo(n) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        if (numEl) numEl.textContent = pad(current + 1);
    }

    function start() { timer = setInterval(() => goTo(current + 1), 5000); }
    function stop()  { clearInterval(timer); }

    prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
    nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stop(); goTo(i); start(); }));

    /* Pause on hover */
    heroEl.addEventListener('mouseenter', stop);
    heroEl.addEventListener('mouseleave', start);

    /* Touch/swipe */
    let touchX = 0;
    heroEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stop(); goTo(current + (diff > 0 ? 1 : -1)); start(); }
    }, { passive: true });

    start();
})();

/* ══ SCROLL REVEAL ══════════════════════════════ */
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('shown');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ══ COUNTER ANIMATION ══════════════════════════ */
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.count').forEach(el => {
                if (el.dataset.done) return;
                el.dataset.done = '1';
                const target = +el.dataset.target;
                const dur = 2000;
                const start = performance.now();
                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - (1 - p) ** 3;
                    el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = target.toLocaleString('en-IN');
                })(start);
            });
            obs.unobserve(e.target);
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.about-stats');
    if (statsEl) obs.observe(statsEl);
})();

/* ══ TESTIMONIAL SLIDER ═════════════════════════ */
(function () {
    const track = document.getElementById('testiTrack');
    const dots  = document.querySelectorAll('.tdot');
    const prev  = document.getElementById('tPrev');
    const next  = document.getElementById('tNext');
    if (!track) return;

    let cur = 0, total = dots.length, timer;

    function go(n) {
        cur = (n + total) % total;
        track.style.transform = `translateX(-${cur * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    prev.addEventListener('click', () => { clearInterval(timer); go(cur - 1); timer = setInterval(() => go(cur + 1), 5500); });
    next.addEventListener('click', () => { clearInterval(timer); go(cur + 1); timer = setInterval(() => go(cur + 1), 5500); });
    dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); go(i); timer = setInterval(() => go(cur + 1), 5500); }));

    timer = setInterval(() => go(cur + 1), 5500);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
    track.parentElement.addEventListener('mouseleave', () => { timer = setInterval(() => go(cur + 1), 5500); });
})();

/* ══ CONTACT FORM → WHATSAPP ════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const cat   = document.getElementById('fInt').value;
    const msg   = document.getElementById('fMsg').value.trim();

    if (!name || !phone || !msg) {
        showToast('Please fill all required fields.', 'error');
        return;
    }

    const lines = [
        `🙏 *Hello Mangilal Jwellers!*`,
        ``,
        `*New Enquiry from Website*`,
        `────────────────────`,
        `👤 *Name:* ${name}`,
        `📞 *Phone:* ${phone}`,
        email ? `📧 *Email:* ${email}` : null,
        cat   ? `💎 *Interested In:* ${cat}` : null,
        ``,
        `💬 *Message:*\n${msg}`,
        ``,
        `────────────────────`,
        `_Sent from MangilalJwellers.com_`,
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/919685533548?text=${encodeURIComponent(lines)}`, '_blank');
    this.reset();
    showToast('Opening WhatsApp with your message ✓');
});

/* ══ TOAST ══════════════════════════════════════ */
function showToast(msg, type) {
    let el = document.getElementById('_toast');
    if (!el) {
        el = document.createElement('div');
        el.id = '_toast';
        el.style.cssText = [
            'position:fixed', 'bottom:110px', 'right:32px', 'z-index:9999',
            'padding:13px 22px', 'font-family:Inter,sans-serif', 'font-size:.82rem',
            'font-weight:500', 'color:#fff', 'box-shadow:0 8px 28px rgba(0,0,0,.2)',
            'opacity:0', 'transform:translateY(12px)',
            'transition:all .4s cubic-bezier(.22,1,.36,1)',
        ].join(';');
        document.body.appendChild(el);
    }
    el.style.background = type === 'error' ? '#c0392b' : '#25D366';
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; }, 3500);
}

/* ══ BACK TO TOP ════════════════════════════════ */
document.getElementById('topBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
