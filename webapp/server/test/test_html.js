
/*
 * Eric Yi on 2014-05-20
 * yi_xiaobin@163.com
 */

function handleTag(tag, htm) {
	for (var n in tag.children) {
		var child = tag.children[n];
		var type = child.type;
		if (type == 'tag') {
			htm += child.name;
			handleTag(child, htm);
		}else {
			htm += child.data;
		}	
	}
}

function domParser(dom) {
	if (dom.attribs && dom.attribs.id == 'date') {
		console.log('find : ' + dom.children.push(
			{
				name: 'test',
				type: 'text',
				data: '测试'
			}
		));
		console.log(dom.children[1]);
	} else {
		if (dom.children) {
			for (var n in dom.children) {
				domParser(dom.children[n]);
			}
		}
	}
}

function test2() {
	var html = require('fs').readFileSync('./template_article.htm', 'utf-8');
	jsdom = require('jsdom');
	var document = jsdom.jsdom(html);
}

function test1() {
	var htmlparser = require("htmlparser2");
	var html = require('fs').readFileSync('./template_article.htm', 'utf-8');
	
	var handler = new htmlparser.DomHandler(function(err, dom) {
		for (var n in dom) {
			var d = dom[n];
			//domParser(d);
			/*
			if (d.name == 'template') {
				console.log(d);
				var _htm = '';
				var children = d.children;
				for (var m in children) {
					var child = children[n];
					if (child.type == 'tag') {
						_htm += child.name;
						handleTag(child, _htm);
					}
				}
				console.log(_htm);
			}
			*/
		}

		console.log(dom);
	});

	var parser = new htmlparser.Parser({
		onopentag: function(tagname, attribs){
			//console.log(parser);
			if (attribs && attribs.id=='date') {
				console.log(parser);
				parser._attribvalue = '日期';
				console.log(parser._tokenizer._buffer);	
			}
		},

		ontext: function(text){
	 	},

		onclosetag: function(tagname){
			
		}
	});

	parser.parseComplete(html);
	//new htmlparser.Parser(handler).parseComplete(html);

	//var p = new htmlparser.Parser(handler, {xmlMode: true, lowerCaseAttributeNames: true});
	//p.parseComplete(html);
	//p.write("foo");
	//console.log(p);
};

test1();
	
