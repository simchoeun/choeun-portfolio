document.addEventListener("DOMContentLoaded", function () {
  // 채팅창 스크롤
  const scrollMove = () => {
    const scrollBox = document.querySelector(".scroll_box");
    const btnMove = document.querySelector(".btn_move");

    // 페이지 로드 시 스크롤을 맨 아래로 이동
    const moveToBottom = () => {
      setTimeout(() => {
        scrollBox.scrollTo({ top: scrollBox.scrollHeight, behavior: "instant" });
      }, 0); 
    };

    // 스크롤 상태 체크 함수
    const checkScroll = () => {
      const isAtBottom =
        scrollBox.scrollHeight - scrollBox.clientHeight <= scrollBox.scrollTop + 5;

      isAtBottom ? btnMove.classList.remove("active") : btnMove.classList.add("active");
    };

    scrollBox.addEventListener("scroll", checkScroll);

    // 버튼 클릭 시 스크롤 맨 아래로 이동
    btnMove.addEventListener("click", () => {
      scrollBox.scrollTo({ top: scrollBox.scrollHeight, behavior: "smooth" });
    });

    moveToBottom();
    checkScroll();
  };
  scrollMove();

  // 사이드바 버튼
  const sideBar = () => {
    const buttons = document.querySelectorAll(".btn_box .btn_sidebar");
  
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const parent = this.closest(".btn_box");
        const viewBox = parent.querySelector(".view_box");
  
        this.classList.toggle("active");
        viewBox.classList.toggle("active");
      });
    });
  }
  sideBar();

  // 파일, 이미지 탭
  const tabs = () => {
    const tabButtons = document.querySelectorAll(".chat_btn_wrap .btn_tab");
    const tabContents = document.querySelectorAll(".chat_btn_wrap .tab_content");
  
    tabButtons.forEach(button => {
      button.addEventListener("click", function () {
        const targetTab = this.getAttribute("data-tab");
  
        tabButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
  
        tabContents.forEach(content => content.classList.remove("active"));
        document.getElementById(targetTab).classList.add("active");
      });
    });
  }
  tabs();

  // 모바일 chat_screen 나오도록
  const mobileChatScreen = () => {
    const chatRooms = document.querySelectorAll('.chat_room');
    const chatScreen = document.querySelector('.chat_screen');
    const btnBackChat = document.querySelector('.chat_screen .btn_back');
  
    chatRooms.forEach(room => {
      room.addEventListener('click', () => {
        chatScreen.classList.add('active');
      });
    });

    btnBackChat?.addEventListener('click', () => {
      chatScreen.classList.remove('active');
    });
  }
  mobileChatScreen();

  // 모바일 더보기버튼(참여자/파일모아보기)
  const mobileMore = () => {
    const btnMore = document.querySelector('.chat_screen .btn_more');
    const moreBox = document.querySelector('.chat_screen .more_box');
    const chatBtnWrap = document.querySelector('.chat_btn_wrap');

    btnMore?.addEventListener('click', () => {
      moreBox?.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (
        !moreBox.contains(e.target) &&
        !btnMore.contains(e.target)
      ) {
        moreBox.classList.remove('active');
      }
    });

    // 참여자 버튼 클릭 시 participant_box 활성화
    const btnParticipant = document.querySelector('.more_box .btn_participant');
    const participantBox = document.querySelector('.chat_btn_wrap .participant_box');
  
    btnParticipant?.addEventListener('click', () => {
      chatBtnWrap.classList.add('active');
      participantBox?.classList.add('active');
      fileBox?.classList.remove('active');
      moreBox?.classList.remove('active'); 
    });

    // 파일 모아보기 버튼 클릭 시 file_box 활성화
    const btnFileCollection = document.querySelector('.more_box .btn_file_collection');
    const fileBox = document.querySelector('.chat_btn_wrap .file_box');

    btnFileCollection?.addEventListener('click', () => {
      chatBtnWrap.classList.add('active');
      fileBox?.classList.add('active');
      participantBox?.classList.remove('active');
      moreBox?.classList.remove('active');
    });
  }
  mobileMore();

  // 모바일 참여자/파일모아보기 뒤로가기 버튼
  const mobileMoreBack = () => {
    const backButtons = document.querySelectorAll('.chat_btn_wrap .btn_back');

    backButtons.forEach(button => {
      button.addEventListener('click', () => {
        const btnBox = button.closest('.btn_box'); 
        const chatBtnWrap = document.querySelector('.chat_btn_wrap');

        btnBox?.classList.remove('active'); 
        chatBtnWrap?.classList.remove('active'); 
      });
    });
  }
  mobileMoreBack();

  // 모바일 파일첨부/이미지 더보기 버튼
  const mobilePlus = () => {
    const btnPlus = document.querySelector('.btn_plus');
    const plusBox = document.querySelector('.plus_box');

    btnPlus?.addEventListener('click', (e) => {
      e.stopPropagation(); 
      plusBox?.classList.toggle('active');
    });
  
    plusBox?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  
    document.addEventListener('click', () => {
      plusBox?.classList.remove('active');
    });
  }
  mobilePlus();
});