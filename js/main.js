/* ══════════════════════════════════════════════════════════════
   Portfolio — Main JavaScript
   打字機效果、捲動動畫
   ══════════════════════════════════════════════════════════════ */

// ── Typing Effect ─────────────────────────────────────────────
class TypeWriter {
  constructor(element, texts, wait = 2000) {
    this.element = element;
    this.texts = texts;
    this.wait = wait;
    this.txt = '';
    this.textIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.textIndex % this.texts.length;
    const fullTxt = this.texts[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.innerHTML = `${this.txt}<span class="cursor"></span>`;

    let typeSpeed = 80;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.textIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ── Scroll Animation (Fade In) ────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ── Smooth Scroll for Anchor Links ────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ── Navigation Active State ───────────────────────────────────
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active');
      }
    });
  });
}

// ── Auto-redirect on scroll (Both directions) ─────────────────
function initAutoRedirect() {
  let isRedirecting = false;
  let redirectUrlDown = null;
  let redirectUrlUp = null;
  let wheelUpCount = 0;

  // Determine redirect URLs based on current page
  const path = window.location.pathname;
  
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/portfolio/')) {
    redirectUrlDown = 'about.html';
    // No up redirect from homepage
  } else if (path.endsWith('about.html')) {
    redirectUrlDown = 'projects.html';
    redirectUrlUp = 'index.html';
  } else if (path.endsWith('projects.html')) {
    redirectUrlDown = 'skills.html';
    redirectUrlUp = 'about.html';
  } else if (path.endsWith('skills.html')) {
    redirectUrlUp = 'projects.html';
  }

  // Scroll down to bottom redirect
  if (redirectUrlDown) {
    window.addEventListener('scroll', () => {
      if (isRedirecting) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Check if user scrolled to near bottom (within 100px)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        isRedirecting = true;
        fadeAndRedirect(redirectUrlDown);
      }
    });
  }

  // Scroll up to top redirect
  if (redirectUrlUp) {
    window.addEventListener('wheel', (e) => {
      if (isRedirecting) return;

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      // Check if at top and scrolling up
      if (scrollTop === 0 && e.deltaY < 0) {
        wheelUpCount++;
        
        // Need 2-3 consecutive scroll up attempts at top
        if (wheelUpCount >= 2) {
          isRedirecting = true;
          fadeAndRedirect(redirectUrlUp);
        }
      } else {
        wheelUpCount = 0; // Reset if not at top or scrolling down
      }
    }, { passive: true });

    // Also handle touch scroll on mobile
    let touchStartY = 0;
    let touchMoveCount = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchMoveCount = 0;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isRedirecting) return;

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;

      // Pull down at top (scroll up gesture)
      if (scrollTop === 0 && deltaY > 50) {
        touchMoveCount++;
        
        if (touchMoveCount >= 2) {
          isRedirecting = true;
          fadeAndRedirect(redirectUrlUp);
        }
      }
    }, { passive: true });
  }

  function fadeAndRedirect(url) {
    // Add fade out effect
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    // Redirect after fade out
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }
}

// ── Mobile Menu Toggle ───────────────────────────────────────
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  // Close menu when a link is tapped
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// ── Initialize on DOM Ready ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Typing effect
  const taglineEl = document.querySelector('.hero__tagline');
  if (taglineEl) {
    const texts = taglineEl.dataset.texts 
      ? JSON.parse(taglineEl.dataset.texts)
      : ['政策法規統整', '跨國比較研究', '利害關係人分析', '政府專案執行', 'AI 輔助研究'];
    new TypeWriter(taglineEl, texts, 2000);
  }

  // Scroll animations
  initScrollAnimations();

  // Smooth scroll
  initSmoothScroll();

  // Nav active state
  initNavActiveState();

  // Mobile menu
  initMobileMenu();

  // Auto-redirect on homepage
  initAutoRedirect();
});

