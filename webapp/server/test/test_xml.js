
/*
 * Eric Yi on 2014-05-20
 * yi_xiaobin@163.com
 */

function test() {
	var xml = require('fs').readFileSync('./template_article.htm', 'utf-8');
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
		console.log(result);
	});
}

test();
