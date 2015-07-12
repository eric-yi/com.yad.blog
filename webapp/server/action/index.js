var express = require('express');
var router = express.Router();
var logger = logger_util.getLogger();
Constants = require('./constants');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.htm', Constants.parameters);
});

router.get('/parameters', function(req, res) {
  res.send(Constants.parameters_json);
});


router.get('/resume/(!resources)/*', function(req, res) {
  filter(req, res);
});


_EXCEPTION_204 = '204, 无内容';
function filter(res) {
  logger.debug('=============filter=============');
  res.send(_EXCEPTION_204);
}

module.exports = router;
