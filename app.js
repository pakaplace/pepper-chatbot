'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const TOKEN = process.env.FB_TOKEN


app.set('port', 3000)
// localhost: 8080
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//Models
var User = require('./models/models').User;

// var state = {

// /* Setup States */
// 0: "NOT_STARTED",
// 1: "SETUP_ROUTINE_PROMPTING",
// 2: "SETUP_ROUTINE_ASKING_AND_TIME",
// 3: "SETUP_ASKING_CITY",
// 4: "SETUP_ASKING_WAKEUPTIME",
// 5: "SETUP_READY"

// /* Daily States */
// 5: "ROUTINE_NOT_RECEIVED",
// 6: "ROUTINE_IN_PROGRESS",
// 7: "TASKLIST_PROMPTING",
// 8: "TASKLIST_ASKING",
// 9: "TASKLIST_ASKING_TIME"
// }

// DAILY_GREETING_AND_VIDEO (maybe break this up?)
// ASK_DAILY_ROUTINE
// START_DAILY_ROUTINE (ask again until finished)
// DONE_DAILY_ROUINE (and then a reward)
// START_WORKING
// NOT_WORKING
// ASK_FOR_TASKS
// DONE_TASKS
// ASK_REFLECTION_QUESTIONS
// DONE_FOR_THE_DAY




//prompts are all the response PAM would send back
var prompts = {
  //SETUP
 "WELCOME":function(user){
   return  ["Hey there "+ user.firstname, "I am Pam, your personal assistant. Let's set you up",
             "I'll help you get up in the mornings and fulfill your personal goals"]
 },
 "SETUP": ["Meditation, pushups, tea? What's one thing you should you be doing every morning?",
             "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"],
 "MOREROUTINE": {
     "attachment": {
         "type": "template",
         "payload": {
             "template_type": "button",
             "text": 'Would you like to add another morning routine?',
             "buttons": [{
                   "type": "postback",
                   "payload": 'yes',
                   "title": 'yes'
               }, {
                   "type": "postback",
                   "payload": 'no',
                   "title": 'no'
               }]
         }
     }
 },
  "CITY": ['What city do you live in?'],
  'TIMETOWAKEUP':['What time to you want me to wake up?'],
  'FINISHEDSETUP': ["Your routine is X, We'll remind every X hours. If you'd like to change your settings at any time, send'menu'. You are set"],
  "DENYSETUP": ["Slow to rise, huh? You can always go back and add a routine later"],
  "SETUPCOMPLETE": ["You're all set up, from now on I'll remind you daily!", "If you'd like to start now, say something..."],
  "TASKPROMPT": ["Great, what do you have to do today?", "Separate tasks by comma since I'm dumb"],
  "ADDROUTINE":["Awesome. What would you like to add and for how long? One might say, 'Yoga for 20 minutes...' for example"],

  //DAILY
  'START_MORNING': ["Good morning! Ready to save the world? Let this adorable video wake you up!"],
  'ASK_MORNING_ROUTINE': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Ready to start your morning routine?',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'no'
                }]
          }
      }
  },
  // IF YES, START TIMER
  'START_MORNING_ROUTINE': ['Which one would you like to start?'], // + button this one will get asked again and again
  'DONE_DAILY_ROUINE': ['Congrats on finishing your morning routine! Such a good way to start the day!'],
  // IF NO, START WORKING
  'START_WORKING': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Ready to start working?',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'no'
                }]
          }
      }
  },
  'DONE_WORKING': ['Congrats for such a productive day! Take a rest with this video.'],
  'NO_WORKING': ['You lazy piece of shit! Let me know when you get over your laziness.'],
  'ASK_FOR_TASKS': ['What are your tasks today? Add a task.'],
  'ADD_ANOTHER_TASK': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Add another task?',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'no'
                }]
          }
      }
  },
  'SHOW_TASKS': ['Here is your tasklist! Wish you a productive day.'],
  'ASK_REFLECTION_QUESTIONS': ['How was your day?'],
  "ERROR" : ["Please setup your profile before changing your preferences"],
  "CHANGE_TIME": ["Gotcha. I've updated your wakeup time to: "],
  "CHANGE_CITY" : ["Gotcha. I've updated your city to: "]
}

app.get('/', function(req, res) {
  res.send('I am Pam !');
  console.log('asdf')
});

//get user's messages and verify the token. This is from the website
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_mypassword_verify_me') {
        return res.send(req.query['hub.challenge']);
    }
    return res.send('Error, wrong token');
});

//stateHandlers set user's state and return the user and the messageSend
var stateHandlers = {
  //NOT_STARTED
    0: function(user, messageReceived) {
      //set state to 1, ask for routine
      user.state = 1
      console.log("USER-----*****-------****", user);
      return {
        user: user,
        messageSend: prompts.WELCOME(user)
      }
    },
  // SETUP_ROUTINE_PROMPTING
    1: function(user, messageReceived) { //
    //if the user says 'no' to add another routine, set state to 4 to ask for city
      if(messageReceived === 'no'){
        user.state = 4
        //deleted state 3 that ask for city and put it here
        //SETUP_CITY_ASKING
        return {
          user,
          messageSend: prompts.CITY
        }
      }
      //else proceed to 2, ask to add another routine
      user.state = 2
      return {
        user: user,
        messageSend: prompts.SETUP
      }
    },
  //SETUP_ROUTINE_ASKING & TIME
    2: function(user, messageReceived) {
      //whenever state is set to 2, directly go back to 1
      user.state = 1
      user.routine.push(messageReceived)
      return {
        user: user,
        messageSend: prompts.MOREROUTINE
      }
    },
  //SETUP_TIMETOWAKEUP_ASKING
    4: function(user, messageReceived) {
      user.state = 5
      user.city = messageReceived
      return {
        user: user,
        messageSend: prompts.TIMETOWAKEUP
      }
    },
  //SETUP_READY
    5: function(user, messageReceived) {
      user.state = 6
      user.timeToWakeUP = messageReceived
      //reduce all the routines to a string
      var routine = user.routine.reduce(function(prev, cur) {
        return prev +', '+ cur.toString();
      }, '')
      var routineWithoutComma = routine.substring(1);
      return {
        user: user,
        messageSend: ["Your morning routine is " + routineWithoutComma + ". We'll remind you every 3 hours.",
        "If you'd like to change your settings at any time, send 'menu'. You are set"]
      }
    },
  //START_MORNING
    6: function(user, messageReceived) {
      user.state = 7
      return {
        user: user,
        messageSend: prompts.START_MORNING
      }
    }, //send video here
  //ASK_DAILY_ROUTINE
    7: function(user, messageReceived) {
      user.state = 8
      return {
        user: user,
        messageSend: prompts.ASK_MORNING_ROUTINE
      }
    },
  // START_DAILY_ROUTINE
    8: function(user, messageReceived) {
    //from state 7 asking if you want to start morning routine
      if (messageReceived === 'no') {
        user.state = 10 //start working
      }
    //if the user has finished morning routine
      if (!user.routineCopy.length) {
        user.state = 9
      }
      return {
        user: user,
        messageSend: prompts.START_MORNING_ROUTINE
      }
    }, //ask again until finished
  // DONE_DAILY_ROUINE
    9: function(user, messageReceived) {
      user.state = 10
      return {
        user: user,
        messageSend: prompts.DONE_DAILY_ROUINE
      }
    }, // give a reward
  // START_WORKING
    10: function(user, messageReceived) {
      user.state = 13
      return {
        user: user,
        messageSend: prompts.START_WORKING
      }
    },
  // DONE_WORKING
    11: function(user, messageReceived) {
      user.state = 16
      return {
        user: user,
        messageSend: prompts.DONE_WORKING
      }
    },
  // ASK_FOR_TASKS
    13: function(user, messageReceived) {
      user.tasks.push(messageReceived);
      if (messageReceived === 'no') {
        //NO_WORKING
        user.state = 16
        return {
          user: user,
          messageSend: prompts.NO_WORKING
        }
      }
      user.state = 14
      return {
        user: user,
        messageSend: prompts.ASK_FOR_TASKS
      }
    },
  // ADD_ANOTHER_TASK
    14: function(user, messageReceived) {
    //user dont want to add a new task
      if (messageReceived === 'no') {
        user.state = 15
      } else if (messageReceived === 'yes') {
        user.state = 13
      }
      return {
        user: user,
        messageSend: prompts.ADD_ANOTHER_TASK
      }
    },
  // SHOW_TASK
    15: function(user, messageReceived) {
    //if the user has finished all the tasks
      if (!user.tasks.length) {
        user.state = 11
      }
      return {
        user: user,
        messageSend: prompts.SHOW_TASKS
      }
    },
  // ASK_REFLECTION_QUESTIONS
    16: function(user, messageReceived) {
      user.state = 17
      return {
        user: user,
        messageSend: prompts.ASK_REFLECTION_QUESTIONS
      }
    },

  // >= 100: EDIT STATES
  // EDIT_WAKEUP_TIME
    100: function(user, messageReceived){
      user.timeToWakeUP = messageReceived
      user.state = user.prevState; //remembers where you were before menu
      user.prevState = 100;
        var CHANGE_TIME = prompts.CHANGE_TIME;
        CHANGE_TIME += user.timeToWakeUP;
          return {
           user,
           messageSend: [CHANGE_TIME]
          }
    },
  // EDIT_CITY
    101: function(user, messageReceived){
      user.city = messageReceived
      user.state = user.prevState;
      user.prevState = 101;
        var CHANGE_CITY = prompts.CHANGE_CITY;
        CHANGE_CITY += user.city;
      return {
        user,
        messageSend: [CHANGE_CITY]
      }
    },
    // EDIT_ROUTINES sendMultiButton creates a message with multiple buttons of the tasks/routines in the array
    102: function(user, messageReceived) {
      console.log("I AM IN STATE 1022222222")
      console.log("messageReceived===========================:", messageReceived);
      // sendButtons(menuMessage, user.routine, menuMessage.messageSend, ["Delete this routine", {
      //   type: 'postback',
      //   title: "Add new routine",
      //   payload: "ADD_NEW_ROUTINE"
      // }])
      console.log("MESSAGEEE RECEIVEDDDDDDD", messageReceived)
      if(messageReceived === "ADD_NEW_ROUTINE"){
        user.state = 103
        return {
          user,
          messageSend: prompts.ADDROUTINE
        }
      } else if (messageReceived === "DELETE_ROUTINE"){
     if (user.routine.indexOf(messageReceived) !== -1) {
        var index = user.routine.indexOf(messageReceived)
        user.routine.splice(index, 1)
      }
        return {
          user,
          messageSend: ["Your routine"+ user.routine +"has been deleted"]
        }
      }
    },
    //add routine
    103: function(user, messageReceived) {
      user.routine.push(messageReceived)
      user.state = user.prevState;
      user.prevState = 103;
      return {
        user: user,
        messageSend: ["Your Routine has been added"]
      }
    },
    104: function(user, messageReceived) {
     if (user.routine.indexOf(messageReceived) !== -1) {
        var index = user.routine.indexOf(messageReceived)
        user.routine.splice(index, 1)
        user.save(function(err) {console.log('err from saving routine',err)})
      }
    }
}

// ETHAN DEBUG

// app.post('/webhook', (req, res) => {
//   res.send('ethan debug complete :-)')
// })

app.post('/test/timeout', (req, res, next) => {
  console.log('entering timeout')
  setTimeout(() => {
    sendTextMessages({user: '1069904196424805', messageSend: ["You sent this " + req.body.delay + " seconds after this"]})
    // {[
    //   "You sent this " + req.body.delay + " seconds after this"
    // ]);
  }, req.body.delay);
})

app.post('/webhook/', function(req, res){
  var event = req.body.entry[0].messaging[0];
  var messageReceived;

  if (event.postback) {
    messageReceived = event.postback.payload
  } else {
    messageReceived = event.message.text;
  }

  findOrCreateUser(req.body.entry[0].messaging[0].sender.id) //returns a promise
    // .then(function(user){
    //   request('https://graph.facebook.com/v2.6/'+user.facebookId+'?fields=first_name,\
    //     timezone,locale,gender&access_token='+TOKEN,
    //       function(err, req, body) {
    //         if(body){
    //           console.log("BODY-----  ", body)
    //           console.log("Body type: ", typeof body);
    //           body = JSON.parse(body);
    //           user.firstname = body.first_name;
    //           user.timezone = body.timezone;
    //           user.locale = body.locale;
    //           user.gender = body.gender;
    //           console.log("USER YO--------------",user);
    //           user.save(); //placep
    //         }
    //       })
    //     console.log("USER 1st Then---", user)
    //     return user;
    .then(function(user){
      return new Promise((resolve, reject) => {
        request('https://graph.facebook.com/v2.6/'+user.facebookId+'?fields=first_name,\
        timezone,locale,gender&access_token='+TOKEN, (err, req, body) => {
          if (err) reject(err);
          if(body){
            console.log("BODY-----  ", body)
            console.log("Body type: ", typeof body);
            body = JSON.parse(body);
            user.firstname = body.first_name;
            user.timezone = body.timezone;
            user.locale = body.locale;
            user.gender = body.gender;
            // user.save(); //placep
            resolve(user);
          }
        })
      })
    }).then(function(user) {
      console.log("MESSAGE RECEIVED ", messageReceived)
      //user.prevState is what it is, before calling handler to set to the next state
      // freeze prevState if state is >= 100
      if (user.state < 100) user.prevState = user.state;

      /* BEGIN MENU MESSAGE HANDLING */
      var menuMessage = checkForMenu(user, messageReceived);
      if (menuMessage) {
        if (user.prevState < 6) {
          throw sendTextMessages({user, messageSend: prompts.ERROR})
        }
        //
        if (user.state === 102) {
          console.log("I AM IN STATE 1022222222")
          console.log("messageReceived===========================:", messageReceived);
          sendButtons(menuMessage, user.routine, [
          {
            type: 'postback',
            title: "Delete this routine",
            payload: "DELETE_ROUTINE"},
          {
            type: 'postback',
            title: "Add new routine",
            payload: "ADD_NEW_ROUTINE"
          }])
        }
        return sendTextMessages(menuMessage);
      } else {
        // user has responded to some menu
        // if(messageReceived === "ADD_NEW_ROUTINE"){
        //     console.log("Adding a routine");
        //     user.state=1
        //   }

      }
      /* END MENU MESSAGE HANDLING */
      console.log("HeyYa1---", user)
      //handler is a function that returns user and messageSend, according to the user's state
      var handler = stateHandlers[user.state];

      // console.log("Moving from state " + currentState + " with " + messageReceived);

      //call handle to set the state to the next
      var handle = handler(user, messageReceived);
      // console.log("Got to state " + handle.user.state)

      /*MANAGE MORNING ROUTINE*/
      //create a copy of routine in the user model
      //slice the one with the same handle
      if (user.routineCopy.length === 0 && user.state === 8) {
        user.routineCopy = user.routine.slice();
      } else {
        user.routineCopy = user.routineCopy.slice();
      }
      //when user click on 'finish'
      if (user.routineCopy.indexOf(messageReceived) !== -1) {
        var index = user.routineCopy.indexOf(messageReceived)
        user.routineCopy.splice(index, 1)
        user.save(function(err) {console.log('err from saving routine',err)})
        if (time) {
          clearTimeout(time)
        }
      }
      //when the user start the routine
      else if (messageReceived === 'start'){
        //need time for the routine
        var time = setTimeout(() => sendTextMessages({user, messageSend: ['Half a minute left']}), 1000)
        return handle;
      }
      /*END OF MORNING ROUTINE*/

      /*START OF PAM RESPONSE*/
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      if (user.state >= 100) {
        return sendTextMessages(handle);
      }
      //changed to 2 after we incremented the state
      else if (user.prevState === 2 || user.prevState === 7 || user.prevState === 10 || user.prevState === 14) {
        // console.log("attempting a sendButton with ", handle.messageSend);
        return sendButton(handle)
      //send a video
      } else if (user.prevState === 6 || user.prevState === 9 || user.prevState === 11) {
      //the video here will be randomly generated later
        return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend)
      } else if (user.prevState === 8 || user.prevState === 15) {
        return sendMultiButton(handle, user.routineCopy, handle.messageSend, 'start', 'finish')
      }
      return sendTextMessages(handle)
    })
    .then(function(resp) {
      console.log("RESP.USER------------"+ resp.user);
      return resp.user.save();
    })
    .then(function(user) {
      res.send('OKIE DOKIE');
    })
    .catch(function(err) {
      console.log("[err]", err);
      res.status(200).send(err.message);
    })
});

// findOrCreateUser(facebookId<string>)
// This finds or creates a user given its facebook ID
function findOrCreateUser(facebookId) {

  var promise = new Promise(function(resolve, reject) { //both are functions
    User.findOne({facebookId: facebookId})
      .then(function(user) { //if there is a user
        if (user) {
          resolve(user); //what is resolve
        } else { //if there is not yet a user
          user = new User({facebookId: facebookId});
          user.save().then(resolve).catch(reject);
        }
      })
      .catch(reject); //if there is an error
  });
  return promise;
}

//setTextMessages sends messages in an array
var sendTextMessages = function(resp) {
  return new Promise(function(resolve, reject) {
    function callback(error, response) {
      if (error) {
        reject(error);
      } else if (response && response.body && response.body.error) {
        reject(response.body.error);
      } else if (resp.messageSend.length) {
        var message = resp.messageSend[0];
        resp.messageSend = resp.messageSend.slice(1);
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: TOKEN},
          method: 'POST',
          json: {
            recipient: {id: resp.user.facebookId},
            message: {
              text: message
            }
          }
        }, callback);
      } else {
        resolve(resp);
      }
    }
    callback(); //first time calling the callback
  });
}

//sendButton handles messages that contains a button
function sendButton(resp) {
  return new Promise(function(resolve, reject) {
    var messageData = resp.messageSend;
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: {id: resp.user.facebookId},
        message: messageData
      }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
        //this is the callback and pass down resp
          resolve(resp)
        }
    })
  })
}

//sendVideo takes resp, url, text to send a video
function sendVideo(resp, url, text) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
          "type": "video",
          "payload": {
            "url": url
          }
      }
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: {id: resp.user.facebookId},
        message: messageData
      }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
        //this is the callback and pass down resp
          resolve(resp)
        }
    })
  })
}

//sendVideo takes resp, url, text to send a video
function sendVideo(resp, url, text) {
  return sendTextMessages(resp)
  .then(function(resp) {
    return new Promise(function(resolve, reject) {
      var messageData = {
        "attachment": {
            "type": "video",
            "payload": {
              "url": url
            }
        }
      }
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: TOKEN},
        method: 'POST',
        json: {
          recipient: {id: resp.user.facebookId},
          message: messageData
        }
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: ', response.body.error)
          } else {
          //this is the callback and pass down resp
            resolve(resp)
          }
      })
    })
  })
}

//sendMultiButton creates a message with multiple buttons of the tasks/routines in the array
function sendMultiButton(resp, arr, text, buttonTitle1, buttonTitle2) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            // "text": text,
            "elements": []
        }
      }
    }
    arr.forEach(function(element) {
      var el = {
        "title": element,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": "http://cdn1.bostonmagazine.com/wp-content/uploads/2013/10/mornign-yoga-main.jpg",
        "buttons": [{
          'type': 'postback',
          'payload': buttonTitle1,
          'title': buttonTitle1
        },{
          'type': 'postback',
          'payload': element,
          'title': buttonTitle2
        }]
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.user.facebookId},
            message: messageData,
        }
      }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

//sendMultiButton creates a message with multiple buttons of the tasks/routines in the array
function sendButtons(resp, arr, buttonArray) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": []
        }
      }
    }
    arr.forEach(function(element) {
      var el = {
        "title": element,
        "image_url": "http://cdn1.bostonmagazine.com/wp-content/uploads/2013/10/mornign-yoga-main.jpg",
        buttons: buttonArray.map((title) => {
          if (typeof title === "object") {
            return title;
          } else {
            return {
              type: 'postback',
              title,
              payload: title
            }
          }
        })
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.user.facebookId},
            message: messageData,
        }
      }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

function checkForMenu(user, messageReceived) {
  var ret = null;
  if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP") {
    user.state = 100;
      ret = {
        user,
        messageSend: ["Your current wake up time is " + user.timeToWakeUP + ". What time do you want it to be?"]
      }
    }
     else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_CITY") {
      user.state = 101;
      ret = {
        user,
        messageSend: ["Your current city is " + user.city + ". Which one do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES") {
      user.state = 102;
      ret = {
        user,
        messageSend: ["Your current routine is:"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE") {
      ret = {
        user,
        messageSend: ["Your message frequency is " + user.frequency + ". What do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION") {
      ret = {
        user,
        messageSend: ["ohai"]
      }
    }

    return ret;
}


module.exports = app;
