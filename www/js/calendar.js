calendar = {
  /**
   * --------------------------------------
   * INIT FullCalendar
   * --------------------------------------
   * Doc : https://fullcalendar.io/docs/
   * --------------------------------------
   */
  init: function (authTokenVALUE, userID) {

    const el = $('#calendar');

    // The first time, show GIF during loading
    el.append('<div class="loader"><div class="loader__gif"></div></div>');

    el.fullCalendar({
      defaultView: 'agendaWeek', // 'basicDay'
      weekends: false,
      selectable: true,
      editable: true,
      nowIndicator: true,
      slotDuration: '00:30:00',
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
            $("#calendar").find('.fc-toolbar > div > h2').empty().append(
              "<div>" + view.start.format('[Semaine du<span>] D [</span>au<span>]') + "" + view.end.format(' D [</span>] MMMM YYYY') + "</div>"
            );
          }, 0);
        } else {
          window.setTimeout(function () {
            $("#calendar").find('.fc-toolbar > div > h2').empty().append(
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
        var api = "http://127.0.0.1:8000/events/" + userID;
        $.ajax({
          url: api,
          type: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('#calendar .loader').remove();
            callback(response);
          },
          error: function (err) {
            console.log(err);
          }
        });
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
        $('#calendar').append('<div class="loader"><div class="loader__gif"></div></div>');

        // 2. Update calendar data
        event.start = updatedStart;
        event.end = updatedEnd;

        // 3. Save data into DB
        var api = "http://127.0.0.1:8000/event/update/" + event.id;
        $.ajax({
          url: api,
          type: 'PATCH',
          data: {
            start: updatedStart,
            end: updatedEnd
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            console.log(response);

            // 1. Remove loader
            $('#calendar .loader').remove();

            // 2. Render update event on calendar
            el.fullCalendar('updateEvent', event);
            el.fullCalendar('refetchEvents');
          },
          error: function (err) {
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
        $('#calendar').append('<div class="loader"><div class="loader__gif"></div></div>');

        // 2. Update calendar data
        event.start = updatedStart
        event.end = updatedEnd;

        // 3. Save data into DB
        var api = "http://127.0.0.1:8000/event/update/" + event.id;
        $.ajax({
          url: api,
          type: 'PATCH',
          data: {
            start: updatedStart,
            end: updatedEnd
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            console.log(response);

            // 1. Remove loader
            $('#calendar .loader').remove();

            // 2. Render update event on calendar
            el.fullCalendar('updateEvent', event);
            el.fullCalendar('refetchEvents');
          },
          error: function (err) {
            console.log(err);
            revertFunc();
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

        let editModale = '' +
          '<form class="calendar-modale" id="jsUpdateEventForm">' +
          '<div class="calendar-modale__inner">' +
          '<span class="icon icon-close jsCloseModalCalendar"></span>' +
          '<div class="calendar-modale__title">Modifier un événement</div>' +
          '<div class="calendar-modale__input-container">' +
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

        $('.calendar-edit').append(editModale);

        $('#planning').on('click', '.jsConfirmDeleteEvent', function () {
          if (confirm("Cette action sera irréversible.")) {
            // 1. Add loader
            $('#calendar').append('<div class="loader"><div class="loader__gif"></div></div>');

            // 2. Remove modale
            $(this).parents('.calendar-modale').remove();

            // 3. Delete data into DB
            var api = "http://127.0.0.1:8000/event/delete/" + event.id;
            $.ajax({
              url: api,
              type: 'DELETE',
              beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
              },
              success: function (response) {
                console.log(response);

                // 1. Remove loader
                $('#calendar .loader').remove();

                // 2. Delete event on calendar
                el.fullCalendar('removeEvents', event._id);

                // 3. Remove handlers event
                el.fullCalendar('unselect');
                $('#planning').off('click', '.jsConfirmEditEvent');
                $('#planning').off('click', '.jsConfirmDeleteEvent');
              },
              error: function (err) {
                console.log(err);
              }
            });
          }
        });

        $('#planning').on('click', '.jsConfirmEditEvent', function (e) {
          e.preventDefault();
          eventTitle = $(this).parents('.calendar-modale').find('#jsCalendarAddTitle').val();
          eventLocation = $(this).parents('.calendar-modale').find('#jsCalendarAddLocation').val();

          let error = eventTitle.length == "" || eventLocation.length == "" ? true : false;
          if(error) {
            $(this).parents('.calendar-modale').find('.calendar-modale-error').text('Les champs "titre" et "lieu" sont obligatoire.');
          }

          if (!error) {
            // 1. Add loader
            $('#calendar').append('<div class="loader"><div class="loader__gif"></div></div>');

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
            var api = "http://127.0.0.1:8000/event/update/" + event.id;
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
                $('#calendar .loader').remove();

                // 2. Render update event on calendar
                el.fullCalendar('updateEvent', event);

                // 3. Remove handlers event
                el.fullCalendar('unselect');
                $('#planning').off('click', '.jsConfirmEditEvent');
                $('#planning').off('click', '.jsConfirmDeleteEvent');
              },
              error: function (err) {
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

        let isAllDay = !start.hasTime();
        let allDayChecked = isAllDay ? "checked" : "";
        let addModale = '' +
          '<form class="calendar-modale" id="jsAddEventForm">' +
          '<div class="calendar-modale__inner">' +
          '<span class="icon icon-close jsCloseModalCalendar"></span>' +
          '<div class="calendar-modale__title">Ajouter un événement</div>' +
          '<div class="calendar-modale__input-container">' +
          '<input type="checkbox" name="all_day" value="" ' + allDayChecked + ' style="visibility: hidden;">' +
          '<input type="hidden" name="start" value="' + moment(start).format('YYYY-MM-DD HH:mm:ss') + '">' +
          '<input type="hidden" name="end" value="' + moment(end).format('YYYY-MM-DD HH:mm:ss') + '">' +
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
          '<div>' +
          '<button type="submit" class="calendar-modale__button calendar-modale__button--confirm jsConfirmAddEvent">Ajouter</button>' +
          '<button class="calendar-modale__button calendar-modale__button--cancel jsCloseModalCalendar">Annuler</button>' +
          '</div>' +
          '<div class="calendar-modale-error"></div>' +
          '</div>' +
          '</form>';

        $('.calendar-add').append(addModale);

        $('#planning').on('click', '.jsConfirmAddEvent', function (e) {
          e.preventDefault();
          eventTitle = $(this).parents('.calendar-modale').find('#jsCalendarAddTitle').val();
          eventLocation = $(this).parents('.calendar-modale').find('#jsCalendarAddLocation').val();

          let error = eventTitle.length == "" || eventLocation.length == "" ? true : false;
          if(error) {
            $(this).parents('.calendar-modale').find('.calendar-modale-error').text('Les champs "titre" et "lieu" sont obligatoire.');
          }

          if (!error) {
            let eventData;
            const eventBg = $(this).parents('.calendar-modale').find('input[name=background_color]:checked').val();
            const eventBorder = $(this).parents('.calendar-modale').find('input[name=border_color]:checked').val();

            // 1. Add loader
            $('#calendar').append('<div class="loader"><div class="loader__gif"></div></div>');

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
            var api = "http://127.0.0.1:8000/event/create/" + userID;
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
                $('.calendar-add input:text').val('');

                // 2. Remove loader
                $('#calendar .loader').remove();

                // 3. Render new event on calendar
                el.fullCalendar('renderEvent', eventData, true);

                // 4. Remove handlers event
                el.fullCalendar('unselect');
                $('#planning').off('click', '.jsConfirmAddEvent');
              },
              error: function (err) {
                console.log(err);
              }
            });
          }
        });
      },
    })

    calendar.navigate(el);
    calendar.modal(el);
  },

  modal: function (el) {
    $('#planning').on('click', '.jsCloseModalCalendar', function () {
      // Remove modale & error
      $(this).parents('.calendar-modale').remove();
      $(this).parents('.calendar-modale').find('.calendar-modale-error').text('');

      // Remove handlers event
      $('#planning').off('click', '.jsConfirmAddEvent');
      $('#planning').off('click', '.jsConfirmEditEvent');
      $('#planning').off('click', '.jsConfirmDeleteEvent');

      // Remove previous selection
      $('.calendar-add input:text').val('');
      $('.calendar-add input:radio').prop('checked', false);
      $('.calendar-add #bg-dark').prop('checked', true);
    });
  },

  navigate: function (el) {
    // Go to previous day / week
    $('.calendar-navigation-prev').on('click', function () {
      el.fullCalendar('prev');
    });
    // Go to next day / week
    $('.calendar-navigation-next').on('click', function () {
      el.fullCalendar('next');
    });
    // Switch on week view
    $('.calendar-view__button--week').on('click', function () {
      $('.calendar-view__button').removeClass('active');
      $(this).addClass('active');
      el.fullCalendar('changeView', 'agendaWeek');
    });
    // Switch on day view
    $('.calendar-view__button--day').on('click', function () {
      $('.calendar-view__button').removeClass('active');
      $(this).addClass('active');
      el.fullCalendar('changeView', 'agendaDay');
    });

  },

  testFunction: function (el) {
    // Go to a specific date
    const date = moment().format();
    el.fullCalendar('gotoDate', date);

    // When click on 'planning' tab
    el.fullCalendar('render');
    el.fullCalendar('refetchEvents');

    // Go to today
    el.fullCalendar('today');

    // Change view
    el.fullCalendar('changeView', 'basicDay');
    el.fullCalendar('changeView', 'basicWeek');

    // To put a bg color to close day
    $('#calendar').fullCalendar({
      events: [
        {
          allDay: true,
          start: '2014-11-10T10:00:00',
          end: '2014-11-10T16:00:00',
          rendering: 'background'
        }
      ]
    });
  },

  // ...
};