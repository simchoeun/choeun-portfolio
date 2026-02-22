document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /**
   * value (our_value)
   */
  const ourValue = () => {
    let valueSwiper = null;
    const mq = window.matchMedia('(max-width: 768px)');

    const initSwiper = () => {
      if (valueSwiper) return;
      if (typeof Swiper === 'undefined') {
        console.warn('Swiper JS가 로드되지 않았습니다.');
        return;
      }

      valueSwiper = new Swiper('.valueSwiper .swiper-container', {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 15,
        watchOverflow: true,
        observeParents: true,
        observer: true,
      });
    };

    const destroySwiper = () => {
      if (!valueSwiper) return;
      valueSwiper.destroy(true, true); 
      valueSwiper = null;
    };

    const enableIfMobile = () => {
      if (mq.matches) initSwiper();
      else destroySwiper();
    };

    window.addEventListener('load', enableIfMobile);
    mq.addEventListener('change', enableIfMobile);
  }
  ourValue();

  /**
   * life_style
   */
  // 스크롤 해야 이미지가 흐름
  // const lifeStyle = () => {

  //   const setVh = () => {
  //     const vh = window.innerHeight * 0.01;
  //     document.documentElement.style.setProperty('--vh', `${vh}px`);
  //   };
  //   setVh();
    
  //   window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  //   window.addEventListener('resize', () => { setVh(); ScrollTrigger.refresh(); }, { passive: true });

  //   const imgWrap = document.querySelector('.life_style .img_wrap');

  //   const endDist = window.matchMedia('(max-width: 768px)').matches ? '+=220%' : '+=300%';
  //   const tl = gsap.timeline({
  //     scrollTrigger:{
  //       trigger: '.life_style',
  //       start: 'top top',
  //       end: endDist,
  //       pin: true,
  //       scrub: 1,
  //       anticipatePin: 1
  //     }
  //   });

  //   tl.to(imgWrap, {
  //     y: '-200vh',
  //     ease: 'none'
  //   }, 0);

  //   gsap.utils.toArray('.life_style .img_item').forEach((el, i) => {
  //     const dir = i % 2 ? 1 : -1;
  //     gsap.to(el, {
  //       scrollTrigger:{
  //         trigger: '.life_style',
  //         start: 'top top',
  //         end: endDist,
  //         scrub: 1
  //       },
  //       keyframes: [
  //         { yPercent: 0,    rotate: 0,    scale: 1.00, ease: 'none' },
  //         { yPercent: 10*dir, rotate: 3*dir, scale: 0.98, ease: 'none' },
  //         { yPercent: 20*dir, rotate: 6*dir, scale: 1.02, ease: 'none' }
  //       ]
  //     });
  //   });

  // }
  // lifeStyle();

  // 이미지 자동으로 흐름
  const lifeStyleAuto = () => {
    // 1) vh 유틸 (모바일 주소창 대응)
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh, { passive: true });

    // 2) 엘리먼트
    const section = document.querySelector('.life_style');
    const imgWrap = document.querySelector('.life_style .img_wrap');
    if (!section || !imgWrap) return;

    // 3) 모션 축소 선호
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 4) 반응형 지속시간 (기존보다 조금 빠르게)
    const isMo = window.matchMedia('(max-width: 768px)').matches;
    const wrapDuration = reduce ? 0 : (isMo ? 18 : 42); // ← 25/40 에서 살짝 빠르게

    // 5) 수직 이동만, 무한 루프
    const wrapTween = gsap.to(imgWrap, {
      y: '-200vh',
      ease: 'none',
      duration: wrapDuration,
      repeat: -1
    });

    // 6) 브레이크포인트 바뀌면 재초기화
    let lastIsMo = isMo;
    const onResize = () => {
      const nowIsMo = window.matchMedia('(max-width: 768px)').matches;
      if (nowIsMo !== lastIsMo) {
        wrapTween.kill();
        window.removeEventListener('resize', onResize);
        lifeStyleAuto();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
  };
  lifeStyleAuto();


  /**
   * history (our_journey)
   */
  const historyAll = () => {
    const yearWrap = document.querySelector('.history_list .year_wrap');
    const btns = document.querySelectorAll('.history_year_list .btn_year');
    const prevBtn = document.querySelector('.history_arrow_wrap .btn_prev');
    const nextBtn = document.querySelector('.history_arrow_wrap .btn_next');
    const detailBoxes = document.querySelectorAll('.history_detail_box .history_box');

    if (!yearWrap || btns.length === 0) return;

    let marqueePrepared = false;
    let currentIndex = [...btns].findIndex(b => b.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    /** ------------------ 공통 유틸 ------------------ */
    // year_txt 내부를 항상 "span 1개" 상태로 강제
    const normalizeYearTxts = () => {
      yearWrap.querySelectorAll('.year_txt').forEach(el => {
        el.classList.remove('change');
        const olds = el.querySelectorAll('span.old');
        olds.forEach(o => o.remove());
        const news = el.querySelectorAll('span.new');
        news.forEach(n => {
          n.classList.remove('new');
        });

        const spans = Array.from(el.querySelectorAll('span'));
        if (spans.length === 0) {
          const txt = (el.textContent || '').trim() || '2024';
          el.textContent = '';
          const s = document.createElement('span');
          s.textContent = txt;
          el.appendChild(s);
        } else if (spans.length > 1) {
          const keep = spans[spans.length - 1];
          const text = keep.textContent;
          el.textContent = '';
          const s = document.createElement('span');
          s.textContent = text;
          el.appendChild(s);
        } else {

          spans[0].classList.remove('old', 'new');
        }
      });
    };

    // 진행 중 애니메이션이 있으면 즉시 종료하고 "span 1개" 상태로 맞춤
    const cancelInFlight = (el) => {
      el.classList.remove('change');
      const oldEl = el.querySelector('span.old');
      if (oldEl) oldEl.remove();
      const newEl = el.querySelector('span.new');
      if (newEl) newEl.classList.remove('new');

      // 2개 이상이면 마지막만 남김
      const spans = el.querySelectorAll('span');
      if (spans.length > 1) {
        const keep = spans[spans.length - 1];
        spans.forEach(s => { if (s !== keep) s.remove(); });
      }
    };

    // 마키 준비 (한 번만)
    const ensureMarqueePrepared = () => {
      if (marqueePrepared) return;
      const children = Array.from(yearWrap.children);
      if (children.length === 0) return;
      children.forEach(node => yearWrap.appendChild(node.cloneNode(true)));
      yearWrap.classList.add('marquee'); // 절대 제거하지 않음
      marqueePrepared = true;
    };

    // 상세 박스 토글
    const setActiveDetail = (year) => {
      const nextBox = [...detailBoxes].find(box => box.dataset.yearBox === year);
      if (!nextBox) return;

      const prevBox = document.querySelector('.history_detail_box .history_box.active');
      if (prevBox === nextBox) return;

      // 이전 박스 처리
      if (prevBox) {
        prevBox.classList.remove('active');
        prevBox.classList.add('leaving');

        const onLeaveEnd = (e) => {
          if (e.target !== prevBox) return;
          prevBox.classList.remove('leaving');
          prevBox.removeEventListener('transitionend', onLeaveEnd);
        };
        prevBox.removeEventListener('transitionend', onLeaveEnd);
        prevBox.addEventListener('transitionend', onLeaveEnd);

        // 안전망
        setTimeout(() => {
          prevBox.classList.remove('leaving');
        }, 600);
      }

      // 새 박스 활성화
      nextBox.classList.add('active');
    };

    /** ------------------ 텍스트 교체 ------------------ */
    // 기존 span은 위(-100%)로, 새 span은 아래(100%)→0으로
    const updateRunningText = (year) => {
      yearWrap.querySelectorAll('.year_txt').forEach(el => {
        cancelInFlight(el);

        const current = el.querySelector('span'); 
        if (!current) {
          const s = document.createElement('span');
          s.textContent = year;
          el.appendChild(s);
          return;
        }

        // 같은 연도면 굳이 애니메이션 X
        if (current.textContent === String(year)) return;

        // old 지정 (위로 올라갈 아이)
        current.classList.add('old');

        // new 생성 (아래 대기 → 올라올 아이)
        const incoming = document.createElement('span');
        incoming.textContent = year;
        incoming.className = 'new';
        el.appendChild(incoming);

        // rAF 2번으로 초기 상태 확정 후 트리거 (transform 초기값 적용 보장)
        requestAnimationFrame(() => {
          void incoming.offsetHeight; 
          requestAnimationFrame(() => {
            el.classList.add('change');
          });
        });

        // 애니메이션 종료 시 정리
        const onDone = () => {
          // old 제거
          const oldEl = el.querySelector('span.old');
          if (oldEl) oldEl.remove();
          // new → 일반화
          incoming.classList.remove('new');
          el.classList.remove('change');
          incoming.removeEventListener('transitionend', onDone);
        };
        incoming.addEventListener('transitionend', onDone);

        // 안전망 (transitionend 미수신 대비)
        setTimeout(() => {
          if (incoming && incoming.isConnected && incoming.classList.contains('new')) {
            onDone();
          }
        }, 700);
      });
    };

    /** ------------------ 인덱스 활성화 ------------------ */
    const activateByIndex = (index) => {
      currentIndex = (index + btns.length) % btns.length;

      btns.forEach(b => b.classList.remove('active'));
      const btn = btns[currentIndex];
      btn.classList.add('active');

      const year = btn.dataset.year;
      setActiveDetail(year);
      updateRunningText(year);
    };

    /** ------------------ 초기화 ------------------ */
    const init = () => {
      normalizeYearTxts();
      ensureMarqueePrepared();
      activateByIndex(currentIndex);

      // 연도 버튼
      btns.forEach((btn, idx) => {
        btn.addEventListener('click', () => activateByIndex(idx));
      });

      if (prevBtn) prevBtn.addEventListener('click', () => activateByIndex(currentIndex - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => activateByIndex(currentIndex + 1));
    };

    init();

    // 필요 시 외부에서 호출
    window._updateHistoryYear = updateRunningText;
  };
  historyAll();
});