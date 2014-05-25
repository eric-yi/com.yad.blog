/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

exports.trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

exports.escape_html = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n/g, '')
    .replace(/\n/g, '');
};

exports.dealNull = function(str, dec) {
  if (str == null)
    return 'null';
  if (str.toLowerCase() == 'null')
    return 'null';
  if (dec == null)  dec = '';
  return dec + str.toString() + dec;
};

exports.lineToHtml = function(str) {
  return String(str)
    .replace(/\r\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
};

exports.isEmpty = function(str) {
  if (str == null || str.trim() == '')
    return true;
  return false;
};
