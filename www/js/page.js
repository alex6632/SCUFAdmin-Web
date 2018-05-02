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
                console.log("Profile response : ", response);
                $('.profile-page__name').text(response.firstname + " " + response.lastname);
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
                var hoursToPlanify = response.hoursTodo - response.hoursPlanified;
                var percentageHoursTodo = (response.hoursDone / response.hoursTodo) * 100;
                var percentageHoursPlanified = (response.hoursPlanifiedByMe / hoursToPlanify) * 100;
                var coeff = localStorage.getItem('settingCOEFF');
                var repos = response.overtime / coeff;
                $('.profile-page__status').text(role);
                $('#jsHoursTodo .progress-bar__ratio').html('<span class="ratio-ok">' + response.hoursDone + '</span>/' + response.hoursTodo + '<span>H</span>');
                $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text(percentageHoursTodo + '%');
                $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodo + '%;');
                $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok">' + response.hoursPlanifiedByMe + '</span>/' + hoursToPlanify + '<span>H</span>');
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