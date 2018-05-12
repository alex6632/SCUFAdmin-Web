var me = {

    init: function () {

        // CONNECT
        login.loginPage();
        login.ajaxLogin();

        // CHECK IF TOKEN IS VALID ?
        var isConnected = utils.isValidToken();

        if (isConnected) {
            var authTokenID = localStorage.getItem('authTokenID'),
                authTokenVALUE = localStorage.getItem('authTokenVALUE'),
                userID = localStorage.getItem('userID');

            // CHECK IF THERE ARE NOTIFICATIONS
            page.refreshNotifications(authTokenVALUE, userID);

            // FIND ACTIVE PAGE
            utils.loadActivePage(authTokenVALUE, userID);

            // DISCONNECT
            logout.ajaxLogout(authTokenVALUE, authTokenID);

            // ROUTING
            routing.level1('planning', authTokenVALUE);
            routing.level1('validation', authTokenVALUE);
            routing.level1('actions', authTokenVALUE);
            routing.level1('profile', authTokenVALUE);
            routing.level2(authTokenVALUE, userID);

            // SPECIAL PAGES
            anim.fadeInPage('jsNotifications', authTokenVALUE, userID);
            anim.fadeInPage('jsSearch', authTokenVALUE, userID);

            // OTHER EVENTS
            //anim.swipe('notification__list');
            anim.swipeDesktop('notification__list');
            anim.switch('stop');
            anim.switch('ok');
            anim.switch('no');
            anim.switch('label--stop');
            anim.switch('label--ok');
            anim.switch('label--no');
            anim.progressBar();

            // SHOW ADD FORM
            anim.showForm('jsFormAddUser', authTokenVALUE);

            // SEARCH USER - AUTOCOMPLETE -
            utils.ajaxSearchUser('jsSearchUser');
        }

    },

};

$(document).ready(function () {
    me.init();
});