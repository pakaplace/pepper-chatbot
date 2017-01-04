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
   return  ["Hi there "+ user.firstname, "My name is Pepper and I'm delighted to meet you!",
             "Together, we'll build a more PRODUCTIVE and MINDFUL routine", "Type anything to get started"]
  },

 "TOPICS":["Additionally, I'll send you tailored news content to enjoy as you complete your list. Tap on one of the options above ^^^"],

 "CITY": function(user, errorMessage){
    if(errorMessage === undefined && user.locale.indexOf('US')=== -1){
      return ['What city and country do you live in? For example, you could say "Hamburg, Germany"']
    }
    else if(errorMessage === undefined){
      return ['What city and state do you live in? You could reply with "Chapel Hill, North Carolina" or "Beijing" for example...', "This will help me with sending you local information, like the weather "]
    }
    else{
      return [errorMessage]
    }
  },

  'TIMETOWAKEUP': function(errorMessage) {
    if(errorMessage === undefined){
      return ["What time would you like me to message you in the mornings?", "I'll be sending you readings to get your mind going and recording your agenda..."]
    }
    else {
      return [errorMessage,'What time would you like me to to wake up?']
    }
  },

  "SETUPCOMPLETE": ["You're all set. Type anything to get started or wait until tomorrow morning..."],

  "TASKPROMPT": ["What do you have to do today?", "Separate tasks by comma since I'm dumb"],

  "TIME_INCOMPLETE":["Please enter a valid time", "Following with AM or PM so I don't mess up!"],

  //DAILY
   "WEATHER": function(user, weatherData, content){
    console.log("WEATHER CONTENT,", content)
    if(weatherData !== undefined){
      return ["Good morning! Today in " + user.city + " it'll be " + weatherData.text + " with "+ weatherData.temp + "°F. Get your mind rolling with this top article - " + content.title+ '"', content.url, "Message me anything to get started"]
    }
    else{
      return ["Please update your current city in the menu bar to get weather forecast."]
    }
  },

  'START_MORNING': function(user, content){
    var responseArr = ["Good morning "+user.firstname, "Hello there "+user.firstname, "WAKE UP "+user.firstname+". My dear, did I leave the caps lock on :o ","Rise and shine "+user.firstname];
    console.log("START_MORNING CONTENT", content)
    var response = [responseArr[Math.floor(Math.random()*responseArr.length)], 'Here\'s some '+user.topic+" news to get your mind running- "+ '"'+content.title+'"', content.url] //randomizes response
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

  'BEGIN_WORKING_STANDBY':["Need a minute? When you're ready to start, type anything.."],

  'DONE_WORKING': function(user, content){
    var responseArr = ["You're finished "+user.firstname+"! Take pride in what you've done today. If you'd like to add more tasks, tap on the menu icon", "Fantastic, "+user.firstname+"! Time for some well deserved personal time. If you'd like to add more tasks, tap on the menu icon", "Beautifully done, "+user.firstname+"! Let me know if you'd like to add more tasks by tapping on the menu icon"]
    var response = [responseArr[Math.floor(Math.random()*responseArr.length)], "Here's a cool article as a reward for your hard work " + content.url] //randomizes response
    return response;
  },

  'REFLECT_OPTION': {
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

  'ASK_FOR_TASKS': [ "What's the most important thing you have to work on today..."],

  'ADD_ANOTHER_TASK': {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": 'Shall I add another task? Tap an option...',
              "buttons": [{
                    "type": "postback",
                    "payload": 'yes',
                    "title": 'Add task'
                }, {
                    "type": "postback",
                    "payload": 'no',
                    "title": 'Finished'
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
