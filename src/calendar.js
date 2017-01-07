var calendarNameIds;
var calendarNames=[];//calendars to plot
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
			loadFromAllCalendars(calendarNames);		    
     });
}

function loadFromAllCalendars(calendarNames){
	//Load events from all selected calendars
	for (var i =0; i<calendarNames.length;i++){
		if (i==calendarNames.length-1){
			//Render visualization as true if we are at the last element of the calendar list
			loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i],true);
		}else{
			loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i]);	
		}		
	}
}
function selectCalendar(btn)
{
	calendarNames.push(btn.id);
}
