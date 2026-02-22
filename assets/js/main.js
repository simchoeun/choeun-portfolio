document.addEventListener("DOMContentLoaded", () => {
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

  /**
   * 모바일 vh 대응
   */
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);

  /**
   * about 영역
   */
  const aboutBgAnimation = () => {
    const bg = document.querySelector('.about .img_wrap .bg_img');
    if (!bg) return;

    gsap.to(bg, {
      width: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about .img_wrap",
        start: "top 80%", 
        toggleActions: "play none none none",
      }
    });
  };
  aboutBgAnimation();
});
