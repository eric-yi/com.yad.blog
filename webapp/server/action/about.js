var express = require('express');
var router = express.Router();
Base = require('./base');

router.get('/', function(req, res) {
  Base.getAbout(res);
});

router.get('/content', function(req, res) {
	res.send(Base.getAboutContent());
});

router.post('/edit', function(req, res) {
	var msg = 1;
	try {
		Base.service.updateAbout(req.body.content);
	} catch(e) {
		console.log(e);
		msg = -11;
	}
	Base.sendMessage(res, msg);
});

module.exports = router;

