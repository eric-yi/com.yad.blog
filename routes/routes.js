/*
 * eric yi on 20140-05-07
 * yi_xiaobin@163.com
 */

module.exports = function(app) {
	function init() {
		var index = require('./index');
		var test = require('./test');

		app.use('/', index);
		app.use('/test', test);
	};
	
	return {create: init};
};
