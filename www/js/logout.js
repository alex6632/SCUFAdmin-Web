/*
* LOGOUT ACTION
*/
var logout = {
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
                login.loginPage();
            },
            error: function (response) {
            console.log(response);
            //var error = response.responseJSON.code + " : " + response.responseJSON.message;
            //$('.msg-flash .alert').remove();
            //$('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
            }
        });
        });
    }
};