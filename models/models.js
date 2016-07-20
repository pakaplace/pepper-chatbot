var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = require('./connect.js').MONGODB_URI;

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
  facebookId: { //store facebook id here
    type: String,
    required: true
  },
  routine:{
    type: Array
  },
  routineCopy:{
    type: Array
  },
  city: {
    type: String
  },
  timeToWakeUP: {
    type: String
  },
  tasks:{
    type: Array
  },
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
  }
});

userSchema.plugin(findOrCreate);
module.exports = {User: mongoose.model('User', userSchema)};
