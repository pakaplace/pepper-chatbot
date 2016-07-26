var express = require('express');
var router = express.Router();

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
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/index.html')
});


module.exports = router;

