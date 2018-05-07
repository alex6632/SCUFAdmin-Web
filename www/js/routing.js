var routing = {
  /**
   * LEVEL 1 ROUTING
   * - Planning
   * - Validations
   * - Actions
   * - Profil
   */
  level1: function (element, authTokenVALUE) {
    $('.' + element).on('click', function () {
      if (utils.isValidToken()) {
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
  /**
   * LEVEL 2 ROUTING
   * -- Demande de repos compensatoire
   * -- Demande de congés
   * -- Demande d'heures supplémentaires
   * -- Editer un planning
   * -- Droits
   * -- Réglages
   * -- Gestion des utilisateurs
   */
  level2: function (authTokenVALUE, userID) {
    $('.jsGoLevel2').on('click', function () {
      var element = $(this).attr('data-routing');
      var jsGoLevel1 = $(this).parents('.routing').find('.jsGoLevel1');
      switch (element) {
        case "addAccess":
          jsGoLevel1.attr('id', 'level2Access');
          crud.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access', authTokenVALUE);
          crud.ajaxAdd('jsFormAddAccess', 'access', authTokenVALUE);
          crud.ajaxRemove('.access-list', '.access-list #deleteAccess', 'access', authTokenVALUE);
          crud.ajaxEdit('.access-list', '.access-list #editAccess', 'access', authTokenVALUE);
          break;
        case "addSetting":
          jsGoLevel1.attr('id', 'level2Setting');
          crud.ajaxSimpleList('http://127.0.0.1:8000/settings', $('.setting-list'), 'setting', authTokenVALUE);
          crud.ajaxRemove('.setting-list', '.setting-list #deleteSetting', 'setting', authTokenVALUE);
          crud.ajaxEdit('.setting-list', '.setting-list #editSetting', 'setting', authTokenVALUE);
          break;
        case "addUser":
          jsGoLevel1.attr('id', 'level2User');
          crud.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user', authTokenVALUE);
          crud.ajaxAdd('jsFormAddUser', 'user', authTokenVALUE);
          crud.ajaxRemove('.user-list', '.user-list #deleteUser', 'user', authTokenVALUE);
          crud.ajaxEditUser(authTokenVALUE);
          break;
        case "rest":
          jsGoLevel1.attr('id', 'level2Rest');
          crud.ajaxSimpleList('http://127.0.0.1:8000/actions/rest/' + userID, $('.rest-list tbody'), 'rest', authTokenVALUE);
          crud.ajaxAddAction('rest', authTokenVALUE, userID);
          crud.ajaxRemove('.rest-list', '.rest-list #deleteRest', 'action', authTokenVALUE, 'rest');
          break;
        case "leave":
          jsGoLevel1.attr('id', 'level2Leave');
          crud.ajaxSimpleList('http://127.0.0.1:8000/actions/leave/' + userID, $('.leave-list tbody'), 'leave', authTokenVALUE);
          crud.ajaxAddAction('leave', authTokenVALUE, userID);
          crud.ajaxRemove('.leave-list', '.leave-list #deleteLeave', 'action', authTokenVALUE, 'leave');
          break;
        case "hours":
          jsGoLevel1.attr('id', 'level2Hours');
          page.getEmployees(authTokenVALUE, userID);
          crud.ajaxSimpleList('http://127.0.0.1:8000/actions/hours/' + userID, $('.hours-list tbody'), 'hours', authTokenVALUE);
          crud.ajaxAddAction('hours', authTokenVALUE, userID);
          crud.ajaxRemove('.hours-list', '.hours-list #deleteHours', 'action', authTokenVALUE, 'hours');
          break;
        case "edit":
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