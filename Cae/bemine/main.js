setInterval(function() {
  var r_num = Math.floor(Math.random() * 40) + 1;
  var r_size = Math.floor(Math.random() * 65) + 10;
  var r_left = Math.floor(Math.random() * 100) + 1;
  var r_bg = Math.floor(Math.random() * 25) + 100;
  var r_time = Math.floor(Math.random() * 5) + 5;
  $('.bg_heart').append("<div class='heart' style='width:" + r_size + "px;height:" + r_size + "px;left:" + r_left + "%;background:rgba(255," + (r_bg - 25) + "," + r_bg + ",1);-webkit-animation:love " + r_time + "s ease;-moz-animation:love " + r_time + "s ease;-ms-animation:love " + r_time + "s ease;animation:love " + r_time + "s ease'></div>");

  $('.bg_heart').append("<div class='heart' style='width:" + (r_size - 10) + "px;height:" + (r_size - 10) + "px;left:" + (r_left + r_num) + "%;background:rgba(255," + (r_bg - 25) + "," + (r_bg + 25) + ",1);-webkit-animation:love " + (r_time + 5) + "s ease;-moz-animation:love " + (r_time + 5) + "s ease;-ms-animation:love " + (r_time + 5) + "s ease;animation:love " + (r_time + 5) + "s ease'></div>");

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
    base_elem.innerHTML = "You make my heart beat so fast"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)

  } else if (slide_num == 2) {

    granimInstance.changeState('violet-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "Around you, every instinct in my body tells me to hug, treasure and love you"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)

  } else if (slide_num == 3) {

    granimInstance.changeState('orange-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "Yes, we will have our challenges. We are complete people, with our commitments, lives etc."

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)

  } else if (slide_num == 4) {

    granimInstance.changeState('orange-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "But..."

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
  } else if (slide_num == 5) {

    granimInstance.changeState('blue-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "I've honestly never been so much in love before"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
  } else if (slide_num == 6) {

    granimInstance.changeState('violet-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "And I want my future to include you, the most passionate girl I met and felt for"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
  } else if (slide_num == 7) {

    granimInstance.changeState('red-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "You really read my mind and I read yours"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
  } else if (slide_num == 8) {

    granimInstance.changeState('violet-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "I love you so much and that's why I gotta ask you a question"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)

  } else if (slide_num == 9) {

    granimInstance.changeState('final-state');
    var text = document.getElementById('text')

    var base_elem = document.createElement("p");
    base_elem.classList.add('text-focus-in')
    base_elem.classList.add('main-text')
    base_elem.id = 'text'
    base_elem.innerHTML = "Will you be mine?"

    text.parentNode.appendChild(base_elem)
    text.parentNode.removeChild(text)
    setInterval(function() {
      var r_num = Math.floor(Math.random() * 40) + 1;
      var r_size = Math.floor(Math.random() * 65) + 10;
      var r_left = Math.floor(Math.random() * 100) + 1;
      var r_bg = Math.floor(Math.random() * 25) + 100;
      var r_time = Math.floor(Math.random() * 5) + 5;
      $('.bg_heart').append("<div class='heart' style='width:" + r_size + "px;height:" + r_size + "px;left:" + r_left + "%;background:rgba(255," + (r_bg - 25) + "," + r_bg + ",1);-webkit-animation:love " + r_time + "s ease;-moz-animation:love " + r_time + "s ease;-ms-animation:love " + r_time + "s ease;animation:love " + r_time + "s ease'></div>");

      $('.bg_heart').append("<div class='heart' style='width:" + (r_size - 10) + "px;height:" + (r_size - 10) + "px;left:" + (r_left + r_num) + "%;background:rgba(255," + (r_bg - 25) + "," + (r_bg + 25) + ",1);-webkit-animation:love " + (r_time + 5) + "s ease;-moz-animation:love " + (r_time + 5) + "s ease;-ms-animation:love " + (r_time + 5) + "s ease;animation:love " + (r_time + 5) + "s ease'></div>");

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
