'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const path = require('path')
const app = express()
const TOKEN = process.env.FB_TOKEN


// app.use(express.static(path.join(__dirname, 'frontpage')));


app.set('port', (process.env.PORT)|| 3000)
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
 "WELCOME": ["Hello there, I am Pam, your personal assistant. Let's set you up",
             "I'll help you get up in the mornings and fulfill your personal goals"],
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

 //DAILY
 'VIDEO': {
        "attachment": {
            "type": "video",
            "payload": {
              "url": 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4'
            },
            'text': "Good morning! Ready to save the world? Let this adorable video wake you up!"
        }
    },

 
}

app.get('/', function(req, res) {
  // res.send('I am Pam !');
  console.log('asdf')
  res.redirect('/frontpage/index.html')
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
      console.log("USERRR 0", user);
      return {
        user: user,
        messageSend: prompts.WELCOME
      }
    },
  // SETUP_ROUTINE_PROMPTING
    1: function(user, messageReceived) { //
    //if the user says 'no' to add another routine, set state to 4 to ask for city 
      if(messageReceived === 'no'){
        user.state = 4 
        console.log("USERRR 1=4", user);
        //deleted state 3 that ask for city and put it here 
        //SETUP_CITY_ASKING
        return {
          user,
          messageSend: prompts.CITY
        }
      }
      //else proceed to 2, ask to add another routine
      user.state = 2
      console.log("USERRR 1=2", user);
      return {
        user: user,
        messageSend: prompts.SETUP
      }
    },
  //SETUP_ROUTINE_ASKING & TIME
    2: function(user, messageReceived) { 
      console.log('ethan debug -----', messageReceived);
      //whenever state is set to 2, directly go back to 1
      user.state = 1
      console.log("USERRR 2", user);
      return {
        user: user,
        routine: user.routine.push(messageReceived),
        messageSend: prompts.MOREROUTINE
      }
    },
  //SETUP_TIMETOWAKEUP_ASKING
    4: function(user, messageReceived) { 
      user.state = 5
      console.log("USERRR 4", user);
      return {
        user: user,
        messageSend: prompts.TIMETOWAKEUP
      }
    },
  //SETUP_READY
    5: function(user, messageReceived) { 
      user.state = 6
      console.log("USERRR 5", user);
      //reduce all the routines to a string
      console.log("USER.ROUTINE =====", user.routine);
      var routine = user.routine.reduce(function(prev, cur) {
        return prev +', '+ cur.toString();
      }, '')
      var routineWithoutComma = routine.substring(1)
      console.log("ROUTINE =====", routine);
      console.log("routineWithoutComma =====", routineWithoutComma);
      return {
        user: user,
        messageSend: ["Your morning routine is" + routineWithoutComma + ". We'll remind you every 3 hours.",
        "If you'd like to change your settings at any time, send 'menu'. You are set"]
      }
    },
}

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

// ETHAN DEBUG

// app.post('/webhook', (req, res) => {
//   res.send('ethan debug complete :-)')
// })

app.post('/webhook/', function(req, res){
  var event = req.body.entry[0].messaging[0];
  var messageReceived;
  if (event.postback) {
    messageReceived = event.postback.payload
  } else {
    messageReceived = event.message.text;
  }

  findOrCreateUser(req.body.entry[0].messaging[0].sender.id)
    .then(function(user) { 
      if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP") {
        sendTextMessages([{user, messageSend: "ohai"}])
      }

      //handler is a function that returns user and messageSend, according to the user's state 
      var handler = stateHandlers[user.state];
      //currentState is what it is, before calling handler to set to the next state
      var currentState = user.state;
      // console.log("Moving from state " + currentState + " with " + messageReceived);
      //call handle to set the state to the next 
      var handle = handler(user, messageReceived);
      // console.log("Got to state " + handle.user.state)  
      
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      //changed to 2 after we incremented the state
      if (currentState === 2) { 
        // console.log("attempting a sendButton with ", handle.messageSend);
        return sendButton(handle)
      }
      return sendTextMessages(handle)
    })
    .then(function(resp) {
      return resp.user.save();
    })
    .then(function(user) {
      res.send('OKIE DOKIE');
    })
    .catch(function(err) {
      console.log("[err]", err);
      res.status(200).send(err.message);
    });
});



module.exports = app;
