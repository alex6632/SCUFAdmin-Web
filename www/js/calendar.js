calendar = {
  /**
   * INIT FullCalendar
   * ---------------------
   * Doc : https://fullcalendar.io/docs/
   */
  init: function () {

    const el = $('#calendar');
    el.fullCalendar({
      defaultView: 'agendaWeek', // 'basicDay'
      weekends: false,
      customButtons: {
        myCustomButton: {
          text: 'Custom !',
          click: function () {
            calendar.myFunction();
          }
        }
      },
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
      viewRender: function (view) {
        console.log(view.type);
        //const title = view.title;
        //$("#externalTitle").html(title);
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
      eventResize: function (event) {
        console.log('Resize', event);
        console.log('Start : ', event.start);
        console.log('End : ', event.end);

        calendar.addEvent(start, end, allDay)

      },
      select: function (start, end) {

        $('.calendar-add').fadeIn();
        $('#planning').on('click', '.jsConfirmAddEvent', function () {
          var eventData;

          eventTitle = $('#jsCalendarAddTitle').val();
          eventLocation = $('#jsCalendarAddLocation').val();

          var error = eventTitle.length == "" || eventLocation.length == "" ? true : false;          

          if (!error) {
            eventData = {
              title: eventTitle,
              location: eventLocation,
              start: start,
              end: end,
              editable: true,
            };
            console.log(eventData);
            el.fullCalendar('renderEvent', eventData, true);
          }
          el.fullCalendar('unselect');
        });
      },
    })

    calendar.modal();


    // TEST
    calendar.addEvent(el);
    calendar.navigate(el);






  },

  modal: function () {
    $('#planning').on('click', '.jsCloseModalCalendar', function () {
      $(this).parents('.calendar-add').fadeOut();
    });
  },

  addEvent: function (el) {
    var calendar = el.fullCalendar('getCalendar');

    calendar.on('dayClick', function (date, jsEvent, view) {
      console.log('clicked on ' + date.format());
    });

  },

  navigate: function (el) {
    $('.calendar-navigation-prev').on('click', function () {
      console.log('prev');
      el.fullCalendar('prev');
    });
    $('.calendar-navigation-next').on('click', function () {
      console.log('next');
      el.fullCalendar('next');
    });
    $('.calendar-view__button--week').on('click', function () {
      console.log('WEEK view');
      $('.calendar-view__button').removeClass('active');
      $(this).addClass('active');
      el.fullCalendar('changeView', 'agendaWeek');
    });
    $('.calendar-view__button--day').on('click', function () {
      console.log('DAY view');
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

  myFunction: function (el) {
    alert('custom !');
  },


};