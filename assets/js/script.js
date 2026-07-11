/**
 * ============================================================
 * KOPANA - Koperasi Jasa Serba Usaha Purnakaryawan Pertamina
 * Website Resmi | script.js
 * Version: 1.0.0
 * ============================================================
 *
 * Daftar Isi:
 * 1.  Navbar (Sticky + Scroll)
 * 2.  Mobile Navigation
 * 3.  Dark Mode Toggle
 * 4.  Hero Particles Animation
 * 5.  Smooth Scroll
 * 6.  Scroll Reveal Animation (IntersectionObserver)
 * 7.  Tab (Tentang Kami)
 * 8.  Counter Animation (Statistik)
 * 9.  Galeri Filter
 * 10. Lightbox
 * 11. Back to Top
 * 12. Active NavLink on Scroll
 * 13. KopanaAPI (render konten dari data/*.json)
 * ============================================================
 */

'use strict';

/* ============================================================
   HELPER: Escape HTML — cegah injeksi markup dari data JSON
   ============================================================ */
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ============================================================
   HELPER: Slug berita — dipakai untuk URL halaman detail berita
   (harus sama persis dengan fungsi di berita.html)
   ============================================================ */
function slugBerita(judul) {
  return String(judul ?? '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ============================================================
   HELPER: Parse tanggal "DD MMM YYYY" — aman lintas browser
   (Safari/iOS tidak mendukung format ini di new Date())
   ============================================================ */
function parseTanggal(str) {
  if (!str) return 0;
  const m = String(str).trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const bulan = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, mei: 4, jun: 5,
      jul: 6, aug: 7, agu: 7, agt: 7, sep: 8, oct: 9, okt: 9,
      nov: 10, dec: 11, des: 11
    };
    const idx = bulan[m[2].slice(0, 3).toLowerCase()];
    if (idx !== undefined) return new Date(+m[3], idx, +m[1]).getTime();
  }
  const t = new Date(str).getTime();
  return isNaN(t) ? 0 : t;
}


/* ============================================================
   1. NAVBAR - STICKY & SCROLL EFFECT
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    // Tambahkan class scrolled saat sudah scroll
    if (window.scrollY > 50 || navbar.classList.contains('always-scrolled')) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Panggil saat load
})();


/* ============================================================
   2. MOBILE NAVIGATION
   ============================================================ */
(function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    // Cegah scroll saat menu terbuka
    document.body.style.overflow = isOpen ? '' : 'hidden';
    hamburger.setAttribute('aria-expanded', !isOpen);
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleMenu);

  // Tutup menu saat klik link
  const allMenuLinks = navMenu.querySelectorAll('.nav-link');
  allMenuLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Tutup menu saat klik di luar
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Tutup saat resize ke desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
})();


/* ============================================================
   3. DARK MODE TOGGLE
   ============================================================ */
(function initDarkMode() {
  const toggleBtn = document.getElementById('dark-toggle');
  const icon = document.getElementById('dark-icon');
  if (!toggleBtn) return;

  // Baca preferensi tersimpan atau system preference
  const saved = localStorage.getItem('kopana-dark-mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = saved !== null ? saved === 'true' : prefersDark;

  function applyDarkMode(dark) {
    document.body.classList.toggle('dark-mode', dark);
    if (icon) {
      icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('kopana-dark-mode', dark);
  }

  applyDarkMode(isDark);

  toggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    applyDarkMode(isDark);
  });

  // Ikuti perubahan system preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('kopana-dark-mode') === null) {
      isDark = e.matches;
      applyDarkMode(isDark);
    }
  });
})();


/* ============================================================
   4. HERO PARTICLES ANIMATION
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  // Kurangi partikel di mobile untuk performa
  const count = window.innerWidth < 768 ? 10 : 20;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';

    // Ukuran acak
    const size = Math.random() * 60 + 15;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;

    container.appendChild(particle);
  }
})();


/* ============================================================
   5. SMOOTH SCROLL untuk anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Abaikan link kosong "#" (bukan anchor valid) agar tidak error
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      let target = null;
      try { target = document.querySelector(href); } catch (err) { return; }
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   6. SCROLL REVEAL ANIMATION (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  // Tidak jalankan jika user prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Hanya animasi sekali
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ============================================================
   7. TAB SYSTEM (Tentang Kami)
   ============================================================ */
(function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${target}`) {
          content.classList.add('active');
        }
      });
    });
  });
})();


/* ============================================================
   8. COUNTER ANIMATION (Statistik)
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(counter => animateCounter(counter));
    }
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statistik');
  if (statsSection) observer.observe(statsSection);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const noFormat = el.dataset.noFormat === 'true';
    const duration = 2000;
    const startTime = performance.now();

    // Jika placeholder (misal JUMLAH_ANGGOTA), tampilkan teks
    if (isNaN(target)) {
      el.textContent = el.dataset.target;
      return;
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = prefix + (noFormat ? current : current.toLocaleString('id-ID')) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (noFormat ? target : target.toLocaleString('id-ID')) + suffix;
      }
    }

    requestAnimationFrame(update);
  }
})();


/* ============================================================
   9. GALERI FILTER
   ============================================================ */
window.initGaleriFilter = function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galeriItems = document.querySelectorAll('.galeri-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items dengan animasi
      galeriItems.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          item.style.opacity = '0';
          item.style.display = 'block';
          // Gunakan requestAnimationFrame untuk trigger reflow
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease';
              item.style.opacity = '1';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
};
window.initGaleriFilter();


/* ============================================================
   10. LIGHTBOX (dengan Touch Swipe untuk Mobile)
   ============================================================ */
window.initLightbox = function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox) return;

  let currentIndex = 0;
  const galeriItems = document.querySelectorAll('.galeri-item');

  // Buka lightbox
  galeriItems.forEach((item, index) => {
    // Click support
    item.addEventListener('click', () => openLightbox(item, index));

    // Keyboard support (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item, index);
      }
    });
  });

  function openLightbox(item, index) {
    const img = item.querySelector('.galeri-img');
    const caption = item.querySelector('.galeri-caption h4');
    const subcap = item.querySelector('.galeri-caption span');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption
      ? `${caption.textContent}${subcap ? ' — ' + subcap.textContent : ''}`
      : '';

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
    lightboxClose.focus();
  }

  // Tutup lightbox
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Kembalikan fokus ke item galeri yang dibuka
    if (galeriItems[currentIndex]) {
      galeriItems[currentIndex].focus();
    }
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });

  function navigateLightbox(direction) {
    const visibleItems = Array.from(galeriItems).filter(
      item => item.style.display !== 'none'
    );
    const visibleIndex = visibleItems.indexOf(galeriItems[currentIndex]);
    const nextIndex = (visibleIndex + direction + visibleItems.length) % visibleItems.length;
    const nextItem = visibleItems[nextIndex];

    if (nextItem) {
      currentIndex = Array.from(galeriItems).indexOf(nextItem);
      const img = nextItem.querySelector('.galeri-img');
      const caption = nextItem.querySelector('.galeri-caption h4');

      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxImg.style.opacity = '1';
      }, 200);
    }
  }

  // ---- TOUCH SWIPE SUPPORT (untuk HP/Mobile) ----
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 60;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    if (Math.abs(deltaX) > SWIPE_THRESHOLD && deltaY < 80) {
      if (deltaX < 0) {
        navigateLightbox(1);
      } else {
        navigateLightbox(-1);
      }
    }

    if (Math.abs(deltaX) < 10 && deltaY < 10 && e.target === lightbox) {
      closeLightbox();
    }
  }, { passive: true });
};
window.initLightbox();



/* ============================================================
   11. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   12. ACTIVE NAV LINK ON SCROLL
   ============================================================ */
(function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
})();


/* ============================================================
   13. KopanaAPI - render konten dinamis dari data/*.json
   (dikelola lewat Sveltia CMS di /admin/)
   ============================================================ */
const KopanaAPI = {
  /**
   * Ambil daftar berita dari lokal data/berita.json
   */
  async getBerita() {
    try {
      const response = await fetch('data/berita.json');
      const data = await response.json();
      this.renderBerita(data.items || []);
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat berita.json, menggunakan konten statis.', error);
    }
  },

  /**
   * Render berita ke DOM
   * @param {Array} items
   */
  renderBerita(items) {
    const container = document.getElementById('berita-container');
    if (!container) return;
    
    if (!items || items.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">Belum ada berita saat ini.</p>';
      return;
    }

    // Sort items: Kategori 'Pengumuman' selalu di atas, sisanya diurutkan dari yang terbaru
    items.sort((a, b) => {
      const isAPengumuman = a.kategori && a.kategori.toLowerCase() === 'pengumuman';
      const isBPengumuman = b.kategori && b.kategori.toLowerCase() === 'pengumuman';
      
      if (isAPengumuman && !isBPengumuman) return -1;
      if (!isAPengumuman && isBPengumuman) return 1;

      // Jika keduanya pengumuman atau keduanya bukan, urutkan berdasarkan tanggal (terbaru ke terlama)
      // Tanggal diformat "DD MMM YYYY", e.g., "15 Jan 2026" — diparse dengan parseTanggal agar aman di Safari
      return parseTanggal(b.tanggal) - parseTanggal(a.tanggal);
    });

    // Batasi jumlah kartu jika kontainer punya data-limit (dipakai halaman utama)
    const limit = parseInt(container.dataset.limit, 10);
    if (!isNaN(limit) && limit > 0) items = items.slice(0, limit);

    container.innerHTML = items.map(item => {
      const isPengumuman = item.kategori && item.kategori.toLowerCase() === 'pengumuman';
      const badgeBg = isPengumuman ? 'background: var(--secondary);' : '';
      const judul = escapeHTML(item.judul);
      const kategori = escapeHTML(item.kategori || 'Berita');

      let imgWrapHtml = '';
      let bodyBadgeHtml = '';

      if (item.foto) {
        imgWrapHtml = `
          <div class="berita-img-wrap">
            <img src="${escapeHTML(item.foto)}" alt="${judul}" class="berita-img" loading="lazy">
            <span class="berita-category" style="${badgeBg}">${kategori}</span>
          </div>
        `;
      } else {
        bodyBadgeHtml = `
          <span class="berita-category" style="position: relative; top: 0; left: 0; display: inline-block; margin-bottom: var(--spacing-sm); ${badgeBg}">${kategori}</span>
        `;
      }

      // Tujuan tombol "Baca Selengkapnya": link eksternal jika diisi,
      // selain itu ke halaman detail berita di website ini.
      const eksternal = item.url && item.url !== '#';
      const targetUrl = eksternal ? item.url : `berita.html?id=${slugBerita(item.judul)}`;
      const readMoreHtml = `
            <a href="${escapeHTML(targetUrl)}" class="berita-read-more" aria-label="Baca selengkapnya: ${judul}">
              Baca Selengkapnya <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </a>`;

      return `
        <article class="berita-card reveal">
          ${imgWrapHtml}
          <div class="berita-body">
            ${bodyBadgeHtml}
            <div class="berita-meta">
              <span><i class="far fa-calendar-alt" aria-hidden="true"></i> ${escapeHTML(item.tanggal)}</span>
              <span><i class="far fa-user" aria-hidden="true"></i> ${escapeHTML(item.penulis || 'Redaksi')}</span>
            </div>
            <h3 class="berita-title">${judul}</h3>
            <p class="berita-excerpt">${escapeHTML(item.ringkasan)}</p>${readMoreHtml}
          </div>
        </article>
      `;
    }).join('');

    // Re-init scroll reveal untuk elemen baru
    document.querySelectorAll('#berita-container .reveal').forEach(el => {
      new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      }, { threshold: 0.1 }).observe(el);
    });
  },
  /**
   * Render Galeri ke DOM
   */
  renderGaleri(items) {
    const container = document.querySelector('.galeri-grid');
    if (!container) return;
    
    if (!items || items.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">Belum ada foto galeri.</p>';
      return;
    }

    // Kelas filter yang aman (lowercase, tanpa spasi)
    const slugify = (s) => (s || 'lainnya').toLowerCase().replace(/[^a-z0-9]/g, '');

    // Batasi jumlah foto jika kontainer punya data-limit (dipakai halaman utama)
    const limit = parseInt(container.dataset.limit, 10);
    const terbatas = !isNaN(limit) && limit > 0;
    if (terbatas) items = items.slice(0, limit);

    container.innerHTML = items.map((item, index) => {
      const cat = slugify(item.kategori);
      const delay = index > 0 ? `reveal-delay-${(index % 5) + 1}` : '';
      const judul = escapeHTML(item.judul);
      return `
        <div class="galeri-item reveal ${delay}" data-category="${cat}" role="button" tabindex="0" aria-label="Buka foto: ${judul}">
          <img src="${escapeHTML(item.url)}" alt="${judul}" class="galeri-img" loading="lazy">
          <div class="galeri-overlay">
            <div class="galeri-overlay-icon" aria-hidden="true"><i class="fas fa-search-plus"></i></div>
            <div class="galeri-caption">
              <h4>${judul}</h4>
              <span>${escapeHTML(item.kategori)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bangun tombol filter secara dinamis dari kategori yang benar-benar ada di data,
    // agar tombol filter selalu cocok dengan foto galeri (sebelumnya hardcoded dan tidak cocok).
    const filterContainer = document.querySelector('.galeri-filter');
    if (filterContainer && terbatas) {
      // Halaman utama hanya menampilkan sebagian foto — filter ada di halaman arsip
      filterContainer.style.display = 'none';
    } else if (filterContainer) {
      const catMap = new Map();
      items.forEach(item => {
        const label = item.kategori || 'Lainnya';
        if (!catMap.has(slugify(label))) catMap.set(slugify(label), label);
      });
      if (catMap.size > 1) {
        filterContainer.style.display = '';
        filterContainer.innerHTML =
          '<button class="filter-btn active" data-filter="all">Semua</button>' +
          [...catMap.entries()].map(([slug, label]) =>
            `<button class="filter-btn" data-filter="${slug}">${escapeHTML(label)}</button>`
          ).join('');
      } else {
        // Hanya satu kategori — filter tidak berguna, sembunyikan barisnya
        filterContainer.style.display = 'none';
      }
    }

    // Re-init observer untuk elemen baru
    document.querySelectorAll('.galeri-grid .reveal').forEach(el => {
      new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      }, { threshold: 0.1 }).observe(el);
    });

    // Re-init lightbox & filter setelah item dimuat
    if (typeof window.initGaleriFilter === 'function') window.initGaleriFilter();
    if (typeof window.initLightbox === 'function') window.initLightbox();
  },

  /**
   * Ambil data galeri dari lokal data/galeri.json
   */
  async getGaleri() {
    try {
      const response = await fetch('data/galeri.json');
      const data = await response.json();
      this.renderGaleri(data.items || []);
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat galeri.json, menggunakan konten statis.', error);
    }
  },

  /**
   * Ambil statistik koperasi dari lokal data/statistik.json
   */
  async getStatistik() {
    try {
      const response = await fetch('data/statistik.json');
      const data = await response.json();

      const keys = ['anggota', 'tahun', 'pengurus', 'pengawas', 'cabang', 'karyawan'];
      keys.forEach(key => {
        const counter = document.querySelector(`.stat-number[data-key="${key}"]`);
        if (counter && data[key] !== undefined) {
          counter.dataset.target = data[key];
          // Set nilai langsung; animasi counter berjalan saat section terlihat
          counter.textContent = data[key];
        }
      });
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat statistik.json, menggunakan data statis.');
    }
  },

  /**
   * Ambil data kontak
   */
  async getKontak() {
    try {
      const response = await fetch('data/kontak.json');
      const data = await response.json();
      
      const setEl = (id, text, attr, attrVal) => {
        const el = document.getElementById(id);
        if (el) {
          if (text !== null) el.textContent = text;
          if (attr && attrVal) el.setAttribute(attr, attrVal);
        }
      };

      setEl('dyn-kontak-alamat', data.alamat);
      if (data.telepon) setEl('dyn-kontak-telepon', data.telepon, 'href', `tel:${data.telepon.replace(/\s+/g, '')}`);
      if (data.email) {
        document.querySelectorAll('.dyn-email').forEach(el => {
          el.textContent = data.email;
          el.href = `mailto:${data.email}`;
        });
      }

      const mapsContainer = document.getElementById('dyn-maps-container');
      if (mapsContainer && data.maps) {
        let mapsUrl = data.maps;
        // Check if user accidentally pasted full iframe code instead of just url
        if(mapsUrl.includes('<iframe') && mapsUrl.includes('src="')) {
           const match = mapsUrl.match(/src="([^"]+)"/);
           if(match) mapsUrl = match[1];
        }
        mapsContainer.innerHTML = `<iframe src="${escapeHTML(mapsUrl)}" width="100%" height="380" style="border:0; border-radius: var(--radius-2xl);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat kontak.json');
    }
  },

  /**
   * Ambil data beranda
   */
  async getBeranda() {
    try {
      const response = await fetch('data/beranda.json');
      const data = await response.json();
      
      const setEl = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      };

      setEl('dyn-hero-title', data.hero_title);
      setEl('dyn-hero-subtitle', data.hero_subtitle);
      setEl('dyn-hero-desc', data.hero_desc);
      setEl('dyn-sambutan-1', data.sambutan_1);
      setEl('dyn-sambutan-2', data.sambutan_2);
      setEl('dyn-ketua-nama', data.ketua_nama);
      
      const img = document.getElementById('dyn-ketua-foto');
      if (img && data.ketua_foto) img.src = data.ketua_foto;

      if (data.tampilkan_foto_hero === false) {
        const heroBg = document.querySelector('.hero-bg');
        const heroOverlay = document.querySelector('.hero-overlay');
        if (heroBg) heroBg.style.display = 'none';
        if (heroOverlay) {
          heroOverlay.style.background = 'linear-gradient(135deg, var(--primary) 0%, #061536 100%)';
          heroOverlay.style.opacity = '1';
        }
      } else {
        const heroBg = document.querySelector('.hero-bg');
        const heroOverlay = document.querySelector('.hero-overlay');
        if (heroBg) {
          heroBg.style.display = 'block';
          if (data.hero_bg) {
            heroBg.style.backgroundImage = `url('${data.hero_bg}')`;
          }
        }
        if (heroOverlay) {
          heroOverlay.style.background = 'linear-gradient(135deg, rgba(10,37,88,0.95) 0%, rgba(10,37,88,0.8) 100%)';
        }
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat beranda.json');
    }
  },

  /**
   * Ambil data profil
   */
  async getProfil() {
    try {
      const response = await fetch('data/profil.json');
      const data = await response.json();
      
      const setEl = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = text; // innerHTML for safe formatting like <strong>
      };

      setEl('dyn-sejarah-1', data.sejarah_1);
      setEl('dyn-sejarah-2', data.sejarah_2);
      setEl('dyn-visi', data.visi);
      
      const setElAttr = (id, text, attr, attrVal) => {
        const el = document.getElementById(id);
        if (el) {
          if (text !== null) el.innerHTML = text;
          if (attr && attrVal) el.setAttribute(attr, attrVal);
        }
      };
      
      setElAttr('dyn-profil-badge-angka', data.badge_angka, null, null);
      setElAttr('dyn-profil-badge-teks', data.badge_teks, null, null);
      
      const profilImg = document.getElementById('dyn-profil-foto');
      if (profilImg && data.foto) profilImg.src = data.foto;

      const misiContainer = document.getElementById('dyn-misi-container');
      if (misiContainer && data.misi) {
        misiContainer.innerHTML = data.misi.map(m => `
          <div class="misi-item">
            <div class="misi-icon"><i class="fas fa-check" aria-hidden="true"></i></div>
            <p>${escapeHTML(m.teks)}</p>
          </div>
        `).join('');
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat profil.json');
    }
  },

  /**
   * Ambil data pengurus
   */
  async getPengurus() {
    try {
      const response = await fetch('data/pengurus.json');
      const data = await response.json();
      
      // Render Pengurus
      const pengurusContainer = document.getElementById('dyn-pengurus-container');
      if (pengurusContainer && data.dewan_pengurus) {
        pengurusContainer.innerHTML = data.dewan_pengurus.map((p, index) => {
          const delay = `reveal-delay-${(index % 3) + 1}`;
          const nama = escapeHTML(p.nama);
          const jabatan = escapeHTML(p.jabatan);
          const photoHtml = p.foto
            ? `<img src="${escapeHTML(p.foto)}" alt="${nama} - ${jabatan}" class="card-photo" loading="lazy">`
            : `<div class="card-icon-placeholder" aria-hidden="true"><i class="fas fa-user-circle"></i></div>`;

          return `
          <article class="person-card reveal ${delay}">
            <div class="card-photo-wrap">
              ${photoHtml}
            </div>
            <div class="card-body">
              <span class="card-badge">Pengurus</span>
              <h3 class="card-name">${nama}</h3>
              <p class="card-role">${jabatan}</p>
            </div>
          </article>
          `;
        }).join('');
      }

      // Render Pengawas
      const pengawasContainer = document.getElementById('dyn-pengawas-container');
      if (pengawasContainer && data.dewan_pengawas) {
        pengawasContainer.innerHTML = data.dewan_pengawas.map((p, index) => {
          const delay = `reveal-delay-${(index % 3) + 1}`;
          const nama = escapeHTML(p.nama);
          const jabatan = escapeHTML(p.jabatan);
          const photoHtml = p.foto
            ? `<img src="${escapeHTML(p.foto)}" alt="${nama} - ${jabatan}" class="card-photo" loading="lazy">`
            : `<div class="card-icon-placeholder" aria-hidden="true"><i class="fas fa-user-circle"></i></div>`;

          return `
          <article class="person-card pengawas-card reveal ${delay}">
            <div class="card-photo-wrap">
              ${photoHtml}
            </div>
            <div class="card-body">
              <span class="card-badge" style="background: rgba(214,40,40,0.08); color: var(--secondary);">Pengawas</span>
              <h3 class="card-name">${nama}</h3>
              <p class="card-role">${jabatan}</p>
            </div>
          </article>
          `;
        }).join('');
      }

      // Render Cabang
      const cabangContainer = document.getElementById('dyn-cabang-container');
      if (cabangContainer && data.cabang) {
        cabangContainer.innerHTML = data.cabang.map((c, index) => {
          const delay = `reveal-delay-${(index % 3) + 1}`;
          const nama = escapeHTML(c.nama);
          return `
          <article class="cabang-card reveal ${delay}">
            ${c.foto
              ? `<img src="${escapeHTML(c.foto)}" alt="${nama}" style="width: 260px; height: 260px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px auto; display: block; border: 4px solid var(--surface); box-shadow: 0 8px 25px rgba(0,0,0,0.15);">`
              : `<div class="cabang-icon" aria-hidden="true"><i class="fas fa-map-marker-alt"></i></div>`
            }
            <h3 class="cabang-name">${nama}</h3>
            <p class="cabang-branch">${escapeHTML(c.cabang)}</p>
            <p class="cabang-desc">${escapeHTML(c.desc)}</p>
          </article>
          `;
        }).join('');
      }

      // Re-init reveal observer for new elements
      const observer = new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      }, { threshold: 0.1 });
      
      document.querySelectorAll('#dyn-pengurus-container .reveal, #dyn-pengawas-container .reveal, #dyn-cabang-container .reveal').forEach(el => {
        observer.observe(el);
      });
      
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat pengurus.json');
    }
  },

  async getFormulir() {
    try {
      const container = document.getElementById('dyn-formulir-container');
      if (!container) return; // Only fetch if container exists on the page
      
      const response = await fetch('data/formulir.json');
      if (!response.ok) throw new Error("Network not ok");
      const data = await response.json();
      
      if (data && data.items && data.items.length > 0) {
        container.innerHTML = '';
        
        // Kelompokkan berdasarkan kategori
        const grouped = {
          'Formulir': [],
          'Laporan & RAT': [],
          'Dokumen Umum': []
        };
        
        data.items.forEach(f => {
          if (!f.file) return;
          const cat = f.kategori || 'Dokumen Umum';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(f);
        });
        
        // Render setiap kategori
        for (const cat in grouped) {
          const section = document.createElement('div');
          section.className = 'download-category-section';
          section.style.marginBottom = '30px';
          
          const title = document.createElement('h3');
          title.textContent = cat;
          title.style.color = 'var(--primary)';
          title.style.fontWeight = '700';
          title.style.marginBottom = '15px';
          title.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
          title.style.paddingBottom = '10px';
          section.appendChild(title);
          
          const list = document.createElement('div');
          list.style.display = 'flex';
          list.style.flexDirection = 'column';
          list.style.gap = '15px';
          
          if (grouped[cat].length === 0) {
            const emptyText = document.createElement('p');
            emptyText.textContent = 'Belum ada dokumen di kategori ini.';
            emptyText.style.color = 'var(--text-muted)';
            emptyText.style.fontStyle = 'italic';
            list.appendChild(emptyText);
          } else {
            grouped[cat].forEach(f => {
              const a = document.createElement('a');
              
              if (f.kunci_dokumen) {
                a.href = '#';
                a.innerHTML = `<i class="fas fa-lock" aria-hidden="true" style="color:var(--secondary)"></i> ${escapeHTML(f.judul)} <span style="font-size:0.75rem; color:var(--secondary); opacity:0.8; margin-left:8px">(Terkunci)</span>`;
                a.onclick = (e) => {
                  e.preventDefault();
                  const userPin = prompt("Dokumen ini khusus anggota.\\n\\nSilakan masukkan PIN Anggota KOPANA untuk mengunduh:");
                  if (userPin === null) return;
                  if (userPin === (data.pin_anggota || 'KOPANA2026')) {
                    window.open(f.file, '_blank', 'noopener,noreferrer');
                  } else {
                    alert("PIN yang Anda masukkan salah. Silakan coba lagi.");
                  }
                };
              } else {
                a.href = f.file;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                // Check if it's a link to a file or an external URL
                const isExternal = f.file.startsWith('http');
                a.innerHTML = `<i class="fas ${isExternal ? 'fa-external-link-alt' : 'fa-file-download'}" aria-hidden="true"></i> ${escapeHTML(f.judul)}`;
              }
              
              list.appendChild(a);
            });
          }
          
          section.appendChild(list);
          container.appendChild(section);
        }
      } else {
        container.innerHTML = '<div class="loading-state"><p>Belum ada formulir atau dokumen yang diunggah.</p></div>';
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat formulir.json');
      const container = document.getElementById('dyn-formulir-container');
      if (container) container.innerHTML = '<div class="loading-state"><p>Gagal memuat daftar unduhan.</p></div>';
    }
  },

  async getPengaturan() {
    try {
      const response = await fetch('data/pengaturan.json');
      if (!response.ok) return;
      const data = await response.json();
      
      const el = (id) => document.getElementById(id);
      
      if (data.nama) {
        if (el('dyn-nav-brand-name')) el('dyn-nav-brand-name').textContent = data.nama;
        if (el('dyn-footer-brand-name')) el('dyn-footer-brand-name').textContent = data.nama;
      }
      if (data.tagline && el('dyn-nav-brand-tagline')) el('dyn-nav-brand-tagline').textContent = data.tagline;
      if (data.deskripsi && el('dyn-footer-about')) el('dyn-footer-about').textContent = data.deskripsi;
      
      // Kontak data is now handled exclusively by getKontak() to avoid race conditions.
      
      if (data.logo) {
        document.querySelectorAll('.nav-logo, .footer-logo').forEach(img => {
          img.src = data.logo;
        });
      }

      if (data.versi_counter) {
        const pathParam = encodeURIComponent(`https://kopana.co.id/${data.versi_counter}`);
        document.querySelectorAll('.visitor-badge-img').forEach(img => {
          img.src = `https://api.visitorbadge.io/api/visitors?path=${pathParam}&label=Total%20Pengunjung&labelColor=%230f172a&countColor=%232563eb`;
        });
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat pengaturan.json');
    }
  },
  async getUsaha() {
    try {
      const container = document.getElementById('dyn-usaha-container');
      if (!container) return;
      
      const response = await fetch('data/usaha.json');
      if (!response.ok) return;
      
      const data = await response.json();
      if (data && data.items && data.items.length > 0) {
        container.innerHTML = '';
        data.items.forEach(item => {
          const card = document.createElement('article');
          card.className = 'berita-card reveal';
          card.innerHTML = `
            <div class="berita-img-wrap">
              <img src="${escapeHTML(item.foto || 'assets/img/hero-bg.jpg')}" alt="${escapeHTML(item.judul)}" class="berita-img" loading="lazy">
            </div>
            <div class="berita-body">
              <h3 class="berita-title">${escapeHTML(item.judul)}</h3>
              <p class="berita-excerpt" style="-webkit-line-clamp: unset;">
                ${escapeHTML(item.deskripsi)}
              </p>
            </div>
          `;
          container.appendChild(card);
        });
        
        // Re-init scroll reveal untuk elemen baru
        document.querySelectorAll('#dyn-usaha-container .reveal').forEach(el => {
          new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            }
          }, { threshold: 0.1 }).observe(el);
        });
      } else {
        container.innerHTML = '<div class="loading-state"><p>Belum ada data bidang usaha.</p></div>';
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat usaha.json');
      const el = document.getElementById('dyn-usaha-container');
      if(el) el.innerHTML = '<div class="loading-state"><p>Gagal memuat Bidang Usaha.</p></div>';
    }
  },

  async getFaq() {
    try {
      const listContainer = document.getElementById('dyn-faq-list');
      if (!listContainer) return; // Only run on pages that have the FAQ container
      
      const response = await fetch('data/faq.json');
      if (!response.ok) throw new Error("Gagal mengambil data FAQ");
      const data = await response.json();
      
      if (data && data.items && data.items.length > 0) {
        listContainer.innerHTML = '';
        data.items.forEach((item, index) => {
          const faqItem = document.createElement('div');
          faqItem.className = 'faq-item';
          
          faqItem.innerHTML = `
            <button class="faq-question">
              ${escapeHTML(item.pertanyaan)} <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
              <div class="faq-answer-content">
                ${escapeHTML(item.jawaban)}
              </div>
            </div>
          `;
          
          // Add click event for accordion
          const btn = faqItem.querySelector('.faq-question');
          const answer = faqItem.querySelector('.faq-answer');
          
          btn.addEventListener('click', () => {
            // Close all other open items
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
              if (activeItem !== faqItem) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-answer').style.maxHeight = null;
              }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
              answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
              answer.style.maxHeight = null;
            }
          });
          
          listContainer.appendChild(faqItem);
        });
      } else {
        listContainer.innerHTML = '<div class="loading-state"><p>Belum ada daftar FAQ.</p></div>';
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat faq.json');
      const el = document.getElementById('dyn-faq-list');
      if(el) el.innerHTML = '<div class="loading-state"><p>Gagal memuat FAQ.</p></div>';
    }
  },

  // 12. GET PENGUMUMAN (POPUP)
  async getPengumuman() {
    try {
      const modal = document.getElementById('announcement-modal');
      const titleEl = document.getElementById('announcement-title');
      const bodyEl = document.getElementById('announcement-body');
      const closeBtn = document.querySelector('.modal-close-btn');
      const okBtn = document.querySelector('.modal-ok-btn');
      
      if (!modal) return;
      
      const response = await fetch('data/pengumuman.json');
      if (!response.ok) throw new Error("Gagal mengambil pengumuman");
      const data = await response.json();
      
      if (data && data.aktifkan && data.judul) {
        // Cek localStorage, apakah pengunjung sudah pernah menutup pengumuman ini?
        const closedTitle = localStorage.getItem('kopana_announcement_closed');
        if (closedTitle === data.judul) {
          // Sudah pernah ditutup, jangan tampilkan lagi
          return;
        }
        
        // Render konten
        titleEl.textContent = data.judul;
        
        // Escape dulu agar aman, lalu dukung baris baru + bold/italic sederhana
        let contentHtml = escapeHTML(data.pesan || '');
        // Ubah newline jadi <br>
        contentHtml = contentHtml.replace(/\n/g, '<br>');

        // Render bold / italic simple markdown style
        contentHtml = contentHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        contentHtml = contentHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');

        bodyEl.innerHTML = contentHtml;
        
        // Tampilkan modal
        // Tunggu sedikit agar animasi terlihat smooth setelah load
        setTimeout(() => {
          modal.classList.remove('hidden');
          modal.setAttribute('aria-hidden', 'false');
        }, 1000);
        
        // Fungsi tutup modal
        const closeModal = () => {
          modal.classList.add('hidden');
          modal.setAttribute('aria-hidden', 'true');
          // Simpan ke localStorage agar tidak muncul lagi
          localStorage.setItem('kopana_announcement_closed', data.judul);
        };
        
        closeBtn.addEventListener('click', closeModal);
        okBtn.addEventListener('click', closeModal);
      }
    } catch (error) {
      console.info('KopanaAPI: Gagal memuat pengumuman.json');
    }
  }
};

/* ============================================================
   Inisialisasi API — hanya fetch data yang dibutuhkan halaman ini
   (menghindari belasan request sia-sia di halaman lain)
   ============================================================ */
(function initKopanaAPI() {
  const has = (id) => document.getElementById(id) !== null;

  if (has('dyn-kontak-alamat') || document.querySelector('.dyn-email')) KopanaAPI.getKontak();
  if (has('dyn-hero-title')) KopanaAPI.getBeranda();
  if (has('dyn-sejarah-1')) KopanaAPI.getProfil();
  if (has('dyn-pengurus-container') || has('dyn-pengawas-container') || has('dyn-cabang-container')) KopanaAPI.getPengurus();
  if (has('berita-container')) KopanaAPI.getBerita();
  if (has('dyn-galeri-grid') || document.querySelector('.galeri-grid')) KopanaAPI.getGaleri();
  if (document.querySelector('.stat-number[data-key]')) KopanaAPI.getStatistik();
  if (has('dyn-formulir-container')) KopanaAPI.getFormulir();
  if (has('dyn-faq-list')) KopanaAPI.getFaq();
  if (has('dyn-usaha-container')) KopanaAPI.getUsaha();
  if (has('dyn-nav-brand-name') || document.querySelector('.visitor-badge-img')) KopanaAPI.getPengaturan();
  if (has('announcement-modal')) KopanaAPI.getPengumuman();
})();


/* ============================================================
   HELPER: Set current year di footer
   ============================================================ */
(function setYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
