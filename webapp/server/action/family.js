
/*
 * Eric Yi on 2014-05-17
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');
string_util = require('../common/string_util');
crypto_util = require('../common/crypto_util');

router.get('/', function(req, res) {
  Base.getFamilies(null, function(families) {
    var json = ModelProxy.toFamilyJson(families);
    res.send(json);
  });
});

router.get('/member/current', function(req, res) {
  var json = '{}';
  var family = req.session.family;
  if (family)
    json = ModelProxy.copyFamily(family).toJson();
  res.send(json);
});

router.post('/:id/edit', function(req, res) {
  var id = req.params.id;
  var name = string_util.formToSql(req.body.family_name, '\'');
  var password = req.body.family_password;
  if (!string_util.isEmpty(password))
    password = crypto_util.md5(password);
  else
    password = req.session.family.password;
  password = string_util.formToSql(password, '\'');
  var email = string_util.formToSql(req.body.family_email, '\'');
  var qq = string_util.formToSql(req.body.family_qq, '\'');
  var weibo = string_util.formToSql(req.body.family_weibo, '\'');
  var weico = string_util.formToSql(req.body.family_weico, '\'');
  var family = ModelProxy.copyFamily({
    id: id,
    name: name,
    password: password,
    email: email,
    qq: qq,
    weibo: weibo,
    weico: weico
  });
  var message = new Message();
  message.success = false;
  Base.service.updateFamily(family, function(result) {
    message.success = true;
    res.send(message.toJson());
  });
});

module.exports = router;
