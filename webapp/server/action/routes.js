/*
 * eric yi on 20140-05-07
 * yi_xiaobin@163.com
 */

var Routes = function(app) {
	var index = require('./index');
	var test = require('./test');

	app.use('/', index);
	app.use('/test', test);
};

module.exports = function(app) {
	var routes = new Routes(app);

	function getRoutes() {
		return routes;
	};

	return {
		create: getRoutes
	};
};
