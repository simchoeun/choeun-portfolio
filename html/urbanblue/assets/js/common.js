document.addEventListener("DOMContentLoaded", () => {
  /**
   * Header 스크롤 시
   */
  const headerScroll = () => {
    const header = document.querySelector('#header');
    let lastY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 4; // 미세 스크롤 무시 (필요 없으면 0)

    const update = () => {
      const y = window.scrollY;

      if (y <= 0) {
        header.classList.remove('down');
      } else if (Math.abs(y - lastY) > THRESHOLD) {
        y > lastY
          ? header.classList.add('down')
          : header.classList.remove('down');
      }

      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }
  headerScroll();

  /**
   * Header 스크롤 시 (dark)
   */
  const headerScrollDark = () => {
    const header = document.querySelector('#header');
    const darkSections = document.querySelectorAll('section.has_dark');

    const checkDarkSection = () => {
      let isDarkActive = false;

      darkSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom > 0) {
          isDarkActive = true;
        }
      });

      header.classList.toggle('dark', isDarkActive);
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(checkDarkSection);
    }, { passive: true });
  }
  headerScrollDark();

  /**
   * 스크롤 애니메이션 active 적용
   */
  const scrollActive = () => {
    const boxes = document.querySelectorAll(".animation_box");

    if (!boxes.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, {
      threshold: 0.3
    });

    boxes.forEach(box => observer.observe(box));
  }
  scrollActive();


  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);
});
