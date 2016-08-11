'use strict'
var path = require('path');

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
  // "MOREROUTINE": {
    // "attachment": {
    //     "type": "template",
    //     "payload": {
    //         "template_type": "button",
    //         "text": 'Would you like to add another morning routine?',
    //         "buttons": [{
    //               "type": "postback",
    //               "payload": 'yes',
    //               "title": 'Yes'
    //           }, {
    //               "type": "postback",
    //               "payload": 'no',
    //               "title": 'No'
    //           }]
    //     }
    // }

  // },
  "MOREROUTINE":['Would you like to add another morning routine?'],
  "TOPICS":["What type of content would you like?"],
  "CITY": function(errorMessage){
    if (errorMessage === undefined){
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
  'ASK_FOR_TASKS': ['What do you have to get done today? Type to add a task'],
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
  'ASK_REFLECTION_QUESTIONS': ["What's one conversation or interaction you had today that really mattered?"],
  'RANDOM_VIDEOS':[[path.join(__dirname, 'public/videos/vid1.mp4'), 'https://www.instagram.com/jakepaul/'],[path.join(__dirname, 'public/videos/alissaviolet.mp4'),'https://www.instagram.com/alissaviolet/']],
  "ERROR" : ["Please finish these first few setup questions before changing your preferences"],
  "CHANGE_TIME": ["Noted. I've updated your wake up time to: "],
  "CHANGE_FREQ": ["Noted. I've updated your frequency to: "],
  "CHANGE_TIME_REFLECTION" : ["Noted. I've updated your reflection time to: "],
  "CHANGE_CITY" : ["Noted. I've updated your city to: "],
  'GREAT': ['Superb, and remember to vote for Trump!!! Make America great again? jkjkjkjkjk lol'],
  'ADD_PICTURE': ['Would you like to send a picture?']
}

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
  // SETUP_ROUTINE_PROMPTING
    1: function(user, messageReceived) { //
    //if the user says 'no' to add another routine, set state to 4 to ask for city
      if(messageReceived === 'no'){
        user.state = 3
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
      if(data.entities)
      user.timeToWakeUp.hour = new Date(data.entities.datetime[0].values[0].value).getHours()+user.timezone;
      user.timeToWakeUp.minute = new Date(data.entities.datetime[0].values[0].value).getMinutes();
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      //reduce all the routines to a string
      var routine = user.routine.reduce(function(prev, cur) {
        return prev + cur.routine.toString() + " for "+ cur.duration.toString() + " minutes , " ;
      }, '')
      return {
        user,
        messageSend: ["Your morning routine is " + routine + "We'll remind you every 3 hours.",
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
    /*MANAGE MORNING ROUTINE*/
    //create a copy of routine in the user model
    if (user.routineCopy.length === 0 && user.prevState === 7) {
      //create the initial copy
      user.routineCopy = user.routine.slice();
    } else {
      user.routineCopy = user.routineCopy.slice();
    }
    //when user click  on 'finish'
    var duration, halfTime, fullTime, index
    for (var i = 0; i < user.routineCopy.length; i ++) {
      if (messageReceived === user.routineCopy[i].routine) {
        user.routineCopy.splice(i, 1)
      }
      if (halfTime || fullTime) {
          clearTimeout(halfTime)
          clearTimeout(fullTime)
      }
   }
    if (messageReceived.slice(0, 5) === 'begin'){
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
          sendMorningRoutine({user, messageSend: user.routineCopy}, user.routineCopy, prompts.START_MORNING_ROUTINE, 'begin', 'finish')
          user.save(function(err) {console.log('err from saving routine',err)})
      }, duration * 60 * 1000);
      // return  handle   do i need to return here?
    }
    /*END OF MORNING ROUTINE*/
      if (messageReceived === 'no') {
        user.state = 10 //start working
        return {
          user: user,
          messageSend: prompts.BEGIN_WORKING_STANDBY
        }
      }
    //if the user has finished morning routine
      if (!user.routineCopy.length && user.prevState === 8) {
        user.state = 10
        return {
          user: user,
          messageSend: prompts.DONE_DAILY_ROUINE
        }
      }
      else {
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
    //when the user click on finish
      if (messageReceived.indexOf('finish') > -1) {
        var index = messageReceived[messageReceived.length - 1];
        user.tasks.splice(index, 1)
        // sendTextMessages({user, messageSend:retrieveMediaContent(user.topic)})
      }
    //if the user has finished all the tasks
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
      return {
        user: user,
        messageSend: [user.reflectionQuestion]
      }
    },
    // REFLECTION_PICTURE_QUESTION
    17: function(user, messageReceived) {
      var date = new Date();
      user.reflection.title.text.headline = user.reflectionQuestion;
      user.reflection.title.text.headline = messageReceived;
      user.reflectionAnswer = messageReceived;
      return {
        user: user,
        messageSend: prompts.ADD_PICTURE
      }
    },
    // SAVE_REFLECTION_QUESTION
    18: function(user, messageReceived) {
      var date = new Date();
      user.reflection.events.push(
        {
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
            "text": messageReceived
          }
        })
      return {
        user: user,
        messageSend: ["I've saved your reflection, thanks for sharing. Your information will always be kept private", 'Check out a visualizaiton of your reflection log at https://d14e4a2f.ngrok.io/reflection/' + user._id]
      }
    },
  // >= 100: EDIT STATES
  // EDIT_WAKEUP_TIME
    100: function(user, messageReceived, witData) {
      user.state = user.prevState; //remembers where you were before menu
      user.prevState = null;
      // user.token = randomCode();
      console.log("DATA~~~~~~~",witData.entities)
      user.timeToWakeUp.hour = new Date(witData.entities.datetime[0].values[0].value).getHours()+user.timezone;
      user.timeToWakeUp.minute = new Date(witData.entities.datetime[0].values[0].value).getMinutes();
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
    // EDIT_ROUTINES
    102: function(user, messageReceived) {
      // user.state = user.prevState; //remembers where you were before menu
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
        user.state = user.prevState
        user.prevState = null;
        return {
          user,
          messageSend: ["Your routine "+ deletedMessage +" has been deleted"]
        }
      }
    },
    //add routine
    103: function(user, messageReceived, data){
      var newRoutine = {};
      if(user.missingDuration || user.missingRoutine){
         newRoutine = {
           routine: user.missingDuration, //filled in
           duration: user.missingRoutine //null
         }
      }
      if(data.entities.duration){ //new routine is checked because if one is saved and the other isn't then it must be
        newRoutine.duration = data.entities.duration[0].normalized.value/60 //to acount for seconds
        user.missingRoutine = data.entities.duration[0].normalized.value/60
      }
      if(data.entities.agenda_entry){
        newRoutine.routine = data.entities.agenda_entry[0].value; //to acount for seconds
        user.missingDuration = data.entities.agenda_entry[0].value;
      }
      if(newRoutine.routine === null || newRoutine.routine === undefined){ // data.entities.location === 'undefined'
          console.log("Agenda undefined")
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
        var status = "Awesome!"
        user.routine.push(newRoutine)
        user.state = user.prevState;
        user.prevState = null;
      }
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
      var CHANGE_TIME = prompts.CHANGE_TIME;
      return {
        user,
        messageSend: prompts.CHANGE_FREQ
      }
    },

     105:  function(user, messageReceived, data) {
       //to be changed to change frequency messages
      user.state = user.prevState; //remembers where you were before menu
      user.prevState = null;
      user.reflectionTime.hour = new Date(data.entities.datetime[0].values[0].value).getHours()+user.timezone;
      user.reflectionTime.minute = new Date(data.entities.datetime[0].values[0].value).getMinutes();
      user.reflectionTime.time = user.reflectionTime.hour+":"+user.reflectionTime.minute;
      var CHANGE_TIME_REFLECTION = prompts.CHANGE_TIME_REFLECTION[0];
      CHANGE_TIME_REFLECTION += user.reflectionTime.time;
      return {
        user,
        messageSend: [CHANGE_TIME_REFLECTION]
      }
    },
}


module.exports = {
  stateHandlers: stateHandlers,
  prompts: prompts
}
