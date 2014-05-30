var express = require('express');
var router = express.Router();
Constants = require('./constants');
string_util = require('../common/string_util');
crypto_util = require('../common/crypto_util');
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  res.render('master.htm', Constants.parameters);
});

router.post('/login', function(req, res) {
  login(req, res);
});

router.get('/logout', function(req, res) {
  var message = new Message();
  if (Base.isLogin(req)) {
    req.session.family = null;
  }
  res.send(message.toSuccessJson());
});

function login(req, res) {
  if (Base.requestLogin(req, res)) {
    return;
  }
  var message = new Message();
  message.success = false;
  var username = req.body.username;
  var password = req.body.password;
  if (string_util.isEmpty(username) || string_util.isEmpty(password)) {
    message.msg = -1;
    res.send(message.toJson());
  } else {
    Base.service.getFamilyByLogin(username, crypto_util.md5(password), function(info) {
      message.msg = info.code;
      if (info.code != 0) {
        res.send(message.toJson());
      } else {
        message.success = true;
        req.session.family = info.family;
        res.send(message.toJson());
      }
    });
  }
}

module.exports = router;
