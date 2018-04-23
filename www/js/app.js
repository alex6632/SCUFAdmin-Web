var me = {
  routing: function(element) {
    $('.' + element).on('click', function () {
      // Tab bar
      $('.tab-bar__item').removeClass('current');
      $(this).addClass('current');

      // Pages
      $('.routing').removeClass('show');
      var current = $(this).attr('data-routing');
      $('.routing#' + current).addClass('show');
    });
  },
  routingLevel2: function (element) {
    // Go level 2
    $('.' + element).on('click', function () {
      var jsGoLevel1 = $(this).parents('.routing').find('.jsGoLevel1');
      switch(element) {
        case "addAccess":
          jsGoLevel1.attr('id', 'level2Access');
          me.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access');
          me.ajaxAdd('jsFormAddAccess', 'access');
          me.ajaxRemove('.access-list', '.access-list #deleteAccess', 'access');
          me.ajaxEdit('.access-list', '.access-list #editAccess', 'access');
          break;
        case "addSetting":
          jsGoLevel1.attr('id', 'level2Setting');
          me.ajaxSimpleList('http://127.0.0.1:8000/settings', $('.setting-list'), 'setting');
          me.ajaxRemove('.setting-list', '.setting-list #deleteSetting', 'setting');
          me.ajaxEdit('.setting-list', '.setting-list #editSetting', 'setting');
          break;
        case "addUser":
          jsGoLevel1.attr('id', 'level2User');
          me.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user');
          me.ajaxAdd('jsFormAddUser', 'user');
          me.ajaxRemove('.user-list', '.user-list #deleteUser', 'user');
          me.ajaxEditUser();
          break;
      }
      var content = $(this).text();
      $(this).parents('.level1').addClass('swipe');
      $('#' + element).addClass('show');
      jsGoLevel1.addClass('show');
      $(this).parents('.routing').find('.jsSearch').addClass('hide');
      $(this).parents('.routing').find('.title span').text("/ " + content);
    });
    // Back level 1
    $('.jsGoLevel1').on('click', function () {
      var id = $(this).attr('id');
      me.removeIfNotNecessary(id);
      $(this).removeClass('show');
      $(this).removeAttr('id');
      $(this).prev().removeClass('hide');
      $(this).parents('.routing').find('.level1').removeClass('swipe');
      $(this).parents('.routing').find('.level2').removeClass('show');
      $(this).parents('.routing').find('.title span').text('');
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
      $('.action__list__item.list div').remove();
    })
  },
  fadeInPage: function (element) {
    $('.' + element).on('click', function () {
      $(this).toggleClass('current');
      me.removeIfNotNecessary();

      var elementToShow = $('#' + element);
      if(elementToShow.css('display') == 'none') {
        elementToShow.fadeIn();
        $('.tab-bar__overlay').fadeIn();
      } else {
        elementToShow.fadeOut();
        $('.tab-bar__overlay').fadeOut();
      }
    })
  },
  login: function() {
    $('#jsShowConnectForm').on('click', function () {
      $(this).parents('.login').addClass('step2');
      $('.login__info-touch').fadeOut();
      $('.login__form').delay(800).fadeIn();
    });
  },
  input:function(element) {
    var myElement = $('#' + element);
    myElement.keyup(function() {
      var n = myElement.val();
      if (n != "") {
        myElement.prev().addClass('move');
      } else {
        myElement.prev().removeClass('move');
      }
    });
  },
  swipe:function (element) {
    var ts;
    var el = $('.' + element);
    el.bind('touchstart', function (e){
      ts = e.originalEvent.touches[0].clientX;
    });

    el.bind('touchend', function (e){
      var te = e.originalEvent.changedTouches[0].clientX;
      if(ts > te+5){
        $('.notification__list__item').removeClass('swipe');
        $(this).addClass('swipe');
      }else if(ts < te-5){
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

      if(status == 'stop') {
        $(this).parents('.switch').prev().text('Partiellement');
        validationItem.find('.jsJustificationStop').fadeIn();
      } else if(status == 'ok') {
        $(this).parents('.switch').prev().text('Fait');
      } else {
        $(this).parents('.switch').prev().text('Non fait');
        validationItem.find('.jsJustificationNo').fadeIn();
      }
    })
  },
  progressBar: function () {
    var screenWidth = ($(document).width()-150)*0.9;
    $('.progress-bar').css('width',screenWidth);
    $('.progress-bar__bar__wip span').css('min-width',screenWidth);
  },
  removeIfNotNecessary: function (element) {
    $('.msg-flash .alert').remove();

    switch(element) {
      case "level2Access":
        //me.ajaxAddAccess('jsFormAddAccess');
        $('.access-list li').remove();
        break;
      case "level2Setting":
        $('.setting-list li').remove();
        break;
      case "level2User":
        $('.action__list__item.list div').remove();
        $('.user-list tbody tr').remove();
        //me.ajaxAddUser();
        break;
    }
  },
  emptyForm: function (type) {
    switch(type) {
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
   * LOGIN
   */
  ajaxLogin: function () {
    $('.login__form').on('submit', function (e) {
      e.preventDefault();
      // 1. Call API to check credentials
      //...
      // 2. Open APP profile page
      $('.login').addClass('hide');
    });
  },

  /*
   * LOGOUT
   */
  ajaxLogout: function () {
    $('.jsLogout').on('click', function () {
      // 1. Call API to remove Session variable
      //...
      // 2. Show connect page
      $('.login').removeClass('hide');
    });
  },
  /*
   * GET ACCESS
   */
  ajaxGet: function (element, type) {
    var api = "http://127.0.0.1:8000/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      success: function(response) {
        //console.log(response);
        if(type == 'checked') {
          //*****************
          console.log(response);
          me.parseCheckAccess(response);
          //****************
        } else {
          for(var j=0; j<response.length; j++) {
            $('.action__list__item.list').append(
              '<div>' +
              '<input type="checkbox" name="access[]" value="' + response[j].id + '" id="' + response[j].slug + '"><label for="' + response[j].slug + '">' + response[j].title + '</label>' +
              '</div>'
            );
          }
        }
      },
      error: function(response) {
        console.log(response);
      }
    });
  },

  parseCheckAccess: function(response) {
    console.log(response);
    var allListAccess = '';
    for(var i=0; i<response.length; i++) {
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
      $('form.' + element + ' button').prop( "disabled", true );
      var api = "http://127.0.0.1:8000/" + type + "/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        success: function(response) {
          switch(type) {
            case 'access':
              if(response.type == 'success') {
                me.removeIfNotNecessary("level2Access");
                $('form.' + element + ' button').prop( "disabled", true );
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
                me.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access');
                me.emptyForm('access');
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.msg + '</div>');
              }
              break;
            case 'user':
              if(response.type == 'success') {
                me.removeIfNotNecessary("level2User");
                $('form.' + element + ' button').prop( "disabled", true );
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
                me.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user');
                me.emptyForm('user');
                // Close form
                $('#jsCloseFormAddUser').removeClass('show');
                $('#jsFormAddUser').removeClass('hide');
                $('.jsFormAddUser').slideUp();
                $('.action__list__item.list div').remove();
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.msg + '</div>');
              }
              break;
          }
        },
        error: function(response) {
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
      success: function(response) {
        switch (type) {
          case "access":
            for(var i=0; i<response.length; i++) {
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
            for(var j=0; j<response.length; j++) {
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
            for(var i=0; i<response.length; i++) {
              var superior = "",
                  role = '',
                  access = [];
              if(response[i].superior !== null) {
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

              if(response[i].access.length > 0) {
                var listAccess = '';
                for(var j=0; j<response[i].access.length; j++) {

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
                '<tr id="user' + response[i].id + '">' +
                  '<td>' + response[i].id + '</td>' +
                  '<td><input type="text" name="firstname" value="' + response[i].firstname + '" disabled></td>' +
                  '<td><input type="text" name="lastname" value="' + response[i].lastname + '" disabled></td>' +
                  '<td><input type="text" name="username" value="' + response[i].username + '" disabled></td>' +
                  '<td>' +
                    role +
                  '</td>' +
                  '<td><input type="text" name="superior" value="' + superior + '" disabled></td>' +
                  '<td class="user-access-list">' + listAccess + '</td>' +
                  '<td><input type="text" name="hours_planified" value="' + response[i].hoursPlanified + '" disabled></td>' +
                  '<td>' +
                    '<span class="link-table editEnabled">Editer</span>' +
                    '<span class="link-table edit" id="editUser' + response[i].id + '">Valider</span>' +
                    '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteUser' + response[i].id + '">Supprimer</span>' +
                  '</td>' +
                '</tr>'
              );
            }
            break;
        }
      },
      error: function(response) {
        console.log(response);
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.msg + '</div>');
      }
    })
  },

  /*
   * EDIT
   */
  ajaxEdit: function (click, element, type) {
    $(click).on('click', 'li .editEnabled', function() {
      $(this).parents('li').find('input').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('li').find('.editCanceled').addClass('show');
      $(this).parents('li').find('.edit').addClass('show');
    });
    $(click).on('click', 'li .editCanceled', function() {
      $(this).parents('li').find('input').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('li').find('.edit').removeClass('show');
      $(this).parents('li').find('.editEnabled').removeClass('hide');
    });
    $(click).on('click', 'li .edit', function() {
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = "http://127.0.0.1:8000/" + type + "/update/"+id;
      var value = '';
      var data = {};
      if(type == 'access') {
        value = $(this).parents('li').find('input').val();
        data = { title : value };
        console.log(value);
      } else {
        value = $(this).parents('li').find('input').val();
        data = { value : value };
      }
      $.ajax({
        url: api,
        type: 'PATCH',
        data: data,
        success: function(response) {
          switch(type) {
            case "access":
              if(response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
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
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.msg + '</div>');
              }
              break;
            case "setting":
              if(response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
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
        error: function(response) {
          console.log(response);
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  ajaxEditUser: function() {
    $('.user-list').on('click', 'tr .editEnabled', function() {
      $(this).parents('tr').find('input').prop('disabled', false);
      $(this).parents('tr').find('select').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('tr').find('.editCanceled').addClass('show');
      $(this).parents('tr').find('.edit').addClass('show');
    });
    $('.user-list').on('click', 'tr .editCanceled', function() {
      $(this).parents('tr').find('input').prop('disabled', true);
      $(this).parents('tr').find('select').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('tr').find('.edit').removeClass('show');
      $(this).parents('tr').find('.editEnabled').removeClass('hide');
    });
  },

  /*
   * REMOVE
   */
  ajaxRemove: function (click, element, type) {
    $(click).on('click', '.delete', function() {
      if(confirm("Cette action sera irréversible.")) {
        var idStr = $(this).attr('id');
        var reg = /([0-9]+)/.exec(idStr);
        var id = RegExp.$1;
        var api = "http://127.0.0.1:8000/" + type + "/delete/"+id;
        $.ajax({
          url: api,
          type: 'DELETE',
          success: function(response) {
            switch(type) {
              case "access":
                if(response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
                  $(element + '' + response.id).parent().remove();
                }
                break;
              case "setting":
                if(response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
                  $(element + '' + response.id).parent().remove();
                }
                break;
              case "user":
                if(response.type == 'success') {
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.msg + '</div>');
                  $(element + '' + response.id).parents('#user' + response.id).remove();
                }
                break;
            }
          },
          error: function(response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de la suppression</div>');
          }
        })
      }
    });
  },

  /*
   * ADD SETTING
   */
  ajaxAddSetting: function () {
    $('').on('submit', function () {

    })
  }
};

$(document).ready(function() {
  // ROUTING
  me.routing('planning');
  me.routing('validation');
  me.routing('actions');
  me.routing('profile');
  me.routingLevel2('rest');
  me.routingLevel2('leave');
  me.routingLevel2('hours');
  me.routingLevel2('addAccess');
  me.routingLevel2('addSetting');
  me.routingLevel2('addUser');

  // SPECIAL PAGES
  me.fadeInPage('jsNotifications');
  me.fadeInPage('jsSearch');

  // LOGIN PAGE
  me.login();
  me.input('login-email');
  me.input('login-pwd');

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
});