
/*
 * Eric Yi on 2014-05-1y
 * yi_xiaobin@163.com
 */

date_util = require('../common/date_util');
module.exports = function() {
  var id;
  var target_type;
  var target_id;
  var family_id;
  var name;
  var email;
  var content;
  var reply_time;

  return {
    id:           this.id,
    target_type:  this.taret_type,
    target_id:    this.target_id,
    family_id:    this.family_id,
    name:         this.name,
    email:        this.email,
    content:      this.content,
    reply_time:   this.reply_time,

    reply_date: function() {
      return date_util.split(this.reply_time);
    },

    toJson: function() {
      return '{"id":"' + this.id + 
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
