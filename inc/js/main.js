//   const heroSlider = {
//     slides: document.querySelectorAll('.hero-slide'),
//     dots: document.querySelectorAll('.progress-dot'),
//     currentIndex: 0,
//     interval: null,
//     duration: 6000, // 6 seconds per slide
    
//     init() {
//       if (this.slides.length === 0) return;
      
//       // Set up dot click handlers
//       this.dots.forEach((dot, index) => {
//         dot.addEventListener('click', () => {
//           this.goToSlide(index);
//           this.resetInterval();
//         });
//       });
      
//       // Start auto-play
//       this.startInterval();
//     },
    
//     goToSlide(index) {
//       // Remove active state from current slide
//       this.slides[this.currentIndex].classList.remove('active');
//       this.dots[this.currentIndex].classList.remove('active');
      
//       // Update index
//       this.currentIndex = index;
      
//       // Add active state to new slide
//       this.slides[this.currentIndex].classList.add('active');
//       this.dots[this.currentIndex].classList.add('active');
//     },
    
//     nextSlide() {
//       const nextIndex = (this.currentIndex + 1) % this.slides.length;
//       this.goToSlide(nextIndex);
//     },
    
//     startInterval() {
//       this.interval = setInterval(() => {
//         this.nextSlide();
//       }, this.duration);
//     },
    
//     resetInterval() {
//       clearInterval(this.interval);
//       this.startInterval();
//     }
//   };
  
//   heroSlider.init();

if(document.querySelector(".hero-section")){

function heroSlider(options){

    const {
        sectionSelector ='.slider-section',
        sliderWrapperSelector = '.slider-wrapper',
        prevBtnSelector = '.prev-btn',
        nextBtnSelector = '.next-btn',
        playSpeed = 6000
    } = options;

    let section = document.querySelector(sectionSelector);
    let sliderWrapper = document.querySelector(sliderWrapperSelector);
    let slides = Array.from(sliderWrapper.children);
    let prevBtn = document.querySelector(prevBtnSelector);
    let nextBtn = document.querySelector(nextBtnSelector);
    let dotsWrapper;
    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    
    function setupSlider(){
      if (currentIndex >= 0 && currentIndex < slides.length) {
          dotsWrapper.children[currentIndex]?.classList.add('active');
      }
    }

    function buildIndicators(){
        dotsWrapper = document.createElement('ul');
        dotsWrapper.classList.add('dots-list');
        section.appendChild(dotsWrapper);

        for (let i=0; i<slides.length; i++) {
            const indicator = document.createElement('li');
            indicator.setAttribute('data-index', i);
            dotsWrapper.appendChild(indicator);
        
            indicator.addEventListener('click', () => {
              currentIndex = i;
              updateSlides();
            });
        }

        dotsWrapper.children[currentIndex].classList.add('active');

        if(window.innerWidth < 500){
           if(dotsWrapper.children.length > 8){
              dotsWrapper.style.display = 'none';
           }
        } else {
          if(dotsWrapper.children.length > 12){
             dotsWrapper.style.display = 'none';
          }
        }
    }

    function updateSlides(){
       const scrollPosition = currentIndex * slideWidth;
       Array.from(dotsWrapper.children).forEach(indicator => {indicator.classList.remove('active');});
       dotsWrapper.children[currentIndex].classList.add('active');

       slides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

        function animateScroll(start, end, duration) {
            let startTime = null;
    
            function animation(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, start, end - start, duration);
    
                sliderWrapper.scrollLeft = run;
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
    
            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
    
            requestAnimationFrame(animation);
        }
    
        animateScroll(sliderWrapper.scrollLeft, scrollPosition, 1100);
        
        sliderWrapper.scrollTo({
            left:scrollPosition,
            behavior:"smooth"
        });
    
        if (currentIndex >= slides.length) {
            currentIndex = 0;
            sliderWrapper.scrollLeft = 0;
        }
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    }

    let heroSliderInterval = setInterval(nextSlide, playSpeed);

    function stopSlider(){
      clearInterval(heroSliderInterval);
    }

    function startSlider(){
      clearInterval(heroSliderInterval);
      heroSliderInterval = setInterval(nextSlide, playSpeed);
    }

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        scrollStart = sliderWrapper.scrollLeft;
    }

    function duringDrag(e) {
      if (!isDragging) return;
      const currentX = e.clientX;
      const dragDistance = currentX - startX;
      sliderWrapper.scrollLeft = scrollStart - dragDistance;
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      const scrollLeft = sliderWrapper.scrollLeft;

      if (Math.abs(scrollLeft - currentIndex * slideWidth) > slideWidth / 4) { // Snap to nearest slide after drag
          if (scrollLeft > currentIndex * slideWidth) {
              nextSlide();
          } else {
              prevSlide();
          }
      } else {
          updateSlides();
      }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    section.addEventListener('mouseenter', stopSlider);
    section.addEventListener('mouseleave', startSlider);
    prevBtn.addEventListener('mouseenter', stopSlider);
    nextBtn.addEventListener('mouseenter', stopSlider);

    sliderWrapper.addEventListener('mousedown', startDrag);
    sliderWrapper.addEventListener('mousemove', duringDrag);
    sliderWrapper.addEventListener('mouseup', endDrag);
    sliderWrapper.addEventListener('mouseleave', endDrag);

    buildIndicators();
    updateSlides();
    setupSlider();

    window.addEventListener('scroll', function(){
      if(window.scrollY > 10){
          stopSlider();
      } else if(window.scrollY === 0){
          startSlider();
      }
    });

    section.querySelectorAll('.hero-slider-item .content p').forEach((p) => {
      p.textContent = p.textContent.split(" ").slice(0,3).join(" ");
    });

    section.querySelectorAll('.hero-slider-item .content h1').forEach((h1) => {
      h1.textContent = h1.textContent.split(" ").slice(0,6).join(" ");
    });
}

heroSlider({sectionSelector:'.hero-section', 
            sliderWrapperSelector:'.hero-section .hero-slides-wrapper', 
            prevBtnSelector:'.hero-section .prev-btn',
            nextBtnSelector:'.hero-section .next-btn',
});

}

/*
 ######################
 ####### GLOBAL #######
 ######################
*/
