# rtpoll - real time database polling app

Create a mobile application using the real time database with [ionic](http://www.ionicframework.com) and [backand](http://www.backand.com).

1 - To run starter, download zip and run ionic start:

    git clone https://github.com/wirelessdreamer/rtpoll.git rtpoll
    cd rtpoll

2 - Install dependencies from npm
    npm install

3 - Install the backand SDK (required for real time database updates)
    bower install angularbknd-sdk#1.8.2

4 - Run with ionic serve function

    ionic serve

5 - Login as guest or with  user and password (no security is set up in the demo, please don't use this for anything real without configuring security):

  <b>user</b>: ionic@backand.com

  <b>pwd</b>: backand

6 - Enjoy your mobile application, with backand at server side and full CRUD commands to server.

7 - Create a new backand project

8 - Use following model (go to Objects->Model) and delete existing objects, then click on model json, and paste this json:

    [
  {
    "name": "users",
    "fields": {
      "email": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      }
    }
  },
  {
    "name": "sessions",
    "fields": {
      "name": {
        "type": "text"
      },
      "description": {
        "type": "text"
      }
    }
  },
  {
    "name": "answers",
    "fields": {
      "answer": {
        "type": "text"
      },
      "session_id": {
        "type": "text"
      },
      "question_id": {
        "type": "text"
      }
    }
  },
  {
    "name": "questions",
    "fields": {
      "answers": {
        "type": "string"
      },
      "question": {
        "type": "text"
      },
      "question_id": {
        "type": "string"
      },
      "session_id": {
        "type": "string"
      }
    }
  },
  {
    "name": "poll_status",
    "fields": {
      "poll_index": {
        "type": "string"
      },
      "poll_id": {
        "type": "string"
      }
    }
  }
]

9 - Create the server side events that our application will listen for
  Select your app on Backand.com
  	- Objects->answers->Actions->Create->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("answer_created",dbRow);
			    return {};
			}
  		```
        click save

  	- Objects->poll_status->Actions->Create->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("poll_status_created",dbRow);
			    return {};
			}
  		```
        click save

  	- Objects->poll_status->Actions->Update->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("poll_status_updated",dbRow);
			    return {};
			}
  		```
        click save

  	- Objects->answers->Actions->Create->After (click on plus)
  		Name the action
  		```javascript
            'use strict';
            function backandCallback(userInput, dbRow, parameters, userProfile) {
                socket.emitAll("answer_created",dbRow);
                return {};
            }
  		```
        click save

     - Objects->questions->Actions->Create->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("questions_created",dbRow);
			    return {};
			}
  		```
        click save

     - Objects->questions->Actions->Update->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("questions_updated",dbRow);
			    return {};
			}
  		```
        click save

     - Objects->questions->Actions->Delete->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("questions_deleted",dbRow);
			    return {};
			}
  		```
        click save

     - Objects->sessions->Actions->Create->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("sessions_created",dbRow);
			    return {};
			}
  		```
        click save

     - Objects->sessions->Actions->Update->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("sessions_updated",dbRow);
			    return {};
			}
  		```
        click save

     - Objects->sessions->Actions->Delete->After (click on plus)
  		Name the action
  		```javascript
			'use strict';
			function backandCallback(userInput, dbRow, parameters, userProfile) {
			    socket.emitAll("sessions_deleted",dbRow);
			    return {};
			}
  		```
        click save

10 - Configure app.js Config section:
    Select your app on Backand.com, navigate to Docs & API->Ionic Mobile Starter
    Under: Configure Backand's REST API copy the .config entries listed, and replace the corrosponding entries in the starter app's app.js file

    example section:
    ```javascript
        .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
          BackandProvider.setAppName('rtdbintro');
          BackandProvider.setSignUpToken('2f50d55a-e958-4e3e-8d60-67949366d8f4');
          BackandProvider.setAnonymousToken('66efb4e9-f9cc-45ce-b8fd-916b0bef373d');
      })

    ```

11 - change application name in  /js/app.js file at line 26
to your new application name.
