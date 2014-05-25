
/*
 * Eric Yi on 2014-05-17
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var position;
  var username;
  var password;
  var name;
  var member_id;
  var email;
  var qq;
  var weibo;
  var weico;

  return {
    id:           this.id,
    position:     this.position,
    username:     this.username,
    password:     this.password,
    name:         this.name,
    member_id:    this.member_id,
    email:        this.email,
    qq:           this.qq,
    weibo:        this.weibo,
    weido:        this.weico,

    toJson: function() {
      return '{"id":"' + this.id +
        '", "position":"' + this.position +
        '", "username":"' + this.username +
        '", "name":"' + this.name +
        '", "member_id":"' + this.member_id +
        '", "email":"' + this.email +
        '", "qq":"' + this.qq +
        '", "weibo":"' + this.weibo +
        '", "weico":"' + this.weico +
        '"}';
    }
  };
};
