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
        switch (response[0].role) {
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
        var restHours = Math.trunc((response[0].overtime * coeff) / 60);
        var restMinutes = (response[0].overtime * coeff) % 60;
        var rest = restHours == 0 ? restMinutes + '<span>MIN</span>' : restHours + '<span>H</span>' + restMinutes;
        if (response[0].access.length > 0) {
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

        $('#profile-firstname').text(response[0].firstname);
        $('#profile-lastname').text(response[0].lastname);
        $('#profile-username').text(response[0].username);
        $('#profile-role').text(role);
        $('#profile-superior').text(response[1]);
        $('#profile-access').text(listAccess);

        //$('.profile-page__status').text(role);
        $('#jsHoursTodo .progress-bar__ratio').html('<span class="ratio-ok">' + response[0].hoursDone + '</span>/' + response[0].hoursTodo + '<span>H</span>');
        $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text(percentageHoursTodo + '%');
        $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodo + '%;');
        $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok">' + response[0].hoursPlanifiedByMe + '</span>/' + hoursToPlanify + '<span>H</span>');
        $('#jsHoursPlanified .progress-bar__bar__text, #jsHoursPlanified .progress-bar__bar__wip span').text(percentageHoursPlanified + '%');
        $('#jsHoursPlanified .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursPlanified + '%;');
        $('.profile-page__info-hours__nb').html(rest);
      },
      error: function (response) {
        console.log(response);
        var error = response.responseJSON.code + " : " + response.responseJSON.message;
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    });
    $('#profile-update-password').on('click', function () {
      $(this).fadeOut();
      $('#profile-cancel-password').fadeIn();
      $(this).parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeIn();
    });
    $('#profile-cancel-password').on('click', function () {
      $(this).fadeOut();
      $('#profile-update-password').fadeIn();
      $(this).parents('.profile-page__edit__text--update-pwd').find('input').val('');
      $(this).parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeOut();
    })
    $('#jsUpdatePassword').on('click', function () {
      previousPassword = $('#previous_password').val();
      plainPassword = $('#new_password').val();
      confirmPassword = $('#confirm_new_password').val();

      if (previousPassword.length != "" && plainPassword.length != "" && confirmPassword.length != "") {
        var api = "http://127.0.0.1:8000/user/update/" + userID;
        var data = {
          previous_password: previousPassword,
          plain_password: plainPassword,
          confirm_password: confirmPassword
        };
        $.ajax({
          url: api,
          type: 'PATCH',
          data: data,
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
            //page.refreshProfile(authTokenVALUE, userID);
            $('#profile-cancel-password').fadeOut();
            $('#profile-update-password').fadeIn();
            $('#profile-cancel-password').parents('.profile-page__edit__text--update-pwd').find('input').val('');
            $('#profile-cancel-password').parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeOut();
          },
          error: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.responseJSON.message + '</div>');
          }
        })
      } else {
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">Tous les champs sont obligatoire !</div>');
      }
    });
  },

  refreshProfile: function (authTokenVALUE, userID) {
    $('.jsRefreshProfile').on('click', function () {
      // Reset all data
      $('#profile-firstname').text('');
      $('#profile-lastname').text('');
      $('#profile-username').text('');
      $('#profile-role').text('');
      $('#profile-superior').text('');
      $('#profile-access').text('');
      $('#jsHoursTodo .progress-bar__ratio').html('');
      $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text('%');
      $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: 0%;');
      $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok"></span>/<span>H</span>');
      $('#jsHoursPlanified .progress-bar__bar__text, #jsHoursPlanified .progress-bar__bar__wip span').text('%');
      $('#jsHoursPlanified .progress-bar__bar__wip').attr('style', 'width: 0%;');
      $('.profile-page__info-hours__nb').html('');

      // Re inject data
      page.profile(authTokenVALUE, userID);
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

  getEmployees: function (authTokenVALUE, userID, page) {
    var api = "http://127.0.0.1:8000/users/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        switch(page) {
          case "hours":
            for (var i = 0; i < response.length; i++) {
              $('#jsEmployeesList').append('<option value="' + response[i].id + '">' + response[i].firstname + ' ' + response[i].lastname + '</option>');
            }
            break;
          case "planning":
            for (var i = 0; i < response.length; i++) {
              $('.selectUserToEditPlanning').append('<option value="' + response[i].id + '">' + response[i].firstname + ' ' + response[i].lastname + '</option>');
            }
            break;
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  notifications: function (authTokenVALUE, userID) {
    var api = "http://127.0.0.1:8000/notifications/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log(response);
        $('.notification__wait').text(response.count + ' en attente de traitement');
        for (var i = 0; i < response.list.length; i++) {
          let li = '';
          let view = response.list[i].view == 0 ? "not-seen" : "";
          let statusClass = "";
          if (response.list[i].status != 2) {
            statusClass = response.list[i].status == 0 ? "notification__status--refused" : "notification__status--accepted";
          }
          switch (response.list[i].type) {
            case 'rest':
              li = '' +
                '<li class="notification__list__item ' + view + '">' +
                '<div class="notification__status ' + statusClass + '"></div>' +
                '<form>' +
                '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                '<div>Demande de repos compensatoire</div>' +
                '<div>Le ' + response.list[i].startDate + ' de ' + response.list[i].startHours + ' à ' + response.list[i].endHours + '</div>' +
                '<div class="notification__justification">' + response.list[i].justification + '</div>' +
                '<div class="options">' +
                '<div class="options__inner options__inner--approve jsApproveAction">' +
                '<span>Accepter</span>' +
                '</div>' +
                '<div class="options__inner options__inner--decline jsADeclineAction">' +
                '<span>Décliner</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</li>';
              break;
            case 'hours':
              li = '' +
                '<li class="notification__list__item ' + view + '">' +
                '<div class="notification__status ' + statusClass + '"></div>' +
                '<form>' +
                '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                '<input type="hidden" class="notification-justification" value="' + response.list[i].justification + '">' +
                '<input type="hidden" class="notification-location" value="' + response.list[i].location + '">' +
                '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                '<div>Demande d\'heures supplémentaires : ' + response.list[i].justification + '</div>' +
                '<div>Lieu : ' + response.list[i].location + '</div>' +
                '<div>Le ' + response.list[i].startDate + ' de ' + response.list[i].startHours + ' à ' + response.list[i].endHours + '</div>' +
                '<div class="notification__motivation">Acceptez ! <br> Les heures supplémentaires vous seront bientôt récompensées par un repos compensatoire !</div>' +
                '<div class="options">' +
                '<div class="options__inner options__inner--approve jsApproveAction">' +
                '<span>Accepter</span>' +
                '</div>' +
                '<div class="options__inner options__inner--decline jsADeclineAction">' +
                '<span>Décliner</span>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</li>';
              break;
            case 'leave':
              li = '' +
                '<li class="notification__list__item ' + view + '">' +
                '<div class="notification__status ' + statusClass + '"></div>' +
                '<form>' +
                '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                '<div>Demande de congés</div>' +
                '<div>Du ' + response.list[i].startDate + ' au ' + response.list[i].endDate + '</div>' +
                '<div class="notification__justification">' + response.list[i].justification + '</div>' +
                '<div class="options">' +
                '<div class="options__inner options__inner--approve jsApproveAction">' +
                '<span>Accepter</span>' +
                '</div>' +
                '<div class="options__inner options__inner--decline jsADeclineAction">' +
                '<span>Décliner</span>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</li>' +
                '';
              break;
          }
          $('.notification__list').append(li);
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  refreshNotifications: function (authTokenVALUE, userID) {
    var api = "http://127.0.0.1:8000/notifications/count/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        if (response[0].count > 0) {
          $('.jsNotifications').find('#push').html('<div class="push">' + response[0].count + '</div>');
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  /*
  * ------------------------------------
  * IF USER DECLINE A NOTIFICATION
  * ------------------------------------
  */
  declineNotification: function (authTokenVALUE, userID) {
    $('.notification__list').on('click', '.jsADeclineAction', function (e) {
      e.preventDefault();

      // 1. Add loader
      $('#jsNotifications').append('<div class="loader"><div class="loader__gif"></div></div>');

      let item = $(this).parents('.notification__list__item');
      let actionID = item.find('.notification-id').val();

      // 2. Update data into DB
      var api = "http://127.0.0.1:8000/action/update/" + actionID;
      $.ajax({
        url: api,
        type: 'PATCH',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          console.log(response);
          
          // 0. Refresh notifications
          utils.removeHTML('notifications');
          page.notifications(authTokenVALUE, userID);

          // 1. Remove loader
          $('#jsNotifications .loader').remove();

          // 2. Remove "not-seen" class to item
          item.removeClass('not-seen');

          // 3. Show success message on notification page
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');

          // 4. Remove handlers event
          $('.notification__list').off('click', '.jsApproveAction');
          $('.notification__list').off('click', '.jsADeclineAction');
        },
        error: function (err) {
          console.log(err);
        }
      });
    });
  },
};