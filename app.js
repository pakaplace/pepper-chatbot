'use strict'
// ___________________ 
// < MOJIA LOVES TRUMP >
// ------------------- 
//         \   ^__^
//         \  (oo)\_______
//            (__)\       )\/\
//                 ||----w |
//                 ||     ||
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')
const app = express()
const TOKEN = process.env.FB_TOKEN
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

//prompts are all the response PAM would send back
var prompts = {
  //SETUP
 "WELCOME": function(user){
   return  ["Nice to meet you "+ user.firstname, "Your decision to message me was a good one, as you'll see...",
             "I'll be helping you wake up in the mornings, keeping track of your tasks, and feeding you reflection questions at the end of the day :)"]
 },
 "SETUP": function(errorMessage){
    var arr = ['You could say "meditate for 10 minutes", or... "primal screaming for 20 minutes" if that\'s what you\'re into?'];
    if (errorMessage !== undefined) {
        arr = [].concat(errorMessage).concat(arr) 
        return arr
      } 
    else{
      return ['What\'s one activity you\'d like to incorporate into your morning routine?','For example, you could respond "meditation for 10 minutes" or "read for 20 minutes?"'];
    }
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
                   "title": 'Yes'
               }, {
                   "type": "postback",
                   "payload": 'no',
                   "title": 'No'
               }]
         }
     }
 },
 "TOPICS":["What type of content would you like?"],
  "CITY": function(errorMessage){
    if(errorMessage === undefined){
      return ["What city and state do you live in? I'm from Chapel Hill, North Carolina... "]
    }
    else{
      return [errorMessage]
    }
  },
  'TIMETOWAKEUP': function(errorMessage) {
    if(errorMessage === undefined){
      return ["I'll be on you daily to make sure you stick to your morning routine. What time would you like me to wake up? "]
    }
    else {
      return [errorMessage,'What time would you like me to to wake up?'] 
    }    
  },
  'FINISHEDSETUP': ["Your routine is X, We'll remind every 3 hours. If you'd like to change your settings at any time, go to 'menu'. You are set"],
  "DENYSETUP": ["Slow to rise, huh? You can always go back and add a routine later"],
  "SETUPCOMPLETE": ["You're all set. From now on I'll remind you daily!", "If you'd like to start now just let me know..."],
  "TASKPROMPT": ["What do you have to do today?", "Separate tasks by comma since I'm dumb"],
  "ADDROUTINE":['Awesome. What would you like to add and for how long? One might say, "Yoga for 20 minutes..." for example'],

  //DAILY
   "WEATHER": function(user, weatherData){
    if(weatherData !== undefined){
      return ["Good morning! Today in " + user.city + " it'll be " + weatherData.text + " with "+ weatherData.temp + "°F. This video should help you get out of bed:"]
    }
    else{
      return ["Please update your current city in the menu to get weather forecast."]
    }
  },
  
  
  'START_MORNING': ["This video should help get you out of bed!"],
  'ASK_MORNING_ROUTINE': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Ready to start your morning routine?',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'Yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'No'
                }]
          }
      }
  },
  // IF YES, START TIMER
  'START_MORNING_ROUTINE': ['Which activity would you like to start?'], // + button this one will get asked again and again
  'DONE_DAILY_ROUINE': ['Fantastic, you\'ve finished, Paul Coehlo once said "If you think adventure is dangerous, try routine, it is lethal"'],
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
                    "title": 'Yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'No'
                }]
          }
      }
  },
  'BEGIN_WORKING_STANDBY':["No worries, type anything to start your tasks."],
  'DONE_WORKING': ["You're finished! Take pride in what you've done today and start planning out your evening. If you'd like to add more tasks, click the menu icon"],
  'NO_WORKING': ['Okay, just remember that "Work is never done" - Cole Ellison'],
  'ASK_FOR_TASKS': ['What do you have get done today? Type to add a task'],
  'ADD_ANOTHER_TASK': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Shall I add another task?',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'Yes'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'No'
                }]
          }
      }
  },
  'SHOW_TASKS': ["Here's what you have to do today?"],
  'ASK_REFLECTION_QUESTIONS': ["What's one conversation or interaction you had today that really mattered?"],
  'RANDOM_VIDEOS':[[path.join(__dirname, 'public/videos/vid1.mp4'), 'https://www.instagram.com/jakepaul/'],[path.join(__dirname, 'public/videos/alissaviolet.mp4'),'https://www.instagram.com/alissaviolet/']],
  // "SAVE_REFLECTION_QUESTION" : ["Thank you, your reflection has been saved.", 'Check out your reflection memories at www.pamchatbot.herokuapp.com/' + user._id],
  "ERROR" : ["Please finish these first few setup questions before changing your preferences"],
  "CHANGE_TIME": ["Noted. I've updated your wake up time to: "],
  "CHANGE_FREQ": ["Noted. I've updated your frequency to: "],
  "CHANGE_TIME_REFLECTION" : ["Noted. I've updated your reflection time to: "],
  "CHANGE_CITY" : ["Noted. I've updated your city to: "],
  'GREAT': ['Superb, and remember to vote for Trump!!! Make America great again? jkjkjkjkjk lol']
}

app.get('/', function(req, res) {
  res.send('I am Pam!');
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
      return {
        user: user,
        messageSend: prompts.WELCOME(user)
      }
    },
    1: function(user, messageReceived) { //
    //if the user says 'no' to add another routine, set state to 4 to ask for city
      if(messageReceived === 'no'){
        user.state = 3
        console.log("REACHED WOW", user.state)
        // ASK TOPICS
        return{
          user,
          messageSend: prompts.TOPICS
        }
      }
      //else proceed to 2, ask to add another routine
      user.state = 2
      return {
        user: user,
        messageSend: prompts.SETUP()
      }
    },
  //SETUP_ROUTINE_ASKING & TIME
    2: function(user, messageReceived, data) { //add data as third parameter
      //whenever state is set to 2, directly go back to 1
      user.state = 1
      var newRoutine = {};
      if(user.missingDuration || user.missingRoutine){
         newRoutine = {
           routine: user.missingDuration, //filled in
           duration: user.missingRoutine //null
         }
      }
      // if(data.entities.agenda_entry === undefined || data.entities.duration === undefined){
      //   user.state = 2;
      // }
      if(data.entities.duration){ //new routine is checked because if one is saved and the other isn't then it must be
        newRoutine.duration = data.entities.duration[0].normalized.value/60 //to acount for seconds
        user.missingRoutine = data.entities.duration[0].normalized.value/60
      }
      if(data.entities.agenda_entry){
        newRoutine.routine = data.entities.agenda_entry[0].value; //to acount for seconds
        user.missingDuration = data.entities.agenda_entry[0].value;
      }
      if(newRoutine.routine === null || newRoutine.routine === undefined){ // data.entities.location === 'undefined'
          user.state = 2
          user.prevState = 1;
          return {user, messageSend: prompts.SETUP("Woops, either you forgot to include a routine or I didn't pick up on that?")}
      }
      if(newRoutine.duration === null || newRoutine.duration === undefined){
          user.state = 2
          user.prevState = 1;
          return {user, messageSend: prompts.SETUP("For how long? 5 minutes, half an hour...?")}
      }
      else{
        var status = "Awesome!"
        user.routine.push(newRoutine)
      }
      console.log("Asking user for more")
      user.missingRoutine = null;
      user.missingDuration = null;
      return {
        user: user,
        messageSend: prompts.MOREROUTINE
      }
    },
    //ASK_CITIES
    3: function(user, messageReceived){
      if(messageReceived === "Funny" || messageReceived === "Inspirational" || messageReceived === "Tech"){
        user.topic = messageReceived;
      }
      user.state = 4;
      return {
        user,
        messageSend: prompts.CITY()
      }
    },
  //SETUP_TIMETOWAKEUP_ASKING
    4: function(user, messageReceived, data) {
      if(data.entities.location === undefined){
        user.state=4;
        return { user, messageSend: prompts.CITY("Oops, looks like you didn't enter in the name of your state.")
        }
      } else {
        user.state = 5
        user.city = data.entities.location[0].value;
        return {
          user: user,
          messageSend: prompts.TIMETOWAKEUP()
        }
      }
    },
  //SETUP_READY
    5: function(user, messageReceived, data) {
      user.state = 6
      // user.token = randomCode();
      if(data.entities)
      console.log("USER~~~~~ ",user.timezone);
      var dt = new Date(data.entities.datetime[0].values[0].value);
      user.timeToWakeUp.minute = dt.getMinutes();
      console.log("hour", dt.getHours())
      if(dt.getHours() <= Math.abs(user.timezone)){
        user.timeToWakeUp.hour = 24 + dt.getHours() + user.timezone;
        console.log("user.timeToWakeUp.hour", user.timeToWakeUp.hour)
      } else {
        user.timeToWakeUp.hour = dt.getHours() + user.timezone;
      }
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      //reduce all the routines to a string
      var routine = user.routine.reduce(function(prev, cur) {
        return prev + cur.routine.toString() + " for "+ cur.duration.toString() + " minutes , " ;
      }, '')
      return {
        user,
        messageSend: ["Your morning routine is " + routine + "We'll remind you every 3 hours.",
        "If you'd like to change your settings at any time, click 'menu'. You are set"]
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
        return {
          user: user,
          messageSend: prompts.BEGIN_WORKING_STANDBY
        }
      }
    //if the user has finished morning routine 
      if (!user.routineCopy.length) {
        console.log("REACHED BEEOTCH")
        user.state = 10
        return {
        user: user,
        messageSend: prompts.DONE_DAILY_ROUINE
       }
      } else {
        return {
        user: user,
        messageSend: prompts.START_MORNING_ROUTINE
    }
  }
      
      
    }, //ask again until finished
  // DONE_DAILY_ROUINE
    // 9: function(user, messageReceived) {
    //   user.state = 10
    //   return {
    //     user: user,
    //     messageSend: prompts.GREAT
    //   }
    // }, // give a reward
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
      user.state = 16
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
      console.log("ethan debug" ,messageReceived);
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
      
      user.tasks = user.tasks.concat(messageReceived);
      console.log("user.tasks", user.tasks);
      user.state = 13
      return {
        user: user,
        messageSend: prompts.ADD_ANOTHER_TASK
      }
    },
  // SHOW_TASK
    15: function(user, messageReceived, trump, rocks, content) {
    //if the user has finished all the tasks
    if (messageReceived.indexOf('finish') > -1) {
        console.log("WARNING! - Splicing out!");
        var index = messageReceived[messageReceived.length - 1];
        user.tasks.splice(index, 1)
        // sendTextMessages({user, messageSend:retrieveMediaContent(user.topic)})
    }
      if (!user.tasks.length) {
        user.state = 16
        return {
          user: user,
          messageSend: [prompts.DONE_WORKING, content]
        } 
      }
      return {
        user: user,
        messageSend: prompts.SHOW_TASKS
      }
    },
  // ASK_REFLECTION_QUESTIONS
    16: function(user, messageReceived) {
      user.state = 17
      //choose a random reflection question
      user.reflectionQuestion = prompts.ASK_REFLECTION_QUESTIONS[Math.floor(Math.random()*prompts.ASK_REFLECTION_QUESTIONS.length)];
      
      // user.reflectionQuestion = 
      return {
        user: user,
        messageSend: [user.reflectionQuestion]
      }
    },
    // SAVE_REFLECTION_QUESTION
    17: function(user, messageReceived) {
      var date = new Date();
      user.reflection.title.text.headline = user.reflectionQuestion;
      user.reflection.title.text.headline = messageReceived;
      user.reflectionAnswer = messageReceived;
      user.state = 18
      return {
        user: user,
        messageSend: ['You can upload a picture from today, or a selfie. Otherwise, say "no"']
      }
    },
    
    // REFLECTION_PICTURE_QUESTION
    18: function(user, messageReceived) {
      console.log('urlllllllllllllllllll', messageReceived)
      var date = new Date();
      if (messageReceived) {
        user.reflection.events.push(
        {
          //detect key words and display pictures
          "media": {
            "url": messageReceived
          },
          "start_date": {
            "month": date.getMonth() + 1,
            "day": date.getDay(),
            "year": date.getYear()
          },
          "text": {
            "headline": user.reflectionQuestion,
            "text": user.reflectionAnswer
          }
        })
      }
      return {
        user: user,
        messageSend: ["I've saved your reflection, thanks for sharing. Your information will always be kept private", 'Check out a visualizaiton of your reflection log at https://8bcaa5aa.ngrok.io/reflection/' + user._id]
      }
    },

  // >= 100: EDIT STATES
  // EDIT_WAKEUP_TIME
    100: 
    function(user, messageReceived, data) {
      user.state = user.prevState; //remembers where you were before menu
      user.prevState = null; 
      console.log("WIT DATA", data)
      // user.token = randomCode();
      var dt = new Date(data.entities.datetime[0].values[0].value);
      user.timeToWakeUp.minute = dt.getMinutes();
      console.log("hour", dt.getHours())
      if(dt.getHours() <= Math.abs(user.timezone)){
        user.timeToWakeUp.hour = 24 + dt.getHours() + user.timezone;
        console.log("user.timeToWakeUp.hour", user.timeToWakeUp.hour)
      } else {
        user.timeToWakeUp.hour = dt.getHours() + user.timezone;
      }
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      //reduce all the routines to a string
      var CHANGE_TIME = prompts.CHANGE_TIME;
      CHANGE_TIME += user.timeToWakeUp.time;
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
      user.state = user.prevState
      user.prevState = null; 
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
      console.log("STATE", user.state, "OLD STATE", user.prevState)
      if(messageReceived.indexOf("ADD_NEW_ROUTINE") !== -1 ){
        user.state = 103
        user.prevState = null; 
        return {
          user,
          messageSend: prompts.ADDROUTINE
        } 
      } else if (messageReceived.indexOf("DELETE_ROUTINE") > -1){
      
        var index = parseInt(messageReceived[messageReceived.length-1])
        var deletedMessage = user.routine[index].routine;
        user.routine.splice(index, 1)
        // user.state = user.prevState
        user.prevState = null; 
        return {
          user,
          messageSend: ["Your routine "+ deletedMessage +" has been deleted"]
        }
      }
    },
    //add routine
    103: function(user, messageReceived, data){
    console.log("USer", user)
      var newRoutine = {};
      if(user.missingDuration || user.missingRoutine){
         newRoutine = {
           routine: user.missingDuration, //filled in
           duration: user.missingRoutine //null
         }
      }
      console.log("New Routine", newRoutine)
      // if(data.entities.agenda_entry === undefined || data.entities.duration === undefined){
      //   user.state = 2;
      // }
      if(data.entities.duration){ //new routine is checked because if one is saved and the other isn't then it must be
        newRoutine.duration = data.entities.duration[0].normalized.value/60 //to acount for seconds
        user.missingRoutine = data.entities.duration[0].normalized.value/60
        console.log('YAY 1~~~~~~~~~~~~~~~~~~')
      }
      if(data.entities.agenda_entry){
        newRoutine.routine = data.entities.agenda_entry[0].value; //to acount for seconds
        user.missingDuration = data.entities.agenda_entry[0].value;
                console.log('YAY 2~~~~~~~~~~~~~~~~~~')

      }
      if(newRoutine.routine === null || newRoutine.routine === undefined){ // data.entities.location === 'undefined'
                          console.log('YAY 3~~~~~~~~~~~~~~~~~~')

          user.state = 2
          user.prevState = 1;
          return {user, messageSend: prompts.SETUP("Woops, either you forgot to include a routine or I didn't pick up on that?")}
      }
      if(newRoutine.duration === null || newRoutine.duration === undefined){
                        console.log('YAY 4~~~~~~~~~~~~~~~~~~')

          user.state = 2
          user.prevState = 1;
          console.log("Duration undefined")
          return {user, messageSend: prompts.SETUP("For how long? 5 minutes, half an hour...?")}
      }
      else{
        console.log('YAY 5~~~~~~~~~~~~~~~~~~')
        console.log("here")
        console.log('STATE', user.state, 'prevstate',user.prevState)
        user.routine.push(newRoutine)
        // user.state = user.prevState;
        user.prevState = null;
        console.log("ROUTINE", newRoutine)
      }
      console.log('YAY 6~~~~~~~~~~~~~~~~~~')
      // user.save();
      user.missingRoutine = null;
      user.missingDuration = null;
      return {
        user: user,
        messageSend:  ["Your Routine " + newRoutine.routine + " for " + newRoutine.duration + " minutes has been added"]
      }
    },
    104:  function(user, messageReceived, data) {
       //to be changed to change frequency messages
      user.state = user.prevState; //remembers where you were before menu
      // user.prevState = null; 
      var CHANGE_TIME = prompts.CHANGE_TIME;
      // CHANGE_TIME += user.timeToWakeUp;
      
      // user.timeToWakeUp.hour = new Date(data.entities.datetime[0].values[0].value).getHours();
      // user.timeToWakeUp.minute = new Date(data.entities.datetime[0].values[0].value).getMinutes();
      // user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;

      return {
        user,
        messageSend: prompts.CHANGE_FREQ
      }
    },
    
     105:  function(user, messageReceived, data) {
       //to be changed to change frequency messages
      user.state = user.prevState; //remembers where you were before menu
      user.prevState = null; 
      var dt = new Date(data.entities.datetime[0].values[0].value);
      user.reflectionTime.minute = dt.getMinutes();
      if(dt.getHours() <= Math.abs(user.timezone)){
        user.reflectionTime.hour = 24 + dt.getHours() + user.timezone;
        console.log("user.timeToWakeUp.hour", user.reflectionTime.hour)
      } else {
        user.reflectionTime.hour = dt.getHours() + user.timezone;
      }
      user.reflectionTime.time = user.reflectionTime.hour+":"+user.reflectionTime.minute;
      
      var CHANGE_TIME_REFLECTION = prompts.CHANGE_TIME_REFLECTION[0];
      CHANGE_TIME_REFLECTION += user.reflectionTime.time;
      
      return {
        user,
        messageSend: [CHANGE_TIME_REFLECTION]
      }
    },
}

// function randomCode() {
//   var min = 100000;
//   var max = 999999;
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// Ethan Debug
// app.post('/webhook', (req, res) => {
//   res.send('ethan debug complete :-)')
// })
var count = 1;
app.get('/reflection/:id', (req, res, next) => {
  console.log("ID coming in: ", req.params.id)
  User.findById(req.params.id, function(err, user) {
    if (err) {res.status(400).send(err);}
    var data = JSON.stringify(user.reflection);
    res.render('reflection', {
      data
    })
  })
})

// app.get('/', (req, res, next) => {
//   res.render('index')
// })

app.get('/sendScheduled', (req, res, next) => {
  User.find(function(err, users) {
    if (err) {
      res.status(400).send('error', {
        message: err
      })
    }
    users.forEach(function(user) {
      // fetch weather
      var p = new Promise(function(resolve, reject) {
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
        var date = new Date();
        var userHours = 24 + date.getUTCHours() + user.timezone;
        if (user.timeToWakeUp.hour === userHours && user.timeToWakeUp.minute <= date.getMinutes()) {
          user.state = 7
          // console.log("weatherData================", weatherData)
          //choose a random video
          var randomVideo = prompts.RANDOM_VIDEOS[Math.floor(Math.random()*prompts.RANDOM_VIDEOS.length)];
          // console.log("Weather message: ", prompts.WEATHER(user, weatherData));
          sendTextMessages({user, messageSend: prompts.WEATHER(user, weatherData)});
          // sendVideo({user, messageSend: prompts.START_MORNING}, randomVideo, prompts.START_MORNING)
          uploadVideo({user, messageSend: prompts.START_MORNING}, randomVideo[0], randomVideo[1]);
        } else if (user.reflectionTime.hour === userHours && user.reflectionTime.minute <= date.getMinutes()) {
          user.state = 17
          sendTextMessages({user, messageSend: prompts.ASK_REFLECTION_QUESTIONS})
        }
        user.save(function(err) {console.log("user save err", err)})
      })
    })
  })
  res.send(200)
});

app.post('/test/timeout', (req, res, next) => {
  console.log('entering timeout')
  setTimeout(() => {
    sendTextMessages({user: '1069904196424805', messageSend: ["You sent this " + req.body.delay + " seconds after this"]})
  }, req.body.delay);
})

app.post('/webhook/', function(req, res){
  var event = req.body.entry[0].messaging[0];
  var messageReceived;
  // console.log("EVENT",event);

  if (event.postback) {
    messageReceived = event.postback.payload
  } 
  else if (event.message.attachment) {
    messageReceived = event.message.attachment[0].payload.url;
  }
  else {
    messageReceived = event.message.text;
  }
  
  console.log("message received", messageReceived)

  findOrCreateUser(req.body.entry[0].messaging[0].sender.id) //returns a promise
    .then(function(user){
      // console.log("MESSAGE RECEIVED YO", messageReceived)
      return new Promise(function(resolve, reject){
        wit.message(messageReceived, {})
        .then((data) => {
          // console.log('WIT DATA------', data)
          req.witData = data;
          resolve(user)
        })
      })
    })
    .then(function(user){
      return new Promise((resolve, reject) => {
        request('https://graph.facebook.com/v2.6/'+user.facebookId+'?fields=first_name,\
        timezone,locale,gender&access_token='+TOKEN, (err, req, body) => {
          if (err) {reject(err);}
          if(body){
            body = JSON.parse(body);
            user.firstname = body.first_name;
            user.timezone = body.timezone;
            user.locale = body.locale;
            user.gender = body.gender;
            resolve(user);
          }
        })
      })
    })
    .then(function(user){
      // function retrieveMediaContent(""){
      //get curated content
      if(user.topic !== undefined){
        return new Promise(function(resolve, reject){
          console.log("TOPIC1", user.topic)
          var topicTokens ={Funny:'aca1810034a40134947a0242ac110002', Inspirational:'498e21b034aa013423e40242ac110002', Tech:'f56e5410357e013494800242ac110002'};
          console.log("topicTokens[user.topic]", topicTokens[user.topic])
            request({
              url: "https://api.backstit.ch/v2/topics/"+topicTokens[user.topic]+"/results?count=1",
              headers: {
                "Accept": "application/json"
              },
              method: 'GET'
            }, function(error, response, body){
              var body = JSON.parse(body)
              var result = body[0];
                if(result.type ==="article"){
                  req.content = result.origin.url;
                  resolve(user);
                }
                else{
                  reject(error);
                }
            })
        })
      }
      else{ 
        return user;
      }
    })
    .then(function(user) {
      //user.prevState is what it is, before calling handler to set to the next state
      // freeze prevState if state is >= 100
      console.log("+++++++User state+++++:", user.state)
      console.log("+++++++User prevState+++++:", user.prevState)
      if (user.state < 100) user.prevState = user.state;
      
      
      /* BEGIN MENU MESSAGE HANDLING */
      var menuMessage = checkForMenu(user, messageReceived);
      if (menuMessage) {
        if (user.state === 102) {
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
      var handle = handler(user, messageReceived, req.witData, req.weatherData, req.content); //add req.witData
      // console.log("Got to state " + handle.user.state)
      
      
      ///////////////////// FOR DEBUG PURPOSES /////////////////////////////////
      // sendTextMessages({user, messageSend: ["[L492] You are in state " + user.state + ", coming from: " + user.prevState]});

      /*MANAGE MORNING ROUTINE*/
      //create a copy of routine in the user model
      //slice the one with the same handle
      var halfTime;
      var fullTime;
      if (user.routineCopy.length === 0 && user.state === 8) {
        user.routineCopy = user.routine.slice();
      } else {
        user.routineCopy = user.routineCopy.slice();
      }
      //when user click  on 'finish'
      var index;
      var duration;
      for (var i = 0; i < user.routineCopy.length; i ++) {
        if (messageReceived === user.routineCopy[i].routine) {
          user.routineCopy.splice(i, 1)
          console.log('CURRENT ROUTINE', user.routineCopy)
          user.save(function(err) {console.log('err from saving routine',err)})
        }
        if (halfTime || fullTime) {
            clearTimeout(halfTime)
            clearTimeout(fullTime)
        }
     }
      // if (user.routineCopy.indexOf(messageReceived) !== -1) {
      //   console.log('FINISH ROUTINE IS CALLED')
      //   var index = user.routineCopy.indexOf(messageReceived)
      //   user.routineCopy.splice(index, 1)
      //   console.log('CURRENT ROUTINE', user.routineCopy)
      //   user.save(function(err) {console.log('err from saving routine',err)})
      //   if (halfTime || fullTime) {
      //     clearTimeout(halfTime)
      //     clearTimeout(fullTime)
      //   }
      // }
      if (messageReceived.slice(0, 5) === 'begin'){
        //need time for the routine
        var index;
        var duration;
        for (var i = 0; i < user.routineCopy.length; i ++) {
          if (messageReceived.slice(5) === user.routineCopy[i].routine) {
            duration = user.routineCopy[i].duration;
            index = i;
          }
        }
        sendTextMessages({user, messageSend: ['Timer starts now! You have '+user.routineCopy[index].duration+" minutes left..."]})
        halfTime = setTimeout(() => sendTextMessages({user, messageSend: [duration/2 + ' minutes left']}), duration/2 * 60 * 1000) 
        fullTime = setTimeout(function() {
            sendTextMessages({user, messageSend: ['Time up']})
            user.routineCopy.splice(index, 1);
            sendMorningRoutine(handle, user.routineCopy, handle.messageSend, 'begin', 'finish')
            user.save(function(err) {console.log('err from saving routine',err)})
          
        }, duration * 60 * 1000);
        console.log("handle",handle);
        
        return  handle 
      }
      /*END OF MORNING ROUTINE*/
      
      /*START OF PAM RESPONSE*/
      if (! handler) {
        throw new Error("Can't handle state: " + user.state);
      }
      console.log("messageRecieved~~~~~~~~ ",messageReceived)
      
      if(user.state === 3){
        console.log("user state", user.state)
        console.log("Reacheddddddd")
        sendTopicButtons(user, ["Funny", "Inspirational", "News"])
      }
      if (user.state >= 100) {
        return sendTextMessages(handle);
      }
      // else if(messageReceived === "Funny"){
      //   user.topic = "funny";
      // }
      // else if(messageReceived === "Inspirational"){
      //   user.topic = "inspirational";
      // }
      // else if(messageReceived === "News"){
      //   user.topic = "news";
      // }
      else if ((user.state === 15 && user.prevState === 13) 
        || (user.state === 15 && user.prevState === 15)) {
        if (user.tasks.length === 0) console.log("this will error, because there are no tasks\nenable ethan debug to continue")
        return sendMultiButton(handle, user.tasks, handle.messageSend, 'start', 'finish')
      }
      //changed to 2 after we incremented the state
      else if (user.prevState === 2 || user.prevState === 7 || user.prevState === 10 || user.prevState === 14) {
        // console.log("attempting a sendButton with ", handle.messageSend);
        console.log("Sending button: ", handle);
        console.log("user.tasks, again", handle.user.tasks)
        return sendButton(handle)
      //send a video
      } else if (user.state === 16 || user.prevState === 6) {
        // sendTextMessages(handle, retrieveMediaContent(user.topic))
      //the video here will be randomly generated later
        return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend)
      } else if (user.prevState === 8 && user.state === 8) {
        // if (user.routineCopy.length) {
        return sendMorningRoutine(handle, user.routineCopy, handle.messageSend, 'begin', 'finish')
        // } else {
        //   user.prevState = 8;
        //   user.state = 9;
          // return sendTextMessages({user, messageSend: ['hi']})
          //how can i trigger again?? 
        // }
      } else if (user.prevState === 8 && user.state === 10) {
        return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend) //sends twice because state and prev state are maintained
      } 
      if(user.state === 11 ){
        return sendTextMessages(handle, retrieveMediaContent(user.topic))
      }
      if (user.state === 16) {
        console.log(handle);
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
      console.log("[err]", err, typeof err);
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

//retrieve content from backstitch
// function retrieveMediaContent(topic){
//   return new Promise(function(resolve, reject){
//     function callback(error, response){
//       var topicTokens ={funny:'aca1810034a40134947a0242ac110002'}
//       request({
//         url:"https://api.backstit.ch/v2/topics/"+topicTokens[user.topic]+"/results",
//         headers: {
//           "Accept": "application/json"
//         },
//         method: 'GET'
//       }, function(error, response, body){
//         if(response.statusCode==200 && !error){
//           var result = body[0]
//           if(result ==="article"){
//             resolve(result.origin.url);
//           }
//           else{
//             return error;
//           }
//         }
//         else{
//           return error;
//         }
//       })
//     }
//   })
  
// }

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
            // console.log('Error sending messages: ', error)
        } else if (response.body.error) {
          // reject(error); fix
            // console.log('Error: ', response.body.error)
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
function uploadVideo(resp, path, text) {
  resp.messageSend = [text]
  return sendTextMessages(resp)
  .then(function(resp) {
    return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
          "type": "video",
          "payload": {}
      }
    }
    var formData = {
      recipient: '{"id":' + resp.user.facebookId + '}',
      message: '{"attachment":{"type":"video", "payload":{}}}',
      filedata: fs.createReadStream(path)
    }
    request.post({
      url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + TOKEN,
      formData: formData
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
            return reject(response.body.error);
        } else {
        //this is the callback and pass down resp
          console.log("Body of response:", body);
          resolve(resp)
        }
    })
    })
    
    // fs.createReadStream(path).pipe(
    //   request.post({
    //   url: 'https://graph.facebook.com/v2.6/me/messages',
    //   qs: {access_token: TOKEN}
    // }, function(error, response, body) {
    //     if (error) {
    //         console.log('Error sending messages: ', error)
    //         return reject(error);
    //     } else if (response.body.error) {
    //         console.log('Error: ', response.body.error)
    //         return reject(response.body.error);
    //     } else {
    //     //this is the callback and pass down resp
    //       console.log("Body of response:", body);
    //       resolve(resp)
    //     }
    // }))
    // .form();
    // form.append('file', fs.createReadStream(path));
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
function sendMorningRoutine(resp, arr, text, buttonTitle1, buttonTitle2) {
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
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      // "http://blog.myvirtualyoga.com/wp-content/uploads/2015/02/meditation-pose-drawing.jpg","http://workoutlabs.com/wp-content/uploads/watermarked/Wide_Pushup1.png","http://cdn.imgs.steps.dragoart.com/how-to-draw-tea-tea-step-4_1_000000075607_3.jpg"
      var el = {
        "title": element.routine,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": imgArr[i % imgArr.length],
        "buttons": [{
          'type': 'postback',
          'payload': buttonTitle1 + element.routine,
          'title': buttonTitle1
        },{
          'type': 'postback',
          'payload': element.routine,
          'title': buttonTitle2
        }]
      }
      messageData.attachment.payload.elements.push(el)
    })
  })
}
function sendMorningRoutine(resp, arr, text, buttonTitle1, buttonTitle2) {
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
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      // "http://blog.myvirtualyoga.com/wp-content/uploads/2015/02/meditation-pose-drawing.jpg","http://workoutlabs.com/wp-content/uploads/watermarked/Wide_Pushup1.png","http://cdn.imgs.steps.dragoart.com/how-to-draw-tea-tea-step-4_1_000000075607_3.jpg"
      var el = {
        "title": element.routine,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": imgArr[i % imgArr.length],
        "buttons": [{
          'type': 'postback',
          'payload': buttonTitle1 + element.routine,
          'title': buttonTitle1
        },{
          'type': 'postback',
          'payload': element.routine,
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

function sendTopicButtons(resp, arr) {
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
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      var el = {
        "title": element,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": "https://source.unsplash.com/category/nature",
        "buttons": [{
          'type': 'postback',
          'payload': element,
          'title': "Select"
        }]
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.facebookId},
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
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      console.log("Ethan Debug", element.routine);
      var el = {
        "title": element.routine,
        //images displaying in the routine menu
        "image_url": imgArr[i % imgArr.length],
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
  if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP") {
    if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
    user.state = 100;
      ret = {
        user,
        messageSend: ["Your current wake up time is " + user.timeToWakeUp.time + ". What time do you want it to be?"] //fix
      }
    } 
     else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_CITY") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 101;
      ret = {
        user,
        messageSend: ["Your current city is " + user.city + ". Which one do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 102;
      ret = {
        user,
        messageSend: ["Your current routine is:"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 104;
      ret = {
        user,
        messageSend: ["Your message frequency is every " + user.frequency + " hours. What do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 105;
      console.log("USERRRRRR", user)
      console.log("USERRRRRR.reflectionTime", user.reflectionTime)
      ret = {
        user,
        messageSend: ["Your current reflection time is " + user.reflectionTime.hour + ". What time do you want it to be?"]
      }
    }
    return ret;
}


module.exports = app;
