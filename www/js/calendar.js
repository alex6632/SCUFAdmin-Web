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
      slotDuration: '00:30:00',
      minTime: "08:00:00",
      maxTime: "21:00:00",
      header: {
        left: 'title', //day,basicDay week,basicWeek myCustomButton
        center: '',
        right: '' //today prev next
      },
      viewRender: function (view) {
        //const title = view.title;
        //$("#externalTitle").html(title);
        window.setTimeout(function () {
          $("#calendar").find('.fc-toolbar > div > h2').empty().append(
            "<div>" + view.start.format('[Semaine du<span>] D [</span>au<span>]') + "" + view.end.format(' D [</span>] MMMM YYYY') + "</div>"
          );
        }, 0);


      }
    })

    calendar.addEvent(el);
    calendar.navigate(el);






  },

  addEvent: function (el) {
    var calendar = el.fullCalendar('getCalendar');

    calendar.on('dayClick', function (date, jsEvent, view) {
      console.log('clicked on ' + date.format());
    });

  },

  navigate: function (el) {
    console.log('coucou');
    $('.calendar-navigation-prev').on('click', function () {
      console.log('prev');
      el.fullCalendar('prev');
    });
    $('.calendar-navigation-next').on('click', function () {
      console.log('next');
      el.fullCalendar('next');
    });
  },

  testFunction: function (el) {

    // Go to a specific date
    const date = moment().format();
    el.fullCalendar('gotoDate', date);

    // When click on 'planning' tab
    el.fullCalendar('render');

    // Go to today
    el.fullCalendar('today');

    // Change view
    el.fullCalendar('changeView', 'basicDay');
    el.fullCalendar('changeView', 'basicWeek');




  },

  myFunction: function (el) {
    alert('custom !');
  },


};