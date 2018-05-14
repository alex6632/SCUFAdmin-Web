var crud = {
  /**
   * ADD AN ELEMENT
   */
  ajaxAdd: function (element, type, authTokenVALUE) {
    $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
    $('.' + element).on('submit', function (e) {
      e.preventDefault();
      $('form.' + element + ' button').prop("disabled", true);
      var api = "http://127.0.0.1:8000/" + type + "/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          switch (type) {
            case 'access':
              if (response.type == 'success') {
                utils.removeHTML("level2Access");
                $('form.' + element + ' button').prop("disabled", true);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList('http://127.0.0.1:8000/access', $('.access-list'), 'access', authTokenVALUE);
                utils.emptyForm('access');
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case 'user':
              utils.removeHTML("level2User");
              $('form.' + element + ' button').prop("disabled", true);
              $('.msg-flash .alert').remove();
              $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
              crud.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user', authTokenVALUE);
              utils.emptyForm('user');
              // Close form
              $('#jsCloseFormAddUser').removeClass('show');
              $('#jsFormAddUser').removeClass('hide');
              $('.jsFormAddUser').slideUp();
              $('.action__list__item.list div').detach();
              break;
            case 'section':
              utils.removeHTML("level2Section");
              $('.msg-flash .alert').remove();
              $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
              crud.ajaxSimpleList('http://127.0.0.1:8000/sections', $('.section-list'), 'section', authTokenVALUE);
              utils.emptyForm('section');
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'ajout</div>');
        }
      })
    });
  },

  /**
   * SHOW SIMPLE LIST
   */
  ajaxSimpleList: function (api, element, type, authTokenVALUE) {
    $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        $('#actions .loader').remove();
        switch (type) {
          case "access":
            for (let i = 0; i < response.length; i++) {
              $(element).append(
                '<li>' +
                '<input type="text" name="title" value="' + response[i].title + '" disabled>' +
                '<span class="link editEnabled">Editer</span>' +
                '<span class="link edit" id="editAccess' + response[i].id + '">Valider</span>' +
                '<span class="link editCanceled">Annuler</span>' +
                '<span class="link delete" id="deleteAccess' + response[i].id + '">Supprimer</span>' +
                '</li>'
              );
            }
            break;
          case "setting":
            for (let j = 0; j < response.length; j++) {
              $(element).append(
                '<li>' +
                '<span class="">' + response[j].title + '</span> : <input type="text" name="value" value="' + response[j].value + '" disabled>' +
                '<span class="link editEnabled">Editer</span>' +
                '<span class="link edit" id="editSetting' + response[j].id + '">Valider</span>' +
                '<span class="link editCanceled">Annuler</span>' +
                '<span class="link delete" id="deleteSetting' + response[j].id + '">Supprimer</span>' +
                '</li>'
              );
            }
            break;
          case "section":
            if (response.success) {
              for (let j = 0; j < response.list.length; j++) {
                $(element).append(
                  '<li>' +
                  '<input type="text" name="name" value="' + response.list[j].name + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSection' + response.list[j].id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSection' + response.list[j].id + '">Supprimer</span>' +
                  '</li>'
                );
              }
            } else {
              $('.no-result').text('');
              $('.section-list').next().append(response.message);
            }
            break;
          case "week":
            if (response.success) {
              console.log(response);
              $('.no-result').text('');
              let action = "";
              for (let i = 0; i < response.list.length; i++) {
                let types = '<select name="setting" disabled>';
                for(let j = 0; j < response.types.length; j++) {
                  let selected = response.list[i].setting.slug == response.types[j].slug ? "selected" : "";
                  types += '<option value="' + response.types[j].id + '" ' + selected + '>' + response.types[j].title + ' (' + response.types[j].value + 'h)</option>'
                }
                types += '</select>';

                action = '' +
                  '<span class="link-table editEnabled">Editer</span>' +
                  '<span class="link-table edit" id="editWeek' + response.list[i].id + '">Valider</span>' +
                  '<span class="link-table editCanceled">Annuler</span>' +
                  '<span class="link-table delete" id="deleteWeek' + response.list[i].id + '">Supprimer</span>';
                
                $(element).append(
                  '<form action="" id="formWeek' + response.list[i].id + '" class="tr">' +
                  '<div class="td">' + response.list[i].number + '</div>' +
                  '<div class="td">' + types + '</div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('.no-result').text('');
              $('.week-list').next().append(response.message);
            }
            break;
          case "user":
            for (var i = 0; i < response.length; i++) {
              var superior = "",
                role = '',
                access = [];
              if (response[i].superior !== null) {
                superior = response[i].superior.id;
              } else {
                superior = "Aucun";
              }
              switch (response[i].role) {
                case 1:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1" selected>Salarié</option>' +
                    '</select>';
                  break;
                case 2:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2" selected>Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                case 3:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4">Administrateur</option>' +
                    '<option value="3" selected>Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                case 4:
                  role = '' +
                    '<select name="role" disabled>' +
                    '<option value="4" selected>Administrateur</option>' +
                    '<option value="3">Superviseur</option>' +
                    '<option value="2">Manager</option>' +
                    '<option value="1">Salarié</option>' +
                    '</select>';
                  break;
                default:
                  role = "Aucun";
              }
              //console.log('access 2 ', Access); 
              if (response[i].access.length > 0) {
                var listAccess = '';
                for (var j = 0; j < response[i].access.length; j++) {

                  listAccess += '' +
                    '<div>' +
                    '<input type="checkbox" name="access[]" value="' + response[i].access[j].id + '" id="' + response[i].access[j].slug + '" checked disabled>' +
                    '<label for="' + response[i].access[j].slug + '">' + response[i].access[j].title + '</label>' +
                    '</div>';
                }
              } else {
                listAccess = "Aucun"
              }
              $(element).append(
                '<form action="" id="formUser' + response[i].id + '" class="tr">' +
                '<div class="td">' + response[i].id + '</div>' +
                '<div class="td"><input type="text" name="firstname" value="' + response[i].firstname + '" disabled></div>' +
                '<div class="td"><input type="text" name="lastname" value="' + response[i].lastname + '" disabled></div>' +
                '<div class="td"><input type="text" name="username" value="' + response[i].username + '" disabled></div>' +
                '<div class="td">' + role + '</div>' +
                '<div class="td"><input type="text" name="superior" value="' + superior + '" disabled></div>' +
                '<div class="td user-access-list">' + listAccess + '</div>' +
                '<div class="td"><input type="text" name="hours_todo" value="' + response[i].hoursTodo + '" disabled></div>' +
                '<div class="td">' +
                '<span class="link-table editEnabled">Editer</span>' +
                '<span class="link-table edit" id="editUser' + response[i].id + '">Valider</span>' +
                '<span class="link-table editCanceled">Annuler</span>' +
                '<span class="link-table delete" id="deleteUser' + response[i].id + '">Supprimer</span>' +
                '</div>' +
                '</form>'
              );
            }
            break;
          case "leave":
            if (response.success) {
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    '<span class="link-table editEnabled">Editer</span>' +
                    '<span class="link-table edit" id="editLeave' + response.list[i].id + '">Valider</span>' +
                    '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteLeave' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formLeave' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startDate + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endDate + '" disabled></div>' +
                  '<div class="td td--justification"><teaxtarea name="justification" disabled>' + response.list[i].justification + '</textarea></div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('.leave-list').next().append(response.message);
            }
            break;
          case "rest":
            if (response.success) {
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    '<span class="link-table editEnabled">Editer</span>' +
                    '<span class="link-table edit" id="editRest' + response.list[i].id + '">Valider</span>' +
                    '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteRest' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formRest' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td">' + response.list[i].startDate + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startHours + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endHours + '" disabled></div>' +
                  '<div class="td td--justification"><teaxtarea name="justification" disabled>' + response.list[i].justification + '</textarea></div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('.rest-list').next().append(response.message);
            }
            break;
          case "hours":
            if (response.success) {
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    '<span class="link-table editEnabled">Editer</span>' +
                    '<span class="link-table edit" id="editHours' + response.list[i].id + '">Valider</span>' +
                    '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteHours' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formHours' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td">' + response.list[i].startDate + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startHours + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endHours + '" disabled></div>' +
                  '<div class="td">' + response.list[i].recipientFirstName + ' ' + response.list[i].recipientLastName + '</div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('.no-result').text('');
              $('.hours-list').next().append(response.message);
            }
            break;
        }
      },
      error: function (response) {
        $('.msg-flash .alert').remove();
        var error = response.responseJSON.code !== "" ? response.responseJSON.code + " : " + response.responseJSON.message : response.message;
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    })
  },
  /**
   * EDIT AN ELEMENT
   */
  ajaxEdit: function (click, element, type, authTokenVALUE) {
    $(click).on('click', 'li .editEnabled', function () {
      $(this).parents('li').find('input').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('li').find('.editCanceled').addClass('show');
      $(this).parents('li').find('.edit').addClass('show');
    });
    $(click).on('click', 'li .editCanceled', function () {
      $(this).parents('li').find('input').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('li').find('.edit').removeClass('show');
      $(this).parents('li').find('.editEnabled').removeClass('hide');
    });
    $(click).on('click', 'li .edit', function () {
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = "http://127.0.0.1:8000/" + type + "/update/" + id;
      var value = '';
      var data = {};
      if (type == 'access') {
        value = $(this).parents('li').find('input').val();
        data = { title: value };
        console.log(value);
      } else if (type == 'setting') {
        value = $(this).parents('li').find('input').val();
        data = { value: value };
      } else {
        value = $(this).parents('li').find('input').val();
        data = { name: value };
      }
      $.ajax({
        url: api,
        type: 'PATCH',
        data: data,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          switch (type) {
            case "access":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<input type="text" name="title" value="' + response.title + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editAccess' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteAccess' + response.id + '">Supprimer</span>'
                );
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case "setting":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<span>' + response.title + '</span> : <input type="text" name="value" value="' + response.value + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSetting' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSetting' + response.id + '">Supprimer</span>'
                );
              }
              break;
            case "section":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.section.id).parents('li').html(
                  '<input type="text" name="value" value="' + response.section.name + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSection' + response.section.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSection' + response.section.id + '">Supprimer</span>'
                );
              }
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  /**
   * EDIT USER & WEEK (SPECIFIC)
   */
  ajaxEditForm: function (element, type, authTokenVALUE) {
    $(element).on('click', 'form .editEnabled', function () {
      $(this).parents('form').find('input').prop('disabled', false);
      $(this).parents('form').find('select').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('form').find('.editCanceled').addClass('show');
      $(this).parents('form').find('.edit').addClass('show');
    });
    $(element).on('click', 'form .editCanceled', function () {
      $(this).parents('form').find('input').prop('disabled', true);
      $(this).parents('form').find('select').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('form').find('.edit').removeClass('show');
      $(this).parents('form').find('.editEnabled').removeClass('hide');
    });
    $(element).on('click', 'form .edit', function () {
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = "http://127.0.0.1:8000/" + type + "/update/" + id;
      form = $(this).parents('form');
      console.log(form);
      $.ajax({
        url: api,
        type: 'PATCH',
        data: form.serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          if (response.type == 'success') {
            switch(type) {
              case "user":
                utils.removeHTML("level2User");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user', authTokenVALUE);
                break;
              case "week":
                utils.removeHTML("level2Week");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                const selectUserID = $('.jsUsersList').val();
                crud.ajaxSimpleList('http://127.0.0.1:8000/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
                break;
            }
          } else {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
          }
        },
        error: function (response) {
          console.log(response);
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  /**
   * REMOVE AN ELEMENT
   */
  ajaxRemove: function (click, element, type, authTokenVALUE, actionType = "") {
    $(click).on('click', '.delete', function () {
      if (confirm("Cette action sera irréversible.")) {
        $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
        var idStr = $(this).attr('id');
        var reg = /([0-9]+)/.exec(idStr);
        var id = RegExp.$1;
        var api = "http://127.0.0.1:8000/" + type + "/delete/" + id;
        $.ajax({
          url: api,
          type: 'DELETE',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('#actions .loader').remove();
            if (actionType != "") {
              switch (actionType) {
                case "leave":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formLeave' + response.id).remove();
                  break;
                case "rest":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formRest' + response.id).remove();
                  break;
                case "hours":
                  break;
              }
            } else {
              switch (type) {
                case "access":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "setting":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "user":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parents('#formUser' + response.id).remove();
                  }
                  break;
                case "action":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formLeave' + response.id).remove();
                  break;
                case "section":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "week":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parents('#formWeek' + response.id).remove();
                  }
                  break;
              }
            }
          },
          error: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de la suppression</div>');
          }
        })
      }
    });
  },
  /**
   * ADD AN ACTION
   */
  ajaxAddAction: function (type, authTokenVALUE, userID) {
    $('.form-add-' + type).on('submit', function (e) {
      e.preventDefault();

      let error = false;
      let start = "";
      let end = "";
      let errorJustification = false;
      let justification = $(this).find('.justification');
      let location = $(this).find('.location');
      let hours = false;
      let errorText = false;

      if (type == 'hours') {
        hours = true;
        let tab = [justification, location];
        let errortab = utils.checkText(tab);
        errorText = errortab.includes(true) ? true : false;
      }
      if (type == 'rest' || type == 'hours') {
        let actionDay = $(this).find('.actionDay');
        let errorDay = utils.checkDate(actionDay);
        let startAction = $(this).find('.startAction');
        let endAction = $(this).find('.endAction');
        let errorHours = utils.checkHours(startAction, endAction);

        start = $(this).find('.start').val(actionDay.val() + ' ' + startAction.val());
        end = $(this).find('.end').val(actionDay.val() + ' ' + endAction.val());

        if (!hours) {
          // 'Rest' case
          errorJustification = utils.checkJustification(justification);
          if (errorDay || errorHours || errorJustification) {
            error = true;
          }
        } else {
          // 'Hours' case
          if (errorDay || errorHours || errorText) {
            error = true;
          }
        }
      } else {
        // 'Leave' case
        let startAction = $(this).find('.startAction');
        let endAction = $(this).find('.endAction');
        let errorDates = utils.checkDate(startAction, endAction);
        errorJustification = utils.checkJustification(justification);

        start = $(this).find('.start').val(startAction.val() + ' 08:00');
        end = $(this).find('.end').val(endAction.val() + ' 18:00');

        if (errorJustification || errorDates) {
          error = true;
        }
      }

      if (!error) {
        $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
        const api = "http://127.0.0.1:8000/action/create/" + type + "/" + userID;
        $.ajax({
          url: api,
          type: 'POST',
          data: $(this).serialize(),
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('#actions .loader').remove();
            switch (type) {
              case "leave":
                utils.removeHTML("level2Leave");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList('http://127.0.0.1:8000/actions/leave/' + userID, $('.leave-list tbody'), 'leave', authTokenVALUE);
                utils.emptyForm('leave');
                break;
              case "rest":
                utils.removeHTML("level2Rest");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList('http://127.0.0.1:8000/actions/rest/' + userID, $('.rest-list tbody'), 'rest', authTokenVALUE);
                utils.emptyForm('rest');
                break;
              case "hours":
                utils.removeHTML("level2Hours");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList('http://127.0.0.1:8000/actions/hours/' + userID, $('.hours-list tbody'), 'hours', authTokenVALUE);
                utils.emptyForm('hours');
                break;
            }
          },
          error: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.responseJSON.message + '</div>');
          }
        })
      }
    });
  },
  /**
   * ADD A WEEK
   */
  ajaxAddWeek: function (authTokenVALUE) {
    $('.jsFormAddWeek').on('submit', function (e) {
      e.preventDefault();
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      const api = "http://127.0.0.1:8000/week/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          console.log(response);
          utils.removeHTML("level2Week");
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
          const selectUserID = $('.jsUsersList').val();
          crud.ajaxSimpleList('http://127.0.0.1:8000/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
          utils.emptyForm('hours');
        },
        error: function (err) {
          console.log(err);
        }
      })
    });
  }
};