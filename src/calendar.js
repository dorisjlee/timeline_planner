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
			loadFromAllCalendars(calendarNames);		    
     });
}

function loadFromAllCalendars(calendarNames){
	var dfd_lst=[];
	//Load events from all selected calendars
	for (var i =0; i<calendarNames.length;i++){
		// var _resp = loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i]);
		// console.log(_resp);
		// if (_resp){
		// 	if (i==0){
		// 		//initialize dfd_lst
		// 		dfd_lst=[];
		// 	}
		// 	dfd_lst.push(_resp);	//Don't push in undefined dfds
		// }
		// dfd_lst.push(loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i]));
		if (i==calendarNames.length-1){
			//Render visualization as true if we are at the last element of the calendar list
			loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i],true);
		}else{
			loadEventsFromCalendar(calendarNameIds[calendarNames[i]],calendarNames[i]);	
		}
		
	}
	// $.when.apply($,dfd_lst).done(renderTimeline);
}
