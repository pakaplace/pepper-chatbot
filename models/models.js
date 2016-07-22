var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
<<<<<<< HEAD
var connect = require('./connect.js');
=======
var connect = require('./connect.js').MONGODB_URI;
>>>>>>> d4405a10b693e04e3c5b7bc26b415c758c7cfb20

// var db = mongoose.connection;
// db.once('open', function callback () {
// console.log("DB Connected!");
// });

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  state: {
    type: Number,
    required: true,
    default: 0
  },
  // token: {
  //   type: Number
  // },
  facebookId: { //store facebook id here
    type: String,
    required: true
  },
  routine:[
    {
      routine: String,
      duration:Number
    }
  ],
  routineCopy:{
    type: Array
  },
  city: {
    type: String
  },
  timeToWakeUp: [
    {
      time: String,
      hour: Number,
      minute:Number
    }
  ],
  tasks:{
    type: Array
  }, 
  prevState: {
    type: Number
  },
<<<<<<< HEAD
  firstname:{
    type: String
  },
  timezone:{
    type: Number
  },
  locale:{
    type:String
  },
  gender:{
    type:String
  },
  missingDuration:{
    type: String,
    name: "Routine but no duration"
  },
  missingRoutine:{
    type: String,
    name: "Duration but no routine"
  },
  reflectionTime: [
    {
      hour: {
        type: Number,
        default: 21
      },
      minute: {
        type: Number,
        default: 0
      }
    }
  ],
  reflectionQuestion: {
    type: String
  },
=======
  prevState: {
    type: Number
  },
  firstname:{
    type: String
  },
  timezone:{
    type: Number
  },
  locale:{
    type:String
  },
  gender:{
    type:String
  },
  missingDuration:{
    type: String,
    name: "Routine but no duration"
  },
  missingRoutine:{
    type: String,
    name: "Duration but no routine"
  },
  reflectionTime: [
    {
      hour: {
        type: Number,
        default: 21
      },
      minute: {
        type: Number,
        default: 0
      }
    }
  ],
  reflectionQuestion: {
    type: String
  },
>>>>>>> d4405a10b693e04e3c5b7bc26b415c758c7cfb20
  reflection:{
    "title": {
        // "media": {
        //   "url": String,
        //   "caption": String,
        //   "credit": String
        // },
        "text": {
          "headline": String,
          "text": String
        }
    },
    "events": []
    }
});

userSchema.plugin(findOrCreate);
module.exports = {User: mongoose.model('User', userSchema)};
