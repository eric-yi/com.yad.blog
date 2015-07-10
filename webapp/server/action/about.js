var express = require('express');
var router = express.Router();
logger_util = require('../common/logger_util');
var logger = logger_util.getLogger();
Base = require('./base');

router.get('/', function(req, res) {
  Base.getAbout(res);
});

router.get('/content', function(req, res) {
  res.send(Base.getAboutContent());
});

router.post('/edit', function(req, res) {
  var msg = 1;
  try {
    Base.service.updateAbout(req.body.content);
  } catch(e) {
    console.log(e);
    msg = -11;
  }
  Base.sendMessage(res, msg);
});


var resume_keys = [];

router.post('/resume/:member/open', function(req, res) {
  var member = req.params.member;
  var passkey = req.body.resume_passkey;
  logger.debug('member: ' + member + ', passkey: ' + passkey);
  var realkey = '(resume==' + member + ' && miaomiao == beautiful) ? maybe scare : not peep';
  logger.debug(realkey);
  var message = new Base.Message();
  if (passkey == realkey) {
    message.success = true;
    var resume_key = (Math.random()/+new Date()).toString(36).replace(/\d/g,'').slice(1);
    resume_keys.push(resume_key);
    message.msg = resume_key;
    res.send(message.toJson());
  } else {
    Base.sendMessage(res, 0);
  }
});

router.get('/resume/:member/view', function(req, res) {
  var html = '';
  var index = resume_keys.indexOf(req.query.key);
  if (index > -1) {
    resume_keys.splice(index, 1);
    var member = req.params.member;
    html = Base.getResume(member);
  }
  
  res.send(html);
});

module.exports = router;
