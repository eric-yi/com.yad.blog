
/*
 * Eric Yi on 2014-05-19
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var article_id;
  var title;
  var auth;
  var reply_id;
  var target_type;
  var target_id;
  var family_id;
  var name;
  var email;
  var content;
  var reply_time;

  return {
    article_id:   this.article_id,
    title:        this.title,
    auth:         this.auth,
    reply_id:     this.reply_id,
    target_type:  this.taret_type,
    target_id:    this.target_id,
    family_id:    this.family_id,
    name:         this.name,
    email:        this.email,
    content:      this.content,
    reply_time:   this.reply_time,

    toJson: function() {
      return '{"article_id":"' + this.article_id + 
        '", "title":"' + this.title +
        '", "auth":"' + this.auth +
        '", "reply_id":"' + this.reply_id +
        '", "target_type":"' + this.target_type +
        '", "target_id":"' + this.target_id +
        '", "family_id":"' + this.family_id +
        '", "name":"' + this.name +
        '", "email":"' + this.email +
        '", "content":"' + this.content +
        '", "reply_time":"' + this.reply_time +
        '"}';
    }
  };
};
