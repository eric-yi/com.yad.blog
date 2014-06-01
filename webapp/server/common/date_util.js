
/*
 * Erci Yi on 2014-05-21
 * yi_xiaobin@163.com
 */

var month2chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');

exports.split = function(date) {
  return split_date(date);
};

exports.formatTime = function(date) {
  var sd = split_date(date);
  return sd.year + '-' + sd.mon + '-' + sd.day2 + ' ' + sd.hour2 + ':' + sd.minute2 + ':' + sd.second;
};

function split_date(date) {
  var year = date.getFullYear();
  var month = month2chs[date.getMonth()];
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var day2 = day;
  if (day < 10)     day2 = '0' + day;
  var hour = date.getHours();
  var minute = date.getMinutes();
  var hour2 = hour;
  if (hour < 10)    hour2 = '0' + hour;
  var minute2 = minute;
  if (minute < 10)  minute2 = '0' + minute;
  var second = date.getSecond();
  return {
    year:     year,
    month:    month,
    mon:      mon,
    day:      day,
    day2:     day2,
    hour:     hour,
    hour2:    hour2,
    minute:   minute,
    minute2:  minute2,
    second:   second
  };
}
