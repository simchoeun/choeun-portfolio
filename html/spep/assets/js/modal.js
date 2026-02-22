// 현재 열린 모달을 추적할 변수
let currentOpenModal = null;

// 모달을 열고 닫는 함수
const openModal = (modalId) => {
  const modal = document.getElementById(modalId);

  if (modal) {
    // 이미 열려 있는 모달이 있으면 닫기
    if (currentOpenModal) {
      currentOpenModal.style.display = "none";
    }

    // 새로운 모달 열기
    modal.style.display = "flex";
    currentOpenModal = modal; 
    document.body.style.overflow = "hidden"; 

    // 닫기 버튼이 있으면 클릭 이벤트 추가
    const closeButton = modal.querySelector(".btn_close");
    if (closeButton) {
      closeButton.onclick = function () {
        closeModal(modal);
      };
    }

    window.onclick = function(event) {
      if (event.target === modal) {
        closeModal(modal); 
      }
    };


    /**
     * Modal Event
     */
    // Timer Modal
    if (modalId === "infoTimerModal") {
      setTimeout(() => {
        closeModal(modal);
      }, 3000);
    }

    // Topic Modal 토픽 선택
    if (modalId === 'topicModal') {
      const checkboxes = document.querySelectorAll('input[name="topic"]');
      const topicNum = document.querySelector(".topic_num");
  
      const updateTopicCount = () => {
        const checkedCount = document.querySelectorAll('input[name="topic"]:checked').length;
        topicNum.textContent = `${checkedCount}개`;
      }

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateTopicCount);
      });
  
      updateTopicCount();
    }

    // After-Class Review Modal 교육 아쉬운 부분 '있어요' 클릭 시
    if (modalId === 'afterClassReviewModal') {
      const radioYes = document.getElementById("afterClassReview02"); 
      const radioNo = document.getElementById("afterClassReview01");
      const hiddenDiv = document.getElementById("hiddenDiv");

      const toggleHiddenContent = () => {
          if (radioYes.checked) {
              hiddenDiv.style.display = "block"; // 보이게 함
          } else {
              hiddenDiv.style.display = "none"; // 숨김
          }
      }

      radioYes.addEventListener("change", toggleHiddenContent);
      radioNo.addEventListener("change", toggleHiddenContent);
    }

    // 수강 신청 모달 슬라이드
    if (modalId === 'classDetailModal') {
      const initSwiper = () => {
        new Swiper(".classDetailSwiper", {
          slidesPerView: 1,
          loop: true, 
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
        });
      };
      initSwiper()
    }

    // 교육만족도조사 모달 
    if (modalId === 'educationModal') {
      document.querySelector(".btn_save").addEventListener("click", () => {
        let isValid = true;
        console.log('click')

        // 필수 radio 체크 확인
        document.querySelectorAll(".radio_wrap.required").forEach((radioWrap) => {
            const radioGroup = radioWrap.querySelectorAll("input[type='radio']");
            const isChecked = [...radioGroup].some(radio => radio.checked);
            const title = radioWrap.querySelector(".radio_tit");

            if (!isChecked) {
                title.classList.add("txt_red");
                isValid = false;
            } else {
                title.classList.remove("txt_red");
            }
        });

        // 필수 textarea 입력 확인
        document.querySelectorAll(".textarea_wrap.required").forEach((textareaWrap) => {
          const textarea = textareaWrap.querySelector("textarea");
          const title = textareaWrap.querySelector(".textarea_tit");

          if (!textarea.value.trim()) {
            title.classList.add("txt_red");
            isValid = false;
          } else {
            title.classList.remove("txt_red");
          }
        });

        // 모든 필수 항목이 입력되었을 때만 저장 실행
        if (isValid) {
          alert("저장 완료!");
        } else {
          alert("필수 항목을 입력해주세요.");
        }
      });
    }


  } else {
    console.error(`모달 ${modalId}을(를) 찾을 수 없습니다.`);
  }
}

// 모달 닫는 함수
const closeModal = (modal) => {
  modal.style.display = "none";
  currentOpenModal = null; 

  document.body.style.overflow = "auto"; 
}

// modal.html을 fetch로 로드하여 모달을 동적으로 삽입
fetch('/include/modal.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById("modalContainer").innerHTML = html;

    document.querySelectorAll(".openModalBtn").forEach(button => {
      button.addEventListener("click", function() {
        const modalId = this.getAttribute("data-modal");
        openModal(modalId);
      });
    });
  })
  .catch(error => {
    console.error('모달을 로드하는데 오류가 발생했습니다:', error);
  });