/** 
 * 대시보드 상단 영역
 */
const dashboardTop = () => {
  /**
   * 메인 비주얼 슬라이드 및 버튼 이동
   * dashboard_top > dashboard_top_main > dashboardTopSwiper & dashboard_btn_wrap
   */
  const dashboardTopMain = () => {
    const dashboardTopSwiper = new Swiper(".dashboardTopSwiper", {
      speed: 800,
      slidesPerView: 1,
      autoplay: {
        delay: 8000,
      },
      loop: true,
    });

    const mainBtns = document.querySelectorAll(".main_btn button");
    const slides = document.querySelectorAll(".dashboardTopSwiper .swiper-slide");

    const root = document.querySelector('.dashboard_top_main');
    const radioBtn = document.querySelector('.dashboard_bottom .etc_wrap .btn_radio');

    const pauseAutoplay = () => dashboardTopSwiper.autoplay.stop();
    const resumeAutoplay = () => dashboardTopSwiper.autoplay.start();

    // voiceOpen / radioOpen 을 하나의 lock 상태로 결합
    const isLocked = () => {
      const voiceOpen = window.voicePanel?.isOpen?.() === true;
      const radioOpen = root?.classList.contains('show_radio') === true;
      return voiceOpen || radioOpen;
    };


    // autoplay가 내부적으로 재시작되지 않도록 강제 정지
    const forceStopIfLocked = () => {
      if (isLocked()) {
        pauseAutoplay();
      }
    };

    // autoplay restart 시도할 때마다 강제로 끔
    dashboardTopSwiper.on("slideChange", forceStopIfLocked);
    dashboardTopSwiper.on("autoplay", forceStopIfLocked);



    // 버튼으로 슬라이드 이동
    const gotoSlide = (btn) => {
      const target = btn.dataset.target;
      const idx = Array.from(slides).findIndex(s => s.classList.contains(target));
      if (idx === -1) return;

      const locked = isLocked();


      // lock 상태 (voiceOpen or radioOpen) 
      if (locked) {
        pauseAutoplay(); 
        return;   
      }
      mainBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      resumeAutoplay();

      dashboardTopSwiper.slideTo(idx);
    };


    mainBtns.forEach(btn =>
      btn.addEventListener("click", () => gotoSlide(btn))
    );


    // 슬라이드 변경 시 버튼 active 반영 (잠금일 때는 금지)
    dashboardTopSwiper.on("slideChange", () => {
      if (isLocked()) return;

      const currentIndex = dashboardTopSwiper.realIndex;
      mainBtns.forEach((b, i) => b.classList.toggle("active", i === currentIndex));
    });

  };
  dashboardTopMain();

  /**
   * 메인 음성 영역
   * dashboard_top > dashboard_top_main > voice_wrap
   */
  const dashboardTopVoiceWrap = () => {
    const root = document.querySelector('.dashboard_top_main');
    const voiceBtn = document.querySelector('.dashboard_btn_wrap .btn_voice');
    const mainBtns = document.querySelectorAll('.dashboard_btn_wrap .main_btn button');
    if (!root || !voiceBtn) return;

    const removeMainActive = () => mainBtns.forEach(btn => btn.classList.remove('active'));
    const isOpen = () => root.classList.contains('show_voice');

    const openVoice = () => {
      root.classList.add('show_voice');
      voiceBtn.classList.add('active');
      removeMainActive();
    };
    const closeVoice = () => {
      root.classList.remove('show_voice');
      voiceBtn.classList.remove('active');
    };

    // 외부에서 쓸 수 있게 노출
    window.voicePanel = {
      isOpen,
      open: openVoice,
      close: closeVoice,
    };

    voiceBtn.addEventListener('click', () => {
      if (!isOpen()) openVoice();
    });

    mainBtns.forEach(btn => btn.addEventListener('click', () => closeVoice()));
    closeVoice();
  };
  dashboardTopVoiceWrap();

  // 음성 영역 (음성 인식 및 팝업 띄우기)
  const voiceCommandWrap = () => {
      const dashboardTopMain = document.querySelector('.dashboard_top_main');
      const voiceWrap = document.querySelector('.voice_wrap');
      const voiceTalkBox = document.querySelector('.voice_talk_box');
      const basicVideo = document.querySelector('.voice_ic_wrap .voice_video.basic');
      const processVideo = document.querySelector('.voice_ic_wrap .voice_video.process');
      const actionVideo = document.querySelector('.voice_ic_wrap .voice_video.action');
      const voiceCommand = document.getElementById('voiceCommand');
      const mainPage = document.getElementById('mainPage');

      if (!dashboardTopMain || !voiceWrap || !voiceTalkBox || !basicVideo || !processVideo || !actionVideo) return;

      let balloonTimer = null;
      let processTimer = null;

      const clearTimers = () => {
        if (balloonTimer) {
          clearTimeout(balloonTimer);
          balloonTimer = null;
        }
        if (processTimer) {
          clearTimeout(processTimer);
          processTimer = null;
        }
      };

      const showVideo = (target) => {
        [basicVideo, processVideo, actionVideo].forEach(v => {
          v.classList.remove('active');
          v.pause();
        });
        target.classList.add('active');
      };

      const playBasicLoop = () => {
        showVideo(basicVideo);
        basicVideo.loop = true;
        basicVideo.currentTime = 0;
        basicVideo.play().catch(() => {});
      };

      const playProcessOnce = () => {
        showVideo(processVideo);
        processVideo.loop = false;
        processVideo.currentTime = 0;
        processVideo.play().catch(() => {});
      };

      const playActionLoop = () => {
        showVideo(actionVideo);
        actionVideo.loop = true;
        actionVideo.currentTime = 0;
        actionVideo.play().catch(() => {});
      };

      // process 끝나면 자동으로 action 루프로 전환
      processVideo.addEventListener('ended', () => {
        playActionLoop();
      });

      // 전체를 "맨 처음 상태"로 돌리는 함수
      const resetVoiceUI = () => {
        clearTimers();

        // 말풍선 / 답변 텍스트 제거
        voiceTalkBox.classList.remove('active');
        const answer = voiceTalkBox.querySelector('.voice_talk_answer');
        if (answer) answer.remove();

        // voiceCommand 상태 제거
        if (voiceCommand) {
          voiceCommand.classList.remove(
            'active',
            'has_airshower',
            'has_lighting',
            'has_airdry',
            'has_radio',
            'has_searching'
          );
        }

        // 비디오 기본 상태 (basic 무한루프)
        playBasicLoop();
      };

      const checkVoiceShow = () => {
        if (dashboardTopMain.classList.contains('show_voice')) {

          clearTimers();

          // no_understand 예외처리 추가
          if (voiceWrap.classList.contains('no_understand')) {
            resetVoiceUI(); 
            setTimeout(() => {
              voiceTalkBox.classList.add('active');

              const text = document.createElement('p');
              text.className = 'voice_talk_answer';
              voiceTalkBox.appendChild(text);

              setTimeout(() => {
                text.textContent = '죄송합니다. 잘 이해하지 못했어요.';
                requestAnimationFrame(() => {
                  text.classList.add('visible');
                });
              }, 1000); 

              if (mainPage) {
                mainPage.classList.add('is_active', 'no_understand_main');
              }
              return; 
            },3000);
          }
          playBasicLoop();

          // 2초 후 말풍선 등장
          balloonTimer = setTimeout(() => {
            voiceTalkBox.classList.add('active');

            // 1.8초 후 basic → process (1회 재생)
            processTimer = setTimeout(() => {
              playProcessOnce();
            }, 1800);

            if (voiceWrap.classList.contains('has_airshower')) {
              setTimeout(() => {
                if (!voiceTalkBox.querySelector('.voice_talk_answer')) {
                  const answer = document.createElement('p');
                  answer.className = 'voice_talk_answer';
                  answer.textContent = '네, 에어샤워기 풍속 중으로 켰습니다.';
                  voiceTalkBox.appendChild(answer);
                  requestAnimationFrame(() => {
                    answer.classList.add('visible');
                  });
                }
                if (voiceCommand) voiceCommand.classList.add('active', 'has_airshower');
                if (mainPage) mainPage.classList.add('is_active');
              }, 3000);
            }

            if (voiceWrap.classList.contains('has_lighting')) {
              setTimeout(() => {
                if (!voiceTalkBox.querySelector('.voice_talk_answer')) {
                  const answer = document.createElement('p');
                  answer.className = 'voice_talk_answer';
                  answer.textContent = '네, 조명 살균모드로 켰습니다.';
                  voiceTalkBox.appendChild(answer);
                  requestAnimationFrame(() => {
                    answer.classList.add('visible');
                  });
                }
                if (voiceCommand) voiceCommand.classList.add('active', 'has_lighting');
                if (mainPage) mainPage.classList.add('is_active');
              }, 3000);
            }

            if (voiceWrap.classList.contains('has_airdry')) {
              setTimeout(() => {
                if (!voiceTalkBox.querySelector('.voice_talk_answer')) {
                  const answer = document.createElement('p');
                  answer.className = 'voice_talk_answer';
                  answer.textContent = '네, 에어드라이 자동모드로 켰습니다.';
                  voiceTalkBox.appendChild(answer);
                  requestAnimationFrame(() => {
                    answer.classList.add('visible');
                  });
                }
                if (voiceCommand) voiceCommand.classList.add('active', 'has_airdry');
                if (mainPage) mainPage.classList.add('is_active');
              }, 3000);
            }

            if (voiceWrap.classList.contains('has_radio')) {
              setTimeout(() => {
                if (!voiceTalkBox.querySelector('.voice_talk_answer')) {
                  const answer = document.createElement('p');
                  answer.className = 'voice_talk_answer';
                  answer.textContent = '네, 라디오 켰습니다.';
                  voiceTalkBox.appendChild(answer);
                  requestAnimationFrame(() => {
                    answer.classList.add('visible');
                  });
                }
                if (voiceCommand) voiceCommand.classList.add('active', 'has_radio');
                if (mainPage) mainPage.classList.add('is_active');
              }, 3000);
            }

            if (voiceWrap.classList.contains('has_searching')) {
              setTimeout(() => {
                if (voiceCommand) voiceCommand.classList.add('active', 'has_searching');
                if (mainPage) mainPage.classList.add('is_active');
              }, 3000);
            }

          }, 2000);

        } else {
          // show_voice 사라지면 전체 초기화 + mainPage is_active까지 제거
          resetVoiceUI();
          if (mainPage) mainPage.classList.remove('is_active','no_understand_main');
        }
      };

      // dashboardTopMain의 show_voice 변화 감지
      const observer = new MutationObserver(checkVoiceShow);
      observer.observe(dashboardTopMain, { attributes: true, attributeFilter: ['class'] });

      // mainPage의 is_active 변화도 감지해서, 사라지면 초기화
      if (mainPage) {
        const mainObserver = new MutationObserver(() => {
          if (!mainPage.classList.contains('is_active')) {
            resetVoiceUI();
          }
        });
        mainObserver.observe(mainPage, { attributes: true, attributeFilter: ['class'] });
      }

      checkVoiceShow();
  };
  voiceCommandWrap();

  /**
   * 시계 및 날씨 영역
   * dashboard_top > dashboard_top_main > clock_weather_wrap 영역
   */
  const clockWeatherWrap = () => {
    // 시계 영역
    const clockWrap = () => {
      const deg = 6;
      const hour = document.querySelector(".hour");
      const min = document.querySelector(".min");
      const sec = document.querySelector(".sec");
  
      const setClock = () => {
        let day = new Date();
        let hh = day.getHours() * 30;
        let mm = day.getMinutes() * deg;
        let ss = day.getSeconds() * deg;
  
        hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
        min.style.transform = `rotateZ(${mm}deg)`;
        sec.style.transform = `rotateZ(${ss}deg)`;
      };
  
      // first time
      setClock();
      // Update every 1000 ms
      setInterval(setClock, 1000);
    }
    clockWrap();

    // 시계 & 날씨 이동 영역
    const clockWeatherMove = () => {
      const wrap = document.querySelector('.clock_weather_wrap');
      if (!wrap) return;

      const btnWeather = wrap.querySelector('.btn_weather'); 
      const btnBack = wrap.querySelector('.btn_clock_wrap');

      if (btnWeather) btnWeather.addEventListener('click', () => {
        wrap.classList.add('is_weather');
      });

      if (btnBack) btnBack.addEventListener('click', () => {
        wrap.classList.remove('is_weather');
      });
    }
    clockWeatherMove();
  }
  clockWeatherWrap();

  /**
   * 공간관리현황 도넛차트 영역
   * dashboard_top > dashboard_top_main > space_report_wrap 영역
   */
  const spaceReportWrap = () => {
    // 도넛차트 (플라즈마/이온, led)
    const spaceReportDonut = () => {
      const REPLAY_ON_EACH_ACTIVATION = true; 
      const DELAY_MS = 800; 
      const DURATION_MS = 1800; 
      const KNOB_APPEAR_DELAY_MS = 50; 
  
      const positionKnob = (donut, knob, pct) => {
        if (!knob) return;
        const cx = parseFloat(donut.getAttribute('cx') || 100);
        const cy = parseFloat(donut.getAttribute('cy') || 100);
        const r = parseFloat(donut.getAttribute('r')  || 86);
        const angle = (pct / 100) * Math.PI * 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        knob.setAttribute('cx', x);
        knob.setAttribute('cy', y);
      };
  
      // init
      const prepareDonut = (donut, knob) => {
        const r = parseFloat(donut.getAttribute('r') || 86);
        const C = 2 * Math.PI * r;
        donut.__circumference = C;
  
        donut.style.strokeDasharray  = `${C}`;
        donut.style.strokeDashoffset = `${C}`;
        donut.style.strokeLinecap = 'round';
  
        // 타이머/RAF 정리
        if (donut.__delayTimer) { clearTimeout(donut.__delayTimer); donut.__delayTimer = null; }
        if (donut.__rafId)      { cancelAnimationFrame(donut.__rafId); donut.__rafId = null; }
  
        if (knob) {
          if (!knob.__transitionPatched) {
            const hasTransition = window.getComputedStyle(knob).transitionDuration !== '0s';
            if (!hasTransition) knob.style.transition = 'opacity .25s';
            knob.__transitionPatched = true;
          }
          if (knob.__appearTimer) { clearTimeout(knob.__appearTimer); knob.__appearTimer = null; }
          knob.style.opacity = '0';
          positionKnob(donut, knob, 0);
        }
      };
  
      // 애니메이션
      const animateDonut = (donut, knob, targetPercent) => {
        const C = donut.__circumference ?? (2 * Math.PI * (parseFloat(donut.getAttribute('r') || 86)));
        const start = performance.now();
  
        const tick = (now) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3); 
          const curPct = targetPercent * eased;
  
          donut.style.strokeDashoffset = `${C * (1 - curPct / 100)}`;
          positionKnob(donut, knob, curPct);
  
          if (t < 1) {
            donut.__rafId = requestAnimationFrame(tick);
          } else {
            donut.__rafId = null;
          }
        };
  
        donut.__rafId = requestAnimationFrame(tick);
      };
  
      const animateDonutsIn = (root) => {
        const items = root.querySelectorAll('.space_report_list .list_item');
        items.forEach((item) => {
          const donut = item.querySelector('.donut-progress'); 
          const knob  = item.querySelector('.donut-knob');  
          if (!donut) return;
  
          const percentText = item.querySelector('.list_data')?.textContent.trim() || '0%';
          const percent = parseFloat(percentText);
          if (isNaN(percent)) return;
  
          prepareDonut(donut, knob);
          donut.__delayTimer = setTimeout(() => {
            if (knob) {
              if (knob.__appearTimer) clearTimeout(knob.__appearTimer);
              knob.__appearTimer = setTimeout(() => { knob.style.opacity = '1'; }, KNOB_APPEAR_DELAY_MS);
            }
            animateDonut(donut, knob, percent);
          }, DELAY_MS);
        });
      };
  
      // 리셋
      const resetDonuts = (root) => {
        const items = root.querySelectorAll('.space_report_list .list_item');
        items.forEach((item) => {
          const donut = item.querySelector('.donut-progress');
          const knob  = item.querySelector('.donut-knob');
          if (!donut) return;
          prepareDonut(donut, knob);
        });
      };
  
      const watchSlideGraphActivation = () => {
        const slides = document.querySelectorAll('.swiper-slide.slide-graph');
  
        slides.forEach((slide) => {
          if (slide.classList.contains('swiper-slide-active')) {
            if (REPLAY_ON_EACH_ACTIVATION) animateDonutsIn(slide);
          } else {
            resetDonuts(slide);
          }
  
          const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.attributeName !== 'class') continue;
              const isActive = slide.classList.contains('swiper-slide-active');
  
              if (isActive) {
                if (REPLAY_ON_EACH_ACTIVATION) animateDonutsIn(slide);
              } else {
                if (REPLAY_ON_EACH_ACTIVATION) resetDonuts(slide);
              }
            }
          });
  
          obs.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });
      };
      watchSlideGraphActivation();
    };
    spaceReportDonut();

    // 슬라이드 & 라인차트 (온도 / 습도)
    const temperatureHumidityWrap = () => {
      const DELAY_MS    = 120; 
      const DURATION_MS = 1200;  // 좌→우 애니 길이

      // plugin
      const multiBorderPlugin = {
        id:"multiBorder",
        afterDatasetsDraw(chart,_,opts){
          const {ctx,chartArea} = chart; if(!chartArea) return;
          const {left,right,top,bottom} = chartArea;
          const midY = top + (bottom-top)/2;
          const draw = y => { ctx.beginPath(); ctx.moveTo(left,Math.round(y)+0.5); ctx.lineTo(right,Math.round(y)+0.5); ctx.stroke(); };
          ctx.save(); ctx.strokeStyle = opts?.color || "#242424"; ctx.lineWidth = 1;
          draw(top); draw(midY); draw(bottom);
          ctx.restore();
        }
      };

      const revealLRPlugin = {
        id:"revealLR",
        beforeDatasetsDraw(chart){
          const {ctx,chartArea} = chart; if(!chartArea) return;
          const p = chart.$revealProgress ?? 0;
          const {left,top,right,bottom} = chartArea;
          ctx.save(); ctx.beginPath(); ctx.rect(left,top,(right-left)*p,bottom-top); ctx.clip();
        },
        afterDatasetsDraw(chart){ chart.ctx.restore(); }
      };

      const lastXLinePlugin = {
        id:"lastXLine",
        afterDatasetsDraw(chart){
          const meta = chart.getDatasetMeta(0);
          if(!meta || !meta.data?.length) return;
          const last = meta.data[meta.data.length-1];
          const {ctx,chartArea} = chart; if(!chartArea) return;
          const p = chart.$revealProgress ?? 0;
          const {top,bottom} = chartArea;
          const h = (bottom-top) * p;
          ctx.save(); ctx.strokeStyle="#FFFFFF"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(last.x,bottom); ctx.lineTo(last.x,bottom-h); ctx.stroke(); ctx.restore();
        }
      };

      // Chart Factory
      function createWaveChart(canvasId, points, yMin, yMax, unit, extraFill){
        const canvas = document.getElementById(canvasId);
        if(!canvas) return null;
        const ctx = canvas.getContext("2d");

        // 상단 라인 그라데이션
        const lineGradient = ctx.createLinearGradient(0,0,canvas.width,0);
        lineGradient.addColorStop(0,"#444444");
        lineGradient.addColorStop(1,"#FFFFFF");

        // 채움 그라데이션
        let fillGradient;
        if (extraFill?.type === 'humid') {
          fillGradient = ctx.createLinearGradient(0,0,0,canvas.height);
          fillGradient.addColorStop(0,"rgba(0,138,255,.5)");
          fillGradient.addColorStop(1,"rgba(96,96,96,.2)");
        } else {
          fillGradient = ctx.createLinearGradient(0,0,0,canvas.height);
          fillGradient.addColorStop(0,"rgba(104,111,255,.7)");
          fillGradient.addColorStop(1,"rgba(27,27,51,.2)");
        }

        const chart = new Chart(ctx,{
          type:"line",
          data:{ datasets:[{
            data:points, parsing:false,
            borderColor:lineGradient, backgroundColor:fillGradient, fill:true,
            tension:.45, borderWidth:2,
            pointRadius:i => (i.dataIndex===points.length-1 ? 4 : 0),
            pointBackgroundColor:"#FFFFFF", pointBorderWidth:0
          }]},
          options:{
            responsive:false, maintainAspectRatio:false, events:[],
            layout:{ padding:{ top:6, bottom:0, left:0, right:0 } },
            plugins:{
              legend:{ display:false },
              tooltip:{
                enabled:true, displayColors:false, backgroundColor:"#1c1c1e",
                titleColor:"#fff", bodyColor:"#fff", cornerRadius:12, padding:8,
                yAlign:"bottom", caretPadding:12,
                callbacks:{ title:()=>'', label:i=>`${i.formattedValue} ${unit}` }
              },
              multiBorder:{ color:"#242424" }
            },
            animation:false,
            scales:{
              x:{ type:"linear", min:0, max:3, display:false, grid:{display:false}, border:{display:false} },
              y:{ display:false, min:yMin, max:yMax }
            },
            elements:{ line:{ borderWidth:2 } }
          },
          plugins:[revealLRPlugin, multiBorderPlugin, lastXLinePlugin]
        });

        function showLastTooltip(){
          const idx = chart.data.datasets[0].data.length-1;
          const el = chart.getDatasetMeta(0).data[idx];
          chart.tooltip.setActiveElements([{datasetIndex:0,index:idx}], { x:el.x, y:el.y-10 });
          chart.update('none');
        }
        function animateReveal(duration = DURATION_MS){
          const start = performance.now();
          const ease = t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
          chart.$revealProgress = 0; chart.draw();
          function frame(now){
            const t = Math.min(1,(now-start)/duration);
            chart.$revealProgress = ease(t);
            chart.draw();
            if(t<1) requestAnimationFrame(frame); else showLastTooltip();
          }
          requestAnimationFrame(frame);
        }
        function resetChart(){
          chart.$revealProgress = 0;
          chart.tooltip.setActiveElements([], {x:0,y:0});
          chart.update('none'); chart.draw();
        }
        return { chart, animateReveal, resetChart };
      }

      // 데이터
      const tempPoints  = [{x:0.0,y:25.1},{x:1.2,y:25.7},{x:2.4,y:25.5}];
      const humidPoints = [{x:0.0,y:61.0},{x:1.2,y:64.0},{x:2.4,y:62.0}];

      // 차트생성
      const temperature = createWaveChart("temperatureChart", tempPoints, 24.8, 25.9, "°C", {type:'temp'});
      const humidity    = createWaveChart("humidityChart",    humidPoints, 58,   66,   "%",  {type:'humid'});

      // 내부 스와이퍼
      const innerSwiper = new Swiper('.temperatureHumiditySwiper', {
        direction:'vertical',
        slidesPerView:1,
        spaceBetween:12,
        pagination:{ el:'.temperatureHumiditySwiper .swiper-pagination', clickable:true }
      });

      const container = document.querySelector('.temperatureHumiditySwiper');
      const parentSlide = container?.closest('.swiper-slide.slide-graph'); // ← 부모 슬라이드
      if(!parentSlide){
        setTimeout(()=>{ temperature?.animateReveal(DURATION_MS); humidity?.animateReveal(DURATION_MS); }, DELAY_MS);
        return { innerSwiper, temperature, humidity };
      }

      // 디바운스: class 토글이 모두 끝난 다음 프레임에 처리
      let rafId = null;
      const handleToggle = () => {
        if(rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const isActive = parentSlide.classList.contains('swiper-slide-active');
          if(isActive){
            setTimeout(() => { // 약간의 지연 후 동시 재생
              temperature?.animateReveal(DURATION_MS);
              humidity?.animateReveal(DURATION_MS);
            }, DELAY_MS);
          } else {
            temperature?.resetChart();
            humidity?.resetChart();
          }
        });
      };

      handleToggle();

      // 부모 슬라이드의 class 변화만 관찰 (다른 슬라이드 무시)
      const obs = new MutationObserver((mut) => {
        for(const m of mut){
          if(m.attributeName === 'class') handleToggle();
        }
      });
      obs.observe(parentSlide, { attributes:true, attributeFilter:['class'] });

      return { innerSwiper, temperature, humidity, parentSlide };
    };
    temperatureHumidityWrap();
  }
  spaceReportWrap();
}
dashboardTop();


/** 
 * 대시보드 하단 영역
 */
const dashboardBottom = () => {
  /**
   * 방사능 측정 & 완료 & 메시지/일정 영역
   * dashboard_bottom > dashboard_info
   */
  const dashboardInfoWrap = () => {
    // intro 애니메이션
    const dashboardInfoAnimation = () => {
      const EASE = 'cubic-bezier(.22,.61,.36,1)';
      const DURATION = 800;

      const anim = (el, keyframes, opts) =>
        el?.animate(keyframes, {
          duration: DURATION,
          easing: EASE,
          fill: 'forwards',
          ...opts
        });

      const enterFromBottom = (el) => anim(el, [
        { transform: 'translateY(100%)', opacity: 0 },
        { transform: 'translateY(0%)',   opacity: 1 }
      ]);
      const exitToTop = (el) => anim(el, [
        { transform: 'translateY(0%)',    opacity: 1 },
        { transform: 'translateY(-100%)', opacity: 0 }
      ]);
      const enterFromRight = (el) => anim(el, [
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0%)',   opacity: 1 }
      ]);
      const exitToLeft = (el) => anim(el, [
        { transform: 'translateX(0%)',    opacity: 1 },
        { transform: 'translateX(-100%)', opacity: 0 }
      ]);

      const startDashboardSequence = () => {
        const root = document.querySelector('.dashboard_info');
        if (!root) return;

        const empty = root.querySelector('.empty_box');
        const measure = root.querySelector('.radiation_measurement_box');
        const complete = root.querySelector('.measurement_complete_box');
        const daily = root.querySelector('.daily_info_box');
        const profile = document.querySelector('.profile');

        [empty, measure, complete, daily].forEach((el, i) => {
          if (!el) return;
          el.style.position = 'absolute';
          el.style.inset = '0';
          el.style.zIndex = String(i + 1);
        });
        empty && (empty.style.opacity = 1);
        [measure, complete, daily].forEach(el => el && (el.style.opacity = 0));

        // 0.6s: radiation_measurement_box 등장 + profile에 has_new 추가
        const t1 = setTimeout(() => {
          enterFromBottom(measure);
          if (profile) profile.classList.add('has_new');
        }, 600);

        // 3s: measurement_complete_box 등장 + radiation_measurement_box 퇴장
        const t2 = setTimeout(() => {
          enterFromBottom(complete);
          exitToTop(measure);
        }, 3000);

        // 5s: daily_info_box 등장 + measurement_complete_box 퇴장 + empty 숨김
        const t3 = setTimeout(() => {
          enterFromRight(daily);
          daily?.classList.add('show'); 
          exitToLeft(complete);
          if (empty) empty.style.display = 'none';
        }, 5000);

        return () => {
          clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
        };
      };

      startDashboardSequence();
    };
    dashboardInfoAnimation();

    // dailyInfo 스와이퍼 영역
    const dailyInfoBox = () => {
      const dailyInfoSwiper = new Swiper(".dailyInfoSwiper", {
        direction: 'vertical',
        spaceBetween: 0,
        speed: 800,
        slidesPerView: 1,
        pagination: {
          el: ".dailyInfoSwiper .swiper-pagination",
        },
      });
    };
    dailyInfoBox();

    const dashboardInfoCalendar = () => {
      const dailyButtons = document.querySelectorAll('.dashboard_info .btn_daily_message');
      const scheduleBtn  = document.querySelector('.dashboard_info .btn_daily_schedule');
      const calendarWrap = document.getElementById('calendarWrap');
      const menubar = document.getElementById('menubar');
      const mainEl = document.querySelector('main') || document.getElementById('mainPage'); 

      // 캘린더 열기 함수
      const openCalendar = () => {
        if (calendarWrap && !calendarWrap.classList.contains('active')) {
          calendarWrap.classList.add('active');
        }
        if (menubar && !menubar.classList.contains('has_calendar')) {
          menubar.classList.add('has_calendar');
        }

        // main에 slice_animation 추가
        if (mainEl) {
          mainEl.classList.add('slice_calendar');
        }
      };

      // 메시지 카드 클릭 
      dailyButtons.forEach(btn => {
        btn.addEventListener('click', openCalendar);
      });
      // 일정 버튼 클릭 
      if (scheduleBtn) {
        scheduleBtn.addEventListener('click', openCalendar);
      }
    };
    dashboardInfoCalendar();
  };
  dashboardInfoWrap();

  /**
   * 에어샤워
   * dashboard_bottom > dashboard_left > shower_wrap
   */
  const airShowerWrap = () => {
    const wrap = document.querySelector('.shower_wrap');
    const mainPage = document.getElementById('mainPage');
    if (!wrap) return;

    // 스캔하기 버튼 클릭
    const scanBtn = document.querySelector('.btn_shower');
    const healthScan = document.getElementById('airShower');
  
    if (scanBtn && healthScan) {
      scanBtn.addEventListener('click', () => {
        if (!healthScan.classList.contains('active')) {
          healthScan.classList.add('active');
          mainPage.classList.add('slice_animation');
        }
      });
    }
  };
  airShowerWrap();

  /**
   * 에어드라이
   * dashboard_bottom > dashboard_left > airdry_wrap
   */
  const airDryWrap = () => {
    const wrap = document.querySelector('.airdry_wrap');
    const mainPage = document.getElementById('mainPage');
    if (!wrap) return;

    // 관리하기 버튼 클릭
    const scanBtn = document.querySelector('.btn_airdry');
    const healthScan = document.getElementById('airDry');
  
    if (scanBtn && healthScan) {
      scanBtn.addEventListener('click', () => {
        if (!healthScan.classList.contains('active')) {
          healthScan.classList.add('active');
          mainPage.classList.add('slice_animation');
        }
      });
    }

    const powerBtn = wrap.querySelector('.btn_airdry_power');
    if (powerBtn) {
      powerBtn.addEventListener('click', () => {
        powerBtn.classList.toggle('on');
      });
    }
  };
  airDryWrap();

  /**
   * 헬스스캔
   * dashboard_bottom > dashboard_left > scan_wrap
   */
  const healthScanWrap = () => {
    const wrap = document.querySelector('.scan_wrap');
    if (!wrap) return;

    // 스캔하기 버튼 클릭
    const scanBtn = document.querySelector('.btn_scan');
    const healthScan = document.getElementById('healthScan');

    if (scanBtn && healthScan) {
      scanBtn.addEventListener('click', () => {
        if (!healthScan.classList.contains('active')) {
          healthScan.classList.add('active');
        }
      });
    }
    // -------- end)스캔하기 버튼 클릭 -------

    const scanIntroWrap = wrap.querySelector('.scan_intro_wrap');
    const scanBox       = scanIntroWrap?.querySelector('.scan_box');
    const completeBox   = scanIntroWrap?.querySelector('.scan_complete_box');
    const currentTemp   = wrap.querySelector('.current_temperature');
    const bottomSet     = wrap.querySelector('.bottom_set');
    if (!scanIntroWrap || !scanBox || !completeBox || !currentTemp || !bottomSet) return;

    // timer
    const INTRO_DELAY_MS = 5000;           // 5초 후 intro 시작
    const BOX_DELAY_MS = 1000;             // intro_start 후 1초 뒤 scan_box 활성
    const DONUT_DELAY_MS = 200;            // 도넛 애니 시작 지연
    const DONUT_DURATION_MS = 3000;        // 도넛 0→100% 3초
    const COMPLETE_APPEAR_DELAY_MS = 1000; // 도넛 100% 후 1초 지연 후 완료박스 노출
    const COMPLETE_HOLD_MS = 4000;         // 완료 화면 4초 유지

    let introTimer = null;
    let boxTimer = null;
    let timers = [];
    let observer = null;

    // 재초기화/되감기 방지 가드
    let animating = false;
    let finished  = false;

    // ── Donut 준비 & 애니 (링마다 속도 다르게) ─────────────────────
    const rings = Array.from(scanBox.querySelectorAll('[data-progress]'));

    // 링별로 서로 다른 이징 함수 (원하는대로 조정 가능)
    const easers = [
      (t) => 1 - Math.cos((t * Math.PI) / 2), // 0번 링
      (t) => t * t * (3 - 2 * t), // 1번 링
      (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // 3번 링
    ];

    const prep = (c) => {
      const r = parseFloat(c.getAttribute('r'));
      const C = 2 * Math.PI * r;
      c.__C = C;
      c.style.strokeDasharray = C.toFixed(3);
      c.style.strokeDashoffset = C.toFixed(3); // 0% (비어있게)
      c.style.strokeLinecap = 'round';
    };

    const prepAll = () => rings.forEach(prep);
    prepAll(); // 처음부터 0%로 보이게

    const animateAll = (onComplete) => {
      if (animating || finished) return;
      animating = true;

      // 시작 직전 0%로 보정 (재실행 대비)
      prepAll();
      const t0 = performance.now() + DONUT_DELAY_MS;

      const frame = (now) => {
        const base = Math.max(0, Math.min(1, (now - t0) / DONUT_DURATION_MS)); // 0~1 (시간 비율)

        rings.forEach((c, idx) => {
          const ease = easers[idx] || ((x) => x); // 정의 안된 링은 linear
          const k = ease(base);                   // 각 링의 진행률 (easing 적용)
          const off = c.__C * (1 - k);
          c.style.strokeDashoffset = off;        // 0 → 100%로 차오르는 느낌
        });

        if (now < t0 + DONUT_DURATION_MS) {
          requestAnimationFrame(frame);
        } else {
          // 끝에서는 무조건 100%로 보정
          rings.forEach((c) => (c.style.strokeDashoffset = 0));
          animating = false;
          finished  = true;
          onComplete && onComplete();
        }
      };

      requestAnimationFrame(frame);
    };

    // ── scan_box.active 감시 → 도넛 애니 시작 ──────────────────
    observer = new MutationObserver(() => {
      if (scanBox.classList.contains('active') && !finished && !animating) {
        // 관찰 종료: 이후 클래스 변동이 초기화를 유발하지 않게
        observer.disconnect();

        animateAll(() => {
          // ✅ 도넛 완료 후 1초 기다렸다가 완료 박스 표시
          const t1 = setTimeout(() => {
            scanBox.classList.add('hide');     // 도넛 박스 즉시 가림(플래시 방지)
            completeBox.classList.add('show'); // 완료 화면 노출

            // ✅ 완료 4초 유지 → 인트로 닫고 메인 복귀
            const t2 = setTimeout(() => {
              // cross-fade 고정 상태로 닫기 준비
              scanIntroWrap.classList.add('closing');

              // 다음 프레임 → 그 다음 프레임에 wrap에서 intro_start 제거 (페이드아웃 시작)
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  wrap.classList.remove('intro_start'); // .scan_intro_wrap opacity 0으로
                  currentTemp.classList.add('show');    // 위에서 슬라이드다운
                  // bottom_set는 intro_start 해제로 자연스럽게 복귀

                  // 페이드아웃 종료 후 정리
                  const onFadeEnd = (e) => {
                    if (e.target === scanIntroWrap && e.propertyName === 'opacity') {
                      scanIntroWrap.removeEventListener('transitionend', onFadeEnd);
                      scanBox.classList.remove('active', 'hide');
                      completeBox.classList.remove('show');
                      scanIntroWrap.classList.remove('closing');
                      // finished = true 유지 (100%에서 멈춘 상태 유지)
                    }
                  };
                  scanIntroWrap.addEventListener('transitionend', onFadeEnd);
                });
              });
            }, COMPLETE_HOLD_MS);
            timers.push(t2);
          }, COMPLETE_APPEAR_DELAY_MS);
          timers.push(t1);
        });
      }
    });
    observer.observe(scanBox, { attributes: true, attributeFilter: ['class'] });

    // ── 인트로 시퀀스 시작: 5초 후 intro_start → 1초 후 scan_box active ──
    const ensureBoxActivate = () => {
      if (!scanBox.classList.contains('active')) {
        scanBox.classList.add('active');
      }
    };

    const startSequence = () => {
      wrap.classList.add('intro_start');       // bottom_set 내려가고, intro 페이드인
      if (boxTimer) clearTimeout(boxTimer);
      boxTimer = setTimeout(ensureBoxActivate, BOX_DELAY_MS);
    };

    if (!wrap.classList.contains('intro_start')) {
      introTimer = setTimeout(startSequence, INTRO_DELAY_MS);
    } else {
      // 이미 인트로 상태라면 바로 1초 뒤 박스 활성
      boxTimer = setTimeout(ensureBoxActivate, BOX_DELAY_MS);
    }

    // ── 메모리 누수 방지 ─────────────────────────────────────────
    const cleanup = () => {
      if (introTimer) clearTimeout(introTimer);
      if (boxTimer)   clearTimeout(boxTimer);
      timers.forEach(clearTimeout);
      timers = [];
      if (observer) {
        try { observer.disconnect(); } catch {}
      }
    };
    window.addEventListener('beforeunload', cleanup);
  };
  healthScanWrap();

  /**
   * 홈트레이닝 스와이퍼
   */
  const inbodySwiperWrap = () => {
    const wrap = document.querySelector('.inbody_swiper_box');
    if (!wrap) return;
    const inbodySwiper = new Swiper(".inbodySwiper", {
      direction:'vertical',
      speed: 1200,
      slidesPerView: 1,
      pagination:{ el:'.inbodySwiper .swiper-pagination', clickable:true }
    });
  }
  inbodySwiperWrap();

  /**
   * 라이프모드
   * dashboard_bottom > dashboard_right > lifemedia_wrap
   */
  const lifeMediaWrap = () => {
    const wrap = document.querySelector('.lifemedia_wrap');
    const mainEl = document.querySelector('main') || document.getElementById('mainPage'); 
    if (!wrap) return;

    // 스캔하기 버튼 클릭
    const lifemediaBtn = document.querySelector('.btn_lifemedia');
    const lifeMedia = document.getElementById('lifeMedia');
  
    if (lifemediaBtn && lifeMedia) {
      lifemediaBtn.addEventListener('click', () => {
        if (!lifeMedia.classList.contains('active')) {
          lifeMedia.classList.add('active');
        }
        if (mainEl) {
          mainEl.classList.add('slice_calendar');
        }
      });
    }
  }
  lifeMediaWrap();

  /**
   * 조명 모드
   * dashboard_bottom > dashboard_right > lighting_wrap
   */
  const commandLightingWrap = () => {
    const lightingBox = document.querySelector('.lighting_wrap');
    if (!lightingBox) return;

    const btns = lightingBox.querySelectorAll('.lighting_btn_wrap button');
    const lightingImgWrap = lightingBox.querySelector('.lighting_img');
    const lightingImg = lightingImgWrap ? lightingImgWrap.querySelector('img') : null;
    const range = lightingBox.querySelector('#percentRangeMain');
    const percentValue = lightingBox.querySelector('#percentValueMain');
    const powerBtn = lightingBox.querySelector('.btn_power');
    const percentBox = lightingBox.querySelector('.tit_box .percent');

    if (!lightingImg || !btns.length || !range || !percentValue || !powerBtn) return;

    // 마지막으로 활성화된 색상 버튼
    let lastActiveBtn = lightingBox.querySelector('.lighting_btn_wrap button.active') || null;

    // 마지막 밝기값(%) 저장 (초기값은 현재 range 값 기반)
    let lastPercent = parseInt(range.value, 10) || 0;

    // 버튼 클릭 시 색상 변경 
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;

        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        lastActiveBtn = btn; // 마지막 사용 버튼 업데이트

        const src = lightingImg.getAttribute('src');
        const newColor = btn.classList.contains('btn_yellow')
          ? 'yellow'
          : btn.classList.contains('btn_white')
          ? 'white'
          : 'led';

        const newSrc = src.replace(/lighting_(yellow|white|led)_/, `lighting_${newColor}_`);

        lightingImgWrap.classList.remove('fade-in');
        lightingImgWrap.classList.add('fade-out');

        setTimeout(() => {
          lightingImg.setAttribute('src', newSrc);
          lightingImgWrap.classList.remove('fade-out');
          lightingImgWrap.classList.add('fade-in');
        }, 250);
      });
    });

    // range 조절 시 퍼센트 텍스트 & 이미지 숫자 변경 + 0일 때 숨김
    range.addEventListener('input', () => {
      const val = parseInt(range.value, 10);
      percentValue.textContent = val;

      if (percentBox && !powerBtn.classList.contains('off')) {
        // 전원이 켜져 있을 때만 퍼센트 보여줌
        percentBox.classList.remove('is_off');
        percentBox.textContent = val === 0 ? 'OFF' : `${val}%`;
      }

      if (val === 0) {
        lightingImgWrap.classList.add('is_hidden');
        return;
      } else {
        lightingImgWrap.classList.remove('is_hidden');
        lastPercent = val; // 0이 아닐 때만 마지막 퍼센트 업데이트
      }

      const src = lightingImg.getAttribute('src');
      const newSrc = src.replace(/_(\d{1,3})p\.png$/, `_${val}p.png`);
      lightingImg.setAttribute('src', newSrc);
    });

    // 전원 버튼 클릭
    powerBtn.addEventListener('click', () => {
      powerBtn.classList.toggle('off');

      if (powerBtn.classList.contains('off')) {
        // 전원 꺼짐 상태
        lightingImgWrap.classList.add('is_hidden');
        btns.forEach(b => b.classList.remove('active'));

        if (percentBox) {
          percentBox.classList.add('is_off');
          percentBox.textContent = 'OFF';
        }
      } else {
        // 전원 켜짐 상태
        lightingImgWrap.classList.remove('is_hidden');

        // 마지막에 사용하던 색상 버튼 복구
        if (lastActiveBtn) {
          lastActiveBtn.classList.add('active');
        }

        // 마지막 퍼센트 기반으로 다시 세팅
        if (percentBox) {
          percentBox.classList.remove('is_off');
          percentBox.textContent = lastPercent > 0 ? `${lastPercent}%` : 'OFF';
        }
      }
    });
  };
  commandLightingWrap();


  /**
   * 미러 모드
   * dashboard_bottom > dashboard_right > lighting_wrap
   */
  const mirrorModeWrap = () => {
    const btnMirrorMode = document.querySelector('.btn_mirrormode');
    const mainPage = document.getElementById('mainPage');
    if (!btnMirrorMode || !mainPage) return;

    btnMirrorMode.addEventListener('click', () => {
      mainPage.classList.toggle('has_mirrormode');
    });
  };
  mirrorModeWrap();
}
dashboardBottom();


/**
 * 드레스 룸
 */
const dashboardDressRoom = () => {
  // 라디오 영역 활성화
  const dashboardTopVoiceWrap = () => {
    const root = document.querySelector('.dashboard_top_main');
    const radioBtn = document.querySelector('.dashboard_bottom .etc_wrap .btn_radio');
    const mainBtns = document.querySelectorAll('.dashboard_btn_wrap .main_btn button');
    const voiceBtn = document.querySelector('.dashboard_btn_wrap .btn_voice'); 
    const radioCloseBtn = document.querySelector('.radio_wrap .btn_radio_close');

    if (!root || !radioBtn) return;

    const removeMainActive = () => {
      mainBtns.forEach(btn => btn.classList.remove('active'));
    };

    // 라디오 켜기
    const openRadio = () => {
      root.classList.remove('show_voice');
      if (voiceBtn) {
        voiceBtn.classList.remove('active');
      }

      root.classList.add('show_radio');
      radioBtn.classList.add('active');

      removeMainActive();
    };

    // 라디오 끄기 (라디오 상태만 정리)
    const closeRadio = () => {
      root.classList.remove('show_radio');
      radioBtn.classList.remove('active');
    };

    // 라디오 버튼 클릭 → 라디오 열기
    radioBtn.addEventListener('click', openRadio);

    // 메인 버튼 클릭 → 라디오 닫기
    mainBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        closeRadio();
      });
    });

    // 보이스 버튼 클릭 → 라디오 닫기
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        closeRadio();  
      });
    }

    // 라디오 내부 닫기 버튼: "첫 번째 메인 버튼 클릭"으로 처리
    if (radioCloseBtn && mainBtns[0]) {
      radioCloseBtn.addEventListener('click', () => {
        // 라디오 상태도 정리
        closeRadio();
        // 첫 번째 메인 버튼 강제 클릭 → gotoSlide 로직 그대로 타게
        mainBtns[0].click();
      });
    }

    // 초기에는 라디오 닫힌 상태로
    closeRadio();
  };
  dashboardTopVoiceWrap();

  // 라디오 탭
  const tabWrap = () => {
    const tabBtns = document.querySelectorAll('.radio_tab_btn_wrap .btn_radio_tab');
    const tabContents = document.querySelectorAll('.radio_tab_contents .radio_content');
    const contentsWrap = document.querySelector('.radio_tab_contents'); // ← 추가됨

    if (!tabBtns.length || !tabContents.length || !contentsWrap) return;

    // 탭 버튼 클릭 이벤트
    tabBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        // 탭 버튼 활성화 전환
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 탭 콘텐츠 전환
        tabContents.forEach(content => content.classList.remove('active'));
        tabContents[i].classList.add('active');

        // ★ 좌우 슬라이드 애니메이션
        contentsWrap.style.transform = `translateX(${-100 * i}%)`;
      });
    });
  };
  tabWrap();

  // 청취 중 채널 재생/스탑 버튼
  const radioChannelPlayStopWrap = () => {
    const channel = document.getElementById('radioChannel');
    if (!channel) return;

    const btnPlay = channel.querySelector('.btn_play');
    const radioCompany = channel.querySelector('.radio_company');
    const radioTit = channel.querySelector('.radio_tit');
    const radioOpen = document.querySelector('.radio_open');

    if (!btnPlay || !radioCompany || !radioTit) return;

    const defaultCompanyText = radioCompany.textContent.trim();
    const defaultTitText = radioTit.textContent.trim();

    // 텍스트 변경 + opacity 전환
    const smoothTextChange = (el, newText, finalOpacity) => {
      if (!el) return;

      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = finalOpacity === 1 ? 0.2 : 1; 

      setTimeout(() => {
        el.textContent = newText;
        el.style.opacity = finalOpacity; 
      }, 150);
    };

    btnPlay.addEventListener('click', () => {
      btnPlay.classList.toggle('stop');
      const isStop = btnPlay.classList.contains('stop');

      if (!isStop) {
        // stop 제거 = OFF 상태
        if (radioOpen) radioOpen.classList.remove('open');
        channel.classList.add('no_playing');

        smoothTextChange(radioCompany, 'OFF', 0.2);
        smoothTextChange(radioTit, '재생중인 채널이 없습니다', 0.2);
      } else {
        // stop 추가 = ON 상태
        if (radioOpen) radioOpen.classList.add('open');
        channel.classList.remove('no_playing');

        smoothTextChange(radioCompany, defaultCompanyText, 1);
        smoothTextChange(radioTit, defaultTitText, 1);
      }
    });
  };
  radioChannelPlayStopWrap();

  // 채널리스트 버튼 active 
  const channelListWrap = () => {
    const buttons = document.querySelectorAll('.radio_list .btn_radio_list');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // 모든 버튼에서 active 제거 & "재생중" 제거
        buttons.forEach(b => {
          b.classList.remove('active');
          const playing = b.querySelector('.playing');
          if (playing) playing.remove();
        });

        // 클릭한 버튼에 active 추가
        btn.classList.add('active');

        // "재생중" span이 없으면 새로 추가
        if (!btn.querySelector('.playing')) {
          const playingSpan = document.createElement('span');
          playingSpan.className = 'playing';
          playingSpan.textContent = '재생중';
          btn.appendChild(playingSpan);
        }
      });
    });
  };
  channelListWrap();

  // 채널리스트 스크롤 그라데이션
  const channelLisScrolltWrap = () => {
    const list = document.querySelector('#radioChannelList .radio_list');
    if (!list) return;

    const wrap = list.closest('.radio_list_wrap');
    if (!wrap) return;

    list.addEventListener('scroll', () => {
      const scrollTop = list.scrollTop;
      const scrollHeight = list.scrollHeight;
      const clientHeight = list.clientHeight;

      // 맨 위
      if (scrollTop <= 0) {
        wrap.classList.remove('scrolling', 'scroll_end');
        return;
      }

      // 맨 아래
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        wrap.classList.remove('scrolling');
        wrap.classList.add('scroll_end');
        return;
      }

      // 스크롤 중간
      wrap.classList.add('scrolling');
      wrap.classList.remove('scroll_end');
    });
  };
  channelLisScrolltWrap();

}
dashboardDressRoom();