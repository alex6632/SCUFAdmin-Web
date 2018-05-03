var page = {

    profile: function (authTokenVALUE, userID) {
        var api = "http://127.0.0.1:8000/user/" + userID;
        $.ajax({
            url: api,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
                //console.log("Profile response : ", response);
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
                var hoursToPlanify = response[0].hoursTodo - response[0].hoursPlanified;
                var percentageHoursTodo = (response[0].hoursDone / response[0].hoursTodo) * 100;
                var percentageHoursPlanified = (response[0].hoursPlanifiedByMe / hoursToPlanify) * 100;
                var coeff = localStorage.getItem('settingCOEFF');
                var repos = response[0].overtime / coeff;
                if(response[0].access.length > 0) {
                    var listAccess = '';
                    for (var i = 0; i < response[0].access.length; i++) {
                        listAccess += '' +
                            '<div>' +
                            '<input type="checkbox" checked disabled>' +
                            '<label>' + response[0].access[i].title + '</label>' +
                            '</div>';
                    }
                } else {
                    listAccess = 'Aucun';
                }

                $('#profile-firstname').html(response[0].firstname);
                $('#profile-lastname').html(response[0].lastname);
                $('#profile-username').html(response[0].username);
                $('#profile-role').html(response[0].role);
                $('#profile-superior').html(response[1]);
                $('#profile-access').html(listAccess);

                $('.profile-page__status').text(role);
                $('#jsHoursTodo .progress-bar__ratio').html('<span class="ratio-ok">' + response[0].hoursDone + '</span>/' + response[0].hoursTodo + '<span>H</span>');
                $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text(percentageHoursTodo + '%');
                $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodo + '%;');
                $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok">' + response[0].hoursPlanifiedByMe + '</span>/' + hoursToPlanify + '<span>H</span>');
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

    getSetting: function (element, authTokenVALUE) {
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
};