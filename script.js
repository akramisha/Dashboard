// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Animate sidebar footer
    setTimeout(() => {
      document.querySelector('.sidebar-footer').classList.add('animate');
    }, 500);
});

// Initialize mobile menu
function initMobileMenu() {
    const menuButton = document.getElementById('menuButton');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    menuButton.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    const closeSidebar = () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    closeSidebarBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
}

// Initialize scroll animations using Intersection Observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is in viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // If it's a chart container, initialize the chart
          if (entry.target.querySelector('canvas')) {
            const canvas = entry.target.querySelector('canvas');
            if (canvas && !canvas.getAttribute('data-initialized')) {
              initializeChart(canvas.id);
              canvas.setAttribute('data-initialized', 'true');
            }
          }
          
          // If it contains progress bars, animate them
          if (entry.target.querySelector('.progress-bar-fill')) {
            const progressBars = entry.target.querySelectorAll('.progress-bar-fill');
            animateProgressBars(progressBars);
          }
          
          // If it contains circular progress, animate them
          if (entry.target.querySelector('.progress-circle-small')) {
            const circles = entry.target.querySelectorAll('.progress-bar');
            animateCircularProgress(circles);
          }
          
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Trigger when at least 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Slightly before the element comes into view
    });
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(item => {
      observer.observe(item);
    });
}

// Animate horizontal progress bars
function animateProgressBars(progressBars) {
    progressBars.forEach(bar => {
      const width = bar.style.getPropertyValue('--bar-width');
      setTimeout(() => {
        bar.style.width = width;
      }, 300);
    });
}

// Animate circular progress indicators
function animateCircularProgress(circles) {
    circles.forEach(circle => {
      if (!circle) return;
      
      const radius = parseFloat(circle.getAttribute('r'));
      const circumference = 2 * Math.PI * radius;
      
      // Set initial dasharray and dashoffset
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;
      
      // Get percentage from the text inside the container
      const container = circle.closest('.progress-circle-small-container') || 
                        circle.closest('.progress-circle-container');
      if (!container) return;
      
      const percentText = container.querySelector('.progress-text-small')?.textContent || 
                          container.querySelector('.percentage')?.textContent || '0%';
                          
      const percent = parseInt(percentText);
      
      // Animate to the percentage
      setTimeout(() => {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      }, 300);
    });
}

// Initialize all charts
function initCharts() {
    // Clear existing charts
    Chart.helpers.each(Chart.instances, function(instance) {
      instance.destroy();
    });
    
    // Initialize visible charts
    document.querySelectorAll('canvas[data-initialized="true"]').forEach(canvas => {
      initializeChart(canvas.id);
    });
}

// Initialize a specific chart
function initializeChart(chartId) {
    if (!chartId) return;
    
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;
    
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    
    // Chart type specific initialization
    switch(chartId) {
      case 'areaChart':
        initAreaChart(ctx, gridColor, textColor);
        break;
      case 'barChart1':
        initBarChart(ctx, ['#a855f7', '#3b82f6'], gridColor, textColor);
        break;
      case 'barChart2':
        initBarChart(ctx, ['#f43f5e', '#3b82f6'], gridColor, textColor);
        break;
      case 'verticalBarChart':
        initBarChart(ctx, ['#f43f5e', '#3b82f6', '#a855f7'], gridColor, textColor, true);
        break;
      case 'lineChart':
        initLineChart(ctx, ['#f43f5e', '#3b82f6'], gridColor, textColor);
        break;
    }
}

// Initialize Area Chart
function initAreaChart(ctx, gridColor, textColor) {
    const areaGradient1 = ctx.createLinearGradient(0, 0, 0, 200);
    areaGradient1.addColorStop(0, 'rgba(244, 63, 94, 0.5)');
    areaGradient1.addColorStop(1, 'rgba(244, 63, 94, 0)');
    
    const areaGradient2 = ctx.createLinearGradient(0, 0, 0, 200);
    areaGradient2.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    areaGradient2.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    const areaLabels = Array.from({ length: 30 }, (_, i) => i + 1);
    const areaData1 = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 100);
    const areaData2 = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50);
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: areaLabels,
        datasets: [
          {
            label: 'Dataset 1',
            data: areaData1,
            borderColor: '#f43f5e',
            backgroundColor: areaGradient1,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Dataset 2',
            data: areaData2,
            borderColor: '#3b82f6',
            backgroundColor: areaGradient2,
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: 8,
              },
              maxRotation: 0,
              callback: function(value, index) {
                return index % 5 === 0 ? value : '';
              }
            },
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: 8,
              },
              stepSize: 50,
            },
            min: 0,
            max: 250,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    });
}

// Initialize Bar Chart
function initBarChart(ctx, colors, gridColor, textColor, isVertical = false) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const datasets = colors.map((color, index) => {
      return {
        label: `Dataset ${index + 1}`,
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100)),
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 1,
      };
    });
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
              color: textColor,
            },
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              display: false,
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        indexAxis: isVertical ? 'y' : 'x',
      }
    });
}

// Initialize Line Chart
function initLineChart(ctx, colors, gridColor, textColor) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    
    const datasets = colors.map((color, index) => {
      return {
        label: `Dataset ${index + 1}`,
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100)),
        borderColor: color,
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
      };
    });
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
              color: textColor,
            },
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              display: false,
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    });
}


  document.addEventListener("DOMContentLoaded", function () {
    function setProgress(circle, percentage) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
    }

    // Target your progress circle
    const progressBar = document.querySelector(".progress-bar");
    setProgress(progressBar, 67); // Set 67% Progress
  });

