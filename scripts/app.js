document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionLinks = document.querySelectorAll('[data-section]');
  const lessonLinks = document.querySelectorAll('[data-lesson]');
  const testLinks = document.querySelectorAll('[data-test]');
  const sendButton = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const loginForm = document.getElementById('loginForm');

  if (navLinks) {
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(this.getAttribute('data-section'));
        if (targetSection) {
          targetSection.classList.add('active');
        }
        // Reset chat variables and clear chat
        currentFunction = '';
        currentPrompt = '';
        currentTopic = '';
       // clearChat();
      });
    });
  } });
  document.addEventListener('DOMContentLoaded', function () {
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu');
        const navLinks = document.querySelectorAll('#menu a');
        const sections = document.querySelectorAll('.section');

        // Toggle menu visibility
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });

        // Handle navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSectionId = link.getAttribute('data-section');
                
                // Hide all sections
                sections.forEach(section => section.classList.remove('active'));
                
                // Show target section
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }

                // Close menu on mobile after navigation
                if (window.innerWidth < 768) {
                    menu.classList.remove('show');
                }

                // Reset chat variables and clear chat if needed
                if (typeof clearChat === 'function') {
                    currentFunction = '';
                    currentPrompt = '';
                    currentTopic = '';
                    clearChat();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = menu.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnMenuToggle && window.innerWidth < 768) {
                menu.classList.remove('show');
            }
        });
  });
  
   // Chart.js Initialization
  window.onload = function () {
    const ctxLessons = document.getElementById('lessonsChart')?.getContext('2d');
    if (ctxLessons) {
      const lessonsChart = new Chart(ctxLessons, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Lessons Completed',
            data: [5, 10, 15, 20, 25, 30, 35],
            backgroundColor: '#007bff'
          }]
        }
      });
    }

    const ctxQuizzes = document.getElementById('quizzesChart')?.getContext('2d');
    if (ctxQuizzes) {
      const quizzesChart = new Chart(ctxQuizzes, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Quizzes Taken',
            data: [1, 3, 2, 5, 4, 6, 5],
            borderColor: '#007bff',
            fill: false
          }]
        }
      });
    }

    const ctxScore = document.getElementById('scoreChart')?.getContext('2d');
    if (ctxScore) {
      const scoreChart = new Chart(ctxScore, {
        type: 'pie',
        data: {
          labels: ['Scored', 'Remaining'],
          datasets: [{
            data: [85, 15],
            backgroundColor: ['#007bff', '#e9ecef']
          }]
        }
      });
    }

    const ctxProgress = document.getElementById('progressChart')?.getContext('2d');
    if (ctxProgress) {
      const progressChart = new Chart(ctxProgress, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [{
            data: [50, 50],
            backgroundColor: ['#007bff', '#e9ecef']
          }]
        }
      });
    }
  }
    ;