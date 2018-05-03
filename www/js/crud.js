var crud = {
    /**
     * ADD AN ELEMENT
     */
    ajaxAdd: function (element, type, authTokenVALUE) {
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
                            if (response.type == 'success') {
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
                            } else {
                                console.log(response);
                                $('.msg-flash .alert').remove();
                                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
                            }
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
        $.ajax({
            url: api,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
                switch (type) {
                    case "access":
                        for (var i = 0; i < response.length; i++) {
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
                        for (var j = 0; j < response.length; j++) {
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
                                    '<div class="td">' + role +'</div>' +
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
            } else {
                value = $(this).parents('li').find('input').val();
                data = { value: value };
            }
            $.ajax({
                url: api,
                type: 'PATCH',
                data: data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
                },
                success: function (response) {
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
     * EDIT USER (SPECIFIC)
     */
    ajaxEditUser: function (authTokenVALUE) {
        $('.user-list').on('click', 'form .editEnabled', function () {
            $(this).parents('form').find('input').prop('disabled', false);
            $(this).parents('form').find('select').prop('disabled', false);
            $(this).addClass('hide');
            $(this).parents('form').find('.editCanceled').addClass('show');
            $(this).parents('form').find('.edit').addClass('show');
        });
        $('.user-list').on('click', 'form .editCanceled', function () {
            $(this).parents('form').find('input').prop('disabled', true);
            $(this).parents('form').find('select').prop('disabled', true);
            $(this).removeClass('show');
            $(this).parents('form').find('.edit').removeClass('show');
            $(this).parents('form').find('.editEnabled').removeClass('hide');
        });
        $('.user-list').on('click', 'form .edit', function () {
            var idStr = $(this).attr('id');
            var reg = /([0-9]+)/.exec(idStr);
            var id = RegExp.$1;
            var api = "http://127.0.0.1:8000/user/update/" + id;
            form = $(this).parents('form');

            $.ajax({
                url: api,
                type: 'PATCH',
                data: form.serialize(),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
                },
                success: function (response) {
                    if (response.type == 'success') {
                        utils.removeHTML("level2User");
                        $('.msg-flash .alert').remove();
                        $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                        crud.ajaxSimpleList('http://127.0.0.1:8000/users', $('.user-list tbody'), 'user', authTokenVALUE);
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
    ajaxRemove: function (click, element, type, authTokenVALUE) {
        $(click).on('click', '.delete', function () {
            if (confirm("Cette action sera irréversible.")) {
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
};