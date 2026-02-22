window.addEventListener("load", () => {
  document.querySelector(".visual_list").classList.add("start");
});


document.addEventListener("DOMContentLoaded", () => {
  /**
   * 신뢰받는 운영 파트너 스크롤 영역
   */
  const partnerScroll = () => {
    const imgBoxes = document.querySelectorAll(".right_box .img_box");
    const listItems = document.querySelectorAll(".sticky_box .img_list li");
  
    const updateActive = (index) => {
      listItems.forEach((li, i) => {
        li.classList.toggle("active", i === index);
      });
    };
  
    window.addEventListener("scroll", () => {
      imgBoxes.forEach((box, index) => {
        const boxTop = box.getBoundingClientRect().top;
  
        if (boxTop <= 107 && boxTop > 0) {
          updateActive(index);
        }
      });
    });
  }
  partnerScroll();

  /**
   * 차별화된 전문성과 일관된 품질 hover 영역
   */
  const qualityHover = () => {
    const slides = document.querySelectorAll('.qualitySwiper .swiper-slide');

    slides.forEach(option => {
      const btn = option.querySelector('.btn_more_detail');
      if (btn && !btn.dataset.original) {
        btn.dataset.original = btn.textContent.trim();
      }

      option.addEventListener('mouseenter', (e) => {
        // 모든 슬라이드 초기화
        slides.forEach(opt => {
          opt.classList.remove('active');
          const btn = opt.querySelector('.btn_more_detail');
          if (btn && btn.dataset.original) {
            btn.textContent = btn.dataset.original; // 원래 텍스트 복구
          }
        });

        // 현재 대상만 active + 텍스트 교체
        const current = e.currentTarget;
        current.classList.add('active');
        const currentBtn = current.querySelector('.btn_more_detail');
        if (currentBtn) currentBtn.textContent = 'MORE DETAILS';
      });
    });
  };
  qualityHover();

  /**
   * 차별화된 전문성과 일관된 품질 Mobile Swiper 영역
   */
  const qualityMoSwiper = () => {
    let qualitySwiper = null;
    const mq = window.matchMedia('(max-width: 768px)');

    const updateMoreDetailLabels = (swiper) => {
      if (!swiper || swiper.destroyed) return;
      swiper.slides.forEach((slide, idx) => {
        const isActive = idx === swiper.activeIndex;
        slide.classList.toggle('active', isActive);
        slide.querySelectorAll('.btn_more_detail').forEach(btn => {
          if (!btn.dataset.original) btn.dataset.original = btn.textContent.trim();
          btn.textContent = isActive ? 'MORE DETAILS' : btn.dataset.original;
        });
      });
    };

    const initOnce = () => {
      if (qualitySwiper || typeof Swiper === 'undefined') return;

      qualitySwiper = new Swiper('.qualitySwiper .swiper-container', {
        // 핵심
        enabled: mq.matches,               // 모바일에서만 동작
        slidesPerView: 'auto',
        centeredSlides: true,
        centeredSlidesBounds: true,        // resize 시 튕김 방지
        spaceBetween: 10,
        watchOverflow: true,
        observeParents: true,
        observer: true,

        on: {
          init: (s) => {
            s.update();
            updateMoreDetailLabels(s);
          },
          slideChange: (s) => updateMoreDetailLabels(s),
          resize: (s) => {
            if (!mq.matches) return;       // 모바일일 때만
            s.update();
            updateMoreDetailLabels(s);
          }
        }
      });
    };

    const syncMode = () => {
      if (!qualitySwiper) return;

      if (mq.matches) {
        // 모바일 모드: 활성화 + 정렬/라벨 동기화
        qualitySwiper.enable();
        qualitySwiper.update();
        // 루프 사용 안해도 현재 인덱스 기준으로 재정렬
        qualitySwiper.slideTo(qualitySwiper.activeIndex, 0);
        updateMoreDetailLabels(qualitySwiper);
      } else {
        // 데스크톱 모드: 비활성화 + UI 원복
        qualitySwiper.disable();
        qualitySwiper.slides.forEach(slide => {
          slide.classList.remove('active');
          slide.querySelectorAll('.btn_more_detail').forEach(btn => {
            if (btn.dataset.original) btn.textContent = btn.dataset.original;
          });
        });
      }
    };

    // 초기화 & 모드 동기화
    window.addEventListener('load', () => {
      initOnce();
      syncMode();
    }, { once: true });

    // 브레이크포인트 변경 시 모드 동기화
    mq.addEventListener('change', syncMode);

    // 일반 리사이즈: 모바일일 때만 업데이트(과도한 호출 방지로 rAF)
    let raf = null;
    window.addEventListener('resize', () => {
      if (!qualitySwiper || !mq.matches) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        qualitySwiper.update();
        updateMoreDetailLabels(qualitySwiper);
      });
    }, { passive: true });
  };
  qualityMoSwiper();
});