'use strict'
var path = require('path');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'hbs');

//prompts are all the response PAM would send back
var prompts = {
  //SETUP
 "WELCOME": function(user){
   console.log("USER", user)
   console.log("USER", user.firstname)
   return  ["Nice to meet you "+ user.firstname, "Your decision to message me was a good one, as you'll see...",
             "I'll text you when I wake up in the mornings, keep track of your tasks, and feed you reflection questions at the end of the day :)"]
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

  "SETUPCOMPLETE": ["You're all set. From now on I'll be encouraging you to stay ahead of your tasks, and to reflect on your daily experiences.", "Tap the menu icon to revise your routine and settings. If you'd like to start now just let me know..."],

  "TASKPROMPT": ["What do you have to do today?", "Separate tasks by comma since I'm dumb"],

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
    var responseArr = ["Good morning "+user.firstname+". This video should help get you out of bed!", "Hello there "+user.firstname+". Here's something to brighten this morning", "WAKE UP "+user.firstname+"!!! My dear, did I leave the caps lock on :o . Here's an interesting article to start your morning","Rise and shine "+user.firstname+". I'm funny, don't you think?" ];
    var response = [responseArr[Math.floor(Math.random()*responseArr.length)]] //randomizes response
    return response;
  },

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

  'DONE_WORKING': function(user, content){
    var responseArr = ["You're finished "+user.firstname+"! Take pride in what you've done today. If you'd like to add more tasks, tap on the menu icon", "Fantastic, "+user.firstname+"! Time for some well deserved personal time. If you'd like to add more tasks, tap on the menu icon", "Beautifully done, "+user.firstname+"! Let me know if you'd like to add more tasks by tapping on the menu icon"]
    var response = ["Here's a cool article as a reward for your hard work " + content, responseArr[Math.floor(Math.random()*responseArr.length)]] //randomizes response
    return response;
  },

  'STALL': {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": 'Would you like to reflect?',
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

module.exports = prompts;
