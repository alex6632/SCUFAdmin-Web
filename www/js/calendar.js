calendar = {
  /**
   * --------------------------------------
   * INIT FullCalendar
   * --------------------------------------
   * Doc : https://fullcalendar.io/docs/
   * --------------------------------------
   */
  init: function (authTokenVALUE, userID, calendarID, ROLE) {

    const el = $('#' + calendarID);

    let selectable = true;
    let editable = false;

    if(calendarID == 'calendar-edit') {
      userID = 'default';
      const sessionID = localStorage.getItem('userID');
      let su = ROLE === '42' ? true : false;
      userID = $('.selectUserToEditPlanning').val();
      const selectedID = userID;
      page.getEmployees(authTokenVALUE, sessionID, 'planning', su, selectedID);

      selectable = true;
      editable = true;

      $('.selectUserToEditPlanning').on('change', function () {
        const _ = $(this);
        userID = _.val();
        let fullName = _.find(':selected').data('name');
        $('#userPlanning').text('Vous êtes sur le planning de ' + fullName);

        // Remove handlers
        $('.selectUserToEditPlanning').off('change');
        $('.calendar-navigation-prev').off('click');
        $('.calendar-navigation-next').off('click');

        console.log('Switch to calendar : ' + userID);
        
        // Destroy and refresh calendar
        el.fullCalendar('destroy');
        calendar.init(authTokenVALUE, userID, 'calendar-edit', ROLE);
      });

    } else {
      userID = localStorage.getItem('userID');
      selectable = true;
      editable = false;
    }

    if (calendarID === 'calendar' || (calendarID === 'calendar-edit' && userID !== null && userID !== 'default') ) {
      
      // The first time, show GIF during loading
      el.parents('.routing').append('<div class="loader"><div class="loader__gif"></div></div>');

      el.fullCalendar({
        defaultView: 'agendaWeek', // 'basicDay'
        weekends: false,
        selectable: selectable,
        editable: editable,
        //lazyFetching: false,
        nowIndicator: true,
        slotDuration: '00:15:00',
        minTime: '08:00:00',
        maxTime: '23:00:00',
        forceEventDuration: true,
        defaultTimedEventDuration: '00:00:00',
        //defaultAllDayEventDuration: '00:00:00',
        header: {
          left: 'title', //day,basicDay week,basicWeek myCustomButton
          center: '',
          right: '' //today prev next
        },
        views: {
          week: {},
          day: {}
        },
        /*
         * -------------------
         * SHOW CUSTOM HEADER
         * -------------------
         */
        viewRender: function (view) {
          if (view.type == 'agendaWeek') {
            window.setTimeout(function () {
              el.find('.fc-toolbar > div > h2').empty().append(
                "<div>" + view.start.format('[Semaine du<span>] D [</span>au<span>]') + "" + view.end.format(' D [</span>] MMMM YYYY') + "</div>"
              );
            }, 0);
          } else {
            window.setTimeout(function () {
              el.find('.fc-toolbar > div > h2').empty().append(
                "<div>" + view.start.format('[Journée du<span>] D MMMM YYYY[</span>]') + "</div>"
              );
            }, 0);
          }
        },
        /*
         * -------------------
         * RENDER EVENTS
         * -------------------
         */
        events: function (start, end, timezone, callback) {
          const api = localStorage.getItem('ENV') + "/events/" + userID;
          $.ajax({
            url: api,
            type: 'GET',
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
              console.log('Calendar loaded successfully for user [' + userID + ']');
              $('#planning .loader, #actions .loader').remove();
              callback(response);
            },
            error: function (err) {
              $('#planning .loader, #actions .loader').remove();
              console.log(err);
            }
          });
        },
        eventRender: function(event, element) {
          element.find('.fc-title').append(', <span class="event-location">' + event.location + '</span>');
        },
        /*
         * -------------------
         * RESIZE EVENT
         * -------------------
         */
        eventResize: function (event) {
  
          let updatedStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
          let updatedEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss');
  
          // 1. Add loader
          $('#calendar, #calendar-edit').append('<div class="loader"><div class="loader__gif"></div></div>');
  
          // 2. Update calendar data
          event.start = updatedStart;
          event.end = updatedEnd;
  
          // 3. Save data into DB
          var api = localStorage.getItem('ENV') + "/event/update/" + event.id;
          $.ajax({
            url: api,
            type: 'PATCH',
            data: {
              start: updatedStart,
              end: updatedEnd,
              type: 'basic_ext',
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
              console.log(response);
  
              // 1. Remove loader
              $('#calendar .loader, #calendar-edit .loader').remove();
  
              // 2. Render update event on calendar
              el.fullCalendar('updateEvent', event);
              el.fullCalendar('refetchEvents');
            },
            error: function (err) {
              $('#calendar .loader, #calendar-edit .loader').remove();
              console.log(err);
            }
          });
        },
        /*
         * ----------------------
         * DRAG & DROP EVENT
         * ----------------------
         */
        eventDrop: function (event) {
  
          let updatedStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
          let updatedEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss');
  
          // 1. Add loader
          $('#calendar, #calendar-edit').append('<div class="loader"><div class="loader__gif"></div></div>');
  
          // 2. Update calendar data
          event.start = updatedStart
          event.end = updatedEnd;
  
          // 3. Save data into DB
          var api = localStorage.getItem('ENV') + "/event/update/" + event.id;
          $.ajax({
            url: api,
            type: 'PATCH',
            data: {
              start: updatedStart,
              end: updatedEnd,
              type: 'basic_ext',
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
            },
            success: function (response) {
              console.log(response);
  
              // 1. Remove loader
              $('#calendar .loader, #calendar-edit .loader').remove();
  
              // 2. Render update event on calendar
              el.fullCalendar('updateEvent', event);
              el.fullCalendar('refetchEvents');
            },
            error: function (err) {
              $('#calendar .loader, #calendar-edit .loader').remove();
              console.log(err);
            }
          });
        },
        /*
         * ----------------------
         * UPDATE / DELETE EVENT
         * ----------------------
         */
        eventClick: function (event, element) {
          console.log(event);
  
          if(calendarID == 'calendar') {
            return false;
          }
  
          let redBgChecked = event.backgroundColor == "#ff0000" ? "checked" : "";
          let greenBgChecked = event.backgroundColor == "#7ec730" ? "checked" : "";
          let orangeBgChecked = event.backgroundColor == "#f5882f" ? "checked" : "";
          let blueBgChecked = event.backgroundColor == "#2f67f5" ? "checked" : "";
          let darkBgChecked = event.backgroundColor == "#1e1e1e" ? "checked" : "";
  
          let redBorderChecked = event.borderColor == "#ff0000" ? "checked" : "";
          let greenBorderChecked = event.borderColor == "#7ec730" ? "checked" : "";
          let orangeBorderChecked = event.borderColor == "#f5882f" ? "checked" : "";
          let blueBorderChecked = event.borderColor == "#2f67f5" ? "checked" : "";
          let darkBorderChecked = event.borderColor == "#1e1e1e" ? "checked" : "";
  
          let whoiam = calendarID == "calendar" ? "basic_me" : "basic_ext";
  
          let editModale = '' +
            '<form class="calendar-modale" id="jsUpdateEventForm">' +
            '<div class="calendar-modale__inner">' +
            '<div class="calendar-modale__title">Modifier un événement</div>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="hidden" name="start" value="' + moment(event.start).format('YYYY-MM-DD HH:mm:ss') + '">' +
            '<input type="hidden" name="end" value="' + moment(event.end).format('YYYY-MM-DD HH:mm:ss') + '">' +
            '<input type="hidden" name="type" value="' + whoiam + '">' +
            '<input type="text" name="title" class="calendar-modale__input" id="jsCalendarAddTitle" placeholder="Titre" value="' + event.title + '">' +
            '<input type="text" name="location" class="calendar-modale__input" id="jsCalendarAddLocation" placeholder="Lieu" value="' + event.location + '">' +
            '</div>' +
            '<span>Couleur de l\'arrière plan</span>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="radio" class="radio" id="bg-red" name="background_color" value="#ff0000" ' + redBgChecked + '>' +
            '<label for="bg-red"></label>' +
            '<input type="radio" class="radio" id="bg-green" name="background_color" value="#7ec730" ' + greenBgChecked + '>' +
            '<label for="bg-green"></label>' +
            '<input type="radio" class="radio" id="bg-orange" name="background_color" value="#f5882f" ' + orangeBgChecked + '>' +
            '<label for="bg-orange"></label>' +
            '<input type="radio" class="radio" id="bg-blue" name="background_color" value="#2f67f5" ' + blueBgChecked + '>' +
            '<label for="bg-blue"></label>' +
            '<input type="radio" class="radio" id="bg-dark" name="background_color" value="#1e1e1e" ' + darkBgChecked + '>' +
            '<label for="bg-dark"></label>' +
            '</div>' +
            '<span>Couleur de la bordure</span>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="radio" class="radio" id="border-red" name="border_color" value="#ff0000" ' + redBorderChecked + '>' +
            '<label for="border-red"></label>' +
            '<input type="radio" class="radio" id="border-green" name="border_color" value="#7ec730" ' + greenBorderChecked + '>' +
            '<label for="border-green"></label>' +
            '<input type="radio" class="radio" id="border-orange" name="border_color" value="#f5882f" ' + orangeBorderChecked + '>' +
            '<label for="border-orange"></label>' +
            '<input type="radio" class="radio" id="border-blue" name="border_color" value="#2f67f5" ' + blueBorderChecked + '>' +
            '<label for="border-blue"></label>' +
            '<input type="radio" class="radio" id="border-dark" name="border_color" value="#1e1e1e" ' + darkBorderChecked + '>' +
            '<label for="border-dark"></label>' +
            '</div>' +
            '<div>' +
            '<button type="submit" class="calendar-modale__button calendar-modale__button--confirm jsConfirmEditEvent">Confirmer</button>' +
            '<button class="calendar-modale__button calendar-modale__button--cancel jsCloseModalCalendar">Annuler</button>' +
            '<button class="calendar-modale__button calendar-modale__button--delete jsConfirmDeleteEvent">Supprimer</button>' +
            '</div>' +
            '<div class="calendar-modale-error"></div>' +
            '</div>' +
            '</form>';
  
          el.parents('.generic-planning').find('.calendar-edit').append(editModale);
          
          /* 
           * ----------------------
           * DELETE EVENT
           * ----------------------
           */
          el.parents('.generic-planning').on('click', '.jsConfirmDeleteEvent', function () {
            if (confirm("Cette action sera irréversible.")) {
              // 1. Add loader
              $('#calendar, #calendar-edit').append('<div class="loader"><div class="loader__gif"></div></div>');
  
              // 2. Remove modale
              $(this).parents('.calendar-modale').remove();
  
              // 3. Delete data into DB
              var api = localStorage.getItem('ENV') + "/event/delete/" + event.id;
              $.ajax({
                url: api,
                type: 'DELETE',
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
                },
                success: function (response) {
                  console.log(response);
  
                  // 1. Remove loader
                  $('#calendar .loader, #calendar-edit .loader').remove();
  
                  // 2. Delete event on calendar
                  el.fullCalendar('removeEvents', event._id);
  
                  // 3. Remove handlers event
                  el.fullCalendar('unselect');
                  el.parents('.generic-planning').off('click', '.jsConfirmEditEvent');
                  el.parents('.generic-planning').off('click', '.jsConfirmDeleteEvent');
                },
                error: function (err) {
                  $('#calendar .loader, #calendar-edit .loader').remove();
                  console.log(err);
                }
              });
            }
          });
  
          /*
           * ----------------------
           * UPDATE EVENT
           * ----------------------
           */
          el.parents('.generic-planning').on('click', '.jsConfirmEditEvent', function (e) {
            e.preventDefault();
            eventTitle = $(this).parents('.calendar-modale').find('#jsCalendarAddTitle').val();
            eventLocation = $(this).parents('.calendar-modale').find('#jsCalendarAddLocation').val();
  
            let error = eventTitle.length == "" || eventLocation.length == "" ? true : false;
            if (error) {
              $(this).parents('.calendar-modale').find('.calendar-modale-error').text('Les champs "titre" et "lieu" sont obligatoire.');
            }
  
            if (!error) {
              // 1. Add loader
              $('#calendar, #calendar-edit').append('<div class="loader"><div class="loader__gif"></div></div>');
  
              // 2. Remove errors
              $(this).parents('.calendar-modale').find('.calendar-modale-error').text('');
  
              // 3. Update calendar data
              const edit = $(this).parents('.calendar-edit');
              event.title = edit.find('#jsCalendarAddTitle').val();
              event.location = edit.find('#jsCalendarAddLocation').val();
              event.backgroundColor = edit.find('input[name=background_color]:checked').val();
              event.borderColor = edit.find('input[name=border_color]:checked').val();
  
              // 4. Remove modale
              $(this).parents('.calendar-modale').remove();
  
              // 5. Save data into DB
              var api = localStorage.getItem('ENV') + "/event/update/" + event.id;
              $.ajax({
                url: api,
                type: 'PATCH',
                data: $(this).parents('#jsUpdateEventForm').serialize(),
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
                },
                success: function (response) {
                  console.log(response);
  
                  // 1. Remove loader
                  $('#calendar .loader, #calendar-edit .loader').remove();
  
                  // 2. Render update event on calendar
                  el.fullCalendar('updateEvent', event);
  
                  // 3. Remove handlers event
                  el.fullCalendar('unselect');
                  el.parents('.generic-planning').off('click', '.jsConfirmEditEvent');
                  el.parents('.generic-planning').off('click', '.jsConfirmDeleteEvent');
                },
                error: function (err) {
                  $('#calendar .loader, #calendar-edit .loader').remove();
                  console.log(err);
                }
              });
            }
          });
        },
        /*
         * -------------------
         * ADD EVENT
         * -------------------
         */
        select: function (start, end) {
  
          console.log("start : ",start)
          console.log("end : ",end)

          /*
           * ----------
           * LEGEND ---
           * ----------
           * basic_me = event created by user himself
           * basic_ext = event created by superior of user
           */
          let whoiam = calendarID == "calendar" ? "basic_me" : "basic_ext";
          let isAllDay = !start.hasTime();
          let allDayChecked = isAllDay ? "checked" : "";
          let addModale = '' +
            '<form class="calendar-modale" id="jsAddEventForm">' +
            '<div class="calendar-modale__inner">' +
            '<div class="calendar-modale__title">Ajouter un événement</div>' +
            '<div class="calendar-modale__input-container">' +
            '<div class="calendar-modale__info">Attention, l\'événement ne pourra pas être modifié.</div>' +
            '<input type="checkbox" name="all_day" value="" ' + allDayChecked + ' style="visibility: hidden;">' +
            '<input type="hidden" name="start" value="' + moment(start).format('YYYY-MM-DD HH:mm:ss') + '">' +
            '<input type="hidden" name="end" value="' + moment(end).format('YYYY-MM-DD HH:mm:ss') + '">' +
            '<input type="hidden" name="type" value="' + whoiam + '">' +
            '<input type="text" name="title" class="calendar-modale__input" id="jsCalendarAddTitle" placeholder="Titre">' +
            '<input type="text" name="location" class="calendar-modale__input" id="jsCalendarAddLocation" placeholder="Lieu">' +
            '</div>' +
            '<span>Couleur de l\'arrière plan</span>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="radio" class="radio" id="bg-red" name="background_color" value="#ff0000">' +
            '<label for="bg-red"></label>' +
            '<input type="radio" class="radio" id="bg-green" name="background_color" value="#7ec730">' +
            '<label for="bg-green"></label>' +
            '<input type="radio" class="radio" id="bg-orange" name="background_color" value="#f5882f">' +
            '<label for="bg-orange"></label>' +
            '<input type="radio" class="radio" id="bg-blue" name="background_color" value="#2f67f5">' +
            '<label for="bg-blue"></label>' +
            '<input type="radio" class="radio" id="bg-dark" name="background_color" value="#1e1e1e" checked>' +
            '<label for="bg-dark"></label>' +
            '</div>' +
            '<span>Couleur de la bordure</span>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="radio" class="radio" id="border-red" name="border_color" value="#ff0000">' +
            '<label for="border-red"></label>' +
            '<input type="radio" class="radio" id="border-green" name="border_color" value="#7ec730">' +
            '<label for="border-green"></label>' +
            '<input type="radio" class="radio" id="border-orange" name="border_color" value="#f5882f">' +
            '<label for="border-orange"></label>' +
            '<input type="radio" class="radio" id="border-blue" name="border_color" value="#2f67f5">' +
            '<label for="border-blue"></label>' +
            '<input type="radio" class="radio" id="border-dark" name="border_color" value="#1e1e1e" checked>' +
            '<label for="border-dark"></label>' +
            '</div>' +
            '<div class="repeat-block">' +
            '<label for="repeats" class="modal-title">Répétition</label>' + 
            '<input type="checkbox" name="repeats" id="repeats" value="1" />' +
            '<div class="calendar-modale__input-container">' +
            '<select name="repeat_freq" class="select">' +
            '<option value="0">Aucune</option>' +
            '<option value="1">Tous les jours</option>' +
            '<option value="7">Toutes les semaines</option>' +
            '</select>' +
            '</div>' +
            '<span>Durée de la répétition en semaine(s) <i>La répétition s\'éffectuera sur l\'année complète si rien n\'est renseigné ici</i></span>' +
            '<div class="calendar-modale__input-container">' +
            '<input type="number" min="1" max="52" name="until" class="calendar-modale__input" id="jsCalendarRepeatEnd" value="0">' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<button type="submit" class="calendar-modale__button calendar-modale__button--confirm jsConfirmAddEvent">Ajouter</button>' +
            '<button class="calendar-modale__button calendar-modale__button--cancel jsCloseModalCalendar">Annuler</button>' +
            '</div>' +
            '<div class="calendar-modale-error"></div>' +
            '</div>' +
            '</form>';
  
          el.parents('.generic-planning').find('.calendar-add').append(addModale);
  
          el.parents('.generic-planning').on('click', '.jsConfirmAddEvent', function (e) {
            e.preventDefault();
            eventTitle = $(this).parents('.calendar-modale').find('#jsCalendarAddTitle').val();
            eventLocation = $(this).parents('.calendar-modale').find('#jsCalendarAddLocation').val();
  
            let error = eventTitle.length == "" || eventLocation.length == "" ? true : false;
            if (error) {
              $(this).parents('.calendar-modale').find('.calendar-modale-error').text('Les champs "titre" et "lieu" sont obligatoire.');
            }
  
            if (!error) {
              let eventData;
              const eventBg = $(this).parents('.calendar-modale').find('input[name=background_color]:checked').val();
              const eventBorder = $(this).parents('.calendar-modale').find('input[name=border_color]:checked').val();
  
              // 1. Add loader
              $('#calendar, #calendar-edit').append('<div class="loader"><div class="loader__gif"></div></div>');
  
              // 2. Remove errors
              $(this).parents('.calendar-modale').find('.calendar-modale-error').text('');
  
              // 3. Remove modale
              $(this).parents('.calendar-modale').remove();
  
              // 4. Create object with data
              eventData = {
                allDay: isAllDay,
                title: eventTitle,
                location: eventLocation,
                start: start,
                end: end,
                editable: true,
                backgroundColor: eventBg,
                borderColor: eventBorder,
                textColor: '#fff',
              };
  
              // 5. Save data into DB
              var api = localStorage.getItem('ENV') + "/event/create/" + userID;
              $.ajax({
                url: api,
                type: 'POST',
                data: $(this).parents('#jsAddEventForm').serialize(),
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
                },
                success: function (response) {
                  console.log(response);
                  // 1. Remove previous selection
                  $(this).parents('.generic-planning').find('.calendar-add input:text').val('');
  
                  // 2. Remove loader
                  $('#calendar .loader, #calendar-edit .loader').remove();
  
                  // 3. Render new event on calendar
                  el.fullCalendar('renderEvent', eventData, false);
  
                  // 4. Remove handlers event
                  el.fullCalendar('unselect');
                  el.parents('.generic-planning').off('click', '.jsConfirmAddEvent');
                  el.fullCalendar('refetchEvents'); // You must refetch to get real ID of event
                },
                error: function (err) {
                  $('#calendar .loader, #calendar-edit .loader').remove();
                  console.log(err);
                }
              });
            }
          });
        },
      })
      calendar.navigate(el);
      calendar.modal(el, authTokenVALUE, userID, calendarID);
      calendar.refresh(authTokenVALUE, userID, el);
      calendar.repeats();

    } // End of check if userID exists

  },

  repeats: function() {
    $('.generic-planning').on('click', '#repeats', function() {
      $('.repeat-block').toggleClass('open');
    });
  },

  modal: function (el, authTokenVALUE, userID, calendarID) {
    $('.generic-planning').on('click', '.jsCloseModalCalendar', function (e) {
      
      e.stopImmediatePropagation();

      // Remove modale & error
      $(this).parents('.calendar-modale').remove();
      $(this).parents('.calendar-modale').find('.calendar-modale-error').text('');

      // Remove previous selection
      $(this).parents('.generic-planning').find('.calendar-add input:text').val('');
      $(this).parents('.generic-planning').find('.calendar-add input:radio').prop('checked', false);
      $(this).parents('.generic-planning').find('.calendar-add #bg-dark').prop('checked', true);

      // Remove handlers event
      //utils.removeEventHandlers('calendar');
      $('.generic-planning').off('click', '.jsConfirmDeleteEvent');
      $('.generic-planning').off('click', '.jsConfirmAddEvent');
      $('.generic-planning').off('click', '.jsConfirmEditEvent');


      userID = calendarID === 'calendar' ? localStorage.getItem('userID') : $('.selectUserToEditPlanning').val();
      console.log('userID',userID);
      console.log('calendarID',calendarID);

      //el.fullCalendar('destroy');
      //calendar.init(authTokenVALUE, userID, calendarID);
    });
  },

  navigate: function (el) {
    // Go to previous day / week
    $('.calendar-navigation-prev').on('click', function () {
      $(this).parents('.generic-planning').find(el).fullCalendar('prev');
    });
    // Go to next day / week
    $('.calendar-navigation-next').on('click', function () {
      $(this).parents('.generic-planning').find(el).fullCalendar('next');
    });
    // Switch on week view
    $('.calendar-view__button--week').click(function () {
      $('.calendar-view__button').removeClass('active');
      $(this).addClass('active');
      $(this).parents('.generic-planning').find(el).fullCalendar('changeView', 'agendaWeek');
    });
    // Switch on day view
    $('.calendar-view__button--day').click(function () {
      $('.calendar-view__button').removeClass('active');
      $(this).addClass('active');
      $(this).parents('.generic-planning').find(el).fullCalendar('changeView', 'agendaDay');
    });

  },

  refresh: function (authTokenVALUE, userID, el) {
    $('.jsRefreshPlanning').click(function () {
      el.fullCalendar('destroy');
      calendar.init(authTokenVALUE, userID, 'calendar');
    });
  },
 /*
  * ------------------------------------
  * ADD EVENT IF NOTIFICATION IS ACCEPT
  * ------------------------------------
  */
  addEventFromNotification: function (authTokenVALUE, userConnectedID) {
    $('.notification__list').on('click', '.jsApproveAction', function (e) {
      e.preventDefault();
      let item = $(this).parents('.notification__list__item');
      let userNotificationID = item.find('.notification-userID').val();
      let actionID = item.find('.notification-id').val();
      let eventType = item.find('.notification-type').val();
      let eventStart = item.find('.notification-start').val();
      let eventEnd = item.find('.notification-end').val();
      let eventTitle = '';
      let eventLocation = '';
      let eventBg = '';
      let eventBorder = '';
      let eventData;
      let api = "";

      switch(eventType) {
        case 'hours':
          eventBg = '#1e1e1e';
          eventBorder = '#1e1e1e';
          eventTitle = item.find('.notification-justification').val();
          eventLocation = item.find('.notification-location').val();
          api = localStorage.getItem('ENV') + "/event/createFromNotification/" + userConnectedID + "/" + actionID;
          break;
        case 'leave':
          eventBg = '#b0b0b0';
          eventBorder = '#b0b0b0';
          eventTitle = 'Congés';
          eventLocation = 'Aucun';
          api = localStorage.getItem('ENV') + "/event/createFromNotification/" + userNotificationID + "/" + actionID;
          break;
        case 'rest':
          eventBg = '#b0b0b0';
          eventBorder = '#b0b0b0';
          eventTitle = 'Repos';
          eventLocation = 'Aucun';
          api = localStorage.getItem('ENV') + "/event/createFromNotification/" + userNotificationID + "/" + actionID;
          break;
      }

      // 1. Add loader
      $('#jsNotifications').append('<div class="loader"><div class="loader__gif"></div></div>');

      // 1. Create object with data
      eventData = {
        allDay: false,
        title: eventTitle,
        location: eventLocation,
        start: eventStart,
        end: eventEnd,
        editable: false,
        backgroundColor: eventBg,
        borderColor: eventBorder,
        textColor: '#fff',
      };

      // 2. Save data into DB
      $.ajax({
        url: api,
        type: 'POST',
        data: {
          title: eventTitle,
          start: eventStart,
          end: eventEnd,
          location: eventLocation,
          background_color: eventBg,
          border_color: eventBorder
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          console.log(response);

          // 0. Refresh notifications
          utils.removeHTML('notifications');
          page.notifications(authTokenVALUE, userConnectedID);

          // 1. Remove loader
          $('#jsNotifications .loader').remove();

          // 2. Remove "not-seen" class to item
          item.removeClass('not-seen');

          // 3. Show success message on notification page
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');

          // 4. Render new event on calendar
          $('#calendar').fullCalendar('renderEvent', eventData, false);

          // 5. Remove handlers event
          $('#calendar').fullCalendar('unselect');
          $('.notification__list').off('click', '.jsApproveAction');
          $('.notification__list').off('click', '.jsADeclineAction');
        },
        error: function (err) {
          $('#jsNotifications .loader').remove();
          console.log(err);
        }
      });
    });
  },

  // Other functions...
};