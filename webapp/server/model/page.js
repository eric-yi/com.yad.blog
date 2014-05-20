
/*
 * Eric Yi on 2014-05-16
 * yithis.xiaobin@163.com
 */

module.exports = function() {
  var total;
  var size;
  var num;
  var current;
  var prev;
  var next;
	var start;
	var end;
	var sql = false;

  return {
    total:		this.total,
    size:			this.size,
    num:			this.num,
    current:	this.current,
    prev:			this.prev,
    next:			this.next,
		start:		this.start,
		end:			this.end,
		sql:			this.sql,

    toJson: function() {
      return '{"total":"' + this.total +
        '", "size":"' + this.size +
        '", "num":"' + this.num +
        '", "current":"' + this.current +
        '", "prev":"' + this.prev +
        '", "next":"' + this.next +
        '"}';
    }
  };
};
