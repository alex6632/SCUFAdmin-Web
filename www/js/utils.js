var utils = {

    removeHTML: function (element) {
        $('.msg-flash .alert').remove();

        switch (element) {
            case "level2Access":
                $('.access-list li').remove();
                break;
            case "level2Setting":
                $('.setting-list li').remove();
                break;
            case "level2User":
                $('.action__list__item.list div').remove();
                $('.user-list tbody form').remove();
                break;
            case "level2Leave":
                $('.leave-list tbody form').remove();
                break;
            case "level2Rest":
                $('.rest-list tbody form').remove();
                break;
        }
    },

    removeEventHandlers: function (element) {
        switch (element) {
            case "level2Access":
                $('.jsFormAddAccess').off('submit');
                $('.access-list').off('click', '.delete');
                $('.access-list').off('click', 'form .editEnabled');
                $('.access-list').off('click', 'form .editCanceled');
                $('.access-list').off('click', 'form .edit');
                break;
            case "level2Setting":
                $('.setting-list').off('click', '.delete');
                $('.setting-list').off('click', 'form .editEnabled');
                $('.setting-list').off('click', 'form .editCanceled');
                $('.setting-list').off('click', 'form .edit');
                break;
            case "level2User":
                $('.jsFormAddUser').off('submit');
                $('.user-list').off('click', '.delete');
                $('.user-list').off('click', 'form .editEnabled');
                $('.user-list').off('click', 'form .editCanceled');
                $('.user-list').off('click', 'form .edit');
                break;
            case "level2Leave":
                $('.form-add-leave').off('submit');
                $('.leave-list').off('click', '.delete');
                break;
            case "level2Rest":
                $('.form-add-rest').off('submit');
                $('.rest-list').off('click', '.delete');
                break;
        }
    },

    emptyForm: function (type) {
        switch (type) {
            case "access":
                $('.jsFormAddAccess input:text').val('');
                break;
            case "user":
                $('.jsFormAddUser input:text').val('');
                $('.jsFormAddUser input:password').val('');
                $('.jsFormAddUser select').prop('selectedIndex', 0);
                $('.jsFormAddUser input:checkbox').removeAttr('checked');
                break;
            case "leave":
                $('.form-add-leave input:text').val('');
                $('.form-add-leave textarea').val('');
                break;
            case "rest":
                $('.form-add-rest input:text').val('');
                $('.form-add-rest textarea').val('');
                break;
            case "hours":
                $('.form-add-hours input:text').val('');
                $('.form-add-hours textarea').val('');
                break;
        }
    },

    loadActivePage: function (authTokenVALUE, userID) {
        var activePage = $('.tab-bar').find('.current').attr('data-routing');
        switch (activePage) {
            case "notification":
                
            break;
            case "planning":
                
            break;
            case "validation":

            break;
            case "actions":

            break;
            case "profile":
                page.getSetting('coeff', authTokenVALUE);
                page.profile(authTokenVALUE, userID);
                page.refreshProfile(authTokenVALUE, userID);
            break;
        }
    },

    isValidToken: function () {
        console.log('Check if token is valid....');

        var authTokenCREATED = localStorage.getItem('authTokenCREATED'),
            isConnected = false;

        if (authTokenCREATED !== null) {
            var date = Math.trunc(Date.now() / 1000),
                tokenValidityDuration = localStorage.getItem('tokenValidityDuration');

            if (date - authTokenCREATED < tokenValidityDuration) {
                console.log('....token OK :-)');
                isConnected = true;
            } else {
                console.log('....token expired, please login again :-)');
                localStorage.removeItem('authTokenID');
                localStorage.removeItem('authTokenVALUE');
                localStorage.removeItem('userID');
                localStorage.removeItem('authTokenCREATED');
                localStorage.removeItem('tokenValidityDuration');
                login.loginPage();
            }
        }
        return isConnected;
    },

    ajaxGet: function (element, type, authTokenVALUE) {
        var api = "http://127.0.0.1:8000/" + element;
        $.ajax({
            url: api,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
                //console.log(response);
                if (type == 'checked') {
                    //*****************
                    console.log(response);
                    utils.parseCheckAccess(response);
                    //****************
                } else {
                    for (var j = 0; j < response.length; j++) {
                        $('.action__list__item.list').append(
                            '<div>' +
                            '<input type="checkbox" name="access[]" value="' + response[j].id + '" id="' + response[j].slug + '"><label for="' + response[j].slug + '">' + response[j].title + '</label>' +
                            '</div>'
                        );
                    }
                }
            },
            error: function (response) {
                console.log(response);
            }
        });
    },

    parseCheckAccess: function (response) {
        console.log(response);
        var allListAccess = '';
        for (var i = 0; i < response.length; i++) {
            allListAccess += '' +
                '<div>' +
                '<input type="checkbox" name="access[]" value="' + response[i].id + '" id="' + response[i].slug + '"><label for="' + response[i].slug + '">' + response[i].title + '</label>' +
                '</div>';
        }
        console.log(allListAccess);
    },
    /**
     * SEARCH
     */
    ajaxSearchUser: function (element) {

        $('#searchForm').on('submit', function (e) {
            e.preventDefault();
        });

        $('#' + element).instantSearch({
            minQueryLength: 3,
            noItemsFoundMessage: 'Aucun utilisateur trouvé',
            previewDelay: 200
        });
        //lowercase, asciifolding

    },
    /**
     * CHECK FIELDS
     */
    checkActionFields: function (start, end, justification) {
        var error = false;
        var regex = new RegExp('[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}');

        if(!regex.test(start.val()) || !regex.test(end.val()) || justification.val() == '' ) { 
            error = true; 
        }

        if(!regex.test(start.val())) {
            start.next().text('Format incorrect.');
        } else {
            start.next().text('');
        }

        if(!regex.test(end.val())) {
            end.next().text('Format incorrect.');
        } else {
            end.next().text('');
        }

        if(justification.val() == '') {
            justification.next().text('La justification est obligatoire');
        } else {
            justification.next().text('');
        }
        return error;
    }
};