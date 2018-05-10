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
    el.fullCalendar({
      defaultView: 'agendaWeek', // 'basicDay'
      weekends: false,
      selectable: true,
      editable: true,
      nowIndicator: true,
      slotDuration: '00:30:00',
      minTime: "08:00:00",
      maxTime: "21:00:00",
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
       * SHOW CUSTOM HEADER
       * -------------------
       */
      events: "http://127.0.0.1:8000/events/" + userID,
      events: function (start, end, timezone, callback) {
        var api = "http://127.0.0.1:8000/events/" + userID;
        $.ajax({
          url: api,
          type: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
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
        console.log('Resize event: ', event);
        el.fullCalendar('refetchEvents');
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
          '<input type="text" class="calendar-modale__input" id="jsCalendarAddTitle" placeholder="Titre" value="' + event.title + '">' +
          '<input type="text" class="calendar-modale__input" id="jsCalendarAddLocation" placeholder="Lieu" value="' + event.location + '">' +
          '</div>' +
          '<span>Couleur de l\'arrière plan</span>' +
          '<div class="calendar-modale__input-container">' +
          '<input type="radio" class="radio" id="bg-red" name="jsEventBgColor" value="#ff0000" ' + redBgChecked + '>' +
          '<label for="bg-red"></label>' +
          '<input type="radio" class="radio" id="bg-green" name="jsEventBgColor" value="#7ec730" ' + greenBgChecked + '>' +
          '<label for="bg-green"></label>' +
          '<input type="radio" class="radio" id="bg-orange" name="jsEventBgColor" value="#f5882f" ' + orangeBgChecked + '>' +
          '<label for="bg-orange"></label>' +
          '<input type="radio" class="radio" id="bg-blue" name="jsEventBgColor" value="#2f67f5" ' + blueBgChecked + '>' +
          '<label for="bg-blue"></label>' +
          '<input type="radio" class="radio" id="bg-dark" name="jsEventBgColor" value="#1e1e1e" ' + darkBgChecked + '>' +
          '<label for="bg-dark"></label>' +
          '</div>' +
          '<span>Couleur de la bordure</span>' +
          '<div class="calendar-modale__input-container">' +
          '<input type="radio" class="radio" id="border-red" name="jsEventBorderColor" value="#ff0000" ' + redBorderChecked + '>' +
          '<label for="border-red"></label>' +
          '<input type="radio" class="radio" id="border-green" name="jsEventBorderColor" value="#7ec730" ' + greenBorderChecked + '>' +
          '<label for="border-green"></label>' +
          '<input type="radio" class="radio" id="border-orange" name="jsEventBorderColor" value="#f5882f" ' + orangeBorderChecked + '>' +
          '<label for="border-orange"></label>' +
          '<input type="radio" class="radio" id="border-blue" name="jsEventBorderColor" value="#2f67f5" ' + blueBorderChecked + '>' +
          '<label for="border-blue"></label>' +
          '<input type="radio" class="radio" id="border-dark" name="jsEventBorderColor" value="#1e1e1e" ' + darkBorderChecked + '>' +
          '<label for="border-dark"></label>' +
          '</div>' +
          '<button class="calendar-modale__button calendar-modale__button--confirm jsConfirmEditEvent">Confirmer</button>' +
          '<button class="calendar-modale__button calendar-modale__button--cancel jsCloseModalCalendar">Annuler</button>' +
          '<button class="calendar-modale__button calendar-modale__button--delete jsConfirmDeleteEvent">Supprimer</button>' +
          '</div>' +
          '</form>';

        $('.calendar-edit').append(editModale);

        $('#planning').on('click', '.jsConfirmDeleteEvent', function () {
          if (confirm("Cette action sera irréversible.")) {
            el.fullCalendar('removeEvents', event._id);
            $(this).parents('.calendar-modale').remove();
          }
        });

        $('#planning').on('click', '.jsConfirmEditEvent', function () {

          const edit = $(this).parents('.calendar-edit');

          event.title = edit.find('#jsCalendarAddTitle').val();
          event.location = edit.find('#jsCalendarAddLocation').val();
          event.backgroundColor = edit.find('input[name=jsEventBgColor]:checked').val();
          event.borderColor = edit.find('input[name=jsEventBorderColor]:checked').val();


          var error = event.title.length == "" || event.location.length == "" ? true : false;
          if (!error) {
            console.log('New event:', event);
            el.fullCalendar('updateEvent', event);
            $(this).parents('.calendar-modale').remove();
          }
          // Remove handlers event
          el.fullCalendar('unselect');
          $('#planning').off('click', '.jsConfirmEditEvent');
          $('#planning').off('click', '.jsConfirmDeleteEvent');
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
          '<input type="radio" class="radio" id="bg-red" name="bg_color" value="#ff0000">' +
          '<label for="bg-red"></label>' +
          '<input type="radio" class="radio" id="bg-green" name="bg_color" value="#7ec730">' +
          '<label for="bg-green"></label>' +
          '<input type="radio" class="radio" id="bg-orange" name="bg_color" value="#f5882f">' +
          '<label for="bg-orange"></label>' +
          '<input type="radio" class="radio" id="bg-blue" name="bg_color" value="#2f67f5">' +
          '<label for="bg-blue"></label>' +
          '<input type="radio" class="radio" id="bg-dark" name="bg_color" value="#1e1e1e">' +
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
          '<input type="radio" class="radio" id="border-dark" name="border_color" value="#1e1e1e">' +
          '<label for="border-dark"></label>' +
          '</div>' +
          '<button type="submit" class="calendar-modale__button calendar-modale__button--confirm jsConfirmAddEvent">Ajouter</button>' +
          '<button class="calendar-modale__button calendar-modale__button--cancel jsCloseModalCalendar">Annuler</button>' +
          '</div>' +
          '</form>';

        $('.calendar-add').append(addModale);

        $('#planning').on('click', '.jsConfirmAddEvent', function (e) {
          e.preventDefault();
          eventTitle = $('#jsCalendarAddTitle').val();
          eventLocation = $('#jsCalendarAddLocation').val();

          let eventData;
          let eventBg = $("input[name=bg_color]:checked").val() ? $('input[name=bg_color]:checked').val() : '#2f67f5';
          let eventBorder = $("input[name=border_color]:checked").val() ? $('input[name=border_color]:checked').val() : '';
          let error = eventTitle.length == "" || eventLocation.length == "" ? true : false;

          if (!error) {
            $(this).parents('.calendar-modale').remove();
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

            // Save data into DB
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
                el.fullCalendar('renderEvent', eventData, true);
              },
              error: function (err) {
                console.log(err);
              }
            });

          }
          // Remove handlers event
          el.fullCalendar('unselect');
          $('#planning').off('click', '.jsConfirmAddEvent');
          // Remove previous selection
          $('.calendar-add input:text').val('');
          $('.calendar-add input:radio').prop('checked', false);
          $('.calendar-add #bg-dark').prop('checked', true);
        });
      },
    })

    calendar.navigate(el);
    calendar.modal(el);
  },

  modal: function (el) {
    $('#planning').on('click', '.jsCloseModalCalendar', function () {
      // Remove modale
      $(this).parents('.calendar-modale').remove();

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