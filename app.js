'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const TOKEN = process.env.FB_TOKEN
const WIT_TOKEN = process.env.WIT_TOKEN
const WitThing = require('node-wit');
const wit = new WitThing.Wit({accessToken: WIT_TOKEN});
const moment = require('moment');
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// let Wit = null;
// let log = null;
// try {
//   // if running from repo
//   Wit = require('../').Wit;
//   log = require('../').log;
// } catch (e) {
//   Wit = require('node-wit').Wit;
//   log = require('node-wit').log;
// }





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
 "SETUP": function(errorMessage){
  var arr = [errorMessage,"Meditation, pushups, tea? What's one thing you should you be doing every morning?",
             "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"]
  if(!errorMessage){
      arr.splice(0,1);
    }
   return arr
 },
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
  "CITY": function(errorMessage){
    var arr = [errorMessage,"What city and state do you live in? For example, you could say 'Chapel Hill, North Carolina'... "]
    if(errorMessage === undefined){
      arr.splice(0,1);
    }
    return arr
  },
  'TIMETOWAKEUP':function(errrorMessage){
    var arr = [errorMessage,'What time to you want me to wake up?']
    if(errorMessage === undefined){
      arr.splice(0,1);
    }
    return arr},
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
  "SAVE_REFLECTION_QUESTION" : ["Thank you, your reflection has been saved.", "Check out your memories at www.x.com"],
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
          messageSend: prompts.CITY()
        }
      }
      //else proceed to 2, ask to add another routine
      user.state = 2
      return {
        user: user,
        messageSend: prompts.SETUP("Great!")
      }
    },
  //SETUP_ROUTINE_ASKING & TIME
    2: function(user, messageReceived, data) { //add data as third parameter
      //whenever state is set to 2, directly go back to 1
      user.state = 1
      var newRoutine = {};
      console.log("DATA WOOHOOOOOOOO", data.entities.duration);
      newRoutine.routine = data.entities.agenda_entry[0].value,
      newRoutine.duration = data.entities.duration[0].normalized.value/60 //to acount for seconds
      if(data.entities.agenda_entry === undefined){ // data.entities.location === 'undefined'
          user.state = 2
          return {user, messageSend: prompts.SETUP("Woops, either you forgot to include a routine or I didn't pick up on that?")}
      }
      if(data.entities.duration === 'undefined'){
          user.state = 2
          return {user, messageSend: prompts.SETUP("For how long? 5 minutes, half an hour...?")}
      }
      else{
        var status = "Awesome!"
        user.routine.push(newRoutine)
      }

      return {
        user: user,
        messageSend: prompts.MOREROUTINE
      }
    },
  //SETUP_TIMETOWAKEUP_ASKING
    4: function(user, messageReceived, data) {
      user.state = 5
      if(data.entities.location === 'undefined'){
        user.state=4;
        return { user: user, messageSend:prompts.CITY("Oops, looks like you didn't enter in the name of your state.")
        }
      }
      user.city = data.entities.location[0].value;
      return {
        user: user,
        messageSend: prompts.TIMETOWAKEUP()
      }
    },
  //SETUP_READY
    5: function(user, messageReceived, data) {
      console.log("yoyoyo ")
      user.state = 6
      user.timeToWakeUp.hour = new Date(data.entities.datetime[0].values[0].value).getHours();
      user.timeToWakeUp.minute = new Date(data.entities.datetime[0].values[0].value).getMinutes();
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      //reduce all the routines to a string
      console.log("ROUTINE 1", user.routine)
      var routine = user.routine.reduce(function(prev, cur) {
        console.log("yoyoyo ",prev)
        return prev + cur.routine.toString() + " for "+ cur.duration.toString() + " minutes , " ;
      }, ' ')
      console.log("ROUTINE 2", user.routine)
      return {
        user: user,
        messageSend: ["Your morning routine is" + routine + "We'll remind you every 3 hours.",
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
      user.state = 12
      return {
        user: user,
        messageSend: prompts.START_WORKING
      }
    },
  // DONE_WORKING
    11: function(user, messageReceived) {
      user.state = 13
      return {
        user: user,
        messageSend: prompts.DONE_WORKING
      }
    },
    12: function(user, messageReceived) {
      if (messageReceived === 'yes') {
        user.state = 14
        return {
          user,
          messageSend: prompts.ASK_FOR_TASKS
        };
      } else if (messageReceived === 'no') {
        user.state = 16
        return {
          user: user,
          messageSend: prompts.NO_WORKING
        }
      }
    },

  // ASK_FOR_TASKS
    13: function(user, messageReceived) {
      if (messageReceived === 'yes') {
        user.state = 14
        return {
          user: user,
          messageSend: prompts.ASK_FOR_TASKS
        }
      } else if (messageReceived === 'no') {
        user.state = 15
        return {
          user,
          messageSend: prompts.SHOW_TASKS
        }
      }
    },
  // ADD_ANOTHER_TASK yes or no
    14: function(user, messageReceived) {
      user.tasks.push(messageReceived);
      user.state = 13
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
      user.state = 15;
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
      // SAVE_REFLECTION_QUESTION
    17: function(user, messageReceived) {
      user.reflection.push(messageReceived)
      return {
        user: user,
        messageSend: prompts.SAVE_REFLECTION_QUESTION
      }
    },

  // >= 100: EDIT STATES
  // EDIT_WAKEUP_TIME
    100: function(user, messageReceived){ //fix
      user.timeToWakeUp = messageReceived
      user.state = user.prevState; //remembers where you were before menu
      // user.prevState = 100;
      user.prevState = null;
        var CHANGE_TIME = prompts.CHANGE_TIME;
        CHANGE_TIME += user.timeToWakeUp;
          return {
           user,
           messageSend: [CHANGE_TIME]
          }
    },
  // EDIT_CITY
    101: function(user, messageReceived){
      user.city = messageReceived
      // user.state = user.prevState; //remembers where you were before menu
      // user.prevState = 101;
      console.log("[User prev state]: ", user.prevState);
      user.state = user.prevState
        var CHANGE_CITY = prompts.CHANGE_CITY;
        CHANGE_CITY += user.city;
      return {
        user,
        messageSend: [CHANGE_CITY]
      }
    },
    // EDIT_ROUTINES sendMultiButton creates a message with multiple buttons of the tasks/routines in the array
    102: function(user, messageReceived) {
      // user.state = user.prevState; //remembers where you were before menu
      if(messageReceived.indexOf("ADD_NEW_ROUTINE") > -1 ){
        user.state = 103
        return {
          user,
          messageSend: prompts.ADDROUTINE
        }
      } else if (messageReceived.indexOf("DELETE_ROUTINE") > -1){

        var index = parseInt(messageReceived[messageReceived.length-1])
        var deletedMessage = user.routine[index]
        user.routine.splice(index, 1)

        return {
          user,
          messageSend: ["Your routine "+ deletedMessage +" has been deleted"]
        }
      }
    },
    //add routine
    103: function(user, messageReceived) {
      user.routine.push(messageReceived)
      user.state = user.prevState;
      user.prevState = null;
      return {
        user: user,
        messageSend: ["Your Routine has been added"]
      }
    },
}

// ETHAN DEBUG

// app.post('/webhook', (req, res) => {
//   res.send('ethan debug complete :-)')
// })

app.get('/reflection', (req, res, next) => {
  User.find(function(err, users) {
    if (err) res.status*(400).send(err);
    res.render('index')
  })
  var data = require('./reflection.json')
  data = JSON.stringify(data);
  res.render('index', {
    data
  })
})

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
    .then(function(user){
      console.log("MESSAGE RECEIVED YO", messageReceived)
      return new Promise(function(resolve, reject){
        console.log("MESSAGE RECEIVED YO", messageReceived)
        wit.message(messageReceived, {})
        .then((data) => {
          console.log("Yay, got a Wit.ai response ", data);
          req.witData = data;
          resolve(user)
        })
      })
    })
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
      // console.log("MESSAGE RECEIVED ", messageReceived)
      //user.prevState is what it is, before calling handler to set to the next state
      // freeze prevState if state is >= 100
      console.log("+++++++User state+++++:", user.state)
      console.log("+++++++User prevState+++++:", user.prevState)
      if (user.state < 100) user.prevState = user.state;

      /* BEGIN MENU MESSAGE HANDLING */
      var menuMessage = checkForMenu(user, messageReceived);
      if (menuMessage) {
        if (user.prevState < 6) {
          throw sendTextMessages({user, messageSend: prompts.ERROR})
        }
        //
        if (user.state === 102) {
          console.log("I AM IN STATE 200222222")
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
      }
      /* END MENU MESSAGE HANDLING */
      // console.log("HeyYa1---", user)
      //handler is a function that returns user and messageSend, according to the user's state
      var handler = stateHandlers[user.state]; //wrap everything inside of a .then()

      // console.log("Moving from state " + currentState + " with " + messageReceived);

      //call handle to set the state to the next
      // if (typeof handler === 'promise')
      var handle = handler(user, messageReceived, req.witData); //add req.witData
      // console.log("Got to state " + handle.user.state)


      ///////////////////// FOR DEBUG PURPOSES /////////////////////////////////
      // sendTextMessages({user, messageSend: ["[L492] You are in state " + user.state + ", coming from: " + user.prevState]});

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
        // if (handle === promices) {
        //   handle.then((data) => {
        //     sendTextMessages(data)
        //   })
        // }
        return sendTextMessages(handle);
      }
      //changed to 2 after we incremented the state
      else if (user.prevState === 2 || user.prevState === 7 || user.prevState === 10 || user.prevState === 14) {
        // console.log("attempting a sendButton with ", handle.messageSend);
        return sendButton(handle)
      //send a video
      } else if (user.prevState === 6 || user.prevState === 11) {
      //the video here will be randomly generated later
        return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend)
      } else if (user.prevState === 8 && user.state === 8) {
        // if (user.routineCopy.length) {

          return sendMultiButton(handle, user.routineCopy, handle.messageSend, 'start', 'finish')
        // } else {
        //   user.prevState = 8;
        //   user.state = 9;
          // return sendTextMessages({user, messageSend: ['hi']})
          //how can i trigger again??
        // }
      } else if (user.prevState === 8 && user.state === 9) {
        return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend)

      } else if (user.state === 15 && user.prevState === 13) {
        return sendMultiButton(handle, user.tasks, handle.messageSend, 'start', 'finish')
      }
      return sendTextMessages(handle)
    })
    .then(function(resp) {
      console.log("RESP", resp)
      console.log("RESP.USER------------"+ resp.user);
      return resp.user.save();
    })
    .then(function(user) {
      res.send('OKIE DOKIE');
    })
    .catch(function(err) {
      console.log("[err]", err, typeof err);
      res.status(200).send(err.message);
    })

    if (typeof handler === 'promise') {} //depending on which type of handler is returned
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
        console.log("MESSAGESENDDDD", resp.messageSend)
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
  console.log("Sending arrary: ", arr);
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
  console.log(buttonArray);
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
    arr.forEach(function(element, i) {
      var el = {
        "title": element.routine,
        "image_url": "http://cdn1.bostonmagazine.com/wp-content/uploads/2013/10/mornign-yoga-main.jpg",
        buttons: buttonArray.map((button) => {
            return {
              type: 'postback',
              title: button.title,
              payload: button.payload + i
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
  user.pr
  if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP") {
    user.prevState = user.state; // remember the state you were before opening menu
    user.state = 100;
      ret = {
        user,
        messageSend: ["Your current wake up time is " + user.timeToWakeUp + ". What time do you want it to be?"] //fix
      }
    }
     else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_CITY") {

      user.prevState = user.state; // remember the state you were before opening menu
      user.state = 101;
      ret = {
        user,
        messageSend: ["Your current city is " + user.city + ". Which one do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES") {

      user.prevState = user.state; // remember the state you were before opening menu
      user.state = 102;
      ret = {
        user,
        messageSend: ["Your current routine is:"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE") {

      user.prevState = user.state; // remember the state you were before opening menu
      ret = {
        user,
        messageSend: ["Your message frequency is " + user.frequency + ". What do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION") {

      user.prevState = user.state; // remember the state you were before opening menu
      ret = {
        user,
        messageSend: ["ohai"]
      }
    }


    return ret;
}


module.exports = app;
