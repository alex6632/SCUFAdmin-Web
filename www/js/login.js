/*
* LOGIN
*/
var login = {
  loginPage: function () {
    if (localStorage.getItem('authTokenID') === null) {
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
      anim.input('login-email');
      anim.input('login-pwd');

    } else {
      $('.loginTrigger .login').remove();
      $('.loginTrigger').addClass('hide');
      const authTokenVALUE = localStorage.getItem('authTokenVALUE');
      const userID = localStorage.getItem('userID');
      me.init();
    }
  },

  ajaxLogin: function () {
    $('.loginTrigger').on('submit', '.login__form', function (e) {
      e.preventDefault();
      $('#jsShowConnectForm').append('<div class="loader"><div class="loader__gif"></div></div>');
      var api = localStorage.getItem('ENV') + "/auth-tokens";
      $.ajax({
        url: api,
        data: $(this).serialize(),
        type: 'POST',
        success: function (response) {
          location.reload();
          $('#jsShowConnectForm .loader').remove();
          $('.msg-flash .alert').remove();
          localStorage.setItem('authTokenID', response.authToken.id);
          localStorage.setItem('authTokenVALUE', response.authToken.value);
          localStorage.setItem('userID', response.authToken.user.id);
          localStorage.setItem('ROLE', response.authToken.user.role);
          localStorage.setItem('authTokenCREATED', response.createdTime);
          localStorage.setItem('tokenValidityDuration', response.tokenValidityDuration);
          localStorage.setItem('hoursTodo', response.authToken.user.hoursTodo);

          login.loginPage();
        },
        error: function (response) {
          $('#jsShowConnectForm .loader').remove();
          console.log(response);
          var error = response.responseJSON.code + " : " + response.responseJSON.message;
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
        }
      });
    });
  },

  cleaLogin: function (authTokenVALUE, userID) {
    $('.loginTrigger .login').remove();
    $('.loginTrigger').addClass('hide');
    //location.reload();
    utils.reloadDefaultPageOnRefresh(authTokenVALUE, userID);
  }
};