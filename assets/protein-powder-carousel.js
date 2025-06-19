document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.product-image-carousel');
  
  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.product-image');
    const prevButton = carousel.parentElement.querySelector('.nav-arrow.prev');
    const nextButton = carousel.parentElement.querySelector('.nav-arrow.next');
    let currentIndex = 0;

    const showImage = (index) => {
      images.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
      });
    };

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });
  });
});