/**
 * 비수강생
 */
const nonStudent = () => {
  const visualSwiper = new Swiper(".visualSwiper", {
    loop: true,
    pagination: {
      el: ".visualSwiper .swiper-pagination",
      clickable: true,
    },
  });

  const statusSwiper = new Swiper(".statusSwiper", {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    pagination: {
      el: ".statusSwiper .swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".statusSwiper .swiper-button-next",
      prevEl: ".statusSwiper .swiper-button-prev",
    },
    breakpoints: {
      0: { 
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1280: { 
          slidesPerView: 3,
          slidesPerGroup: 3,
      }
    }
  });

  const bannerSwiper = new Swiper(".bannerSwiper", {
    loop: true,
    pagination: {
      el: ".bannerSwiper .swiper-pagination",
      clickable: true,
    },
  });

  const whatsNewSwiper = new Swiper(".whatsNewSwiper .swiper-container", {
    navigation: {
      nextEl: ".whatsNewSwiper .swiper-button-next",
      prevEl: ".whatsNewSwiper .swiper-button-prev",
    },
  });

  const whatsNewMoSwiper = new Swiper(".whatsNewMoSwiper .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 46,
  });

  const courseListMoSwiper = new Swiper(".courseListMoSwiper .swiper-container", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    navigation: {
      nextEl: ".courseListMoSwiper .swiper-button-next",
      prevEl: ".courseListMoSwiper .swiper-button-prev",
    },
  });


  // 임시 더보기 클릭 작업 (추후 개발 필요)
  const moreButton = document.querySelector(".btn_more");
  const listWrap = document.querySelector(".list_wrap.mo_hidden");

  moreButton.addEventListener("click", function () {
    this.classList.toggle("active");

    if (this.classList.contains("active")) {
      this.innerHTML = `접기 <img src="./assets/images/main/btn_more.svg" alt="">`; // 버튼 텍스트 변경

      // active가 추가되었을 때 7개 리스트 추가
      for (let i = 0; i < 7; i++) {
        const newList = document.createElement("div");
        newList.classList.add("available_list", "extra_list"); 
        newList.innerHTML = `
          <div class="day_wrap">
            <p class="day">D-${Math.floor(Math.random() * 10 + 1)}</p>
          </div>
          <div class="info">
            <p class="tit">[2024년] 24년 3차 사내어학과정</p>
            <ul class="detail_wrap">
              <li>
                <p class="sort">과정명</p>
                <p class="detail">E.S.P</p>
              </li>
              <li>
                <p class="sort">교육기간</p>
                <p class="detail">2024. 10.14 ~ 2024. 12. 27</p>
              </li>
              <li class="date">
                <p class="sort">신청기간</p>
                <p class="detail">2024. 10.14 ~ 2024. 12. 27</p>
              </li>
            </ul>
          </div>
          <button type="button" class="btn_available openModalBtn" data-modal="classDetailModal">
            수강신청
            <img src="./assets/images/main/ic_arrow_diagonal.svg" alt="">
          </button>
        `;
        listWrap.insertBefore(newList, moreButton);
      }
    } else {
      this.innerHTML = `더보기 <img src="./assets/images/main/btn_more.svg" alt="">`; // 버튼 텍스트 원래대로

      // active가 제거되었을 때 추가된 리스트 삭제
      document.querySelectorAll(".extra_list").forEach((el) => el.remove());
    }
  });
}

/**
 * 수강생
 */
const student = () => {
  const selectWrap = () => {
    const selectBox = document.querySelector(".select_box");
    const selectBoxTxt = document.querySelector(".select_box .select");
    const optionsContainer = document.querySelector(".options");
    const options = document.querySelectorAll(".option");

    // select 박스 클릭 시 옵션 보이기/숨기기
    selectBox.addEventListener("click", function () {
      optionsContainer.parentElement.classList.toggle("active");
    });

    // 옵션 클릭 시 선택된 값 반영 및 active 클래스 적용
    options.forEach(option => {
      option.addEventListener("click", function () {
        selectBoxTxt.textContent = this.textContent;
        options.forEach(opt => opt.classList.remove("active")); 
        this.classList.add("active");
        optionsContainer.parentElement.classList.remove("active");
      });
    });

    // 바깥 클릭 시 옵션 닫기
    document.addEventListener("click", function (e) {
      if (!selectBox.parentElement.contains(e.target)) {
        optionsContainer.parentElement.classList.remove("active");
      }
    });
  }
  selectWrap();

  const focusAreaSwiper = new Swiper(".focusAreaSwiper .swiper-container", {
    navigation: {
      nextEl: ".focusAreaSwiper .swiper-button-next",
      prevEl: ".focusAreaSwiper .swiper-button-prev",
    },
  });

  const lessonActivitySwiper = new Swiper(".lessonActivitySwiper .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 11,
    navigation: {
      nextEl: ".lessonActivitySwiper .swiper-button-next",
      prevEl: ".lessonActivitySwiper .swiper-button-prev",
    },
    breakpoints: {
      768: { 
        slidesPerView: "auto",
        spaceBetween: 11,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
      }
    }
  });

  const bannerSwiper = new Swiper(".bannerSwiper", {
    loop: true,
    pagination: {
      el: ".bannerSwiper .swiper-pagination",
      clickable: true,
    },
  });

  // mobile tit_box 버튼 클릭
  const boxBtn = () => {
    const titBoxes = document.querySelectorAll(".tit_box");

    titBoxes.forEach(titBox => {
      titBox.addEventListener("click", function () {
        this.classList.toggle("active");

        let nextElement = this.nextElementSibling;

        if (nextElement && (nextElement.classList.contains("scroll_box") || nextElement.classList.contains("swiper"))) {
          nextElement.classList.toggle("active");
        }
      });
    });
  }
  boxBtn();
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("nonStudent")) {
    nonStudent();
  }

  if (document.getElementById("student")) {
    student();
  }
});
