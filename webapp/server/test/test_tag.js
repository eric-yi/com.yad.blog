
/*
 * Eric Yi on 2014-05-21
 * yi_xiaobin@163.com
 */

function test() {
	tag = require('../common/tag');
	var html = require('fs').readFileSync('./template_article.htm', 'utf-8');
	var content = tag.apply(html, {date: '2014-01-01'});
	console.log(content);
}

test();
