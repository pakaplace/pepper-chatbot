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

app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

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
//
// This finds or creates a user given its facebook ID
//
//
//
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

var STATE_HANDLERS = {
  0: function(user, message) {

  }
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

//askQuestionIfNotAsked
function askQuestionIfNotAsked(user, callback) {
  if (! user.setup) {
    return resToMorningRoutine(user.facebookId,
      function() {
        user.setup = true;
        user.save(function(err, user) {
          console.log('error when saving user in setup', err);
          callback(user);
        });
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
    callback();
  });
}

function sendTextMessages(sender, text, callback) {
  let messageData = {text: text[0]}
  if (text.length !== 0) {
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData
      }
    }, function(error, response,body) {
      if (error) {
        console.log('Error sending messages: ', error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
      text = text.slice(1)
      sendTextMessages(sender, text)
    })
  } else {
    if (callback) { callback(); }
  }
}





app.post('/webhook/', function(req, res){
  var stateHanders = {
    0: function(user, messageReceived) {
      // Greet
      //return state and message --> message can be an object
      user.state = 2
      return {
        user: user,
        messageSend: 'Hi I am sd.fasdf'
      }
    }
  }

  findOrCreateUser(req.body.entry[0].id)
  .then(function(user) { //takes a user from resolve
    var handler = stateHandlers[user.state];
    if (! handler) {
      throw new Error("Can't handle state: " + user.state);
    }
    return handler(user, messageReceived);
  })
  .then(function(resp) { //what the function is going to return
    return sendTextMessages(resp) //this needs to be the full response, considering the nest
  .then(function(user)) {
    return user.save()
  })
  .then(function() {
    res.send('OK');
  }) //update ,message to user
  .catch(function(err) {
    res.status(500).send(err.message);
  });



  , function(err, user) {
    setUpUserIfNotSetup(user, function() {
      askQuestionIfNotAsked(user, function(user) {
        var events = req.body.entry[0].messaging;
        events.forEach(function(event) {
          var text = event.postback.payload;

          if (text.toLowerCase().indexOf('yes') === 0) {
            sendTextMessages(sender,
              ["Meditation, pushups, tea? What's one thing you should you be doing every morning?",
              "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"],
            function() {
              res.status(200).send('Success');
            });
          } else if (text.toLowerCase().indexOf('no') === 0) {
            sendTextMessages(sender,
              ["Slow to rise, huh? You can always go back and add a routine later"],
            function() {
              res.status(200).send('Success');
            });
          } else if (text.toLowerCase().indexOf('start') === 0) {
            button(sender, "Cool, let's get started!", 'Finished', 'Skip for today', function() {
              res.status(200).send('Success');
            });
          } else if (text.toLowerCase().indexOf('skip') === 0) {
          } else if (text.toLowerCase().indexOf('start working') === 0) {
          } else {

            // UNKNOWN COMMAND
          }

          // yes
          // no
          // delete
          // start
          // finished
          // skip
          // start working
        });
      });
    })
  });
  /// NOTHING SHOULD BE BELOW!
  return;
  let messaging_events = req.body.entry[0].messaging

  console.log('messging_event', messaging_events.length)
  for (let i = 0; i < messaging_events.length; i ++) {
    console.log(messaging_events[i]);
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id

    var user = User.findOne({facebookId: req.body.entry[0].id}, function(err, user){
          if (err) {return console.log(err);
          } else {
            if (!user && event.message && event.message.text) {
              sendTextMessages(sender, ["Hello there, I am Pam, your personal assistant. Let's set you up", "I'll help you get up in the mornings and fulfill your personal goals"])
              setTimeout(function() {resToMorningRoutine(sender)}, 30)

              // create user
              var user = new User({facebookId: req.body.entry[0].id})
              user.save()
            } else if (user && !user.setup) {
              if (event.postback) {
                let text = event.postback.payload
                if (text === 'yes'){
                  if(user.routineQuestion===false){
                    sendTextMessages(sender, ["Meditation, pushups, tea? What's one thing you should you be doing every morning?", "For example, you could respond 'Meditation for 10 minutes', or... 'Read for 20 minutes'?"])
                    user.routineQuestion = true;
                    user.save();
                  }
                } else if (text === 'no') {
                  sendTextMessages(sender, ["Slow to rise, huh? You can always go back and add a routine later"])
                  user.routineQuestion = true;
                  user.save();
                }
            }
              if (event.message && event.message.text && user.routineQuestion) {
                user.routine.name = event.message.text
                user.save(function (err, user){
                  if(err){
                    console.log('ERROR================')
                  }
                  else {
                    sendTextMessages(sender, ["You're all set up, from now on I'll remind you daily!", "If you'd like to start now, say something..."])
                    user.setup = true;
                    user.save()
                    console.log("USER ADDED ===================");
                  }
                });
              //later add
            }
          } else{
            console.log("YAYAY");
            console.log("event", event);
            console.log(req.body.entry[0].messaging)
            if (event.message && event.message.text && !user.initializeList){
              somethingFun(sender, "This adorable video should wake you up!", 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4')
              setTimeout(function(){button(sender, 'Ready to start the day?', 'Start morning routine', 'Start working')}, 2000)
              console.log("SUCCESS===========================       =======");

            }
            if (event.postback) {
              var text2 = event.postback.payload
              if (text2 === 'Start morning routine'){
                button(sender, "Cool, let's get started!", 'Finished', 'Skip for today');
                //make timers later
              }
              if (text2 === 'Finished' || text2 === 'Skip for today' || text2 === 'Start working'){
                sendTextMessages(sender,["Great, what do you have to do today?", "Separate tasks by comma since I'm dumb"]);
                user.initializeList=true;
                user.save(); //every day initalize list resets
              }
          };
          if(event.message && event.message.text && user.initializeList){
            console.log("SUCCESS2===========================       =======");
            console.log("EVENT.MESSAGE=====    =======    ======", event.message);
            console.log("EVENT.MESSAGE.TEXT =====    =======    ======", event.message.text);
            var listArr = event.message.text.split(',');
            for(var i = 0; i < listArr.length; i++){
              user.list.push(listArr[i]);
            }
            user.save(function (err, user){
              if(err){
                console.log('ERROR================')
              }
              else {
                multiButton(sender, 'Awesome! What would you like to start?', user.list)
                console.log("List Added ===================");
              }
            });
          }
          console.log(event);
          if(event.postback.payload.indexOf('elete')){
            for(var i = 0; i < user.list.length; i++){
              var payload = parseInt(event.postback.payload.slice(event.postback.payload.length-1))
              console.log("PAYLOAD=========",payload);
              if(i === payload){
                user.list.splice(i,1)
                user.save(function(err,user){
                  if(err){
                    console.log('ERROR!', err)
                  }
                  else{
                    multiButton(sender, 'Here is your updated list:', user.list);
                  }
                });
              }
            }
            // return;
          }
      }
      return res.sendStatus(200)
    }
    })
  }
})

const token = "EAACGElIklxMBAGeo6OyZBOOPCudxZCun6dF7noz5P3HixXIzeZClJNDkzQLAFZCyl61Thn98jXzuNo6bE85ZBaxmK5bBmutKFR9O9mLuFJl5h6NHl55L1EmslH6u53IbKtLYTqj2FPmIojrv2wpJ0odaS7ZCh5RUY0XXGymp3qxQZDZD"

//resolve with resp
function sendTextMessages(sender, text, callback) {
  let messageData = {text: text[0]}
  if (text.length !== 0) {
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData
      }
    }, function(error, response,body) {
      if (error) {
        console.log('Error sending messages: ', error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
      text = text.slice(1)
      sendTextMessages(sender, text)
    })
  } else {
    if (callback) { callback(); }
  }
}

function resToMorningRoutine(sender, callback) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",

                "text": "Awesome! Would you like to add a morning ritual? ie. Push-ups, meditation...",

                "buttons": [{
                      "type": "postback",
                      // "url": "https://www.messenger.com",
                      "payload": "yes",
                      "title": "Yeah!"
                  }, {
                      "type": "postback",
                      "title": "No thanks",
                      "payload": "no",
                  }]

            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          if (callback) { callback();}
        }
    })
}

function somethingFun(sender, text, url) {
    var messageData = {
        "attachment": {
            "type": "video",
            "payload": {
              "url": url
            },
            'text': text
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function button(sender, text, button1, button2, callback) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": [{
                      "type": "postback",
                      "payload": button1,
                      "title": button1
                  }, {
                      "type": "postback",
                      "title": button2,
                      "payload": button2,
                  }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
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
}

function multiButton(sender, text, arr, callback) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": []
            }
        }
    }
    // arr.forEach(function(button) {
    //   var buton = {
    //     'type': 'postback',
    //     'payload': button,
    //     'title': button
    //   }
    for(var i = 0; i < arr.length; i++){
      var buton = {
        'type': 'postback',
        'payload':'delete'+i.toString(),
        'title': arr[i]
      }
      messageData.attachment.payload.buttons.push(buton)
    }


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
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
}

// Debugging
// app.post('/webhook/', function(req, res) {
//   console.log('ethan debug complete :-)', req.body.entry[0].messaging)
//   res.send("thx pam");
// })
