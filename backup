'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = "EAACGElIklxMBAGeo6OyZBOOPCudxZCun6dF7noz5P3HixXIzeZClJNDkzQLAFZCyl61Thn98jXzuNo6bE85ZBaxmK5bBmutKFR9O9mLuFJl5h6NHl55L1EmslH6u53IbKtLYTqj2FPmIojrv2wpJ0odaS7ZCh5RUY0XXGymp3qxQZDZD"

app.set('port', (process.env.PORT)|| 3000)
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

var state = {

 /* Setup States */
 0: "NOT_STARTED",
 1: "SETUP_ROUTINE_PROMPTING",
 2: "SETUP_ROUTINE_ASKING",
 3: "SETUP_ROUTINE_ASKING_TIME",
 4: "SETUP_ASKING_TIME",

 /* Daily States */
 5: "ROUTINE_NOT_RECEIVED",
 6: "ROUTINE_IN_PROGRESS",
 7: "TASKLIST_PROMPTING",
 8: "TASKLIST_ASKING",
 9: "TASKLIST_ASKING_TIME"
}

var prompts = {
 "WELCOME": ["Hello there, I am Pam, your personal assistant. Let's set you up",
             "I'll help you get up in the mornings and fulfill your personal goals"],
 "SETUP": ["Meditation, pushups, tea? What's one thing you should you be doing every morning?",
             "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"],
 "MOREROUTINE": ['Would you like to add another morning routine?'],
 "CITY": ['What city do you live in?'],
 'TIMETOWAKEUP':['What time to you want me to wake up?'],
 'FINISHEDSETUP': ["Your routine is X, We'll remind every X hours. If you'd like to change your settings at any time, send'menu'. You are set"],
 "DENYSETUP": ["Slow to rise, huh? You can always go back and add a routine later"],
 "SETUPCOMPLETE": ["You're all set up, from now on I'll remind you daily!", "If you'd like to start now, say something..."],
 "TASKPROMPT": ["Great, what do you have to do today?", "Separate tasks by comma since I'm dumb"]
}

//Models
var User = require('./models/models').User;

app.get('/', function(req, res) {
  res.send('I am a chatbot')
})

//get user's messages and verify the token. This is from the website
app.get('/webhook/', function(req, res) {
  // console.log('getttt', req.query)
  if (req.query['hub.verify_token'] === 'my_voice_is_mypassword_verify_me') {
        return res.send(req.query['hub.challenge'])
    }
    return res.send('Error, wrong token')
})


var stateHandlers = {
    0: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 1
      return {
        user: user,
        messageSend: prompts.WELCOME
      }
    },
    1: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 2
      return {
        user: user,
        messageSend: prompts.SETUP
      }
    },
    2: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 3
      return {
        user: user,
        messageSend: prompts.MOREROUTINE
      }
    },
    3: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 4
      return {
        user: user,
        messageSend: prompts.CITY
      }
    },
    4: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 5
      return {
        user: user,
        messageSend: prompts.TIMETOWAKEUP
      }
    },
    5: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 6
      var routine = user.routine.reduce(function(prev, cur) {
        return prev + cur.toString();
      }, '')
      return {
        user: user,
        messageSend: "Your morning routine is " + routine + ", We'll remind you every 3 hours. \
        If you'd like to change your settings at any time, send'menu'. You are set"
      }
    }
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

// setUpUserIfNotSetup(user<object>, callback <function>)
// this checks if the user is setUp (have been here before), if not, it should prompt it to set up

function setUpUserIfNotSetup(user, callback) {
  if (! user.routineQuestion) { //check if the user is set up
    return sendTextMessages(user.facebookId, //go back to set up
      ["Hello there, I am Pam, your personal assistant. Let's set you up",
      "I'll help you get up in the mornings and fulfill your personal goals"],
      function() {
        user.routineQuestion = true;
        user.save(function(err, user) {
          console.log('error when saving user in setup', err);
          callback(user);
        })
      });
  }
  callback(user);
}



//findOrCreate -if the user has been here

//hasSetUp -of the user has finished set up

var sendTextMessages = function(resp) {
  return new Promise(function(resolve, reject) {
    function callback(error, response) {
      if (error) {
        reject(error);
      } else if (response && response.body && response.body.error) {
        reject(response.body.error);
      } else if (resp.messageSend.length) {
        var message = resp.messageSend[0];
        resp.message = resp.messageSend.slice(1);
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: token},
          method: 'POST',
          json: {
            recipient: {id: sender},
            message: message
          }
        }, callback);
      } else {
        resolve(resp)
      }
    }
    callback(); //first time calling the callback
  });
}

app.post('/webhook/', function(req, res){
  console.log('posttttt', req.body.entry[0])
  var event = req.body.entry[0].messaging[0];
  var messageReceived;
  // console.log('event.postback.payload', event.postback.payload)
  console.log('event.message.text', event.message.text)

  if (event.postback) {
    messageReceived = event.postback.payload
  } messageReceived = event.message.text;

  console.log('messageReceived', messageReceived)

  findOrCreateUser(req.body.entry[0].id)
    .then(function(user) { //takes a user from resolve
      console.log("[user]", user);
      var handler = stateHandlers[user.state];
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      return handler(user, messageReceived);
    })
    .then(function(resp) { //what the function is going to return
      console.log("[response]", resp);
      return sendTextMessages(resp)}) //this needs to be the full response, considering the nest
    .then(function(user) {
      console.log("[user]", user);
      return user.save()})
    .then(function() {
      console.log("[sent] response");
      res.send('OK');
    }) //update ,message to user
    .catch(function(err) {
      console.log("[err]", err);
      res.status(500).send(err.message);
    });
});

module.exports = app;
