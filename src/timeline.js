var timeline;
var startdate = new Date();//Start from Now - 1 months
startdate.setMonth(startdate.getMonth() - 1);
var enddate = new Date()//End from Now + 2 Year
enddate.setFullYear(enddate.getFullYear()+2)
var event_data;

var options = {
	editable: true,

	onAdd: function (item, callback) {
	  prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
	    if (value) {
	      item.content = value;
	      addEvent(item); //update on GCal
	      callback(item); // send back adjusted new item
	    }
	    else {
	      callback(null); // cancel item creation
	    }
	  });
	},

	onMove: function (item, callback) {
	  //Dragging to move event to another date
	  var title = 'Do you really want to move the item to\n' +
	      'start: ' + item.start + '\n' +
	      'end: ' + item.end + '?';

	  prettyConfirm('Move item', title, function (ok) {
	    if (ok) {
	      callback(item); // send back item as confirmation (can be changed)
	      changeDate(item);
	    }
	    else {
	      callback(null); // cancel editing item
	    }
	  });
	},

	onMoving: function (item, callback) {
	  //Dragging to extend or shrink event range
	  if (item.start < startdate) item.start = startdate;
	  if (item.start > enddate) item.start = enddate;
	  if (item.end   > enddate) item.end   = enddate;
	  changeDate(item);
	  callback(item); // send back the (possibly) changed item
	},

	onUpdate: function (item, callback) {
	  prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
	    if (value) {
	      item.content = value;
	      callback(item); // send back adjusted item
	    }
	    else {
	      callback(null); // cancel updating the item
	    }
	  });
	},

	onRemove: function (item, callback) {
	  prettyConfirm('Remove item', 'Do you really want to remove item ' + item.content + '?', function (ok) {
	    if (ok) {
	      callback(item); // confirm deletion
	      deleteEvent(item);
	    }
	    else {
	      callback(null); // cancel deletion
	    }
	  });
	},
	groupOrder: function (a, b) {
      return a.value - b.value;
    }
};

function renderTimeline(){
	var container = document.getElementById('visualization');
	$('#visualization').empty();//clears canvas
	event_data = new vis.DataSet(json_event_lst);
	// Specify properties of groups (calendars)
	// values indicate the ordering of the calendars in the visualization
	// Content is the name of the visualization labelled on the tracks
	var groupsData = []
	for (var i = 0; i<calendarNames.length; i++){
		groupsData.push({id:i,content:calendarNames[i],value:i+1})
	}
	var groups = new vis.DataSet(groupsData);
	timeline = new vis.Timeline(container, event_data, options);
	timeline.setGroups(groups);
	// event_data.on('*', function (event, properties) {
	// 	logEvent(event, properties);
	// });
}
function logEvent(event, properties) {
var log = document.getElementById('log');
var msg = document.createElement('div');
msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
    'properties=' + JSON.stringify(properties);
log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}

function prettyConfirm(title, text, callback) {
	swal({
	  title: title,
	  text: text,
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55"
	}, callback);
}

function prettyPrompt(title, text, inputValue, callback) {
	swal({
	  title: title,
	  text: text,
	  type: 'input',
	  showCancelButton: true,
	  inputValue: inputValue
	}, callback);
}
