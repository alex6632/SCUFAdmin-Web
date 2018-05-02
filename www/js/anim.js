var anim = {
    showForm: function (element) {
        var elt = $('.' + element);
        $('#' + element).on('click', function () {
            $(this).addClass('hide');
            $('#jsCloseFormAddUser').addClass('show');
            elt.slideDown();
            utils.ajaxGet('access', 'all');
        });
        $('#jsCloseFormAddUser').on('click', function () {
            $(this).removeClass('show');
            $('#jsFormAddUser').removeClass('hide');
            elt.slideUp();
            $('.action__list__item.list div').detach();
        })
    },

    fadeInPage: function (element) {
        $('.' + element).on('click', function () {
            $(this).toggleClass('current');
            utils.removeHTML();

            var elementToShow = $('#' + element);
            if (elementToShow.css('display') == 'none') {
                elementToShow.fadeIn();
                $('.tab-bar__overlay').fadeIn();
            } else {
                elementToShow.fadeOut();
                $('.tab-bar__overlay').fadeOut();
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
        el.on('touchstart', function (e) {
            ts = e.originalEvent.touches[0].clientX;
        });

        el.on('touchend', function (e) {
            var te = e.originalEvent.changedTouches[0].clientX;
            if (ts > te + 5) {
                $('.notification__list__item').removeClass('swipe');
                $(this).addClass('swipe');
            } else if (ts < te - 5) {
                $(this).removeClass('swipe');
            }
        });
    },

    switch: function (element) {
        $('.' + element).on('click', function () {
            var status = $(this).attr('data-status');
            var validationItem = $(this).parents('.validation-item');
            validationItem.removeClass('border-ok');
            validationItem.removeClass('border-no');
            validationItem.removeClass('border-stop');
            validationItem.addClass('border-' + status);
            validationItem.find('.validation-item__justification').fadeOut();
            $(this).parents('.switch').find('.switch__btn').removeClass('stop');
            $(this).parents('.switch').find('.switch__btn').removeClass('ok');
            $(this).parents('.switch').find('.switch__btn').removeClass('no');
            $(this).parents('.switch').find('.switch__btn').addClass(status);

            if (status == 'stop') {
                $(this).parents('.switch').prev().text('Partiellement');
                validationItem.find('.jsJustificationStop').fadeIn();
            } else if (status == 'ok') {
                $(this).parents('.switch').prev().text('Fait');
            } else {
                $(this).parents('.switch').prev().text('Non fait');
                validationItem.find('.jsJustificationNo').fadeIn();
            }
        })
    },

    progressBar: function () {
        var screenWidth = ($(document).width() - 150) * 0.9;
        $('.progress-bar').css('width', screenWidth);
        $('.progress-bar__bar__wip span').css('min-width', screenWidth);
    },
};