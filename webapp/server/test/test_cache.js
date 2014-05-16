
/*
 * Eric Yi on 2014-05-16
 * yi_xiaobin@163.com
 */

Cache = require('../service/cache');
var cache = Cache.getCache();

function test() {
	cache.put('k1', 'k2');
	cache.put('k1', 'k2');
	cache.put('k2', 'k2');
	cache.put('k3', 'k2');
	print();
	cache.remove('k1');
	print();
}

function print() {
	var contents = cache.getAll();
	for (var n in contents) {
		var entry = contents[n];	
		console.log(entry.key + ' : ' + entry.value);
	};
}

test();
