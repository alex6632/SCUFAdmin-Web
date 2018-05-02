var routing = {
  
  level1: function (element) {
    $('.' + element).on('click', function () {
      if (utils.isValidToken()) {
        console.log('Connexion succeded')
        // Tab bar
        $('.tab-bar__item').removeClass('current');
        $(this).addClass('current');

        // Pages
        $('.routing').removeClass('show');
        var current = $(this).attr('data-routing');
        $('.routing#' + current).addClass('show');
      }
    });
  },

  level2: function () {
    $('.jsGoLevel2').on('click', function () {
      var element = $(this).attr('data-routing');
      var jsGoLevel1 = $(this).parents('.routing').find('.jsGoLevel1');
      switch (element) {
        case "addAccess":
          jsGoLevel1.attr('id', 'level2Access');
          crud.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access');
          crud.ajaxAdd('jsFormAddAccess', 'access');
          crud.ajaxRemove('.access-list', '.access-list #deleteAccess', 'access');
          crud.ajaxEdit('.access-list', '.access-list #editAccess', 'access');
          break;
        case "addSetting":
          jsGoLevel1.attr('id', 'level2Setting');
          crud.ajaxSimpleList('http://127.0.0.1:8000/settings', $('.setting-list'), 'setting');
          crud.ajaxRemove('.setting-list', '.setting-list #deleteSetting', 'setting');
          crud.ajaxEdit('.setting-list', '.setting-list #editSetting', 'setting');
          break;
        case "addUser":
          jsGoLevel1.attr('id', 'level2User');
          crud.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user');
          crud.ajaxAdd('jsFormAddUser', 'user');
          crud.ajaxRemove('.user-list', '.user-list #deleteUser', 'user');
          crud.ajaxEditUser();
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
      utils.removeHTML(id);
      utils.removeEventHandlers(id);

      $(this).removeClass('show');
      $(this).removeAttr('id');
      $(this).prev().removeClass('hide');
      $(this).parents('.routing').find('.level1').removeClass('swipe');
      $(this).parents('.routing').find('.level2').removeClass('show');
      $(this).parents('.routing').find('.title span').text('');
    });
  }
};