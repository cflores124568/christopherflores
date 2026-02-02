// ===================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Observer configuration
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  };
  
  // Create the observer
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.project-card').forEach(card => fadeInObserver.observe(card));
  document.querySelectorAll('.contact-card').forEach(card => fadeInObserver.observe(card));
  document.querySelectorAll('#projects h2, #contact h2').forEach(header => fadeInObserver.observe(header));

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(20, 2, 16, 0.95)';
      navbar.style.boxShadow = '0 4px 12px rgba(6, 6, 206, 0.3)';
    } else {
      navbar.style.background = 'rgba(20, 2, 16, 0.67)';
      navbar.style.boxShadow = '0 2px 5px rgba(6, 6, 206, 0.2)';
    }
  });

  // Smooth scroll for navbar links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
  
});

// ===================================
// PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.project-card, .contact-card').forEach(el => el.style.transition = 'none');
}

// ===================================
// DOT GRID ANIMATION
// ===================================
const container = document.getElementById('dotGrid');
const dots = [];
const dotData = [];

let containerRect;

function updateContainerRect() {
    containerRect = container.getBoundingClientRect();
    const cols = Math.floor(containerRect.width / 35);
    const rows = Math.floor(containerRect.height / 35);

    container.innerHTML = '';
    dots.length = 0;
    dotData.length = 0;

    for (let i = 0; i < rows * cols; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        container.appendChild(dot);
        dots.push(dot);

        const row = Math.floor(i / cols);
        const col = i % cols;
        dotData.push({ row, col, element: dot });
    }
}

updateContainerRect();
window.addEventListener('resize', updateContainerRect);

let mouseX = -1000;
let mouseY = -1000;

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

container.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
});

function updateDots() {
    if (!containerRect) return;
    const cols = Math.floor(containerRect.width / 35);
    const spacing = containerRect.width / cols;

    dotData.forEach((data) => {
        const dotX = data.col * spacing + spacing / 2;
        const dotY = data.row * spacing + spacing / 2;
        const distance = Math.hypot(mouseX - dotX, mouseY - dotY);

        if (distance < 120) data.element.classList.add('bright');
        else data.element.classList.remove('bright');
    });

    requestAnimationFrame(updateDots);
}
updateDots();

// ===================================
// PROJECT SLIDER LOGIC
// ===================================
const projectSlideIndices = {};

document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('[data-project]');

    projects.forEach((project) => {
        const projectId = project.getAttribute('data-project');
        projectSlideIndices[projectId] = 0;

        const slides = project.querySelectorAll('.project-image, .project-video');
        const dotsContainer = project.querySelector('.slider-dots');
        dotsContainer.innerHTML = '';

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => showSlide(projectId, index));
            dotsContainer.appendChild(dot);
        });

        const prevBtn = project.querySelector('.slider-button.prev');
        const nextBtn = project.querySelector('.slider-button.next');

        prevBtn.addEventListener('click', () => changeSlide(projectId, -1));
        nextBtn.addEventListener('click', () => changeSlide(projectId, 1));

        showSlide(projectId, 0);
    });
});

function changeSlide(projectId, n) {
    showSlide(projectId, projectSlideIndices[projectId] + n);
}

function showSlide(projectId, n) {
    const projectContainer = document.querySelector(`[data-project="${projectId}"]`);
    if (!projectContainer) return;

    const slides = projectContainer.querySelectorAll('.project-image, .project-video');
    const dots = projectContainer.querySelectorAll('.dot');

    if (n >= slides.length) n = 0;
    if (n < 0) n = slides.length - 1;
    projectSlideIndices[projectId] = n;

    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    slides.forEach((slide) => { if (slide.tagName === 'VIDEO') slide.pause(); });

    const currentSlide = slides[n];
    if (currentSlide) currentSlide.classList.add('active');
    if (dots[n]) dots[n].classList.add('active');
}
