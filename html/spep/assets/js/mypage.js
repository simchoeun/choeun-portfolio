/**
 * 마이페이지
 */
const myPage = () => {
  const lessonActivitySwiper = new Swiper(".myCurriculumSwiper .swiper-container", {
    slidesPerView: 2,
    spaceBetween: 22,
    navigation: {
      nextEl: ".myCurriculumSwiper .swiper-button-next",
      prevEl: ".myCurriculumSwiper .swiper-button-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 2, 
      },
      0: {
        slidesPerView: 1,
      }
    }
  });

  // 링크 드롭다운
  document.querySelectorAll('.btn_more').forEach(button => {
    button.addEventListener('click', function () {
      const moreLink = this.nextElementSibling;
      
      this.classList.toggle('active');
      moreLink.classList.toggle('active');
    });
  });
}

const faq = () => {
  const buttons = document.querySelectorAll(".accordion_btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const isActive = this.classList.contains("active");

      buttons.forEach(btn => {
        btn.classList.remove("active");
        btn.nextElementSibling.classList.remove("active");
      });

      if (!isActive) {
        this.classList.add("active");
        this.nextElementSibling.classList.add("active");
      }
    });
  });
}

const inquiryDetail = () => {
  // 모든 'Reply' 버튼을 선택
  const btnReplies = document.querySelectorAll('.btn_reply');
  const btnViewReplies = document.querySelectorAll('.btn_view_reply');

  if (btnReplies) {
    btnReplies.forEach(function(btnReply) {
      const answerItem = btnReply.closest('.answer_item');
      const replyWrap = answerItem.querySelector('.reply_wrap');
      const hasAnswer = answerItem.querySelector('.has_answer');
    
      btnReply.addEventListener('click', function() {
        replyWrap.classList.toggle('active');
    
        if (hasAnswer) {
          if (replyWrap.classList.contains('active') && hasAnswer.classList.contains('active')) {
            hasAnswer.classList.add('has_line');
          } else {
            hasAnswer.classList.remove('has_line');
          }
        }
      });
    });
  }

  // '답글 보기' 버튼에 대한 처리
  if (btnViewReplies) {
    btnViewReplies.forEach(function(btnViewReply) {
      const answerItem = btnViewReply.closest('.answer_item');
      const hasAnswer = answerItem.querySelector('.has_answer');
      
      btnViewReply.addEventListener('click', function() {
        hasAnswer.classList.toggle('active');
        this.classList.toggle('active');
        
        if (hasAnswer.classList.contains('active') && answerItem.querySelector('.reply_wrap').classList.contains('active')) {
          hasAnswer.classList.add('has_line');
        } else {
          hasAnswer.classList.remove('has_line');
        }
    
        if (hasAnswer.classList.contains('active')) {
          btnViewReply.textContent = '답글 접기'; 
        } else {
          btnViewReply.textContent = '답글 보기';
        }
      });
    });
  }


  // textarea 높이 조절
  const commentText = document.getElementById("commentText");
  const replyText = document.getElementById("replyText");

  const commentTextResize = () => {
    commentText.style.height = "auto";
    const newHeight = commentText.scrollHeight;
    if (newHeight > 140) {
      commentText.style.height = "160px";
      commentText.style.overflowY = "auto";
    } else {
      commentText.style.height = newHeight + "px";
      commentText.style.overflowY = "hidden";
    }
  }

  const replyTextResize = () => {
    replyText.style.height = "auto";
    const newHeight = replyText.scrollHeight;
    if (newHeight > 140) {
      replyText.style.height = "160px";
      replyText.style.overflowY = "auto";
    } else {
      replyText.style.height = newHeight + "px";
      replyText.style.overflowY = "hidden";
    }
  }
  commentText.addEventListener("input", commentTextResize);
  replyText.addEventListener("input", replyTextResize);

  // 모바일 첨부파일
  const moFile = () => {
    const fileTotal = document.querySelector(".file_total");
    const downloadWrap = document.querySelector(".download_wrap");

    if (fileTotal && downloadWrap) {
      fileTotal.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          downloadWrap.classList.toggle("active");
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          downloadWrap.classList.remove("active");
        }
      });
    }
  }
  moFile();
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("myPage")) {
    myPage();
  } else if (document.getElementById("faq")) {
    faq();
  } else if (document.getElementById("inquiryDetail")) {
    inquiryDetail();
  }
});