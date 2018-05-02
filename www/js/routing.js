/*
 * ROUTING PAGES
 */
var routing = {
  level1: function (element) {
    $('.' + element).on('click', function () {
      if(me.isValidToken()) {
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
      me.removeHTML(id);
      me.removeEventHandlers(id);
      
      $(this).removeClass('show');
      $(this).removeAttr('id');
      $(this).prev().removeClass('hide');
      $(this).parents('.routing').find('.level1').removeClass('swipe');
      $(this).parents('.routing').find('.level2').removeClass('show');
      $(this).parents('.routing').find('.title span').text('');
    });
  }
};