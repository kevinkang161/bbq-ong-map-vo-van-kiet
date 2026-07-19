/* ==========================================================================
   BBQ ÔNG MẬP VŨNG TÀU — SCRIPT.JS
   Modules: Loader | Navbar scroll | Mobile menu | Theme toggle
   Scroll reveal | Counter animation | Gallery | Testimonial slider
   FAQ accordion | Contact form | Ripple effect | Back to top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
   * 1. LOADER — ẩn màn hình loading khi trang đã tải xong
   * ------------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 400);
  });
  // Phòng trường hợp sự kiện 'load' đã fire trước khi script chạy
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('is-hidden'), 400);
  }

  /* ---------------------------------------------------------------------
   * 2. NAVBAR — đổi nền khi cuộn trang
   * ------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop'); // khai báo sớm vì onScroll() dùng ngay bên dưới
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
   * 3. MOBILE MENU
   * ------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('menu-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Đóng menu mobile khi bấm vào 1 link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------------
   * 4. THEME TOGGLE — dark / light, lưu lựa chọn trong bộ nhớ phiên
   * ------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  let currentTheme = 'dark'; // mặc định dark mode premium

  // Ưu tiên theo hệ thống nếu người dùng thích sáng
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    currentTheme = 'dark'; // vẫn ưu tiên dark cho phong cách premium mặc định
  }
  root.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', currentTheme);
  });

  /* ---------------------------------------------------------------------
   * 5. SCROLL REVEAL — fade-up khi phần tử xuất hiện trong viewport
   * ------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
   * 6. COUNTER ANIMATION — chạy số khi phần Statistics xuất hiện
   * ------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat__num');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo cho cảm giác mượt & cao cấp
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('vi-VN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('vi-VN');
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => statsObserver.observe(counter));

  /* ---------------------------------------------------------------------
   * 7. TESTIMONIAL SLIDER
   * ------------------------------------------------------------------- */
  const slides = Array.from(document.querySelectorAll('.testimonial__slide'));
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let activeIndex = 0;
  let autoplayTimer;

  // Tạo dots động theo số lượng slide
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Xem đánh giá số ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[activeIndex].classList.remove('is-active');
    dots[activeIndex].classList.remove('is-active');
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add('is-active');
    dots[activeIndex].classList.add('is-active');
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(activeIndex + 1), 6000);
  }

  slides[0].classList.add('is-active');
  prevBtn.addEventListener('click', () => goToSlide(activeIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(activeIndex + 1));
  resetAutoplay();

  /* ---------------------------------------------------------------------
   * 8. FAQ ACCORDION
   * ------------------------------------------------------------------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__q');
    const answer = item.querySelector('.faq__a');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Đóng các mục khác để giao diện gọn gàng
      document.querySelectorAll('.faq__item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq__a').style.maxHeight = null;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------------------------------------------------------------------
   * 9. CONTACT FORM — validate + gửi thẳng vào email quán qua Web3Forms
   * (Không cần backend riêng. Đăng ký free tại https://web3forms.com)
   * ------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const submitBtnDefaultText = submitBtn.textContent;
  const WEB3FORMS_ACCESS_KEY = 'a86eec2f-cc4f-463b-badb-666aceb32014';

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    // Validate cơ bản trước khi gửi
    if (name.length < 2) {
      formNote.textContent = 'Vui lòng nhập họ tên hợp lệ.';
      formNote.style.color = '#f97316';
      return;
    }
    if (!phoneRegex.test(phone)) {
      formNote.textContent = 'Số điện thoại chưa đúng định dạng Việt Nam.';
      formNote.style.color = '#f97316';
      return;
    }

    // Chuẩn bị dữ liệu gửi đi — dùng đúng field gốc của form (name, phone, date, guests, message)
    // Không thêm field trùng tên tiếng Việt vì Web3Forms có thể đọc sai encoding tên field có dấu
    const formData = new FormData(contactForm);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `Yeu cau dat ban moi tu ${name} - BBQ Ong Map`);
    formData.append('from_name', 'Website BBQ Ong Map');

    // Trạng thái đang gửi
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
    formNote.style.color = '';
    formNote.textContent = 'Đang gửi yêu cầu đặt bàn...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();
      console.log('Web3Forms response:', result); // Debug: mở DevTools (F12) > Console để xem chi tiết nếu có lỗi

      if (result.success) {
        formNote.style.color = '';
        formNote.textContent = `Cảm ơn ${name}! Ông Mập đã nhận được yêu cầu và sẽ gọi lại theo số ${phone} trong 15 phút tới.`;
        contactForm.reset();
      } else {
        formNote.style.color = '#f97316';
        formNote.textContent = `Lỗi: ${result.message || 'Gửi chưa thành công'}. Vui lòng gọi trực tiếp hotline 0819 171 887 giúp mình nhé.`;
      }
    } catch (error) {
      formNote.style.color = '#f97316';
      formNote.textContent = 'Không có kết nối mạng. Vui lòng thử lại hoặc gọi hotline 0819 171 887.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtnDefaultText;
    }
  });

  // Newsletter footer (demo)
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.value = '';
    input.placeholder = 'Đăng ký thành công! 🔥';
  });

  /* ---------------------------------------------------------------------
   * 10. RIPPLE EFFECT cho các nút [data-ripple]
   * ------------------------------------------------------------------- */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------------------
   * 11. BACK TO TOP
   * ------------------------------------------------------------------- */
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
   * 12. FOOTER YEAR
   * ------------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});