window.addEventListener('DOMContentLoaded', event => {

  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 74,
    });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function(responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

});

function set_gradient_state() {
  gradient_states = ['default-state', 'purple-state', 'dark-blue-state', 'blue-state', 'green-state', 'amber-state']
  currentItem = $("a.nav-link.active").parent().index();
  granimInstance.changeState(gradient_states[currentItem]);
}

$(document).ready(function() {
  $(window).on("activate.bs.scrollspy", function() {
    set_gradient_state()
  })
});

var granimInstance = new Granim({
  element: '#canvas',
  name: 'interactive-gradient',
  elToSetClassOn: '.canvas-wrapper',
  direction: 'diagonal',
  isPausedWhenNotInView: true,
  stateTransitionSpeed: 750,
  states: {
    "default-state": {
      gradients: [
        ['#b71c1c', '#880e4f'],
        ['#4a148c', '#311b92']
      ],
      transitionSpeed: 10000
    },
    "purple-state": {
      gradients: [
        ['#4a148c', '#311b92'],
        ['#1a237e', '#0d47a1']
      ],
      transitionSpeed: 10000
    },
    "dark-blue-state": {
      gradients: [
        ['#1a237e', '#0d47a1'],
        ['#01579b', '#006064']
      ],
      transitionSpeed: 10000
    },
    "blue-state": {
      gradients: [
        ['#01579b', '#006064'],
        ['#004d40', '#1b5e20']
      ],
      transitionSpeed: 10000
    },
    "green-state": {
      gradients: [
        ['#33691e', '#827717'],
        ['#f57f17', '#ff6f00']
      ],
      transitionSpeed: 10000
    },
    "amber-state": {
      gradients: [
        ['#f57f17', '#ff6f00'],
        ['#e65100', '#bf360c']
      ],
      transitionSpeed: 10000
    }
  }
});

function change_default_state() {
  granimInstance.changeState('default-state');
}

function change_purple_state() {
  granimInstance.changeState('purple-state');
}

function change_dark_blue_state() {
  granimInstance.changeState('dark-blue-state');
}

function change_blue_state() {
  granimInstance.changeState('blue-state');
}

function change_green_state() {
  granimInstance.changeState('green-state');
}

function change_amber_state() {
  granimInstance.changeState('amber-state');
}

var project_view = 0

function toggle_project_view() {
  if (project_view === 0) {
    var tempScrollTop = $(window).scrollTop();
    $('#toggle_project_viewer').html('<i class="fa fa-eye"></i> Minimal view')
    $('.max-display').removeClass('d-none')
    $('.min-display').addClass('d-none')
    $(window).scrollTop(tempScrollTop);
    project_view = 1
  } else {
    var tempScrollTop = $(window).scrollTop();
    $('#toggle_project_viewer').html('<i class="fa fa-eye"></i> Full view')
    $('.min-display').removeClass('d-none')
    $('.max-display').addClass('d-none')
    $(window).scrollTop(tempScrollTop);
    project_view = 0
  }

}