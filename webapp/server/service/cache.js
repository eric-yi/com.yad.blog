
/*
 * Eric Yi on 2014-05-16
 * yi_xiaobin@163.com
 */

Cache = function() {
	this.cache = [];
};

Cache.prototype.put = function(key, value) {
	if (!contains(this.cache, key)) {
		this.cache.push({
			key:		key,
			value:	value
		});
	}
};

Cache.prototype.get = function(key) {
	for (var n in this.cache) {
		var entry = this.cache[n];
		if (key == entry.key)
			return entry.value;
	}	
	
	return null;
};

Cache.prototype.getAll = function() {
	return this.cache;
};

Cache.prototype.remove = function(key) {
	for (var n in this.cache) {
		var entry = this.cache[n];
		if (key == entry.key) {
			this.cache.splice(n, 1);
			break;
		}
	}
};

Cache.prototype.removeAll = function() {
	this.cache = [];
};

Cache.prototype.contains = function(key) {
	return contains(this.cache, key);
};

function contains(arr, key) {
	for (var n in arr) {
		var entry = arr[n];
		if (key == entry.key)
			return true;
	}	
	
	return false;
};


var cache = new Cache();
exports.getCache = function() {
	return cache;
};

