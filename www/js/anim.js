var anim = {
  showForm: function (element, authTokenVALUE) {
    var elt = $('.' + element);
    $('#' + element).on('click', function () {
      $(this).addClass('hide');
      $('#jsCloseFormAddUser').addClass('show');
      elt.slideDown();
      utils.ajaxGet('access', 'all', authTokenVALUE);
    });
    $('#jsCloseFormAddUser').on('click', function () {
      $(this).removeClass('show');
      $('#jsFormAddUser').removeClass('hide');
      elt.slideUp();
      $('.action__list__item.list div').detach();
    })
  },

  fadeInPage: function (element, authTokenVALUE, userID) {
    $('.' + element).on('click', function () {
      $(this).toggleClass('current');
      utils.removeHTML();

      var elementToShow = $('#' + element);
      if (elementToShow.css('display') == 'none') {
        elementToShow.fadeIn();
        $('.tab-bar__overlay').fadeIn();
        if (element == "jsNotifications") {
          page.notifications(authTokenVALUE, userID);
          page.declineNotification(authTokenVALUE, userID);
          calendar.addEventFromNotification(authTokenVALUE, userID);
        }
      } else {
        elementToShow.fadeOut();
        $('.tab-bar__overlay').fadeOut();
        if (element == "jsNotifications") {
          utils.removeHTML("notifications");
        }
      }

    })
  },

  input: function (element) {
    var myElement = $('#' + element);
    myElement.keyup(function () {
      var n = myElement.val();
      if (n != "") {
        myElement.prev().addClass('move');
      } else {
        myElement.prev().removeClass('move');
      }
    });
  },

  swipe: function (element) {
    var ts;
    var el = $('.' + element);
    el.on('touchstart', '.notification__list__item', function (e) {
      ts = e.originalEvent.touches[0].clientX;
    });

    el.on('touchend', '.notification__list__item', function (e) {
      var te = e.originalEvent.changedTouches[0].clientX;
      if (ts > te + 5) {
        $('.notification__list__item').removeClass('swipe');
        $(this).addClass('swipe');
      } else if (ts < te - 5) {
        $(this).removeClass('swipe');
      }
    });
  },

  swipeDesktop: function (element) {
    var el = $('.' + element);
    el.on('click', '.notification__list__item', function (e) {
      if ($(this).hasClass('not-seen')) {
        if (!$(this).hasClass('swipe')) {
          $('.notification__list__item').removeClass('swipe');
        }
        $(this).toggleClass('swipe');
      }
    });
  },

  switch: function (element, authTokenVALUE) {

    $('#validation').on('click', '.' + element, function () {

      // 1. Make Anim
      status = $(this).attr('data-status');
      validationItem = $(this).parents('.validation-item');
      validationItem.find('.validation-item__justification').remove();
      validationItem.find('.error-msg').remove();
      validationItem.find('.validationConfrim').remove();
      validationItem.removeClass('border-ok');
      validationItem.removeClass('border-no');
      validationItem.removeClass('border-stop');
      validationItem.addClass('border-' + status);
      validationItem.find('.validation-item__justification').fadeOut();
      $(this).parents('.switch').find('.switch__btn').removeClass('stop');
      $(this).parents('.switch').find('.switch__btn').removeClass('ok');
      $(this).parents('.switch').find('.switch__btn').removeClass('no');
      $(this).parents('.switch').find('.switch__btn').addClass(status);

      let notJustification = '' +
      '<div class="validation-item__justification jsJustificationNo">' +
        '<ul class="action__list">' +
          '<li class="action__list__item textarea">' +
            '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification"></textarea>' +
            '<span class="error-msg error-msg--validation"></span>' +
          '</li>' +
        '</ul>' +
      '</div>';

      let partialJustification = '' +
      '<div class="validation-item__justification jsJustificationStop">' +
        '<ul class="action__list">' +
          '<li class="action__list__item">' +
            '<span>Date : </span>' +
            '<input type="text" placeholder="JJ-MM-AAAA" class="actionDay">' +
            '<span class="error-msg"></span>' +
          '</li>' +
          '<li class="action__list__item">' +
            '<span>Heure de début : </span>' +
            '<input type="text" placeholder="HH:MM" class="startAction">' +
            '<span class="error-msg"></span>' +
            '<input type="hidden" name="start" value="" class="start">' +
          '</li>' +
          '<li class="action__list__item">' +
            '<span>Heure de fin : </span>' +
            '<input type="text" placeholder="HH:MM" class="endAction">' +
            '<span class="error-msg"></span>' +
            '<input type="hidden" name="end" value="" class="end">' +
          '</li>' +
        '</ul>' +
        '<ul class="action__list">' +
          '<li class="action__list__item textarea">' +
            '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification"></textarea>' +
            '<span class="error-msg error-msg--validation"></span>' +
          '</li>' +
        '</ul>' +
      '</div>';

      if (status == 'stop') {
        $(this).parents('.switch').prev().text('Partiellement');
        validationItem.append(partialJustification);
      } else if (status == 'ok') {
        $(this).parents('.switch').prev().text('Fait');
      } else {
        $(this).parents('.switch').prev().text('Non fait');
        validationItem.append(notJustification);
      }

      validationItem.append('<button type="submit" class="validationConfrim">Valider définitivement ce choix</button>');

    })
  },

  progressBar: function () {
    var screenWidth = ($(document).width() - 150) * 0.9;
    $('.progress-bar').css('width', screenWidth);
    $('.progress-bar__bar__wip span').css('min-width', screenWidth);
  },
};