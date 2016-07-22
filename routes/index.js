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
<<<<<<< HEAD
<<<<<<< HEAD

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/index.html')
});
=======
>>>>>>> origin/master
=======
>>>>>>> d4405a10b693e04e3c5b7bc26b415c758c7cfb20

module.exports = router;

