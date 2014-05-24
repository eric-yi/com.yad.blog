
/*
 * Eric Yi on 2014-05-19
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
Comment = require('../model/comment');
string_util = require('../common/string_util');
date_util = require('../common/date_util');

router.get('/recent', function(req, res) {
  Base.getRecentComments(req, res);
});

router.post('/add', function(req, res) {
  var message = new Base.Message();
  var comment = fromPost(req);
  Base.service.addComment(comment, function(result) {
    if (!result) {
      message.success = true;
    } else {
      message.msg = result;
    }
    res.send(message.toJson());
  });
});

function fromPost(req) {
  var comment = new Comment();
  var dec = '"';
  var target_type = string_util.dealNull(req.body.target_type, dec);
  var target_id = string_util.dealNull(req.body.target_id, dec);
  var family_id = string_util.dealNull(req.body.family_id, dec);
  var article_id = string_util.dealNull(req.body.article_id, dec);
  var name = string_util.dealNull(req.body.author, dec);
  var email = string_util.dealNull(req.body.email, dec);
  var content = string_util.dealNull(req.body.comment, dec);
  var reply_time = dec + date_util.formatTime(new Date()) + dec;
  var reply_id = req.body.reply_id;
  if (reply_id != -1)
    target_id = string_util.dealNull(reply_id, dec);
  var reply_type = req.body.reply_type;
  if (reply_type != -1)
    target_type = string_util.dealNull(reply_type, dec);
  comment.target_type = target_type;
  comment.target_id = target_id;
  comment.family_id = family_id;
  comment.article_id = article_id;
  comment.name = name;
  comment.email = email;
  comment.content = string_util.lineToHtml(content);
  comment.reply_time = reply_time;

  return comment;
}

module.exports = router;
