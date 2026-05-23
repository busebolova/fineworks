// ── GSAP setup ───────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);
gsap.config({ trialWarn: false });

// ── Yukarı çık butonu ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// ── Form tag toggle ──────────────────────────────────────────────
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('form-tag')) {
    e.target.classList.toggle('active');
  }
});

// ── Lightbox ─────────────────────────────────────────────────────
(function() {
  var images = [
    '/urun1.png', '/urun2.jpg', '/urun3.png', '/urun4.jpg',
    '/urun5.png', '/urun6.jpg', '/urun7.png', '/urun8.png'
  ];
  var currentIndex = 0;

  var overlay  = document.getElementById('lightbox');
  var img      = document.getElementById('lightboxImg');
  var counter  = document.getElementById('lightboxCounter');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn  = document.getElementById('lightboxPrev');
  var nextBtn  = document.getElementById('lightboxNext');

  if (!overlay) return;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    img.style.opacity = '0';
    setTimeout(function() {
      img.src = images[currentIndex];
      img.style.opacity = '1';
    }, 150);
    counter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function openLightbox(index) {
    showImage(index);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Collage görsellere tıklama
  document.addEventListener('click', function(e) {
    var clickable = e.target.closest('.collage-clickable');
    if (clickable) {
      var idx = parseInt(clickable.getAttribute('data-lightbox-index') || '0', 10);
      openLightbox(idx);
    }
  });

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  prevBtn  && prevBtn.addEventListener('click',  function() { showImage(currentIndex - 1); });
  nextBtn  && nextBtn.addEventListener('click',  function() { showImage(currentIndex + 1); });

  // Overlay'e tıklayınca kapat (görsel dışı alan)
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLightbox();
  });

  // Klavye navigasyonu
  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showImage(currentIndex - 1);
    if (e.key === 'ArrowRight')  showImage(currentIndex + 1);
  });

  // Touch/swipe desteği
  var touchStartX = 0;
  overlay.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showImage(currentIndex + 1) : showImage(currentIndex - 1);
    }
  }, { passive: true });
})();

// ── Preloader ────────────────────────────────────────────────────
function runPreloader(onComplete) {
  var tl = gsap.timeline({ onComplete: onComplete });

  // Harfler yukarı çıkar
  tl.to('.preloader-logo-char', {
    y: 0,
    opacity: 1,
    ease: 'power3.out',
    stagger: 0.06,
    duration: 0.6,
  })
  // Çizgi genişler
  .to('.preloader-line', {
    width: '100%',
    opacity: 0.3,
    ease: 'power2.inOut',
    duration: 0.5,
  }, '-=0.1')
  // Kısa bekleme
  .to({}, { duration: 0.3 })
  // Harfler yukarı kayar
  .to('.preloader-logo-char', {
    y: '-110%',
    opacity: 0,
    ease: 'power3.in',
    stagger: 0.04,
    duration: 0.45,
  })
  // Çizgi solar
  .to('.preloader-line', {
    opacity: 0,
    duration: 0.3,
  }, '<')
  // Preloader paneli yukarı kayar
  .to('#preloader', {
    yPercent: -100,
    ease: 'power3.inOut',
    duration: 0.7,
  }, '-=0.1')
  // Preloader gizlenir
  .set('#preloader', { display: 'none' });
}

// ── Slogan kelime döngüsü (daktilo efekti) ───────────────────────
function startSloganCycle() {
  var words = ['üretim', 'baskı', 'reklam', 'marka', 'görsel'];
  var current = 0;
  var wordEl = document.querySelector('.slogan-word');
  var wrapEl = document.querySelector('.slogan-word-wrap');
  if (!wordEl || !wrapEl) return;

  // En uzun kelimenin genişliğini ölç ve sabit tut
  var measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:inherit;font-size:inherit;letter-spacing:inherit;';
  wrapEl.appendChild(measurer);
  var maxW = 0;
  words.forEach(function(w) {
    measurer.textContent = w;
    if (measurer.offsetWidth > maxW) maxW = measurer.offsetWidth;
  });
  wrapEl.removeChild(measurer);
  wrapEl.style.minWidth = (maxW + 2) + 'px';

  var typeDelay = 60;   // ms per char (yazma)
  var deleteDelay = 40; // ms per char (silme)
  var pauseAfterType = 1600; // ms bekle
  var isAnimating = false;

  function typeWord(word, cb) {
    wordEl.textContent = '';
    var i = 0;
    function next() {
      if (i < word.length) {
        wordEl.textContent += word[i++];
        setTimeout(next, typeDelay);
      } else {
        cb && cb();
      }
    }
    next();
  }

  function deleteWord(cb) {
    var text = wordEl.textContent;
    var i = text.length;
    function next() {
      if (i > 0) {
        wordEl.textContent = text.slice(0, --i);
        setTimeout(next, deleteDelay);
      } else {
        cb && cb();
      }
    }
    next();
  }

  function cycle() {
    if (isAnimating) return;
    isAnimating = true;
    deleteWord(function() {
      current = (current + 1) % words.length;
      typeWord(words[current], function() {
        isAnimating = false;
        setTimeout(cycle, pauseAfterType);
      });
    });
  }

  // İlk kelimeyi yaz, sonra döngüyü başlat
  gsap.set(wordEl, { opacity: 1, y: 0 });
  typeWord(words[0], function() {
    setTimeout(cycle, pauseAfterType);
  });
}

function init() {
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

  // Mobil kontrolü — fonksiyonun başında tanımla
  var isMobile = window.innerWidth <= 768;

  // Hero title harflerini split et ve başlangıç durumunu ayarla
  var heroChars = [];
  if (typeof SplitText !== 'undefined') {
    var split = new SplitText('.hero-title', { type: 'chars', charsClass: 'split-char' });
    heroChars = split.chars;
  }

  if (heroChars.length) {
    // Title görünür yap ama harfler yukarıda gizli
    gsap.set('.hero-title', { opacity: 1 });
    gsap.set(heroChars, { y: '-120%', opacity: 0 });
  }

  // ── Intro animasyonu ─────────────────────────────────────────
  var tl = gsap.timeline({ delay: 0.1 });

  tl.to('.header-item', {
    y: 0,
    opacity: 1,
    ease: 'power2.out',
    stagger: 0.1,
    duration: 0.5,
  });

  // Hero title harfleri yukarıdan aşağıya hızlıca düşer
  if (heroChars.length) {
    tl.to(heroChars, {
      y: 0,
      opacity: 1,
      ease: 'power3.out',
      stagger: 0.04,
      duration: 0.45,
    }, '<0.1');
  } else {
    tl.to('.hero-title', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '<0.1');
  }

  tl.to('.hero-img', {
    opacity: 1,
    ease: 'power2.out',
    duration: 0.8,
  }, '<0.2');

  if (!isMobile) {
    tl.to('.make', { opacity: 1, duration: 0 }, '<')
    .fromTo('.make-text .split-line', {
      scaleY: 0,
      opacity: 0,
    }, {
      scaleY: 1,
      opacity: 1,
      ease: 'sine.out',
      transformOrigin: 'top',
      stagger: 0.05,
      duration: 0.5,
    }, '<0.1');
  }

  tl.call(function () {
    document.body.classList.remove('overflow-hidden');
    ScrollTrigger.refresh();
    startSloganCycle();
  });

  // ── Hero scroll animasyonu (masaüstü) ───────────────────────
  if (!isMobile) {
    // hero-title-rect başlangıç durumu — görünür olsun
    gsap.set('.hero-title-rect', { height: '113%', borderRadius: '0 0 10px 0' });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top+=10%',
        pin: true,
        scrub: true,
      },
    })
      .to('.hero-img', { height: 0, duration: 0.8 }, '<')
      .to('.hero-img video, .hero-img img', { y: '-40%', duration: 0.8 }, '<')
      .to('.hero-title', { y: '-10%', duration: 0.8, ease: 'sine.out' }, '<')
      .fromTo('.hero-title .split-char', {
        scaleY: 1,
        opacity: 1,
      }, {
        scaleY: 0,
        opacity: 0,
        ease: 'sine.in',
        transformOrigin: 'top',
        stagger: 0.03,
        duration: 0.5,
      }, '<')
      .to('.hero-title-rect', { height: 0, duration: 0.8, ease: 'sine.in' }, '<')
      .to('.hero-title-rect', { borderRadius: 0, duration: 0.15 }, '<0.65');
  }

  // ── Menü toggle ──────────────────────────────────────────────
  var menuOpen = false;
  var headerMenu = document.querySelector('.header-menu');
  var navOverlay = document.querySelector('.nav-overlay');

  function openNav() {
    menuOpen = true;
    gsap.set('.nav-link', { y: 30, opacity: 0 });
    gsap.set('.nav-contact-group', { y: 20, opacity: 0 });
    gsap.to('.nav-overlay', { opacity: 1, pointerEvents: 'all', duration: 0.5, ease: 'power3.out' });
    gsap.to('.nav-link', { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power3.out', delay: 0.15 });
    // nav-contact-group'u her zaman göster — mobilde de görünür olsun
    gsap.to('.nav-contact-group', { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.5 });
    gsap.to('.menu-line:first-child', { rotate: 45, y: 6, duration: 0.3 });
    gsap.to('.menu-line:last-child', { rotate: -45, y: -6, duration: 0.3 });
  }

  function closeNav() {
    menuOpen = false;
    gsap.to('.nav-overlay', { opacity: 0, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
    gsap.to('.menu-line:first-child', { rotate: 0, y: 0, duration: 0.3 });
    gsap.to('.menu-line:last-child', { rotate: 0, y: 0, duration: 0.3 });
  }

  if (headerMenu && navOverlay) {
    headerMenu.addEventListener('click', function () {
      menuOpen ? closeNav() : openNav();
    });
  }

  var navClose = document.querySelector('.nav-close');
  if (navClose) {
    navClose.addEventListener('click', closeNav);
  }

  // ── Make section scroll (pin + galeri) animasyonu ───────────
  if (!isMobile) {
    // Masaüstü: scroll animasyonu ile galeri açılır
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.make',
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: true,
      },
    })
      .fromTo('.make-text .split-line', { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0, ease: 'sine.in', transformOrigin: 'top', stagger: 0.05, duration: 0.5 }, '<')
      .fromTo('.gallery-main', { width: 0 }, { width: '100%', ease: 'none', duration: 0.5 })
      .fromTo('.gallery-main .radius', { width: 0, height: 0 }, { width: '10px', height: '10px', ease: 'none', duration: 0.05 }, '<');
  } else {
    // Mobilde make-text'i hemen göster, galeri animasyonu yok
    gsap.set('.make-text .split-line', { scaleY: 1, opacity: 1 });

    // Mobilde make-main flex column yap
    var makeMain = document.querySelector('.make-main');
    if (makeMain) {
      makeMain.style.setProperty('display', 'flex', 'important');
      makeMain.style.setProperty('flex-direction', 'column', 'important');
      makeMain.style.setProperty('grid-template-columns', 'unset', 'important');
    }

    // Mobilde TÜM make-text elementlerini sola hizala
    var makeTexts = document.querySelectorAll('.make-text');
    makeTexts.forEach(function(el) {
      el.style.setProperty('text-align', 'left', 'important');
      el.style.setProperty('width', '100%', 'important');
    });

    // Mobilde make section yüksekliğini sıfırla
    var makeSection = document.querySelector('.make');
    if (makeSection) {
      makeSection.style.setProperty('height', 'auto', 'important');
      makeSection.style.setProperty('min-height', 'auto', 'important');
    }

    // Mobilde galeri — GSAP clearProps ile tüm inline style'ları temizle
    // sonra CSS !important kuralları devreye girer
    gsap.set('.gallery-main', { clearProps: 'all' });
    gsap.set('.gallery-wrapp__big', { clearProps: 'all' });
    gsap.set('.gallery-wrapp__big .gallery-main', { clearProps: 'all' });
    gsap.set('.gallery-wrapp__big .gallery-item', { clearProps: 'all' });

    // gallery-item__rect gizle
    var bigRect = document.querySelector('.gallery-wrapp__big .gallery-item__rect');
    if (bigRect) bigRect.style.setProperty('display', 'none', 'important');

    // gallery-wrapp__left gizle
    var leftWrap = document.querySelector('.gallery-wrapp__left');
    if (leftWrap) leftWrap.style.setProperty('display', 'none', 'important');
  }
  // ── About section animasyonu — premium fade-up ───────────────
  if (isMobile) {
    // Mobilde animasyon yok — direkt göster
    gsap.set('.about-label-wrap', { y: 0, opacity: 1 });
    gsap.set('.about-title', { y: 0, opacity: 1 });
    gsap.set('[data-about-right]', { opacity: 1, filter: 'none' });
    gsap.set('.about-text', { y: 0, opacity: 1 });
    gsap.set('.about-service-item', { y: 0, opacity: 1 });
  } else {
    gsap.set('.about-label-wrap', { y: -12, opacity: 0 });
    gsap.set('.about-title', { y: 50, opacity: 0 });
    gsap.set('[data-about-right]', { opacity: 0, filter: 'blur(4px)' });
    gsap.set('.about-text', { y: 16, opacity: 0 });
    gsap.set('.about-service-item', { y: 32, opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.about',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })
      .to('.about-label-wrap', {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        duration: 0.5,
      })
      .to('.about-title', {
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        duration: 0.8,
      }, '<0.08')
      .to('[data-about-right]', {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.7,
      }, '<0.15')
      .to('.about-text', {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        stagger: 0.1,
        duration: 0.55,
      }, '<0.05');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.about-services',
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    })
      .to('.about-service-item', {
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        stagger: 0.07,
        duration: 0.55,
      });
  }

  // ── References section — scroll ile çark gibi dönen collage ──
  var collage = document.querySelector('[data-refs-collage]');

  if (collage) {
    // Scroll'a bağlı — section boyunca 2 tam tur döner
    gsap.to(collage, {
      rotation: 720,
      ease: 'none',
      transformOrigin: '50% 50%',
      scrollTrigger: {
        trigger: '.psd-welcome-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // ── Marka slider — sonsuz marquee ────────────────────────────
  function initBrandMarquee(selector, direction) {
    var track = document.querySelector(selector + ' .brand-track');
    if (!track) return;
    var totalWidth = track.scrollWidth / 2;
    var startX = direction === 'right' ? -totalWidth : 0;
    var endX   = direction === 'right' ? 0 : -totalWidth;

    gsap.fromTo(track,
      { x: startX },
      {
        x: endX,
        ease: 'none',
        duration: 22,
        repeat: -1,
      }
    );
  }

  initBrandMarquee('[data-brand-left]',  'left');
  initBrandMarquee('[data-brand-right]', 'right');

  // References section fade-in
  gsap.set('.collage-wrapper', { opacity: 0, scale: 0.94 });
  gsap.set('.psd-text-content', { x: 30, opacity: 0 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.psd-welcome-section',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  })
    .to('.collage-wrapper', {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      duration: 0.9,
    })
    .to('.psd-text-content', {
      x: 0,
      opacity: 1,
      ease: 'power3.out',
      duration: 0.75,
    }, '<0.2');

  // Mobil düzeltmeleri — init() sonunda uygula
  if (isMobile) {
    // make-text sola hizala (SplitText işleminden sonra)
    document.querySelectorAll('.make-text').forEach(function(el) {
      el.style.setProperty('text-align', 'left', 'important');
      el.style.setProperty('width', '100%', 'important');
    });
    // make-main flex column
    var mm = document.querySelector('.make-main');
    if (mm) {
      mm.style.setProperty('display', 'flex', 'important');
      mm.style.setProperty('flex-direction', 'column', 'important');
      mm.style.setProperty('grid-template-columns', 'unset', 'important');
    }

    // Galeri — clearProps ile GSAP inline style'larını temizle, CSS devreye girsin
    gsap.set('.gallery-main', { clearProps: 'all' });
    gsap.set('.gallery-wrapp__big', { clearProps: 'all' });
  }
}

// ── Güvenilir başlatma: DOM + scriptler hazır olunca ─────────────
function start() {
  var isMobileStart = window.innerWidth <= 768;

  // SplitText
  if (typeof SplitText !== 'undefined') {
    new SplitText('[split-lines]', { type: 'lines', linesClass: 'split-line' });
  }

  // Başlangıç durumlarını preloader arkasında hazırla
  gsap.set('.header-item', { y: -20, opacity: 0 });
  gsap.set('.hero-img', { opacity: 0 });

  if (!isMobileStart) {
    gsap.set('.make', { opacity: 0 });
    gsap.set('.make-text .split-line', { scaleY: 0, opacity: 0, transformOrigin: 'top' });
    // Masaüstünde galeri başlangıçta gizli (GSAP scroll animasyonla açılır)
    gsap.set('.gallery-main', { width: 0 });
  } else {
    // Mobilde make section'ı hemen görünür yap
    gsap.set('.make', { opacity: 1 });
    gsap.set('.make-text .split-line', { scaleY: 1, opacity: 1 });
    // Mobilde galeri: GSAP hiç dokunmasın, CSS !important kuralları geçerli
    // gallery-main'e width:0 set etme — clearProps ile temizle
    gsap.set('.gallery-main', { clearProps: 'width,height' });
  }

  runPreloader(init);
}

if (document.readyState === 'complete') {
  start();
} else {
  window.addEventListener('load', start);
}