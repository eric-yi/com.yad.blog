var http = require("http");
var host = "0.0.0.0";
var port = 80;

http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("This is a testing\n");
}).listen(port, host);

console.log("Server is running\n");
