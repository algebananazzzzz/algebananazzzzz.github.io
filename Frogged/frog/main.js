setInterval(function () {
  var r_num = Math.floor(Math.random() * 40) + 1;
  var r_size = Math.floor(Math.random() * 65) + 10;
  var r_left = Math.floor(Math.random() * 100) + 1;
  var r_bg = Math.floor(Math.random() * 25) + 100;
  var r_time = Math.floor(Math.random() * 5) + 5;
  $('.bg_frog').append("<svg class='frog' style='width:" + r_size + "px;height:" + r_size + "px;left:" + r_left + "%;-webkit-animation:frog " + r_time + "s ease;-moz-animation:frog " + r_time + "s ease;-ms-animation:frog " + r_time + "s ease;animation:frog " + r_time +
    "s ease' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' fill='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M14.16 48.37c-.43 4.5-10 10.84-9.57 26.89s13.09 44.06 57.72 44.77c44.63.7 60.96-27.31 61.1-46.6c.13-17.88-8.58-21.43-9.57-26.04c-.84-3.94 6.76-21.96-10.28-28.44c-20.11-7.65-27.6 11.68-28.16 12.1c-.56.42-6.05.7-10.84.7s-10 0-10.56-.56c-.56-.56-12.81-19.99-30.55-11.83c-16.64 7.67-9.01 26.05-9.29 29.01z' fill='#b7d019'></path><path d='M103.08 42.36c0 5.29-3 9.76-8.02 9.57c-4.33-.16-7.84-4.29-7.84-9.57s3.51-9.49 7.84-9.57c5.11-.1 8.02 4.28 8.02 9.57z' fill='#2f2f2f'></path><path d='M41.89 41.61c.28 6.76-3 10.14-8.02 10.04c-4.22-.08-7.56-3.19-7.65-9.67c-.08-5.34 1.97-9.48 7.65-9.67c4.22-.13 7.8 3.97 8.02 9.3z' fill='#2f2f2f'></path><path d='M53.29 63.5c-.81 1.79-3.06 2.35-4.57 1.48c-1.5-.87-1.91-3.23-.93-4.93c.98-1.7 2.65-1.96 3.87-1.48c1.63.64 2.83 2.28 1.63 4.93z' fill='#2f2f2f'></path><path d='M80.33 60.55c.77 1.86-.16 4.04-1.94 4.57c-1.78.53-3.69-.61-4.26-2.54c-.57-1.93.14-3.61 1.87-4.3c1.13-.44 3.19-.48 4.33 2.27z' fill='#2f2f2f'></path><path d='M27.44 78.31l.38 2.72s10.51 10.98 35.85 11.36c26 .39 37.26-12.29 37.26-12.29l-11.64-5.63s-11.07 4.69-25.34 4.41c-14.27-.28-28.34-4.41-28.34-4.41l-8.17 3.84z' fill='#ff6011'></path> <path d='M104.59 71.92c-3.28-4.79-7.23-.43-13.42 1.88c-3.43 1.28-5.7 2.02-5.7 2.02s5.09.99 7.34 2.21s6.17 3.89 6.17 3.89s8.37-5.96 5.61-10z' fill='#865b51'></path><path d='M24.81 71.36c-3.94 2.63 3.02 9.68 3.02 9.68s2.15-1.98 5.06-3.2s7.78-2.1 7.78-2.1s-5.63-1.27-8.9-3.16c-1.69-.96-4.71-2.72-6.96-1.22z' fill='#865b51'></path></g></svg>"
  );
  $('.bg_frog').append("<svg class='frog' style='width:" + (r_size - 10) + "px;height:" + (r_size - 10) + "px;left:" + (r_left + r_num) + "%;-webkit-animation:frog " + (r_time + 5) + "s ease;-moz-animation:frog " + (r_time + 5) + "s ease;-ms-animation:frog " + (r_time + 5) + "s ease;animation:frog " + (r_time + 5) + "s ease' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' fill='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M14.16 48.37c-.43 4.5-10 10.84-9.57 26.89s13.09 44.06 57.72 44.77c44.63.7 60.96-27.31 61.1-46.6c.13-17.88-8.58-21.43-9.57-26.04c-.84-3.94 6.76-21.96-10.28-28.44c-20.11-7.65-27.6 11.68-28.16 12.1c-.56.42-6.05.7-10.84.7s-10 0-10.56-.56c-.56-.56-12.81-19.99-30.55-11.83c-16.64 7.67-9.01 26.05-9.29 29.01z' fill='#b7d019'></path><path d='M103.08 42.36c0 5.29-3 9.76-8.02 9.57c-4.33-.16-7.84-4.29-7.84-9.57s3.51-9.49 7.84-9.57c5.11-.1 8.02 4.28 8.02 9.57z' fill='#2f2f2f'></path><path d='M41.89 41.61c.28 6.76-3 10.14-8.02 10.04c-4.22-.08-7.56-3.19-7.65-9.67c-.08-5.34 1.97-9.48 7.65-9.67c4.22-.13 7.8 3.97 8.02 9.3z' fill='#2f2f2f'></path><path d='M53.29 63.5c-.81 1.79-3.06 2.35-4.57 1.48c-1.5-.87-1.91-3.23-.93-4.93c.98-1.7 2.65-1.96 3.87-1.48c1.63.64 2.83 2.28 1.63 4.93z' fill='#2f2f2f'></path><path d='M80.33 60.55c.77 1.86-.16 4.04-1.94 4.57c-1.78.53-3.69-.61-4.26-2.54c-.57-1.93.14-3.61 1.87-4.3c1.13-.44 3.19-.48 4.33 2.27z' fill='#2f2f2f'></path><path d='M27.44 78.31l.38 2.72s10.51 10.98 35.85 11.36c26 .39 37.26-12.29 37.26-12.29l-11.64-5.63s-11.07 4.69-25.34 4.41c-14.27-.28-28.34-4.41-28.34-4.41l-8.17 3.84z' fill='#ff6011'></path> <path d='M104.59 71.92c-3.28-4.79-7.23-.43-13.42 1.88c-3.43 1.28-5.7 2.02-5.7 2.02s5.09.99 7.34 2.21s6.17 3.89 6.17 3.89s8.37-5.96 5.61-10z' fill='#865b51'></path><path d='M24.81 71.36c-3.94 2.63 3.02 9.68 3.02 9.68s2.15-1.98 5.06-3.2s7.78-2.1 7.78-2.1s-5.63-1.27-8.9-3.16c-1.69-.96-4.71-2.72-6.96-1.22z' fill='#865b51'></path></g></svg>"
  );

}, 750);

var granimInstance = new Granim({
  element: '#canvas-interactive',
  name: 'canvas-interactive',
  elToSetClassOn: '.canvas-wrapper',
  direction: 'diagonal',
  stateTransitionSpeed: 500,
  states: {
    "default-state": {
      gradients: [
        ['#B3FFAB', '#12FFF7'],
        ['#ADD100', '#7B920A'],
        ['#1A2980', '#26D0CE']
      ],
      transitionSpeed: 10000
    },
    "violet-state": {
      gradients: [
        ['rgba(253,101,133,1)', 'rgba(255,211,165,1)'],
        ['#4776E6', '#8E54E9']
      ],
      transitionSpeed: 5000
    },
    "orange-state": {
      gradients: [
        ['#FF4E50', '#F9D423'],
        ['#f12711', '#f5af19']
      ],
      loop: false
    },
    "red-state": {
      gradients: [
        ['#bc4e9c', '#f80759'],
        ['#ff416c', '#ff4b2b']
      ],
      loop: false
    },
    "blue-state": {
      gradients: [
        ['#5c258d', '#4389a2'],
        ['#3494e6', '#ec6ead']
      ],
      loop: false
    },
    "final-state": {
      gradients: [
        ['#ec008c', '#fc6767'],
        ['#bc4e9c', '#f80759'],
        ['#4776E6', '#8E54E9'],
        ['#5c258d', '#4389a2'],
        ['#ADD100', '#7B920A'],

      ],
      loop: false
    }



  }
});

var slide_num = 0

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}



function next_slide() {
  if (slide_num == 1) {
    granimInstance.changeState('red-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "Happy Frog Day!!"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)

  } else if (slide_num == 2) {

    granimInstance.changeState('final-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "青蛙节快乐!!"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
    setInterval(function () {
      var r_num = Math.floor(Math.random() * 40) + 1;
      var r_size = Math.floor(Math.random() * 65) + 10;
      var r_left = Math.floor(Math.random() * 100) + 1;
      var r_bg = Math.floor(Math.random() * 25) + 100;
      var r_time = Math.floor(Math.random() * 5) + 5;
      $('.bg_frog').append("<svg class='frog' style='width:" + r_size + "px;height:" + r_size + "px;left:" + r_left + "%;-webkit-animation:frog " + r_time + "s ease;-moz-animation:frog " + r_time + "s ease;-ms-animation:frog " + r_time + "s ease;animation:frog " + r_time +
        "s ease' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' fill='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M14.16 48.37c-.43 4.5-10 10.84-9.57 26.89s13.09 44.06 57.72 44.77c44.63.7 60.96-27.31 61.1-46.6c.13-17.88-8.58-21.43-9.57-26.04c-.84-3.94 6.76-21.96-10.28-28.44c-20.11-7.65-27.6 11.68-28.16 12.1c-.56.42-6.05.7-10.84.7s-10 0-10.56-.56c-.56-.56-12.81-19.99-30.55-11.83c-16.64 7.67-9.01 26.05-9.29 29.01z' fill='#b7d019'></path><path d='M103.08 42.36c0 5.29-3 9.76-8.02 9.57c-4.33-.16-7.84-4.29-7.84-9.57s3.51-9.49 7.84-9.57c5.11-.1 8.02 4.28 8.02 9.57z' fill='#2f2f2f'></path><path d='M41.89 41.61c.28 6.76-3 10.14-8.02 10.04c-4.22-.08-7.56-3.19-7.65-9.67c-.08-5.34 1.97-9.48 7.65-9.67c4.22-.13 7.8 3.97 8.02 9.3z' fill='#2f2f2f'></path><path d='M53.29 63.5c-.81 1.79-3.06 2.35-4.57 1.48c-1.5-.87-1.91-3.23-.93-4.93c.98-1.7 2.65-1.96 3.87-1.48c1.63.64 2.83 2.28 1.63 4.93z' fill='#2f2f2f'></path><path d='M80.33 60.55c.77 1.86-.16 4.04-1.94 4.57c-1.78.53-3.69-.61-4.26-2.54c-.57-1.93.14-3.61 1.87-4.3c1.13-.44 3.19-.48 4.33 2.27z' fill='#2f2f2f'></path><path d='M27.44 78.31l.38 2.72s10.51 10.98 35.85 11.36c26 .39 37.26-12.29 37.26-12.29l-11.64-5.63s-11.07 4.69-25.34 4.41c-14.27-.28-28.34-4.41-28.34-4.41l-8.17 3.84z' fill='#ff6011'></path> <path d='M104.59 71.92c-3.28-4.79-7.23-.43-13.42 1.88c-3.43 1.28-5.7 2.02-5.7 2.02s5.09.99 7.34 2.21s6.17 3.89 6.17 3.89s8.37-5.96 5.61-10z' fill='#865b51'></path><path d='M24.81 71.36c-3.94 2.63 3.02 9.68 3.02 9.68s2.15-1.98 5.06-3.2s7.78-2.1 7.78-2.1s-5.63-1.27-8.9-3.16c-1.69-.96-4.71-2.72-6.96-1.22z' fill='#865b51'></path></g></svg>"
      );
      $('.bg_frog').append("<svg class='frog' style='width:" + (r_size - 10) + "px;height:" + (r_size - 10) + "px;left:" + (r_left + r_num) + "%;-webkit-animation:frog " + (r_time + 5) + "s ease;-moz-animation:frog " + (r_time + 5) + "s ease;-ms-animation:frog " + (r_time + 5) + "s ease;animation:frog " + (r_time + 5) + "s ease' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' fill='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M14.16 48.37c-.43 4.5-10 10.84-9.57 26.89s13.09 44.06 57.72 44.77c44.63.7 60.96-27.31 61.1-46.6c.13-17.88-8.58-21.43-9.57-26.04c-.84-3.94 6.76-21.96-10.28-28.44c-20.11-7.65-27.6 11.68-28.16 12.1c-.56.42-6.05.7-10.84.7s-10 0-10.56-.56c-.56-.56-12.81-19.99-30.55-11.83c-16.64 7.67-9.01 26.05-9.29 29.01z' fill='#b7d019'></path><path d='M103.08 42.36c0 5.29-3 9.76-8.02 9.57c-4.33-.16-7.84-4.29-7.84-9.57s3.51-9.49 7.84-9.57c5.11-.1 8.02 4.28 8.02 9.57z' fill='#2f2f2f'></path><path d='M41.89 41.61c.28 6.76-3 10.14-8.02 10.04c-4.22-.08-7.56-3.19-7.65-9.67c-.08-5.34 1.97-9.48 7.65-9.67c4.22-.13 7.8 3.97 8.02 9.3z' fill='#2f2f2f'></path><path d='M53.29 63.5c-.81 1.79-3.06 2.35-4.57 1.48c-1.5-.87-1.91-3.23-.93-4.93c.98-1.7 2.65-1.96 3.87-1.48c1.63.64 2.83 2.28 1.63 4.93z' fill='#2f2f2f'></path><path d='M80.33 60.55c.77 1.86-.16 4.04-1.94 4.57c-1.78.53-3.69-.61-4.26-2.54c-.57-1.93.14-3.61 1.87-4.3c1.13-.44 3.19-.48 4.33 2.27z' fill='#2f2f2f'></path><path d='M27.44 78.31l.38 2.72s10.51 10.98 35.85 11.36c26 .39 37.26-12.29 37.26-12.29l-11.64-5.63s-11.07 4.69-25.34 4.41c-14.27-.28-28.34-4.41-28.34-4.41l-8.17 3.84z' fill='#ff6011'></path> <path d='M104.59 71.92c-3.28-4.79-7.23-.43-13.42 1.88c-3.43 1.28-5.7 2.02-5.7 2.02s5.09.99 7.34 2.21s6.17 3.89 6.17 3.89s8.37-5.96 5.61-10z' fill='#865b51'></path><path d='M24.81 71.36c-3.94 2.63 3.02 9.68 3.02 9.68s2.15-1.98 5.06-3.2s7.78-2.1 7.78-2.1s-5.63-1.27-8.9-3.16c-1.69-.96-4.71-2.72-6.96-1.22z' fill='#865b51'></path></g></svg>"
      );
    }, 50);
  }

  setTimeout(next_slide, 5000);
  slide_num += 1
}

next_slide()


// granimInstance.changeState('violet-state');

// function setClass(element) {
//     $('.canvas-wrapper a').removeClass('active');
//     $(element).addClass('active');
// };

// $('#default-state-cta').on('click', function(event) {
//     event.preventDefault();
//     granimInstance.changeState('default-state');
//     setClass('#default-state-cta')
// });
