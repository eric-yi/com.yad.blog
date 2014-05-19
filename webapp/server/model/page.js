
/*
 * Eric Yi on 2014-05-16
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var _total;
  var _size;
  var _num;
  var _current;
  var _prev;
  var _next;
	var _start;
	var _end;
	var _sql = false;

  return {
    total: _total,
    size: _size,
    num: _num,
    current: _current,
    prev: _prev,
    next: _next,
		start: _start,
		end: _end,
		sql: _sql,

    toJson: function() {
      return '{"total":"' + _total +
        '", "size":"' + _size +
        '", "num":"' + _num +
        '", "current":"' + _current +
        '", "prev":"' + _prev +
        '", "next":"' + _next +
        '"}';
    }
  };
};
