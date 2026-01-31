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
        // Add the visible class to trigger animation
        entry.target.classList.add('fade-in-visible');
        
        // Optional: Stop observing after animation (performance boost)
        // fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // ===================================
  // OBSERVE ALL ANIMATED ELEMENTS
  // ===================================
  
  // Project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    fadeInObserver.observe(card);
  });
  
  // Contact cards
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    fadeInObserver.observe(card);
  });
  
  // Section headers
  const sectionHeaders = document.querySelectorAll('#projects h2, #contact h2');
  sectionHeaders.forEach(header => {
    fadeInObserver.observe(header);
  });
  

  
  // ===================================
  // NAVBAR BACKGROUND ON SCROLL
  // ===================================
  
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
  

  
  // ===================================
  // SMOOTH SCROLL ENHANCEMENT
  // ===================================
  
  // Add smooth scroll behavior to navbar links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
});

// ===================================
// PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
// ===================================

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.project-card, .contact-card').forEach(el => {
    el.style.transition = 'none';
  });
}