document.addEventListener('DOMContentLoaded', function() {
  // Testimonial Slider
  const testimonialSlides = document.querySelector('.testimonial-slides');
  const testimonialPrev = document.querySelector('.testimonial-slider .prev');
  const testimonialNext = document.querySelector('.testimonial-slider .next');
  
  if (testimonialSlides && testimonialPrev && testimonialNext) {
    testimonialPrev.addEventListener('click', function() {
      testimonialSlides.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    testimonialNext.addEventListener('click', function() {
      testimonialSlides.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
  
  // Category Tabs
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      categoryTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Add logic here to show relevant bundle content
      // based on the selected category
    });
  });
  
  // Bundle Navigation
  const bundlesNav = {
    prev: document.querySelector('.bundles-section .nav-arrow.prev'),
    next: document.querySelector('.bundles-section .nav-arrow.next'),
    grid: document.querySelector('.bundles-grid')
  };
  
  if (bundlesNav.prev && bundlesNav.next && bundlesNav.grid) {
    bundlesNav.prev.addEventListener('click', function() {
      bundlesNav.grid.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    bundlesNav.next.addEventListener('click', function() {
      bundlesNav.grid.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
});