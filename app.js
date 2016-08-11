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
  "SETUPCOMPLETE": ["You're all set. From now on I'll be encouraging you to stay ahead of your tasks, and to reflect on your daily experiences.", "Tap the menu icon to revise your routine and settings. If you'd like to start now just let me know..."],
  "TASKPROMPT": ["What do you have to do today?", "Separate tasks by comma since I'm dumb"],
  "ADDROUTINE":['Awesome. What would you like to add and for how long? One might say, "Yoga for 20 minutes..." for example'],

  "TIME_INCOMPLETE":["Please enter a valid time", "Following the hour with AM or PM might help me understand"],

  //DAILY
   "WEATHER": function(user, weatherData){
    if(weatherData !== undefined){
      return ["Good morning! Today in " + user.city + " it'll be " + weatherData.text + " with "+ weatherData.temp + "°F. This video should help you get out of bed:"]
    }
    else{
      return ["Please update your current city in the menu to get weather forecast."]
    }
  },



  'START_MORNING': function(user){
    var responseArr = ["Good morning "+user.name+". This video should help get you out of bed!", "Hello there "+user.name+". Here's something to brighten this morning", "WAKE UP "+user.name+"!!! My dear, did I leave the caps lock on :o . Here's a funny clip to start your morning","Rise and shine "+user.name+". I'm funny, don't you think?" ];
    var response = responseArr[Math.floor(Math.random()*responseArr.length)] //randomizes response
    return response;
  },
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
  'DONE_WORKING': function(user){
    var responseArr = ["You're finished "+user.name+"! Take pride in what you've done today. If you'd like to add more tasks, tap on the menu icon", "Fantastic, "+user.name+"! Time for some well deserved personal time. If you'd like to add more tasks, tap on the menu icon", "Beautifully done, "+user.name+"! Let me know if you'd like to add more tasks by tapping on the menu icon"]
    var response = responseArr[Math.floor(Math.random()*responseArr.length)] //randomizes response
    return response;
  },
  'NO_WORKING': ["Fine, just let me know when you're ready to begin"],
  'ASK_FOR_TASKS': ['What must you accomplish by the end of the day? I reccomend focusing on five or less tasks.','Type to add a task...'],
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
  'SHOW_TASKS': ["Here's what you have to do today:"],
  'ASK_REFLECTION_QUESTIONS': function(i){
    var arr = ["What's one conversation or interaction you had today that really mattered?","Many of us think of our lives as boringly normal. Take a step back, and take a look at your life as an outsider. What are a few unique, exciting, or just plain odd things you'd see in yourself?",
    "You have the choice to erase one incident from your past, as though it never happened. What would you erase and why?", "Think about the last party you went to. Did being around lots of people either fill you with energy or make you thirst for alone time?",
    "Even if you're not a competitve person, is there something you're always competitive about? Why do you think that is?", 'When are you "in the zone?" What are you doing at those moments and what can you attribute your intense focus too?',
    "What’s the biggest risk you’d like to take — but haven’t been able to?", "If there's one person you'd share this thought catalog with, who would it be and why?", "Do you consider yourself funny? Do other people?", "What's one compliment you recieved lately that really had you blushing? Why did it affect you in such a way?",
    "Does the news you read improve or hurt your lifestyle? What type of news helps you to be a better person?","Tell me about a bullet you dodged. Did that bullet end up hitting somebody else?", "Is there a piece of art that inspires you? Why does it evoke the emotions that it does?"];
    return arr[i]

  },
  'RANDOM_VIDEOS':[[path.join(__dirname, 'public/videos/vid1.mp4'), 'https://www.instagram.com/jakepaul/'],[path.join(__dirname, 'public/videos/alissaviolet.mp4'),'https://www.instagram.com/alissaviolet/'],[path.join(__dirname, 'public/videos/rachelryle.mp4'),'https://www.instagram.com/alissaviolet/'],[path.join(__dirname, 'public/videos/baddiewinkle.mp4'),'https://www.instagram.com/baddiewinkle/'],[path.join(__dirname, 'public/videos/bestvines1.mp4'),'https://www.instagram.com/bestvines/'],[path.join(__dirname, 'public/videos/brittanyfurlan.mp4'),'https://www.instagram.com/brittanyfurlan/'],[path.join(__dirname, 'public/videos/cashcats.mp4'),'https://www.instagram.com/cashcats/'],[path.join(__dirname, 'public/videos/bestvines2.mp4'),'https://www.instagram.com/bestvines/'],[path.join(__dirname, 'public/videos/bestvines3.mp4'),'https://www.instagram.com/bestvines/'],[path.join(__dirname, 'public/videos/funnyvideos1.mp4'),'https://www.instagram.com/explore/tags/funnyvideo/'],[path.join(__dirname, 'public/videos/jakepaul1.mp4'),'https://www.instagram.com/jakepaul/'],[path.join(__dirname, 'public/videos/funnyvids.mp4'),'https://www.instagram.com/funnyvideos/']],
  // "SAVE_REFLECTION_QUESTION" : ["Thank you, your reflection has been saved.", 'Check out your reflection memories at www.pamchatbot.herokuapp.com/' + user._id],
  "ERROR" : ["Please finish these first few setup questions before changing your preferences"],
  "ERROR_TOPIC":["Please choose 1 of these 3 topics:"],
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
      else if (messageReceived !== "Funny" || messageReceived !== "Inspirational" || messageReceived !== "Tech"){
         user.state = 3;
         return{
           user,
           messageSend: prompts.ERROR_TOPIC
         }
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
      user.state = 7
      // user.token = randomCode();
      if(!data.entities.datetime){
        user.state = 5;
        return {user, messageSend: prompts.TIME_INCOMPLETE};
      }
        console.log("USER~~~~~ ",user.timezone);
        var dt = new Date(data.entities.datetime[0].values[0].value);
        user.timeToWakeUp.minute = dt.getMinutes();
        console.log("hour", dt.getHours())
        console.log("dt.gGETHOURSSSSSSSSS()=============",dt.getHours())
        console.log("Math.abs(user.timezone)gGETHOURSSSSSSSSS",Math.abs(user.timezone))
      if(dt.getHours() <= Math.abs(user.timezone)){
        user.timeToWakeUp.hour = 24 + dt.getHours() + user.timezone;
        console.log("user.timeToWakeUp.hour", user.timeToWakeUp.hour)
      }else {
        user.timeToWakeUp.hour = dt.getHours() + user.timezone;
      }
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      //reduce all the routines to a string
      var routine = user.routine.reduce(function(prev, cur) {
        return prev + cur.routine.toString() + " for "+ cur.duration.toString() + " minutes, ";
      }, '')
      routine = routine.substring(0, routine.length - 2);
      console.log("ROUTINNNNNEEEEEEEEEEE", routine)
      return {
        user,
        messageSend: ["Your morning routine is " + routine+".",
        "If you'd like to change your settings at any time, click 'menu'. You are set"]
      }
    },
  //START_MORNING
    6: function(user, messageReceived) {
      user.state = 7
      return {
        user: user,
        messageSend: prompts.START_MORNING(user)
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
        messageSend: prompts.DONE_WORKING(user)
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
      console.log("MESSAGE RECEIVED~~~~ ", messageReceived);
      user.tasks = user.tasks.concat(messageReceived);
      console.log("user.tasks", user.tasks);
      user.state = 13
      return {
        user: user,
        messageSend: prompts.ADD_ANOTHER_TASK
      }
    },
  // SHOW_TASK
    15: function(user, messageReceived, trump, content) {

    if (user.tasks.indexOf(messageReceived)> -1 ) {
        var index = user.tasks.indexOf(messageReceived)
        console.log("Reached")
        user.tasks.splice(index, 1)
        user.save(function(err) {console.log('err from saving routine',err)})
      }

    if(messageReceived === "Add another task"){
      user.state = 14;
      return {
          user: user,
          messageSend: prompts.ASK_FOR_TASKS
        }
    }
      if (!user.tasks.length) {
        user.state = 16
        return {
          user: user,
          messageSend: prompts.DONE_WORKING.concat([ "Here's an article I thought you would enjoy ", content])
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
      user.reflectionQuestion = prompts.ASK_REFLECTION_QUESTIONS(user.reflectionState);
      user.reflectionState++;
      return {
        user: user,
        messageSend: ["Another day down. Take a second to reflect and your response will be saved and visualized",user.reflectionQuestion]
      }
    },
    // SAVE_REFLECTION_QUESTION
    17: function(user, messageReceived) {
      var date = new Date();
      // user.reflection.title.text.headline = user.reflectionQuestion;
      // user.reflection.title.text.headline = messageReceived;
      user.reflectionAnswer = messageReceived;
      user.state = 18
      return {
        user: user,
        messageSend: ['Upload a picture, selfie, or video from today and I\'ll stitch it into your reflection. Otherwise, reply "no"...']
      }
    },

    // REFLECTION_PICTURE_QUESTION
    18: function(user, messageReceived) {
      console.log('urlllllllllllllllllll', messageReceived)
      var date = new Date();
      if (messageReceived.indexOf('https') < 0) {
        messageReceived = 'https://source.unsplash.com/category/nature'
      }
        user.reflection.events.push(
        {
          //detect key words and display pictures
          "start_date": {
            "month": date.getMonth() + 1,
            "day": date.getDay(),
            "year": date.getYear()
          },
          "text": {
            "headline": user.reflectionQuestion,
            "text": user.reflectionAnswer
          },
          "media":{
            "url": messageReceived
          }
        })
      return {
        user: user,
        messageSend: ["I've saved your reflection, thanks for sharing. Your information will always be kept private", 'Check out a visualizaiton of your reflection log at https://6ec1f808.ngrok.io/reflection/' + user._id, "I'll be in touch tomorrow!"]
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
          console.log("Duration undefined")
          return {user, messageSend: prompts.SETUP("For how long? 5 minutes, half an hour...?")}
      }
      else{
        user.routine.push(newRoutine)
        // user.state = user.prevState;
        user.prevState = null;
        console.log("ROUTINE", newRoutine)
      }

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


// Ethan Debug
// app.post('/webhook', (req, res) => {
//   res.send('ethan debug complete :-)')
// })
var count = 1;
app.get('/reflection/:id', (req, res, next) => {
  console.log("ID coming in: ", req.params.id)
  User.findById(req.params.id, function(err, user) {

    if (err || !user) {return res.status(400).send(err);}
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
        var userHours = date.getUTCHours() + user.timezone;
        console.log("user: ", user.firstname)
        console.log("hour at user's timezone: ",userHours)
        console.log("user.reflectionTime.hour", user.reflectionTime.hour)
        if (user.timeToWakeUp.hour === userHours && user.timeToWakeUp.minute <= date.getMinutes() && (date.getMinutes() - user.timeToWakeUp.minute <= 11)) {
        console.log("I AM WAKING YOU UPPPP")
          user.state = 7
          //choose a random video
          console.log("I AM WAKING YOU UPPPP")
          var randomVideo = prompts.RANDOM_VIDEOS[Math.floor(Math.random()*prompts.RANDOM_VIDEOS.length)];
          sendTextMessages({user, messageSend: prompts.WEATHER(user, weatherData)});
          // sendVideo({user, messageSend: prompts.START_MORNING}, randomVideo, prompts.START_MORNING)
          uploadVideo({user, messageSend: prompts.START_MORNING}, randomVideo[0], randomVideo[1]);
        } else if (user.reflectionTime.hour === userHours && user.reflectionTime.minute <= date.getMinutes() && (date.getMinutes() - user.reflectionTime.minute <= 11)) {
          user.state = 17
          sendTextMessages({user, messageSend: prompts.ASK_REFLECTION_QUESTIONS})
        }
        user.save(function(err) {console.log("user save err", err)})
      })
    })
  })
  res.send(200)
});
// app.post('/webhook/', function(req, res){console.log("parker debug")});

app.post('/webhook/', function(req, res){
  var event = req.body.entry[0].messaging[0];
  var messageReceived;
  console.log("EVENT",event.message);

  if (event.postback) {
    messageReceived = event.postback.payload
  }
  else if (event.message.attachment) {
    messageReceived = event.message.attachment[0].payload.url;
  }

  else{
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

          console.log("[PHASE] Wit parsing ------------")
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
      console.log("USER TOPIC]]]]", user.topic)
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
                if(result.type){
                  req.content = result.origin.url;
                  console.log("req.content type ", typeof req.content)
                  console.log("REQ.CONTENT~~~ ", req.content)
                  console.log("[PHASE] Content retrieval ------------")
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
      } else {
      }
      /* END MENU MESSAGE HANDLING */
      // console.log("HeyYa1---", user)
      //handler is a function that returns user and messageSend, according to the user's state
      var handler = stateHandlers[user.state]; //wrap everything inside of a .then()

      // console.log("Moving from state " + currentState + " with " + messageReceived);

      //call handle to set the state to the next
      // if (typeof handler === 'promise')
      // console.log("REQREQREQREQ ", req, req.content)
      console.log("[PHASE] Message retrieval ------------")
      var handle = handler(user, messageReceived, req.witData, req.content); //add req.witData
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
        sendTopicButtons(user, ["Funny", "Inspirational", "Tech"])
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
        return sendMultiButton(handle, user.tasks, handle.messageSend, 'Finish', 'Add New Task')
      }
      //changed to 2 after we incremented the state
      else if (user.prevState === 2 || user.prevState === 7 || user.prevState === 10 || user.prevState === 14) {
        // console.log("attempting a sendButton with ", handle.messageSend);
        return sendButton(handle)
      //send a video
      } else if (user.state === 16 || user.prevState === 6) {
        // sendTextMessages(handle, retrieveMediaContent(user.topic))
      //the video here will be randomly generated later
        // return sendVideo(handle, 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', handle.messageSend) /// SEND CONTENT HERE
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
          return sendTextMessages({ user: handle.user, messageSend:["Here's a link to a "+ user.topic+ " link that I thought you might like...", req.content]}) // SEND CONTENT HERE sends twice because state and prev state are maintained
      }

      //commented out at 4:41 because retrievemediacontent is not a function
      // if(user.state === 11 ){
      //   return sendTextMessages(handle, retrieveMediaContent(user.topic))
      // }

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


module.exports = app;
