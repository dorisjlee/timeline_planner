var json_event_lst =[];//list of JSON event data 
  /**
   * Load Google Calendar client library. List upcoming events
   * once client library is loaded.
   */
  function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listCalendars);    
  }

  function loadEventsFromCalendar(calendarId,calendarName) {
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
      var events = resp.items;
      appendPre('Upcoming events:');
      
      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var json_event = {};
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
          // appendPre(event.summary + ' (' + stime + ')')

          var etime = new Date(event.end.dateTime);
          if (isNaN(etime.valueOf())) {
            //For all day events
            etime = new Date(event.end.date);
          }
          if ((etime-stime)/1000/3600/24==1){
            // if duration is one day, don't add a enddate, treat it as a day event 
          // if (! isNaN(etime.valueOf())) { 
            //if etime not null then write it as a JSON field, otherwise, don't add the end field
            json_event.end =etime;  
          }
          json_event_lst.push(json_event)
        }
      } else {
        appendPre('No upcoming events found.');
      }
    });
  }
  
  /**
   * Append a pre element to the body containing the given message
   * as its text node.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }