var calendarNameIds;
var calendarNames = ['Long Term (Personal)','Long Term (Work)','Schedule']
function listCalendars()
{
	//Retreive calendarID used for retreiving events in the calendar and summary (name) of the calendar
     var request = gapi.client.calendar.calendarList.list();
     calendarNameIds={}
     request.execute(function(resp){
            var calendars = resp.items;
            for (var i = 0; i < calendars.length; i++) {
				item = calendars[i]
				calendarNameIds[item.summary]=item.id
			}
			loadFromAllCalendars();		    
     });
}

function loadFromAllCalendars(){
	//Load events from all selected calendars
	for (var i =0; i<calendarNames.length;i++){
		loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i]);
	}
}
