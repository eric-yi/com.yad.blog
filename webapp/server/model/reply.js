
/*
 * Eric Yi on 2014-05-1y
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
	var target_type;
	var target_id;
  var name;
	var email;
	var reply_path;
	var reply_time;

  return {
		id: this.id,
		target_type: this.taret_type,
		target_id: this.target_id,
		name: this.name,
		email: this.email,
		reply_path: this.reply_path,
		reply_time: reply_time,

		toJson: function() {
			return 	'{"id":" ' + this.id + 
							'", "target_type":"' + this.target_type +
							'", "target_id":"' + this.target_id +
							'", "name":"' + this.name +
							'", "email":"' + this.email +
							'", "reply_path":"' + this.reply_path +
							'", "reply_time":"' + this.reply_time +
							'"}';
		}
  };
};
