var express = require('express');
var router = express.Router();

//Models
var User = require('./models/models').User;
// need to import sendVideo ????
var sendVideo = require('../app').sendVideo;

/* GET home page. */
router.get('/sendScheduled', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.status(500).send('error', {
        message: error
      })
    }
    //need to compare the time
    user.forEach
    var date = new Date();
    if (user.timeToWakeUp.hour === date.getHours() && user.timeToWakeUp.minute <= date.getMinutes()) {
      user.state = 6
      sendVideo(handle, 'https://www.dropbox.com/s/p4qo3clfnnyokb7/Tous.mp4?dl=0', handle.messageSend)
    }
  })
});

module.exports = router;
