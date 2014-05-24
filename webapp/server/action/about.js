var express = require('express');
var router = express.Router();
Base = require('./base');

router.get('/', function(req, res) {
  Base.getAbout(res);
});

module.exports = router;

