'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')
const app = express()
const TOKEN = process.env.FB_TOKEN
const functions = require('./functions');
const sendButton = functions.sendButton;
const findOrCreateUser = functions.findOrCreateUser;
const sendTextMessages = functions.sendTextMessages;
const sendVideo = functions.sendVideo;
const uploadVideo = functions.uploadVideo;
const sendMorningRoutine = functions.sendMorningRoutine;
const sendTopicButtons = functions.sendTopicButtons;
const checkForMenu = functions.checkForMenu;
const sendMultiButton = functions.sendMultiButton;
const sendButtons = functions.sendButtons;
const stateHandlers = require('./states')
const prompts = require('./prompts')
//wit
const WIT_TOKEN = process.env.WIT_TOKEN
const WitThing = require('node-wit');
const wit = new WitThing.Wit({accessToken: WIT_TOKEN});






var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.set('port', 3000)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Models
var User = require('./models/models').User;
var News = require('./models/models').News;


app.get('/', function(req, res) {
  // res.send('I am Pam!');
  console.log("Landing Page loading...")
  res.render('landing');
});

//get user's messages and verify the token. This is from the website
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === 'hellokitty20') {
        console.log("verified")
        return res.send(req.query['hub.challenge']);
    }
    console.log("FB TOKEN validation failed on GET...")
    return res.send('Error, wrong token');
});



var count = 1;
app.get('/reflection/:id', (req, res, next) => {
  User.findById(req.params.id, function(err, user) {
    if (err || !user) {return res.status(400).send(err);}
    var data = JSON.stringify(user.reflection);
    res.render('reflection', {
      data
    })
  })
})

app.get('/sendScheduled', (req, res, next) => {
  console.log("Sending Scheduled messages")
  User.find(function(err, users) {
    if (err) {
      res.status(400).send('error', {
        message: err
      })
    }
    users.forEach(function(user) {
      // fetch weather
      var p = new Promise(function(resolve, reject) {
        News.find(function(err, body){
            if(err){
                console.log("error finding news", err)
            }
            else{
                req.content = body[0][user.topic][0]
            }
        })
        var location = user.city || "Philadelphia";
        var weatherEndpoint = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        request({
          url: weatherEndpoint,
          json: true
          }, function(error, response, body) {
            try {
              var condition = body.query.results.channel.item.condition;
              resolve(condition);
            } catch(err) {
              reject(err);
            }
          });
      });
      p.then(function(weatherData) {
        var now = new Date();
        var userHours = now.getUTCHours() + user.timezone;
        console.log("user: ", user.firstname, ' || userHours ', userHours, " || hours ", user.timeToWakeUp.hour, " || minutes ", user.timeToWakeUp.minute)
        if (user.timeToWakeUp.hour === userHours && user.timeToWakeUp.minute <= now.getMinutes() && (now.getMinutes() - user.timeToWakeUp.minute <= 11)) { //last statement is to prevent it from sending twice, since sheduler sends every 10 minutes
          user.state = 5
          //choose a random video
          sendTextMessages({user, messageSend: prompts.WEATHER(user, weatherData, req.content)});
          // var randomVideo = prompts.RANDOM_VIDEOS[Math.floor(Math.random()*prompts.RANDOM_VIDEOS.length)];
          // sendVideo({user, messageSend: prompts.START_MORNING}, randomVideo, prompts.START_MORNING)
          // uploadVideo({user, messageSend: prompts.START_MORNING}, randomVideo[0], randomVideo[1]);
        } 
        else if (user.reflectionTime.hour === userHours && user.reflectionTime.minute <= now.getMinutes() && (now.getMinutes() - user.reflectionTime.minute <= 11)) {
          user.state = 13
          sendTextMessages({user, messageSend: prompts.REFLECT_OPTION})
        }
        user.save(function(err) {console.log("Error saving user in webhook", err)})
      })
    })
  })
  console.log("No users")
  res.sendStatus(200)
});

//~~~~~~~~ Debug clearing~~~~~~~~
// app.post('/webhook', (req, res) => { 
//   console.log('DEBUGGING... CLEARING QUEUE')
//   res.send('Debug  complete :-)')
// })

app.post('/webhook', function(req, res){
  console.log("reachedf", req.body.entry)
  console.log("reachedf", req.body.entry[0])
  console.log("reachedf", req.body.entry[0].messaging)

  var event = req.body.entry[0].messaging[0];
  console.log("event yo", event)
  var messageReceived;
  console.log("EVENT is",event.message); 
  //when user clicks a button
  if (event.postback) {
    messageReceived = event.postback.payload
  }
  //if the user uploads a picture
  else if (event.message.attachments) {
    console.log("EVENT MESSAGE ATTACHMENT", event.message.attachments[0].payload.url)
    messageReceived = event.message.attachments[0].payload.url;
    console.log("EVENT MESSAGE Received", messageReceived)

  }
  //when user texts
  else{
    messageReceived = event.message.text;
  }

  console.log("message received", messageReceived)
  console.log("id~~", req.body.entry[0].messaging[0].sender.id)

  //when recipient reveieves message
  console.log("id~~", req.body.entry[0].messaging[0].recipient.id)



  findOrCreateUser(req.body.entry[0].messaging[0].sender.id)
    .then(function(user){
      return new Promise(function(resolve, reject){
        wit.message(messageReceived, {})
        .then((data) => {
          req.witData = data;
          resolve(user)
        })
      })
    })
    //get user information from facebook
    .then(function(user){
      return new Promise((resolve, reject) => {
        request('https://graph.facebook.com/v2.6/'+user.facebookId+'?fields=first_name,profile_pic,\
        timezone,locale,gender&access_token='+TOKEN, (err, req, body) => {
          if (err) {reject(err);}
          if(body){
            body = JSON.parse(body);
            user.firstname = body.first_name;
            user.timezone = body.timezone;
            user.locale = body.locale;
            user.gender = body.gender;
            user.profile = body.profile_pic;
            console.log("FACEBOOK USER~~~~~", user)
            resolve(user);
          }
        })
      })
    })
    .then(function(user){
      //retrieves curated content
      if(user.topic !== undefined){
        return new Promise(function(resolve, reject){
          News.find(function(err, body){
            if(err){
                console.log("error finding", err)
            }
            else{
                req.content = body[0][user.topic]
                resolve(user)
            }
          }) 
        })
      }
      else{
        return user;
      }
    })
    //handling states
    .then(function(user) {
      //user.prevState is what it is, before calling handler to set to the next state
      console.log("+++++++User state+++++:", user.state)
      console.log("+++++++User prevState+++++:", user.prevState)
      // freeze prevState if state is >= 100
      if (user.state < 100) user.prevState = user.state;

      /* BEGIN MENU MESSAGE HANDLING */
      var menuMessage = checkForMenu(user, messageReceived);
      if (menuMessage) {
        if (user.state === 102) {
          //changes rountine objects to strings of routine names
          var routineStrings = user.routine.map((rt) => rt.routine);
          sendButtons(menuMessage, routineStrings, [
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
      }
      /* END MENU MESSAGE HANDLING */

      //handler is a function that returns user and messageSend
      var handler = stateHandlers[user.state];
      var content;
      if(req.content){
        console.log("CONTENT MACHINE", req.content)
        content = req.content[Math.floor(Math.random()*req.content.length)]
      }  
      console.log('CONTENT~~~~~ ', content)
      //call handle to set the state to the next
      var handle = handler(user, messageReceived, req.witData, content); 

      ///////////////////// FOR DEBUG PURPOSES /////////////////////////////////
      // sendTextMessages({user, messageSend: ["[L492] You are in state " + user.state + ", coming from: " + user.prevState]});

      /*START OF PAM RESPONSE*/
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      console.log("messageRecieved~~~~~~~~ ",messageReceived)

      if (user.state === 2){
        sendTopicButtons(user, ["sports", "news", "tech"])
      }
      if (user.state >= 100) {
        return sendTextMessages(handle);
      }
      else if (user.state === 10 || (user.prevState === 10 && user.state !== 12 && user.state !== 8)) {
        if (user.tasks.length === 0) console.log("Error- no tasks. Enable debug post to continue")
        return sendMultiButton(handle, user.tasks, handle.messageSend, 'Finish', 'Add New Task')
      }
      else if (user.state === 7 || user.prevState === 8 || user.prevState === 12) {
        return sendButton(handle)
      }
      // else if (user.prevState === 5) {
      //   sendTextMessages(handle)
      //   return sendTextMessages({user, messageSend: [content]});
      //   // return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend) /// SEND CONTENT HERE
      // }
    //   // else if (user.prevState === 8 && user.state === 8) {
    //   //   // if (user.routineCopy.length) {
    //   //   return sendMorningRoutine(handle, user.routineCopy, handle.messageSend, 'begin', 'finish')
    //   // } else if (user.prevState === 8 && user.state === 10) {
    //   //     return sendTextMessages({ user: handle.user, messageSend:["Here's a link to a "+ user.topic+ " link that I thought you might like...", req.content]}) // SEND CONTENT HERE sends twice because state and prev state are maintained
    //   // }
      return sendTextMessages(handle)
    })
    .then(function(resp) {
      return resp.user.save(function(err){
        if(err){
          console.log("error saving user, line 283")
        }
      });
    })
    .then(function(user) {
      res.send('OKIE DOKIE');
    })
    .catch(function(err) {
      console.log("[err]", err, typeof err);
      res.status(200).send(err.message);
    })
});


module.exports = app;
