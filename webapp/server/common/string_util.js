/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

exports.trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

exports.escape_html = function(html){
	return String(html)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#39;')
		.replace(/"/g, '&quot;')
		.replace(/\r\n/g, '')
		.replace(/\n/g, '');
};
