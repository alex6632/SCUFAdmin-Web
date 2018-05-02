var me = {


  init: function () {

    // CONNECT
    me.loginPage();
    me.ajaxLogin();

    // CHECK IF TOKEN IS VALID ?
    var isConnected = me.isValidToken();

    if(isConnected) {
      var authTokenID = localStorage.getItem('authTokenID'),
          authTokenVALUE = localStorage.getItem('authTokenVALUE'),
          userID = localStorage.getItem('userID');

      // DISCONNECT
      me.ajaxLogout(authTokenVALUE, authTokenID);

      // ROUTING
      routing.level1('planning');
      routing.level1('validation');
      routing.level1('actions');
      routing.level1('profile');
      routing.level2();

      // SPECIAL PAGES
      me.fadeInPage('jsNotifications');
      me.fadeInPage('jsSearch');

      // PAGES
      me.profile(authTokenVALUE, userID);

      // OTHER EVENTS
      me.swipe('notification__list__item');
      me.switch('stop');
      me.switch('ok');
      me.switch('no');
      me.switch('label--stop');
      me.switch('label--ok');
      me.switch('label--no');
      me.progressBar();

      // SHOW ADD FORM
      me.showForm('jsFormAddUser');

      // SEARCH USER - AUTOCOMPLETE -
      me.ajaxSearchUser('jsSearchUser');
    }

  },

  /*
   * LOGIN
   */
  loginPage: function () {
    if(localStorage.getItem('authTokenID') === null) {
      $('.loginTrigger').removeClass('hide');
      var loginHTMLPage = '' +
        '<div class="login">' +
          '<div class="login__top" id="jsShowConnectForm">' +
            '<div class="login__top__inner">' +
              '<div class="login__head">' +
                  '<div class="icon icon-lock"></div>' +
                  '<div class="login__head__title">Connexion</div>' +
              '</div>' +
              '<div class="login__info-touch">Toucher pour vous connecter</div>' +
              '<form action="" class="login__form">' +
                  '<div class="login__form__block">' +
                      '<label for="login-email" class="login__form__label">Nom utilisateur</label>' +
                      '<input type="text" class="login__form__input" id="login-email" name="login" autocomplete="off"/>' +
                  '</div>' +
                  '<div class="login__form__block">' +
                      '<label for="login-pwd" class="login__form__label">Mot de passe</label>' +
                      '<input type="password" class="login__form__input" id="login-pwd" name="password" autocomplete="off"/>' +
                  '</div>' +
                  '<button type="submit" class="button">Se connecter</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
          '<div class="logo">' +
              '<img src="images/logo.jpg" alt="">' +
          '</div>' +
        '</div>';

      $('.loginTrigger').append(loginHTMLPage);
      
      $('.loginTrigger').on('click', '#jsShowConnectForm', function () {
        $(this).parents('.login').addClass('step2');
        $(this).find('.login__info-touch').fadeOut();
        $(this).find('.login__form').delay(800).fadeIn();
      });
      me.input('login-email');
      me.input('login-pwd');

    } else {
      $('.loginTrigger .login').remove();
      $('.loginTrigger').addClass('hide');
      me.getSetting('coeff', localStorage.getItem('authTokenVALUE'));
    }
  },

  ajaxLogin: function () {
    $('.loginTrigger').on('submit', '.login__form', function (e) {
      e.preventDefault();
      var api = "http://127.0.0.1:8000/auth-tokens";
      $.ajax({
        url: api,
        data: $(this).serialize(),
        type: 'POST',
        success: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            localStorage.setItem('authTokenID', response.authToken.id);
            localStorage.setItem('authTokenVALUE', response.authToken.value);
            localStorage.setItem('userID', response.authToken.user.id);
            localStorage.setItem('authTokenCREATED', response.createdTime);
            localStorage.setItem('tokenValidityDuration', response.tokenValidityDuration);
            me.loginPage();
        },
        error: function (response) {
          console.log(response);
          var error = response.responseJSON.code + " : " + response.responseJSON.message;
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
        }
      });
    });
  },

  /*
   * LOGOUT ACTION
   */
  ajaxLogout: function (authTokenVALUE, authTokenID) {
    $('.jsLogout').on('click', function () {
      var api = "http://127.0.0.1:8000/auth-tokens/" + authTokenID;
      $.ajax({
        url: api,
        type: 'DELETE',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function () {
            localStorage.removeItem('authTokenID');
            localStorage.removeItem('authTokenVALUE');
            localStorage.removeItem('userID');
            localStorage.removeItem('authTokenCREATED');
            localStorage.removeItem('tokenValidityDuration');
            me.loginPage();
        },
        error: function (response) {
          console.log(response);
          //var error = response.responseJSON.code + " : " + response.responseJSON.message;
          //$('.msg-flash .alert').remove();
          //$('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
        }
      });
    });
  },

  /*
   * IS TOKEN VALID ?
   */
  isValidToken: function() {
    console.log('Check if token is valid....');

    var authTokenCREATED = localStorage.getItem('authTokenCREATED'),
        isConnected = false;

    if(authTokenCREATED !== null) {
      var date = Math.trunc(Date.now() / 1000),
          tokenValidityDuration = localStorage.getItem('tokenValidityDuration');

      if(date - authTokenCREATED < tokenValidityDuration) {
        isConnected = true;
      } else {
        localStorage.removeItem('authTokenID');
        localStorage.removeItem('authTokenVALUE');
        localStorage.removeItem('userID');
        localStorage.removeItem('authTokenCREATED');
        localStorage.removeItem('tokenValidityDuration');
        me.loginPage();
      }
    }
    return isConnected;
  },

  /*
   * GET ONE SETTING
   */
  getSetting: function(element, authTokenVALUE) {
    var api = "http://127.0.0.1:8000/setting/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        localStorage.setItem('settingCOEFF', response.value);
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  /*
   * PROFIL PAGE
   */
  profile: function (authTokenVALUE, userID) {
    var api = "http://127.0.0.1:8000/user/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log("Profile response : ",response);
        $('.profile-page__name').text(response.firstname + " " + response.lastname);
        var role = "";
        switch (response.role) {
          case 1:
            role = 'Salarié';
            break;
          case 2:
            role = 'Manager';
            break;
          case 3:
            role = 'Superviseur';
            break;
          case 4:
            role = 'Administrateur';
            break;
          default:
            role = "Aucun";
        }
        var hoursToPlanify = response.hoursTodo - response.hoursPlanified;
        var percentageHoursTodo = (response.hoursDone / response.hoursTodo) * 100;
        var percentageHoursPlanified = (response.hoursPlanifiedByMe / hoursToPlanify) * 100;
        var coeff = localStorage.getItem('settingCOEFF');
        var repos = response.overtime / coeff;
        $('.profile-page__status').text(role);
        $('#jsHoursTodo .progress-bar__ratio').html('<span class="ratio-ok">' + response.hoursDone + '</span>/' + response.hoursTodo + '<span>H</span>');
        $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text(percentageHoursTodo + '%');
        $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodo + '%;');
        $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok">' + response.hoursPlanifiedByMe + '</span>/' + hoursToPlanify + '<span>H</span>');
        $('#jsHoursPlanified .progress-bar__bar__text, #jsHoursPlanified .progress-bar__bar__wip span').text(percentageHoursPlanified + '%');
        $('#jsHoursPlanified .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursPlanified + '%;');
        $('.profile-page__info-hours__nb').html(repos + '<span>H</span>');
      },
      error: function (response) {
        console.log(response);
        var error = response.responseJSON.code + " : " + response.responseJSON.message;
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    });
  },

  


  showForm: function (element) {
    var elt = $('.' + element);
    $('#' + element).on('click', function () {
      $(this).addClass('hide');
      $('#jsCloseFormAddUser').addClass('show');
      elt.slideDown();
      me.ajaxGet('access', 'all');
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
      me.removeHTML();

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

  removeHTML: function (element) {
    $('.msg-flash .alert').remove();

    switch (element) {
      case "level2Access":
        $('.access-list li').remove();
        break;
      case "level2Setting":
        $('.setting-list li').remove();
        break;
      case "level2User":
        $('.action__list__item.list div').remove();
        $('.user-list tbody form').remove();
        break;
    }
  },
  removeEventHandlers: function(element) {
    switch (element) {
      case "level2Access":
        $('.jsFormAddAccess').off('submit');
        $('.access-list').off('click', '.delete');
        $('.access-list').off('click', 'form .editEnabled');
        $('.access-list').off('click', 'form .editCanceled');
        $('.access-list').off('click', 'form .edit');
        break;
      case "level2Setting":
        $('.setting-list').off('click', '.delete');
        $('.setting-list').off('click', 'form .editEnabled');
        $('.setting-list').off('click', 'form .editCanceled');
        $('.setting-list').off('click', 'form .edit');
        break;
      case "level2User":
        $('.jsFormAddUser').off('submit');
        $('.user-list').off('click', '.delete');
        $('.user-list').off('click', 'form .editEnabled');
        $('.user-list').off('click', 'form .editCanceled');
        $('.user-list').off('click', 'form .edit');
        break;
    }
  },
  emptyForm: function (type) {
    switch (type) {
      case "access":
        $('.jsFormAddAccess input:text').val('');
        break;
      case "user":
        $('.jsFormAddUser input:text').val('');
        $('.jsFormAddUser input:password').val('');
        $('.jsFormAddUser select').prop('selectedIndex', 0);
        $('.jsFormAddUser input:checkbox').removeAttr('checked');
        break;
    }
  },

  
  /*
   * GET ACCESS
   */
  getAccess: function() {
    var api = "http://127.0.0.1:8000/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      success: function (response) {
          console.log(response);
      },
      complete: function (response) {
        console.log(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  },
  ajaxGet: function (element, type) {
    var api = "http://127.0.0.1:8000/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      success: function (response) {
        //console.log(response);
        if (type == 'checked') {
          //*****************
          console.log(response);
          me.parseCheckAccess(response);
          //****************
        } else {
          for (var j = 0; j < response.length; j++) {
            $('.action__list__item.list').append(
              '<div>' +
              '<input type="checkbox" name="access[]" value="' + response[j].id + '" id="' + response[j].slug + '"><label for="' + response[j].slug + '">' + response[j].title + '</label>' +
              '</div>'
            );
          }
        }
      },
      complete: function () {

      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  parseCheckAccess: function (response) {
    console.log(response);
    var allListAccess = '';
    for (var i = 0; i < response.length; i++) {
      allListAccess += '' +
        '<div>' +
        '<input type="checkbox" name="access[]" value="' + response[i].id + '" id="' + response[i].slug + '"><label for="' + response[i].slug + '">' + response[i].title + '</label>' +
        '</div>';
    }
    console.log(allListAccess);
  },

  /*
   * ADD
   */
  ajaxAdd: function (element, type) {
    $('.' + element).on('submit', function (e) {
      e.preventDefault();
      $('form.' + element + ' button').prop("disabled", true);
      var api = "http://127.0.0.1:8000/" + type + "/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        success: function (response) {
          switch (type) {
            case 'access':
              if (response.type == 'success') {
                me.removeHTML("level2Access");
                $('form.' + element + ' button').prop("disabled", true);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                me.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access');
                me.emptyForm('access');
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case 'user':
              if (response.type == 'success') {
                me.removeHTML("level2User");
                $('form.' + element + ' button').prop("disabled", true);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                me.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user');
                me.emptyForm('user');
                // Close form
                $('#jsCloseFormAddUser').removeClass('show');
                $('#jsFormAddUser').removeClass('hide');
                $('.jsFormAddUser').slideUp();
                $('.action__list__item.list div').detach();
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'ajout</div>');
        }
      })
    });
  },

  /*
   * SIMPLE LIST
   */
  ajaxSimpleList: function (api, element, type) {
    $.ajax({
      url: api,
      type: 'GET',
      success: function (response) {
        switch (type) {
          case "access":
            for (var i = 0; i < response.length; i++) {
              $(element).append(
                '<li>' +
                '<input type="text" name="title" value="' + response[i].title + '" disabled>' +
                '<span class="link editEnabled">Editer</span>' +
                '<span class="link edit" id="editAccess' + response[i].id + '">Valider</span>' +
                '<span class="link editCanceled">Annuler</span>' +
                '<span class="link delete" id="deleteAccess' + response[i].id + '">Supprimer</span>' +
                '</li>'
              );
            }
            break;
          case "setting":
            for (var j = 0; j < response.length; j++) {
              $(element).append(
                '<li>' +
                '<span class="">' + response[j].title + '</span> : <input type="text" name="value" value="' + response[j].value + '" disabled>' +
                '<span class="link editEnabled">Editer</span>' +
                '<span class="link edit" id="editSetting' + response[j].id + '">Valider</span>' +
                '<span class="link editCanceled">Annuler</span>' +
                '<span class="link delete" id="deleteSetting' + response[j].id + '">Supprimer</span>' +
                '</li>'
              );
            }
            break;
          case "user":
            for (var i = 0; i < response.length; i++) {
              var superior = "",
                role = '',
                access = [];
              if (response[i].superior !== null) {
                superior = response[i].superior.id;
              } else {
                superior = "Aucun";
              }
              switch (response[i].role) {
                case 1:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1" selected>Salarié</option>' +
                    '</select>';
                  break;
                case 2:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2" selected>Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                case 3:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3" selected>Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                case 4:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4" selected>Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                default:
                  role = "Aucun";
              }
              //console.log('access 2 ', Access); 
              if (response[i].access.length > 0) {
                var listAccess = '';
                for (var j = 0; j < response[i].access.length; j++) {

                  listAccess += '' +
                    '<div>' +
                    '<input type="checkbox" name="access[]" value="' + response[i].access[j].id + '" id="' + response[i].access[j].slug + '" checked disabled>' +
                    '<label for="' + response[i].access[j].slug + '">' + response[i].access[j].title + '</label>' +
                    '</div>';
                }
              } else {
                listAccess = "Aucun"
              }
              $(element).append(
                '<form action="" id="formUser' + response[i].id + '" class="tr">' +
                '<div class="td">' + response[i].id + '</div>' +
                '<div class="td"><input type="text" name="firstname" value="' + response[i].firstname + '" disabled></div>' +
                '<div class="td"><input type="text" name="lastname" value="' + response[i].lastname + '" disabled></div>' +
                '<div class="td"><input type="text" name="username" value="' + response[i].username + '" disabled></div>' +
                '<div class="td">' +
                role +
                '</div>' +
                '<div class="td"><input type="text" name="superior" value="' + superior + '" disabled></div>' +
                '<div class="td user-access-list">' + listAccess + '</div>' +
                '<div class="td"><input type="text" name="hours_planified" value="' + response[i].hoursPlanified + '" disabled></div>' +
                '<div class="td">' +
                '<span class="link-table editEnabled">Editer</span>' +
                '<span class="link-table edit" id="editUser' + response[i].id + '">Valider</span>' +
                '<span class="link-table editCanceled">Annuler</span>' +
                '<span class="link-table delete" id="deleteUser' + response[i].id + '">Supprimer</span>' +
                '</div>' +
                '</form>'
              );
            }
            break;
        }
      },
      error: function (response) {
        $('.msg-flash .alert').remove();
        var error = response.responseJSON.code !== "" ? response.responseJSON.code + " : " + response.responseJSON.message : response.message;
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    })
  },

  /*
   * EDIT
   */
  ajaxEdit: function (click, element, type) {
    $(click).on('click', 'li .editEnabled', function () {
      $(this).parents('li').find('input').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('li').find('.editCanceled').addClass('show');
      $(this).parents('li').find('.edit').addClass('show');
    });
    $(click).on('click', 'li .editCanceled', function () {
      $(this).parents('li').find('input').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('li').find('.edit').removeClass('show');
      $(this).parents('li').find('.editEnabled').removeClass('hide');
    });
    $(click).on('click', 'li .edit', function () {
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = "http://127.0.0.1:8000/" + type + "/update/" + id;
      var value = '';
      var data = {};
      if (type == 'access') {
        value = $(this).parents('li').find('input').val();
        data = { title: value };
        console.log(value);
      } else {
        value = $(this).parents('li').find('input').val();
        data = { value: value };
      }
      $.ajax({
        url: api,
        type: 'PATCH',
        data: data,
        success: function (response) {
          switch (type) {
            case "access":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<input type="text" name="title" value="' + response.title + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editAccess' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteAccess' + response.id + '">Supprimer</span>'
                );
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case "setting":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<span>' + response.title + '</span> : <input type="text" name="value" value="' + response.value + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSetting' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSetting' + response.id + '">Supprimer</span>'
                );
              }
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  ajaxEditUser: function () {
    $('.user-list').on('click', 'form .editEnabled', function () {
      $(this).parents('form').find('input').prop('disabled', false);
      $(this).parents('form').find('select').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('form').find('.editCanceled').addClass('show');
      $(this).parents('form').find('.edit').addClass('show');
    });
    $('.user-list').on('click', 'form .editCanceled', function () {
      $(this).parents('form').find('input').prop('disabled', true);
      $(this).parents('form').find('select').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('form').find('.edit').removeClass('show');
      $(this).parents('form').find('.editEnabled').removeClass('hide');
    });
    $('.user-list').on('click', 'form .edit', function () {
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = "http://127.0.0.1:8000/user/update/" + id;
      form = $(this).parents('form');

      $.ajax({
        url: api,
        type: 'PATCH',
        data: form.serialize(),
        success: function (response) {
          if (response.type == 'success') {
            me.removeHTML("level2User");
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
            me.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user');
          } else {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },

  /*
   * REMOVE
   */
  ajaxRemove: function (click, element, type) {
    $(click).on('click', '.delete', function () {
      if (confirm("Cette action sera irréversible.")) {
        var idStr = $(this).attr('id');
        var reg = /([0-9]+)/.exec(idStr);
        var id = RegExp.$1;
        var api = "http://127.0.0.1:8000/" + type + "/delete/" + id;
        $.ajax({
          url: api,
          type: 'DELETE',
          success: function (response) {
            switch (type) {
              case "access":
                if (response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parent().remove();
                }
                break;
              case "setting":
                if (response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parent().remove();
                }
                break;
              case "user":
                if (response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formUser' + response.id).remove();
                }
                break;
            }
          },
          error: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de la suppression</div>');
          }
        })
      }
    });
  },

  /*
   * SEARCH USER
   */
  ajaxSearchUser: function (element) {
    
    $('#searchForm').on('submit', function(e) {
      e.preventDefault();
    });

    $('#' + element).instantSearch({
      minQueryLength: 3,
      noItemsFoundMessage: 'Aucun utilisateur trouvé',
      previewDelay: 200
    });
    //lowercase, asciifolding
  
  }
};

$(document).ready(function () {
  // INIT
  me.init();
});