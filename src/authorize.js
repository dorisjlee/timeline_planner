// Reading in client data from client_id.json 
// (retrieved from your project in the Google
// Developer Console, https://console.developers.google.com)


var CLIENT_ID;

var getJSON = function(url, successHandler, errorHandler) {
  var xhr = typeof XMLHttpRequest != 'undefined'
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onreadystatechange = function() {
    var status;
    var data;
    // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
    if (xhr.readyState == 4) { // `DONE`
      status = xhr.status;
      if (status == 200) {
        successHandler && successHandler(xhr.response);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();
};

getJSON('../data/client_id.json', function(data) {
  CLIENT_ID=data.web.client_id;
}, function(status) {
  alert('Something went wrong.');
});

var SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  // Reset all variable to clear viz when redrawing 
  calendarNames =[];
  json_event_lst =[]
  var allbtn = document.getElementById("All"); //If the "All" button is pressed, then all calendars should be displayed
  //Check list of calendars checked and add it into calendarNames list
  var selections = document.getElementById("calendarSelect").children
  for (var i=0 ; i<selections.length;i++){
    var inputObj = selections[i].children[0]
    if  (inputObj.checked || allbtn.checked){
      calendarNames.push(inputObj.id)
    }
  }
  calendarNames.remove("All")
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    // authorizeDiv.style.display = 'none';
    authorizeDiv.style.display = 'inline'; //Don't hide, change to submit button instead
    var authorizeBtn = document.getElementById('authorize-button');
    authorizeBtn.textContent  = "Submit";
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}


function autoAuth() {
  //Attempt to make authorization automatic without a click
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

// Remove by value in a list, all matching values would be removed
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};