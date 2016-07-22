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

module.exports = router;
