var json_event_lst =[];//list of JSON event data 
  /**
   * Load Google Calendar client library. List upcoming events
   * once client library is loaded.
   */
  function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listCalendars);    
  }

  function loadEventsFromCalendar(calendarId,calendarName,renderVis=false) {
    // Add events from calendar corresponding to the given calendarId into json_event_lst. 
    var request = gapi.client.calendar.events.list({
      'calendarId': calendarId,
      'timeMin': startdate.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 50,
      'orderBy': 'startTime'
    });

    //{id: 4, content: 'item 4', start: new Date(2013, 3, 16), end: new Date(2013, 3, 19)},
    request.execute(function(resp) {
      // var dfd = $.Deferred();
      var events = resp.items;
      var json_event;
      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          json_event= {};
          var event = events[i];
          json_event.id = json_event_lst.length+1;
          json_event.content = event.summary;
          json_event.group = calendarNames.indexOf(calendarName);
          json_event.class = calendarName;
          var stime = new Date(event.start.dateTime);
          if (isNaN(stime.valueOf())) {
            //For all day events
            stime = new Date(event.start.date);
          }
          json_event.start =stime;

          var etime = new Date(event.end.dateTime);
          if (isNaN(etime.valueOf())) {
            //For all day events
            etime = new Date(event.end.date);
          }
          if ((etime-stime)/1000/3600/24!=1){
            // otherwise, if duration is one day, don't add a enddate, treat it as a day event(no enddate)
            json_event.end =etime;  
          }
          json_event_lst.push(json_event)
        }
      }
      if (renderVis){
        renderTimeline();
      } 
    });
  }
