
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var title;
  var subtitle;
  var auth;
  var auth_alias;
  var email;
  var about_title;
  var about_time;
  var about_reply_num;

  return {
    title:            this.title,
    subtitle:         this.subtitle,
    auth:             this.auth,
    auth_alias:       this.auth_alias,
    email:            this.email,
    about_title:      this.about_title,
    about_time:       this.about_time,
    about_reply_num:  this.about_reply_num,

    toJson: function() {
      return '{"title":"' + this.title +
        '", "subtitle":"' + this.subtitle +
        '", "auth":"' + this.auth +
        '", "auth_alias":"' + this.auth_alias +
        '", "email":"' + this.email +
        '", "about_title":"' + this.about_title +
        '", "about_time":"' + this.about_time +
        '", "about_reply_num":"' + this.about_reply_num +
        '"}';
    }
  };
};
