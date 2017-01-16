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
    'maxResults': 300,
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
        json_event.className = calendarName.toLowerCase().replace(" ","-");
        json_event.eventID= event.id;
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
function addEvent(item){
  //Adding events to calendar
  // By default, this adds an all day event
  // If "range:<event name>" is specified, then 5 day (with range) event is added.
  // ex) range:Working on Paper
  // Then the date range could be directly manipulated by onMove
  
  
  if (item.content.indexOf(':') == -1)
  {
    // var prev = new Date(item.start);
    // prev.setDate(item.start.getDate()-1)
    var date  = item.start.getFullYear()+'-'+("0" + (item.start.getMonth() + 1)).slice(-2)+'-'+item.start.getDate();
    var event = {
      'summary': item.content,
      'start': {
        'date': date,
        'timeZone': 'America/Chicago'
      },
      'end': {
        'date': date,
        'timeZone': 'America/Chicago'
      }
    };

  }else{
    end.setDate(item.start.getDate()+5)
    item.content = item.content.split(":")[1];
    item.end = end;
    var event = {
    'summary': item.content,
    'start': {
      'dateTime': item.start.toJSON(),
      'timeZone': 'America/Chicago'
    },
    'end': {
        'dateTime': end.toJSON(),
        'timeZone': 'America/Chicago'
      }
    };
  }
  var request = gapi.client.calendar.events.insert({
    'calendarId': calendarNameIds[calendarNames[item.group]],
    'resource': event
  });
  request.execute(function(event) {
    console.log('Event created: ' + event.htmlLink);
    item.id = event.id;
  });
  //Add in event ID
  json_event_lst.push(item);
}

function deleteEvent(item){
  var request = gapi.client.calendar.events.delete({
    'calendarId': calendarNameIds[calendarNames[item.group]],
    'eventId': item.eventID
  });
  request.execute(function(event) {
    console.log('Event deleted: ' + event.htmlLink);
  });
}

function changeDate(item){
  //Changing the start or end date for all-day events 
  // date for all day events 
  // dateTime for event 
  var end = new Date(item.start);
  if (! item.end ) //if end date is undefined then set as all day event
  {
    end.setDate(item.start.getDate()+1)
  }
  var event = {
    'summary': item.content,
    'start': {
      'dateTime': item.start.toJSON(),
      'timeZone': 'America/Chicago'
    },
    'end': {
      'dateTime': end.toJSON(),
      'timeZone': 'America/Chicago'
    }
  };
  var request = gapi.client.calendar.events.update({
                  'calendarId': calendarNameIds[calendarNames[item.group]],
                  'eventId': item.eventID,
                  'resource': event
                });
  request.execute(function(event) {
    console.log('Event modified: ' + event.htmlLink);
    item.id = event.id;
  });
  //Add in event ID
  json_event_lst.pop(item);
  json_event_lst.push(item);
}
