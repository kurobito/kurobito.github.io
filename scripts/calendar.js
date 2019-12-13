      // Client ID and API key from the Developer Console
      const CLIENT_ID = '304886205033-j4s1jgo4984jfhvnb8rafao5ojlpf7hd.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyBWc1GKjKmZNO08P1_LE9_sBLo3eQraDMs';

      // Array of API discovery doc URLs for APIs used by the quickstart
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');



      /**
       *  On load, called to load the auth2 library and API client library.
       */
       function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
       function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
      }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          // authorizeButton.onclick = handleAuthClick;
          // signoutButton.onclick = handleSignoutClick;
      }, function(error) {
          console.log(JSON.stringify(error, null, 2));
      });
  }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
       function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listUpcomingEvents();
      } else {
          gapi.auth2.getAuthInstance().signIn();
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
      }
  }

      /**
       *  Sign in the user upon button click.
       */
       function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

      /**
       *  Sign out the user upon button click.
       */
       function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

      /**
       * Append a div element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in div element.
       */
       function appendDiv(message) {
        let div = document.getElementById('content');
        let textContent = document.createTextNode(message + '\n');
        div.appendChild(textContent);
    }

      /**
       * Append a eventListItem to the list containing an event from
       * google calendar. Used to display the results of the API call.
       *
       * @param {string} month Text to be placed in span element.
       * @param {string} day Text to be placed in div element.
       * @param {string} summary Text to be placed in h4 element.
       * @param {string} description Text to be placed in p element.
       */
       function appendEventListItem(month, day, summary){
        let eventList = document.getElementById('eventList');
        let event = document.createElement('li');
        let eventLeft = document.createElement('div');
        let eventDate = document.createElement('div');
        let eventMonth = document.createElement('div');
        let eventDay = document.createElement('div');
        let eventMonthText = document.createElement('span');
        let eventBody = document.createElement('div');
        let eventSummary = document.createElement('h4');

        event.className = 'media';
        eventLeft.className = 'media-left';
        eventDate.className = 'panel panel-danger text-center date';
        eventMonth.className = 'panel-heading month';
        eventDay.className = 'panel-body day';
        eventMonthText.className = 'panel-title strong';
        eventBody.className = 'media-body';
        eventSummary.className = 'media-heading';
        eventList.appendChild(event);
        event.appendChild(eventLeft);
        event.appendChild(eventBody);
        eventLeft.appendChild(eventDate);
        eventDate.appendChild(eventMonth);
        eventDate.appendChild(eventDay);
        eventMonth.appendChild(eventMonthText);
        eventBody.appendChild(eventSummary);

        let eventMonthContent = document.createTextNode(month);
        eventMonthText.appendChild(eventMonthContent);

        let eventDayContent = document.createTextNode(day)
        eventDay.appendChild(eventDayContent);

        let eventSummaryContent = document.createTextNode(summary);
        eventSummary.appendChild(eventSummaryContent);
    }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
       function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'k502j2pfv0a1gqld3ql22t8psk@group.calendar.google.com',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
      }).then(function(response) {
          let events = response.result.items;

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              let event = events[i];
              let when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
            }
            let date = new Date(when);

            appendEventListItem(getMonthName(date.getMonth()), date.getDate(), event.summary);
        }
    } else {
        appendDiv('No upcoming events found.');
    }
});
  }


  function getMonthName(month){
    switch(month){
      case 0:
      return 'Jan';
      case 1:
      return 'Feb';
      case 2:
      return 'Mar';
      case 3:
      return 'Apr';
      case 4:
      return 'May';
      case 5:
      return 'Jun';
      case 6:
      return 'Jul';
      case 7:
      return 'Aug';
      case 8:
      return 'Sep';
      case 9:
      return 'Oct';
      case 10:
      return 'Nov';
      case 11:
      return 'Dec';
  }
}