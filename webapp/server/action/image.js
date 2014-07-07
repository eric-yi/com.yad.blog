var express = require('express');
var router = express.Router();
Base = require('./base');

router.get('/', function(req, res) {
  console.log('images brower');
  

  Base.writeHtml(res);
});

router.post('/upload', function(req, res) {
  Base.imageUpload(req, res);
});


module.exports = router;
