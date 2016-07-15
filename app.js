'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

//Models
var User = require('./models/models').User;

app.set('port', (process.env.PORT)|| 3000)

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//get user's messages and verify the token. This is from the website
app.get('/webhook/', function(req, res) {
  console.log(req.query)
  if (req.query['hub.verify_token'] === 'my_voice_is_mypassword_verify_me') {
        return res.send(req.query['hub.challenge'])
    }
    return res.send('Error, wrong token')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


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
      } else if (resp.message.length) {
        var message = resp.message[0];
        resp.message = resp.message.slice(1);
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: token},
          method: 'POST',
          json: {
            recipient: {id: sender},
            message: message
          });
        }, callback);
      } else {
        resolve(resp)
      }
    }
    callback(); //first time calling the callback
  });
}

module.exports = {

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

[11:21]
module.exports = {
 "WELCOME": ["Hello there, I am Pam, your personal assistant. Let's set you up",
             "I'll help you get up in the mornings and fulfill your personal goals"],
 "SETUP": ["Meditation, pushups, tea? What's one thing you should you be doing every morning?",
             "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"],
 "DENYSETUP": ["Slow to rise, huh? You can always go back and add a routine later"],
 "SETUPCOMPLETE": ["You're all set up, from now on I'll remind you daily!", "If you'd like to start now, say something..."],
 "TASKPROMPT": ["Great, what do you have to do today?", "Separate tasks by comma since I'm dumb"]
}

app.post('/webhook/', function(req, res){
  var stateHanders = {
    0: function(user, messageReceived) {
      // Greet
      //return state and message --> message can be an object
      user.state = 2
      return {
        user: user,
        messageSend: "Hello there, I am Pam, your personal assistant. Let's set you up",
        "I'll help you get up in the mornings and fulfill your personal goals"
      }
    },
    1: function()
  }
