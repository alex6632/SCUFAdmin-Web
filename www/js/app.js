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

      // DISCONNECT
      logout.ajaxLogout(authTokenVALUE, authTokenID);

      // ROUTING
      routing.level1('planning');
      routing.level1('validation');
      routing.level1('actions');
      routing.level1('profile');
      routing.level2();

      // SPECIAL PAGES
      anim.fadeInPage('jsNotifications');
      anim.fadeInPage('jsSearch');

      // PAGES
      page.profile(authTokenVALUE, userID);

      // OTHER EVENTS
      anim.swipe('notification__list__item');
      anim.switch('stop');
      anim.switch('ok');
      anim.switch('no');
      anim.switch('label--stop');
      anim.switch('label--ok');
      anim.switch('label--no');
      anim.progressBar();

      // SHOW ADD FORM
      anim.showForm('jsFormAddUser');

      // SEARCH USER - AUTOCOMPLETE -
      utils.ajaxSearchUser('jsSearchUser');
    }

  },

};

$(document).ready(function () {
  me.init();
});