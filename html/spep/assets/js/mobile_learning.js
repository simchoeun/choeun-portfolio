/**
 * common
 */
const common = () => {
  const categorycommonSwiper = new Swiper(".categorycommonSwiper .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 10,
    navigation: {
      nextEl: ".categorycommonSwiper .swiper-button-next",
      prevEl: ".categorycommonSwiper .swiper-button-prev",
    },
  });
  // 클릭 시 active 클래스 토글
  document.querySelectorAll(".categorycommonSwiper .btn_category").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".categorycommonSwiper .btn_category").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  // lestenRepeat 공통 영역
  const lestenRepeat = () => {
    const btnRepeat = document.querySelector('.lesten_repeat_box .btn_repeat');
    const btnBookmark = document.querySelector('.lesten_repeat_box .btn_bookmark');
    const btnSound = document.querySelector('.lesten_repeat_box .btn_sound');
    const btnReplay = document.querySelector('.lesten_repeat_box .btn_replay');
    const btnMike = document.querySelector('.lesten_repeat_box .btn_mike');
    const infoText = document.querySelector('.lesten_repeat_box .sentence_all_wrap .info');
  
    // 셔플 버튼
    if (btnRepeat) {
      btnRepeat.addEventListener('click', function () {
        btnRepeat.classList.toggle('active');
      });
    }
  
    // 북마크 버튼
    if (btnBookmark) {
      btnBookmark.addEventListener('click', function () {
        btnBookmark.classList.toggle('active');
      });
    }

    // 사운드 버튼
    if (btnSound) {
      btnSound.addEventListener('click', function () {
        btnSound.classList.toggle('active');
      });
    }

    // 되돌리기 버튼
    if (btnReplay) {
      btnReplay.addEventListener('click', function () {
        btnReplay.classList.toggle('active');
      });
    }

    // 녹음 버튼
    if (btnMike) {
      btnMike.addEventListener('click', () => {
        // play 또는 pause 클래스가 있다면 실행하지 않음
        if (btnMike.classList.contains('play') || btnMike.classList.contains('pause')) return;
    
        btnMike.classList.toggle('active');
        infoText.classList.toggle('mike_info');
    
        if (infoText.classList.contains('mike_info')) {
          infoText.textContent = '녹음 버튼을 누르세요';
        } else {
          infoText.textContent = '먼저 문장을 들어보세요';
        }
      });
    }

    // 비디오 영역 type1
    const videoBoxType1 = document.querySelector('.lesten_repeat .video_box.type1');
    const btnPlay = document.querySelector('.lesten_repeat .video_box.type1 .btn_play');
    const btnSpeed = document.querySelector('.lesten_repeat .btn_speed');
  
    let speedState = 0; // 배속
  
    if (videoBoxType1 && btnPlay) {
      btnPlay.addEventListener('click', () => {
        btnPlay.classList.toggle('pause');
      });
      btnSpeed.addEventListener('click', () => {
        speedState = (speedState + 1) % 3;
    
        switch (speedState) {
          case 0:
            btnSpeed.textContent = '1x';
            break;
          case 1:
            btnSpeed.textContent = '1.5x';
            break;
          case 2:
            btnSpeed.textContent = '2x';
            break;
        }
      });
    }

    const languageBox = () => {
      const setenceWrap = document.querySelector('.lesten_repeat_box .setence_wrap');
      const btnLanguage = document.querySelector('.lesten_repeat_box .btn_language');
      const englishSetence = document.querySelector('.lesten_repeat_box .setence.english');
      const koreaSetence = document.querySelector('.lesten_repeat_box .setence.korea');
      const engTranslationList = document.querySelector('.lesten_repeat_box .eng_translation_list');
    
      let langState = 0; // 0: 가/A, 1: 가나다, 2: ABC
    
      if (englishSetence && koreaSetence) {
        btnLanguage.addEventListener('click', () => {
          langState = (langState + 1) % 3;
      
          switch (langState) {
            case 0:
              btnLanguage.textContent = '가/A';
              englishSetence.classList.add('active');
              koreaSetence.classList.add('active');
              break;
            case 1:
              btnLanguage.textContent = '가나다';
              englishSetence.classList.remove('active');
              koreaSetence.classList.add('active');
              break;
            case 2:
              btnLanguage.textContent = 'ABC';
              englishSetence.classList.add('active');
              koreaSetence.classList.remove('active');
              break;
          }
  
          const activeCount = setenceWrap.querySelectorAll('.setence.active').length;
  
          if (activeCount === 1) {
            setenceWrap.classList.add('only_one');
          } else {
            setenceWrap.classList.remove('only_one');
          }
        });
      }

      // 번역 리스트 처리
      if (engTranslationList) {
        const translations = engTranslationList.querySelectorAll('.eng_translation');

        btnLanguage.addEventListener('click', () => {
          langState = (langState + 1) % 3;
      
          translations.forEach(item => {
            const eng = item.querySelector('.eng');
            const kor = item.querySelector('.kor');
  
            if (langState === 0) {
              btnLanguage.textContent = '가/A';
              eng?.classList.remove('none');
              kor?.classList.remove('none');
            } else if (langState === 1) {
              btnLanguage.textContent = '가나다';
              eng?.classList.add('none');
              kor?.classList.remove('none');
            } else {
              btnLanguage.textContent = 'ABC';
              eng?.classList.remove('none');
              kor?.classList.add('none');
            }
          });
        });
      }
      
    }
    languageBox();
  }
  lestenRepeat();

  // quizType 공통 영역
  const quizType = () => {
    // 빈칸 맞추기
    const fillBlank = () => {
      const toggleSingleFill = (button, text) => {
        const blank = document.querySelector('.blank_wrap .blank'); 
        const isActive = button.classList.contains('active');
      
        const allButtons = document.querySelectorAll('.blank_btn_wrap .btn_blank'); 
        allButtons.forEach(btn => btn.classList.remove('active'));
      
        if (isActive) {
          blank.textContent = '';
          blank.classList.remove('active');
        } else {
          blank.textContent = text;
          blank.classList.add('active');
          button.classList.add('active');
        }
      };
      
      const buttons = document.querySelectorAll('.blank_btn_wrap .btn_blank');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const text = button.dataset.text;
          toggleSingleFill(button, text);
        });
      });
    }
    fillBlank();

    // 툴팁
    const tooltip = () => {
      const tipButton = document.querySelector('.btn_tip');
      const tipBox = document.querySelector('.tip_box');
      const closeButton = document.querySelector('.btn_tip_close');
    
      if (tipBox) {
        tipButton.addEventListener('click', () => {
          if (tipButton.classList.contains('active')) {
            tipBox.classList.add('active');
          }
        });
      
        closeButton.addEventListener('click', () => {
          tipBox.classList.remove('active');
        });
      }
    }
    tooltip();
  }
  quizType();

  // testType 공통 영역
  const testType = () => {
    const videoBoxType1 = document.querySelector('.test_wrap .video_box.type1');
    const btnPlay = document.querySelector('.test_wrap .video_box.type1 .btn_play');
    const btnBookmark = document.querySelector('.test_wrap .btn_bookmark');
    const btnSpeed = document.querySelector('.test_wrap .btn_speed');
  
    let langState = 0; // 배속
    if (videoBoxType1 && btnPlay) {
      btnPlay.addEventListener('click', () => {
        btnPlay.classList.toggle('pause');
      });
      btnSpeed.addEventListener('click', () => {
        langState = (langState + 1) % 3;
    
        switch (langState) {
          case 0:
            btnSpeed.textContent = '1x';
            break;
          case 1:
            btnSpeed.textContent = '1.5x';
            break;
          case 2:
            btnSpeed.textContent = '2x';
            break;
        }
      });
    }

    // 북마크 버튼
    if (btnBookmark) {
      btnBookmark.addEventListener('click', function () {
        btnBookmark.classList.toggle('active');
      });
    }
  }
  testType();

  // lestenRepeat 추가 공통 영역
  const addLestenRepeat = () => {
    const cardSwiperWrap = document.querySelector('.cardSwiper'); 
    if (cardSwiperWrap) {
      const cardSwiper = new Swiper(".cardSwiper .swiper-container", {
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: true,
      });
    }

    const cardBtnWrap = document.querySelector('.card_btn_wrap');
    if (cardBtnWrap) {
      const clickStates = new Map();

      const setupToggle = (selector, steps) => {
        const button = cardBtnWrap.querySelector(selector);
        if (!button) return;

        clickStates.set(button, 0);

        button.addEventListener('click', () => {
          let current = clickStates.get(button);
          current = (current + 1) % steps.length;
          clickStates.set(button, current);

          // 클래스 초기화
          button.classList.remove('first', 'second');

          // 현재 단계 클래스 추가
          const currentClass = steps[current];
          if (currentClass) {
            button.classList.add(currentClass);
          }
        });
      };

      // 버튼별 단계 설정
      setupToggle('.btn_continue_listening', [null, 'first', 'second']);
      setupToggle('.btn_shuffle', [null, 'first']);
      setupToggle('.btn_card_repeat', [null, 'first', 'second']);
    }
  }
  addLestenRepeat();

  const loading = () => {
    const loadingBox = document.querySelector('.loading_box');
    const htmlEl = document.documentElement;

    if (loadingBox) {
      htmlEl.style.overflowY = 'hidden';
    } else {
      htmlEl.style.overflowY = 'auto';
    }
  }
  loading();
}
window.onload = () => {
  common();
};

/**
 * mobile Learning
 */
const mobileLearning = () => {
  const currentStatusSwiper = new Swiper(".currentStatusSwiper .swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".currentStatusSwiper .swiper-button-next",
      prevEl: ".currentStatusSwiper .swiper-button-prev",
    },
  });

  const spaSwiper = new Swiper(".spaSwiper .swiper-container", {
    loop: true,
    pagination: {
      el: ".spaSwiper .swiper-pagination",
      clickable: true,
    },
  });

  const lessonActivitySwiper = new Swiper(".lessonActivitySwiper .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 20,
    navigation: {
      nextEl: ".lessonActivitySwiper .swiper-button-next",
      prevEl: ".lessonActivitySwiper .swiper-button-prev",
    },
  });

  document.querySelectorAll(".btn_focus").forEach(button => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".btn_focus").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
      document.querySelectorAll(".tab_item").forEach(content => content.classList.remove("active"));

      const targetTab = document.getElementById(this.dataset.tab);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });

  /**
   * chart
   */
  const monthDoughnutChart = (canvasId, value, color) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
  
    const data = {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, "#ffffff00"], // 단일 색상 적용
          borderWidth: 0,
          borderRadius: value === 100 ? 0 : 30,
        },
      ],
    };
  
    const options = {
      cutout: "89%",
      hover: { mode: null },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  
    new Chart(ctx, {
      type: "doughnut",
      data,
      options,
    });
  };
  
  monthDoughnutChart("monthChart", 85, "#ffffff"); 
  monthDoughnutChart("monthChart02", 50, "#ffffff"); 
  monthDoughnutChart("monthChart03", 100, "#ffffff"); 
  

  const spaDoughnutChart = (canvasId, value, color1, color2) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // 그라데이션 생성 (원형 방향)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color1); // 시작 색상
    gradient.addColorStop(1, color2); // 끝 색상
  
    const data = {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [gradient, "#ffffff00"], // 그라데이션 적용
          borderWidth: 0,
          borderRadius: 30,
        },
      ],
    };
  
    const options = {
      cutout: "75%",
      hover: { mode: null },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  
    new Chart(ctx, {
      type: "doughnut",
      data,
      options,
    });
  };
  
  // 각 차트 생성 (색상 그라데이션 적용)
  spaDoughnutChart("retChart", 70, "#ABE31D", "#BBEB41"); 
  spaDoughnutChart("siChart", 69, "#3881FF", "#74A7FF"); 
  spaDoughnutChart("peChart", 89, "#2E51CA", "#6384F7"); 
}

/**
 * Mobile Lesson Activity
 */
const mobileLesson = () => {
  const mobileLessonSwiper = new Swiper(".mobileLessonSwiper .swiper-container", {
    effect: "coverflow",
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 0,
      slideShadows: false
    },
    navigation: {
      nextEl: ".mobileLessonSwiper .swiper-button-next",
      prevEl: ".mobileLessonSwiper .swiper-button-prev",
    },
  });

  // 선택순 옵션 클릭
  const selecOrderWrap = () => {
    const selecOrderBox = document.querySelector(".select_group .sort_order_btn");
    const optionsContainer = document.querySelector(".select_group .options");
    const options = document.querySelectorAll(".select_group .option");

    // select 박스 클릭 시 옵션 보이기/숨기기
    selecOrderBox.addEventListener("click", function () {
      selecOrderBox.classList.toggle("active");
      optionsContainer.classList.toggle("active");
    });

    // 옵션 클릭 시 선택된 값 반영 및 active 클래스 적용
    options.forEach(option => {
      option.addEventListener("click", function () {
        selecOrderBox.classList.remove("active");
        selecOrderBox.textContent = this.textContent;
        options.forEach(opt => opt.classList.remove("active")); 
        this.classList.add("active");
        optionsContainer.classList.remove("active");
      });
    });

    // 바깥 클릭 시 옵션 닫기
    document.addEventListener("click", function (e) {
      if (!selecOrderBox.contains(e.target)) {
        selecOrderBox.classList.remove("active");
        optionsContainer.classList.remove("active");
      }
    });
  }
  selecOrderWrap();

  // 더보기 버튼 클릭
  const moreBtn = () => {
    const moreButtons = document.querySelectorAll(".btn_more");

    moreButtons.forEach(button => {
      button.addEventListener("click", function () {
        const conversationItem = this.closest(".conversation_item"); 
        const moreBox = conversationItem.querySelector(".more_box"); 
  
        this.classList.toggle("active"); 
        moreBox.classList.toggle("active"); 
      });
    });
  }
  moreBtn();
}

/**
 * What’s New
 */
const whatsNew = () => {
  const weeklySwiper = new Swiper(".weeklySwiper .swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".weeklySwiper .swiper-button-next",
      prevEl: ".weeklySwiper .swiper-button-prev",
    },
  });

  const bookmarkButtons = document.querySelectorAll("#whats .btn_bookmark");
  bookmarkButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation(); 
      event.preventDefault(); 
      this.classList.toggle("active"); 
    });
  });
}

/**
 * What’s New Detail
 */
const whatsNewDetail = () => {
  const whatsnewDetailSwiper = new Swiper(".whatsnewDetailSwiper .swiper-container", {
    loop: true,
    autoHeight: true,
    navigation: {
      nextEl: ".whatsnewDetailSwiper .swiper-button-next",
      prevEl: ".whatsnewDetailSwiper .swiper-button-prev",
    },
    pagination: {
      el: ".whatsnewDetailSwiper .swiper-pagination",
      clickable: true,
    },
  });
  
  // 좋아요 수
  const btnHeart = document.querySelector("#whatsDetail .btn_wrap .btn_heart");
  const txtSpan = btnHeart.querySelector("#whatsDetail .btn_wrap .btn_heart .txt");
  txtSpan.style.display = txtSpan.textContent === "" ? "none" : "inline";
  btnHeart.addEventListener("click", function () {
    btnHeart.classList.toggle("active"); 
    txtSpan.textContent = this.classList.contains("active") ? "1" : "";
    txtSpan.style.display = txtSpan.textContent === "" ? "none" : "inline";
  });

  // 북마크
  const btnBookmark = document.querySelector("#whatsDetail .btn_wrap .btn_bookmark");
  btnBookmark.addEventListener("click", function () {
    btnBookmark.classList.toggle("active");
  });
}

/**
 * My List
 */
const myList = () => {
  const tabButtons = document.querySelectorAll(".btn_tab");
  const tabPanels = document.querySelectorAll(".tab_panel");

  // 탭 활성화
  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
      tabPanels.forEach(panel => panel.classList.remove("active"));
      document.getElementById(this.dataset.tab).classList.add("active");
    });
  });

  // 선택순 옵션 (각 탭마다 개발필요)
  const selecOrderWrap = () => {
    const selecOrderBox = document.querySelector(".sort_order .sort_order_btn");
    const optionsContainer = document.querySelector(".sort_order .options");
    const options = document.querySelectorAll(".sort_order .option");

    // select 박스 클릭 시 옵션 보이기/숨기기
    selecOrderBox.addEventListener("click", function () {
      selecOrderBox.classList.toggle("active");
      optionsContainer.classList.toggle("active");
    });

    // 옵션 클릭 시 선택된 값 반영 및 active 클래스 적용
    options.forEach(option => {
      option.addEventListener("click", function () {
        selecOrderBox.classList.remove("active");
        selecOrderBox.textContent = this.textContent;
        options.forEach(opt => opt.classList.remove("active")); 
        this.classList.add("active");
        optionsContainer.classList.remove("active");
      });
    });

    // 바깥 클릭 시 옵션 닫기
    document.addEventListener("click", function (e) {
      if (!selecOrderBox.contains(e.target)) {
        selecOrderBox.classList.remove("active");
        optionsContainer.classList.remove("active");
      }
    });
  }
  selecOrderWrap();

  // 갯수보기 옵션 (각 탭마다 개발필요)
  const selectNumWrap = () => {
    const selectNumBox = document.querySelector(".sort_num .sort_num_btn");
    const optionsContainer = document.querySelector(".sort_num .options");
    const options = document.querySelectorAll(".sort_num .option");

    // select 박스 클릭 시 옵션 보이기/숨기기
    selectNumBox.addEventListener("click", function () {
      selectNumBox.classList.toggle("active");
      optionsContainer.classList.toggle("active");
    });

    // 옵션 클릭 시 선택된 값 반영 및 active 클래스 적용
    options.forEach(option => {
      option.addEventListener("click", function () {
        selectNumBox.classList.remove("active");
        selectNumBox.textContent = this.textContent;
        options.forEach(opt => opt.classList.remove("active")); 
        this.classList.add("active");
        optionsContainer.classList.remove("active");
      });
    });

    // 바깥 클릭 시 옵션 닫기
    document.addEventListener("click", function (e) {
      if (!selectNumBox.contains(e.target)) {
        selectNumBox.classList.remove("active");
        optionsContainer.classList.remove("active");
      }
    });
  }
  selectNumWrap();

  // 전체 체크 (각 탭마다 개발필요)
  const checkVocabulary = () => {
    const selectAll = document.getElementById('check_all_vocabulary');
    const checkboxes = document.querySelectorAll('.vocabulary_checkbox');
  
    selectAll.addEventListener('change', () => {
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
      });
    });
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        selectAll.checked = [...checkboxes].every(cb => cb.checked);
      });
    });
  }
  checkVocabulary();

  // play 클릭시 > puase
  const playButton = document.querySelector(".btn_play"); 
  if (playButton) {
    playButton.addEventListener("click", () => {
      playButton.classList.toggle("pause");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("mobileLearning")) { 
    mobileLearning();
  } else if (document.getElementById("mobileLesson")) { 
    mobileLesson();
  } else if (document.getElementById("whats")) { 
    whatsNew();
  } else if (document.getElementById("whatsDetail")) { 
    whatsNewDetail();
  } else if (document.getElementById("myList")) { 
    myList();
  } 
});