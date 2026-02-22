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
    breakpoints: {
      0: { 
        spaceBetween: 6,
      },
      768: {
        spaceBetween: 10,
      },
    }
  });
  // 클릭 시 active 클래스 토글
  document.querySelectorAll(".categorycommonSwiper .btn_category").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".categorycommonSwiper .btn_category").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  const commonFocusAreaSwiper = new Swiper(".commonFocusAreaSwiper .swiper-container", {
    slidesPerView: 2,
    spaceBetween: 20,
    navigation: {
      nextEl: ".commonFocusAreaSwiper .swiper-button-next",
      prevEl: ".commonFocusAreaSwiper .swiper-button-prev",
    },
    breakpoints: {
      0: { 
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
    }
  });

  // commonFocusAreaSwiper 툴팁
  let currentMode = window.innerWidth <= 768 ? 'mobile' : 'pc';

  const handleProgressBoxBehavior = () => {
    const detailButtons = document.querySelectorAll('.btn_color_detail');

    detailButtons.forEach(button => {
      const txtBox = button.nextElementSibling;

      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      if (currentMode === 'mobile') {
        newButton.addEventListener('click', function (e) {
          e.preventDefault();
          txtBox.classList.toggle('active');
        });
      } else {
        newButton.addEventListener('mouseenter', () => {
          txtBox.classList.add('active');
        });

        newButton.addEventListener('mouseleave', () => {
          txtBox.classList.remove('active');
        });
      }
    });
  };

  handleProgressBoxBehavior();

  window.addEventListener('resize', () => {
    const newMode = window.innerWidth <= 768 ? 'mobile' : 'pc';
    if (newMode !== currentMode) {
      currentMode = newMode;
      handleProgressBoxBehavior();
    }
  });


}
window.onload = () => {
  common();
};

/**
 * 수강신청
 */
const classRegist = () => {
  const choiceBtn = document.querySelector(".choice");
  const stickyBox = document.querySelector(".sticky");

  if (choiceBtn && stickyBox) {
    choiceBtn.addEventListener("click", function () {
      stickyBox.classList.toggle("active");
    });
  }
}

/**
 * 신청내역
 */
const applicationHistory = () => {
  const btnTopicMore = document.querySelector(".btn_topic_more");
  const topicWrap = document.querySelector(".topic_wrap");

  btnTopicMore.addEventListener("click", function () {
    btnTopicMore.classList.toggle("active");
    topicWrap.classList.toggle("active");
  });
}

/**
 * survey
 */
const survey = () => {
  const afterClassReviewSwiper = new Swiper(".afterClassReviewSwiper .swiper-container", {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      nextEl: ".afterClassReviewSwiper .swiper-button-next",
      prevEl: ".afterClassReviewSwiper .swiper-button-prev",
    },
    breakpoints: {
      0: { 
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1280: { 
        slidesPerView: 3,
      }
    }
  });
}

/**
 * classRoom
 */
const classRoom = () => {
  const tabs = () => {
    const tabButtons = document.querySelectorAll(".btn_tab");
    const tabContents = document.querySelectorAll(".tab_content");
  
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

  // chart
  const options = {
    chart: {
      height: '100%',
      width: '100%',
      type: "radialBar",
      animations: { 
        enabled: true,
        easing: "easeinout",
        speed: 800, 
        animateGradually: {
          enabled: false,
          delay: 0
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      },
    },
    series: [100, 75, 75], // 데이터 값 (퍼센트)
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360, 
        hollow: {
          size: "45%", 
          background: "transparent"
        },
        track: {
          show: true,
          margin: 14,
          background: "#EEF0F8"
        },
        dataLabels: {
          show: false, 
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    fill: { 
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.8,
        gradientToColors: ["#6A8BFF", "#A5ABFF", "#DCEF6F"], 
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: ["#4B73FF", "#999FFF", "#C7DB52"],
    legend: {
      show: false 
    },
    tooltip: { 
      enabled: true,
      theme: "dark", 
      fillSeriesColor: false, 
      y: {
        formatter: function(val) {
          return val + "%"; 
        }
      },
    },
    states: { 
      normal: {
        filter: {
          type: "none"
        }
      },
      hover: {
        filter: {
          type: "none"
        }
      },
      active: {
        filter: {
          type: "none"
        }
      }
    },
    labels: ['차수 실제 출석률', '인정 출석률', '실제 출석률'],
  };

  const chart = new ApexCharts(document.querySelector("#thisMonthChart"), options);
  chart.render();
}


/**
 * 교육리포트
 */
const educationReport = () => {
  // 출석률 상세
  const dataBox = () => {
    const buttons = document.querySelectorAll(".btn_data");
  
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const parentBox = this.closest(".data_box"); 
        const activeBox = document.querySelector(".data_box.active"); 
  
        if (activeBox && activeBox !== parentBox) {
          activeBox.classList.remove("active");
        }
  
        parentBox.classList.toggle("active");
      });
    });
  }
  dataBox();

  // 출석률 상세 모바일
  const mobileDataBox = () => {
    const optionButtons = document.querySelectorAll('.select_item .option');
    const optionTotalBtn = document.querySelector('.select_item .option_btn');
    const selectItem = document.querySelector('.select_item');

    optionTotalBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      selectItem.classList.toggle('active');
    });

    optionButtons.forEach(button => {
      button.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab');
        selectItem.classList.remove('active');
        optionTotalBtn.classList.remove('active');

        optionButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const optionBtn = this.closest('.select_item').querySelector('.option_btn .date');
        if (optionBtn) {
          optionBtn.textContent = this.textContent;
        }

        const allDataBoxes = document.querySelectorAll('.data_detail .data_box');
        allDataBoxes.forEach(box => box.classList.remove('active'));

        const targetBox = document.getElementById(targetId);
        if (targetBox) {
          targetBox.classList.add('active');
        }
      });
    });
  }
  mobileDataBox();

  // Word Per Minute 툴팁
  const tooltip = () => {
    const tooltipBtn = document.querySelector(".btn_tooltip");
    const tooltipWrap = document.querySelector(".tooltip_wrap");
    const tooltipCloseBtn = document.querySelector(".btn_tooltip_close");
  
    tooltipBtn.addEventListener("click", function () {
      tooltipWrap.classList.toggle("active");
    });
  
    tooltipCloseBtn.addEventListener("click", function () {
      tooltipWrap.classList.remove("active");
    });
  }
  tooltip();

  const classFeedbackSwiper = new Swiper(".classFeedbackSwiper .swiper-container", {
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
      nextEl: ".classFeedbackSwiper .swiper-button-next",
      prevEl: ".classFeedbackSwiper .swiper-button-prev",
    },
    breakpoints: {
      0: { 
        spaceBetween: 10,
      },
      768: {
        spaceBetween: 20,
      },
    }
  });

  const monthSwiper = new Swiper(".monthSwiper .swiper-container", {
    slidesPerView: '5',
    spaceBetween: 15,
    navigation: {
      nextEl: ".monthSwiper .swiper-button-next",
      prevEl: ".monthSwiper .swiper-button-prev",
    },
    breakpoints: {
      0: { 
        slidesPerView: '1',
      },
      768: {
        slidesPerView: '3',
      },
      1280: {
        slidesPerView: '5',
      },
    }
  });

  /**
   * chart
   */
  // 월별 모바일 학습 현황 chart
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
      cutout: "82%",
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
  monthDoughnutChart("monthMobileChart01", 40, "#3D62E4"); 
  monthDoughnutChart("monthMobileChart02", 85, "#3D62E4"); 
  monthDoughnutChart("monthMobileChart03", 100, "#3D62E4"); 
  monthDoughnutChart("monthMobileChart04", 40, "#3D62E4"); 
  monthDoughnutChart("monthMobileChart05", 85, "#3D62E4");
  
  // 출석률 상세 chart
  const options = {
    chart: {
      height: '100%',
      width: '100%',
      type: "radialBar",
      animations: { 
        enabled: true,
        easing: "easeinout",
        speed: 800, 
        animateGradually: {
          enabled: false,
          delay: 0
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      },
    },
    series: [85, 60], // 데이터 값 (퍼센트)
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360, 
        hollow: {
          size: "45%", 
          background: "transparent"
        },
        track: {
          show: true,
          margin: 14,
          background: "rgba(238, 240, 248, 0.4)"
        },
        dataLabels: {
          show: false, 
        }
      }
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ["#A5C3FF", "#DCEF6F"],
    legend: {
      show: false 
    },
    tooltip: { 
      enabled: false,
    },
    states: { 
      normal: {
        filter: {
          type: "none"
        }
      },
      hover: {
        filter: {
          type: "none"
        }
      },
      active: {
        filter: {
          type: "none"
        }
      }
    },
    labels: ['인정 출석률', '실제 출석률'],
  };
  const chart = new ApexCharts(document.querySelector("#attendanceChart"), options);
  chart.render();

  // 출석률 상세 chart
  const ctx01 = document.getElementById('focusChart').getContext('2d');

  const gradientHoverLine = {
    id: 'focusChart',
    afterDatasetsDraw(chart) {
      if (!chart.tooltip || !chart.tooltip._active || !chart.tooltip._active.length) {
        return;
      }

      const ctx = chart.ctx;
      ctx.save();
      ctx.setLineDash([3, 3]); 
      ctx.lineWidth = 1;
        
      chart.tooltip._active.forEach(activePoint => {
        const datasetIndex = activePoint.datasetIndex;
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

          // Create gradient based on dataset
        const gradient = ctx.createLinearGradient(x, topY, x, bottomY);
        if (datasetIndex === 0) {
          gradient.addColorStop(0, '#B4B4B4');
          gradient.addColorStop(1, '#B4B4B4');
        } else if (datasetIndex === 1) {
          gradient.addColorStop(0, '#B4B4B4');
          gradient.addColorStop(1, '#B4B4B4');
        }
          
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  const focusChart = new Chart(ctx01, {
    type: 'line',
    data: {
      labels: ['01.02', '01.05', '01.11', '01.13', '01.24', '01.25'],
      datasets: [
        {
          label: '',
          data: [4.2, 2.8, 5.0, 1.9, 0.7, 3.6],
          borderColor: '#8EE43D',
          backgroundColor: 'rgba(255, 99, 132, 0)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0 
        },
        {
          label: '',
          data: [1.5, 4.7, 0.9, 3.8, 2.6, 1.3],
          borderColor: '#6486FB',
          backgroundColor: 'rgba(54, 162, 235, 0)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0 
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false 
          },
          ticks: {
            padding: 10,
            color: '#81889A',
            font: {
              size: 14,
            }
          },
          offset: true, 
          border: {
            dash: [0, 0],
            color: '#CDCDCD'
          }
        },
        y: {
          grid: {
            color: '#CDCDCD' 
          },
          beginAtZero: true, 
          min: 0, 
          max: 5, 
          ticks: {
            padding: 10,
            stepSize: 1, 
            color: '#5D6477',
            font: {
              size: 14,
            }
          },
          border: {
            dash: [3, 3],
            color: 'rgba(0,0,0,0)'
          }
        }
      },
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          intersect: false,
          mode: 'nearest',
          displayColors: false, 
          backgroundColor: '#293043',
          titleColor: 'rgba(255, 255, 255, 0.6)',
          titleFont: {
            size: 12,
            weight: 600
          },
          bodyFont: {
            size: 16,
            weight: 700,
            color: 'rgba(255, 255, 255, 1)'
          },
          padding: 16,
          cornerRadius: 8,
          callbacks: {
            title: function(tooltipItems) {
              const dateMap = {
                '01.02': '2024년 1월 2일',
                '01.05': '2024년 1월 5일',
                '01.11': '2024년 1월 11일',
                '01.13': '2024년 1월 13일',
                '01.24': '2024년 1월 24일',
                '01.25': '2024년 1월 25일'
              };
              return dateMap[tooltipItems[0].label] || tooltipItems[0].label;
            },
            label: function(tooltipItem) {
              return `${tooltipItem.raw}점`;
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        intersect: false
      }
    },
    plugins: [gradientHoverLine]
  });
  
  // Word per Minute chart
  const ctx02 = document.getElementById('wordPerChart').getContext('2d');
  const dataValuesWordPer = [60, 0, 80, 40, 50];
  
  // 라벨 생성 함수
  const getResponsiveLabels = () =>
    window.innerWidth <= 768
      ? [['2024년', '1월'], ['2024년', '2월'], ['2024년', '3월'], ['2024년', '4월'], ['2024년', '5월']]
      : ['2024년 1월', '2024년 2월', '2024년 3월', '2024년 4월', '2024년 5월'];
  
  let labelsWordPer = getResponsiveLabels();
  
  const wordPerChart = new Chart(ctx02, {
    type: 'bar',
    data: {
      labels: labelsWordPer,
      datasets: [{
        label: '',
        data: dataValuesWordPer,
        backgroundColor: '#6E89E6',
        borderWidth: 0,
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0
        },
        barThickness: window.innerWidth <= 768 ? 35 : 50
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            padding: 10,
            color: dataValuesWordPer.map(v => v === 0 ? 'rgba(93, 100, 119, 0.6)' : '#5D6477'),
            font: dataValuesWordPer.map(v => ({
              family: 'Pretendard',
              size: window.innerWidth <= 768 ? 12 : 14,
              weight: v === 0 ? 500 : 600
            })),
            paddingRight: 30
          },
          offset: true,
          border: {
            dash: [0, 0],
            color: '#CDCDCD'
          }
        },
        y: {
          grid: { color: '#CDCDCD' },
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: value => [20, 40, 60, 80, 100].includes(value) ? value : '',
            color: '#5D6477',
            font: { size: window.innerWidth <= 768 ? 12 : 14 }
          },
          border: {
            dash: [3, 3],
            color: 'rgba(0,0,0,0)'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          position: 'nearest',
          yAlign: 'bottom',
          backgroundColor: '#293043',
          titleColor: 'rgba(255, 255, 255, 0.6)',
          titleFont: { size: 12, weight: 600 },
          bodyFont: {
            size: window.innerWidth <= 768 ? 14 : 16,
            weight: 700,
            color: 'rgba(255, 255, 255, 1)'
          },
          callbacks: {
            title: context => {
              const index = context[0].dataIndex;
              const rawLabel = context[0].chart.data.labels[index];
              return Array.isArray(rawLabel) ? rawLabel.join(' ') : rawLabel;
            },
            label: context => `${context.raw} words`
          },
          padding: window.innerWidth <= 768 ? { x: 10, y: 14 } : 16,
          cornerRadius: 8,
          displayColors: false
        }
      }
    }
  });
  
  // 반응형 라벨 & 폰트 업데이트
  const updateChartOnResize = chart => {
    const isMobile = window.innerWidth <= 768;
    chart.data.labels = getResponsiveLabels();
    chart.options.scales.x.ticks.font.size = isMobile ? 12 : 14;
    chart.options.scales.y.ticks.font.size = isMobile ? 12 : 14;
    chart.update();
  };
  
  // barThickness 업데이트
  const updateBarThickness = chart => {
    chart.data.datasets[0].barThickness = window.innerWidth <= 768 ? 35 : 50;
    chart.update();
  };
  
  // tooltip 폰트 & padding 업데이트
  const updateTooltipOptions = chart => {
    const isMobile = window.innerWidth <= 768;
    chart.options.plugins.tooltip.bodyFont.size = isMobile ? 14 : 16;
    chart.options.plugins.tooltip.padding = isMobile ? { x: 10, y: 14 } : 16;
    chart.update();
  };
  
  updateChartOnResize(wordPerChart);
  updateBarThickness(wordPerChart);
  updateTooltipOptions(wordPerChart);

  window.addEventListener('resize', () => {
    updateChartOnResize(wordPerChart);
    updateBarThickness(wordPerChart);
    updateTooltipOptions(wordPerChart);
  });
}

/**
 * classFeedback
 */
const classFeedback = () => {
  // 피드백 저장
  const feedbackBookmark = () => {
    const feedbackBtn = document.querySelector(".btn_feedback_bookmark");

    feedbackBtn.addEventListener("click", function () {
      feedbackBtn.classList.toggle("active");
    });
  }
  feedbackBookmark();

  const feedbackDetailSwiper = new Swiper(".feedbackDetailSwiper .swiper-container", {
    slidesPerView: 1,
    navigation: {
      nextEl: ".feedbackDetailSwiper .swiper-button-next",
      prevEl: ".feedbackDetailSwiper .swiper-button-prev",
    },
  });

  // Response Recording 탭
  const tabs = () => {
    const tabButtons = document.querySelectorAll(".btn_tab");
    const tabContents = document.querySelectorAll(".tab_content");
  
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

  // Response Recording play버튼
  const playBtns = () => {
    const playButtons = document.querySelectorAll(".btn_play");
  
    playButtons.forEach(button => {
      button.addEventListener("click", function () {
        this.classList.toggle("pause");
      });
    });
  };
  playBtns();


  // mobile Response Recording 옵션
  const mobileOption = () => {
    const optionBtn = document.querySelector('.option_btn');
    const optionBox = document.querySelector('.options');
    const options = document.querySelectorAll('.option');
    const tabContents = document.querySelectorAll('.tab_content');
    const tabButtons = document.querySelectorAll('.tab_btn');

    optionBtn.addEventListener('click', () => {
      optionBtn.classList.toggle('active');
      optionBox.classList.toggle('active');
    });

    options.forEach(option => {
      option.addEventListener('click', function() {
        const selectedTab = option.getAttribute('data-tab');
        const tabTitle = option.textContent;

        optionBtn.textContent = tabTitle;

        options.forEach(opt => opt.classList.remove('active'));
        tabContents.forEach(tab => {
          tab.classList.remove('active');
          const recording = tab.querySelector('.recording');
          if (recording) recording.classList.remove('active');
        });

        option.classList.add('active');
        const selectedTabContent = document.getElementById(selectedTab);
        selectedTabContent.classList.add('active');

        // .recording에 active 추가
        const recording = selectedTabContent.querySelector('.recording');
        if (recording) recording.classList.add('active');

        // 첫 번째 .tab_btn에 active 추가
        const firstTabButton = selectedTabContent.querySelector('.tab_btn');
        if (firstTabButton) {
          firstTabButton.classList.add('active');
        }

        optionBox.classList.remove('active');
      });
    });
  }
  mobileOption();

  // mobile Response Recording tab
  const mobileTab = () => {
    const tabButtons = document.querySelectorAll('.tab_btn');
    const tabContents = document.querySelectorAll('.script_txt');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.querySelector(`.script_txt.${tabId}`).classList.add('active');
      });
    });
  }
  mobileTab();
}


document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("applicationHistory")) {
    applicationHistory();
  } else if (document.getElementById("survey")) {
    survey();
  } else if (document.getElementById("classRoom")) {
    classRoom();
  } else if (document.getElementById("educationReport")) {
    educationReport();
  } else if (document.getElementById("classFeedback")) {
    classFeedback();
  } else if (document.getElementById("class")) {
    classRegist();
  }
});