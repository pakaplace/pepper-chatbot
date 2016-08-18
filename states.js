'use strict'
var prompts = require('./prompts')

//stateHandlers set user's state and return the user and the messageSend
var stateHandlers = {
  //NOT_STARTED: welcome the user and introduce Pepper
    0: function(user, messageReceived) {
      //set state to 1, ask for content
      user.state = 1
      return {
        user,
        messageSend: prompts.WELCOME(user)
      }
    },
    //ASK_TOPICS
    1: function(user, messageReceived) { //
      user.state = 2
      // ASK TOPICS
      return{
        user,
        messageSend: prompts.TOPICS
      }
    },
    //ASK_CITIES
    2: function(user, messageReceived){
      if(messageReceived === "Sports" || messageReceived === "News" || messageReceived === "Tech"){
        user.topic = messageReceived;
      }
      else if (messageReceived !== "Sports" || messageReceived !== "News" || messageReceived !== "Tech"){
         user.state = 2;
         return{
           user,
           messageSend: prompts.ERROR_TOPIC
         }
      }
      user.state = 3;
      return {
        user,
        messageSend: prompts.CITY()
      }
    },
  //TIMETOWAKEUP_ASKING
    3: function(user, messageReceived, data) {
      if(data.entities.location === undefined){
        user.state=3;
        return { user, messageSend: prompts.CITY("Oops, looks like you didn't enter in the name of your state.")
        }
      } else {
        user.state = 4
        user.city = data.entities.location[0].value;
        return {
          user: user,
          messageSend: prompts.TIMETOWAKEUP()
        }
      }
    },
  //SETUP_READY
    4: function(user, messageReceived, data) {
      user.state = 5
      if(!data.entities.datetime){
        user.state = 4;
        return {user, messageSend: prompts.TIME_INCOMPLETE};
      }
      var dt = new Date(data.entities.datetime[0].values[0].value);
      user.timeToWakeUp.minute = dt.getMinutes();
      if(dt.getHours() <= Math.abs(user.timezone)){
        user.timeToWakeUp.hour = 24 + dt.getHours() + user.timezone;
      } else {
        user.timeToWakeUp.hour = dt.getHours() + user.timezone;
      }
      user.timeToWakeUp.time = user.timeToWakeUp.hour+":"+user.timeToWakeUp.minute;
      return {
        user,
        messageSend: ["You are set! I'll be contacting you tomorrow morning at "+user.timeToWakeUp.time+ " to help you start your day"]
      }
    },
  //START_MORNING
    5: function(user, messageReceived, witData, content) {
      user.state = 6
      return {
        user,
        messageSend: prompts.START_MORNING(user)
      } //send video here
    },
  // START_WORKING
    6: function(user, messageReceived) {
      user.state = 7
      return {
        user,
        messageSend: prompts.START_WORKING
      }
    },
  //HANDLING_START_WORKING
    7: function(user, messageReceived) {
      if (messageReceived === 'yes') {
        // ASK_FOR_TASKS
        user.state = 8
        return {
          user,
          messageSend: prompts.ASK_FOR_TASKS
        }
      } else if (messageReceived === 'no') {
        // NO_WORKING
        user.state = 11
        return {
          user,
          messageSend: prompts.NO_WORKING
        }
      }
    },
    // ADD_ANOTHER_TASK
    8: function(user, messageReceived) {
      user.tasks = user.tasks.concat(messageReceived);
      console.log("user.tasks", user.tasks);
      user.state = 9
      return {
        user: user,
        messageSend: prompts.ADD_ANOTHER_TASK
      }
    },
    //HANDLING_ADD_TASK
    9: function(user, messageReceived) {
      if (messageReceived === 'yes') {
        user.state = 8
        return {
          user: user,
          messageSend: prompts.ASK_FOR_TASKS
        }
      } else if (messageReceived === 'no') {
        user.state = 10
        return {
          user,
          messageSend: prompts.SHOW_TASKS
        }
      }
    },
    //SHOW_TASKS
    10: function(user, messageReceived, witData, content) {
      if (messageReceived === "Add another task"){
        user.state = 8;
        return {
            user,
            messageSend: prompts.ASK_FOR_TASKS
          }
      }
      if (user.tasks.indexOf(messageReceived)> -1) {
          var index = user.tasks.indexOf(messageReceived)
          console.log("Reached")
          user.tasks.splice(index, 1)
          user.save(function(err) {console.log('err from saving routine', err)})
        }
      if (!user.tasks.length) {
        console.log("REACHED YO")
        user.state = 12
        return {
          user,
          messageSend: prompts.DONE_WORKING(user, content)
        }
      }
      return {
        user,
        messageSend: prompts.SHOW_TASKS
      }
    },
    // NO_WORKING
    11: function(user, messageReceived) {
      user.state = 6
      return {
        user,
        messageSend: ['Glad you are back!']
      }
    },
  // DONE_WORKING
    12: function(user, messageReceived) {
      user.state = 13
      return {
        user,
        messageSend: prompts.STALL
      }
    },
  // ASK_REFLECTION_QUESTIONS
    13: function(user, messageReceived) {
      if (messageReceived === 'yes') {
        user.state = 14
        //choose a random reflection question
        user.reflectionQuestion = prompts.ASK_REFLECTION_QUESTIONS(user.reflectionState);
        user.reflectionState++;
        if(user.reflectionQuestion === undefined){user.reflectionState = 0} // prevents question not in prompts array from being asked
      } else {
        user.state=12;
        user.prevState=10;
        return {
          user,
          messageSend: ["Fine. You can reflect later if you'd like..."]
        }
      }

      return {
        user,
        messageSend: ["Another day down. Take a second to reflect and your response will be saved and visualized",user.reflectionQuestion]
      }
    },
  // SAVE_REFLECTION_QUESTION
    14: function(user, messageReceived) {
      var date = new Date();
      // user.reflection.title.text.headline = user.reflectionQuestion;
      // user.reflection.title.text.headline = messageReceived;
      user.reflectionAnswer = messageReceived;
      user.state = 15
      return {
        user,
        messageSend: ['Upload a picture, selfie, or video from today and I\'ll stitch it into your reflection. Otherwise, reply "no"...']
      }
    },

  // REFLECTION_PICTURE_QUESTION
    15: function(user, messageReceived) {
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

        user.reflection.title.media.url =  user.profile;
        user.reflection.title.text.headline = user.firstname + "'s Memories";
      return {
        user,
        messageSend: ["I've saved your reflection, thanks for sharing. Your information will always be kept private", 'Check out a visualizaiton of your reflection log at https://pamchatbot.herokuapp.com/reflection/' + user._id, "I'll be in touch tomorrow!"]
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
module.exports = stateHandlers;
