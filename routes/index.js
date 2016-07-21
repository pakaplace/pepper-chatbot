var express = require('express');
var router = express.Router();

//Models
var User = require('./models/models').User;
// need to import sendVideo ????
var sendVideo = require('../app').sendVideo;

//** WIT REQUIRE **//
let Wit = null;
let log = null;

try {
  Wit = require('../').Wit;
  log = require('node-wit').log;
} catch(e){
  Wit = require('node-wit').Wit
  log = require('node-wit').log;
}

/* GET home page. */
router.get('/sendScheduled', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.status(500).send('error', {
        message: error
      })
    }
    var date = new Date();
    var userHours = date.getUTCHours()+user.timezone;
    //need to compare the time
    users.forEach(function(user) {

      if (user.timeToWakeUp.hour === userHours && user.timeToWakeUp.minute <= date.getMinutes()) {
        user.state = 6
        sendVideo(handle, 'https://www.dropbox.com/s/p4qo3clfnnyokb7/Tous.mp4?dl=0', handle.messageSend)
      }
    })
  })
});

module.exports = router;
