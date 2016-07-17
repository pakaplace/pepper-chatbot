'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const TOKEN = process.env.FB_TOKEN

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
      user.save();
      return {
        user: user,
        messageSend: prompts.WELCOME
      }
    },
    1: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 2
      user.save();
      return {
        user: user,
        messageSend: prompts.SETUP
      }
    },
    2: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 3
      user.save();
      return {
        user: user,
        messageSend: prompts.MOREROUTINE
      }
    },
    3: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 4
      user.save();
      return {
        user: user,
        messageSend: prompts.CITY
      }
    },
    4: function(user, messageReceived) { //
      // Greet
      //return state and message --> message can be an object
      user.state = 5
      user.save();
      return {
        user: user,
        messageSend: prompts.TIMETOWAKEUP
      }
    },
    5: function(user, messageReceived) { //
      user.state = 6

      var routine = user.routine.reduce(function(prev, cur) {
        return prev +', '+ cur.toString();
      }, '')
      routine = routine.slice(2)
      user.save();
      return {
        user: user,
        messageSend: ["Your morning routine is " + routine + ", We'll remind you every 3 hours.",
        "If you'd like to change your settings at any time, send'menu'. You are set"]
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
        resp.messageSend = resp.messageSend.slice(1);
        console.log("[resp]", resp);
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
        resolve(resp)
      }
    }
    callback(); //first time calling the callback
  });
}

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
              if (callback) callback();
            }
        })

        resolve(resp)
      })
    }

    // request({
    //     url: 'https://graph.facebook.com/v2.6/me/messages',
    //     qs: {access_token:token},
    //     method: 'POST',
    //     json: {
    //         recipient: {id:sender},
    //         message: messageData
    //     }
    // }, function(error, response, body) {
    //     if (error) {
    //         console.log('Error sending messages: ', error)
    //     } else if (response.body.error) {
    //         console.log('Error: ', response.body.error)
    //     } else {
    //       if (callback) callback();
    //     }
    // })
// }

app.post('/webhook/', function(req, res){
  var event = req.body.entry[0].messaging[0];
  var messageReceived;
  console.log('eventtttttttttttttt', event)
  console.log('event.message', event.message);

  // var messageId = event.delivery.mid[0];
  // ?? url: 'https://graph.facebook.com/v2.6/' + messageId, are we using messageId here?
  // request({
  //   url: 'https://graph.facebook.com/v2.6/messages',
  //   qs: {access_token: TOKEN},
  //   method: 'GET',
  //   json: {
  //     recipient: {id: req.user.facebookId},
  //     message: {
  //       text: message
  //     }
  //   }
  // }, callback);


  if (event.postback) {
    messageReceived = event.postback.payload
  } messageReceived = event.message.text;

  console.log('facebook id', req.body.entry[0].messaging[0].sender.id)

  // findOrCreateUser(req.body.entry[0].user.id)
  findOrCreateUser(req.body.entry[0].messaging[0].sender.id)
    .then(function(user) { //takes a user from resolve
      console.log("[user-------]", user);
      var handler = stateHandlers[user.state];
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      console.log("^^^^^^^^^"+handler(user, messageReceived));
      return handler(user, messageReceived);
    })
    .then(function(resp) { //what the function is going to return
      console.log("[response]", resp);

      if (resp.user.state === 2) {
        return sendButton(resp)
      }
      return sendTextMessages(resp)}) //this needs to be the full response, considering the nest
    .then(function(resp) {
      console.log("[user yayyyyyyyyyyyyyy]", resp);
      // console.log("HEY HO HEY",User.findById(user._id))
      User.findById(user._id)
      //   , function(err, user) {
      //   return user.save();
      // })
      .then(function(user) {
        console.log("USER.save")
        console.log(user)
        return user.save()})
      })
    .then(function() {
      // console.log("[sent] response");
      res.send('OK');
    }) //update ,message to user
    .catch(function(err) {
      console.log("[err]", err);
      res.status(500).send(err.message);
    });
});

module.exports = app;
