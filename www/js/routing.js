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
                switch (element) {
                    case "planning":
                        
                    break;
                    case "validation":

                    break;
                    case "actions":

                    break;
                    case "profile":
                        var userID = localStorage.getItem('userID');
                        page.profile(authTokenVALUE, userID);
                    break;
                }
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
    level2: function (authTokenVALUE) {
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