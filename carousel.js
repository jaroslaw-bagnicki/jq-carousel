const myCarousel = (function() {
  const state = {
    currIndex: 0,
    autoChange: true,
    isAnimating: false,
    // slideChangeInterval: null
  };

  const data = {
    carouselId: 'my-carousel',
    // images: null,
    // imagesLength: null,
    // slidesContainer: null
  };

  init();
 
  // Initialization carousel
  function init() {
    $(function() {
      data.images = $(`#${data.carouselId} img`); // Load images from document to array
      data.imagesLength = data.images.length
      $(`#${data.carouselId}`).empty().append(`
        <div class="slides-container"></div>
        <div class="navigation">
          <a href="#!" class="turn-btn prev"><i class="icon-chevron-left"></i></a>
          <a href="#!" class="turn-btn next"><i class="icon-chevron-right"></i></a>
        </div>
      `)
      const prevBtn = $('.prev');
      prevBtn.click(prevSlide);
      const nextBtn = $('.next');
      nextBtn.click(nextSlide);
      data.slidesContainer = $(`#${data.carouselId} .slides-container`);
      data.slidesContainer.append($(data.images[state.currIndex]));
      if (state.autoChange) setAutoChange();
    }) 
  }

  // Load prev slide
  function prevSlide(e) {
    oneStepTurn('prev', e);
  }

  // Load next slide
  function nextSlide(e) {
    oneStepTurn('next', e)
  };

  // Run auto change slides
  function setAutoChange() {
    state.slideChangeInterval = setInterval(function() {turnSlide(calcIndex(1), 'next')}, 3000);
  }

  // Toggle auto change slides
  function toggleAutoChange() {
    if (!state.autoChange) {
      setAutoChange();
      state.autoChange = true;
    }
    else {
      clearInterval(state.slideChangeInterval);
      state.autoChange = false;
    }
  }
  
  // Calculates index of next image based on number of steps
  function calcIndex(steps) {
    let newIndex = state.currIndex + steps;
    if (newIndex < 0) newIndex += data.imagesLength 
      else if (newIndex >= data.imagesLength) newIndex -= (data.imagesLength);
    return newIndex;
  }

  // One step turn
  function oneStepTurn(direction, e) {
    if (e) e.preventDefault();
    const step = {
      'prev': -1,
      'next': 1
    }
    if (!state.isAnimating) {
      turnSlide(calcIndex(step[direction]), direction);
      if (state.autoChange) {
        clearInterval(state.slideChangeInterval);
        setAutoChange();
      }
    }
  }

  // Turns slide based on index of new image and animation direction
  function turnSlide(imgIndex, direction) {
    state.isAnimating = true;
    
    let insertOffset, turnOffset;
    if (direction === 'prev') {
      insertOffset = '-100%';
      turnOffset = '+=100%';
    } else if (direction === 'next') {
      insertOffset = '100%';
      turnOffset = '-=100%';
    } else insertOffset = turnOffset = 0;

    // Append next slide image to DOM 
    data.slidesContainer.append($(data.images[imgIndex]).css('left', insertOffset));

    // Make turn with animation
    $.when($(`#${data.carouselId} img`).animate(
      {'left': turnOffset},
      {duration: 1000}
    )).done(function() {
      $(this).first().remove(); 
      state.isAnimating = false;
      state.currIndex = imgIndex;
    });
  }

  return {
    getState: function() {return state}, 
    getData: function() {return data},
    prevSlide,
    nextSlide,
    toggleAutoChange
  }
})();


