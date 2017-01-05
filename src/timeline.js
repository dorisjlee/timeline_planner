var event_data;
var container = document.getElementById('visualization');
var options = {
	editable: true,

	onAdd: function (item, callback) {
	  prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
	    if (value) {
	      item.content = value;
	      callback(item); // send back adjusted new item
	    }
	    else {
	      callback(null); // cancel item creation
	    }
	  });
	},

	onMove: function (item, callback) {
	  var title = 'Do you really want to move the item to\n' +
	      'start: ' + item.start + '\n' +
	      'end: ' + item.end + '?';

	  prettyConfirm('Move item', title, function (ok) {
	    if (ok) {
	      callback(item); // send back item as confirmation (can be changed)
	    }
	    else {
	      callback(null); // cancel editing item
	    }
	  });
	},

	onMoving: function (item, callback) {
	  if (item.start < startdate) item.start = startdate;
	  if (item.start > enddate) item.start = enddate;
	  if (item.end   > enddate) item.end   = enddate;

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
	    }
	    else {
	      callback(null); // cancel deletion
	    }
	  });
	}
};

function renderTimeline(){
	//var items = listUpcomingEvents();
	event_data = new vis.DataSet(json_event_lst);
	var timeline = new vis.Timeline(container, event_data, options);
	event_data.on('*', function (event, properties) {
		logEvent(event, properties);
	});
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
