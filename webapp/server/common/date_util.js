
/*
 * Erci Yi on 2014-05-21
 * yi_xiaobin@163.com
 */

var month2chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');

exports.split = function(date) {
	var year = date.getFullYear();
  var month = month2chs[date.getMonth()];
	var mon = date.getMonth() + 1;
  var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var hour2 = hour;
	if (hour < 10)	hour2 = '0' + hour;
	var minute2 = minute;
	if (minute < 10)	minute2 = '0' + minute;
	return {
		year:			year,
		month:		month,
		mon:			mon,
		day:			day,
		hour:			hour,
		hour2:		hour2,
		minute:		minute,
		minute2:	minute2
	};
};
