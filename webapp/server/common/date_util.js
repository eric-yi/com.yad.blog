
/*
 * Erci Yi on 2014-05-21
 * yi_xiaobin@163.com
 */

var month2chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');

exports.split = function(date) {
	var year = date.getFullYear();
  var month = month2chs[date.getMonth()];
  var day = date.getDate();
	return {
		year:		year,
		month:	month,
		day:		day
	};
};
