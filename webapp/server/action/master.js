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

router.get('/family', function(req, res) {
  var json = '{}';
  var family = req.session.family;
  if (family)
    json = ModelProxy.copyFamily(family).toJson();
  res.send(json);
});

router.post('/login', function(req, res) {
  login(req, res);
});

function isLogin(req) {
	if (req.session.family)
		return true;
	return false;
}

function requestLogin(req, res) {
	if (isLogin(req)) {
  	var message = new Message();
		message.success = true;
		message.msg = 1;
		res.send(message.toJson());
		return true;
	}
	return false;
}

function login(req, res) {
	if (requestLogin(req, res)) {
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
