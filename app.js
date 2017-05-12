var express = require('express');
var path = require('path')

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res ) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(8888, function() {
	console.log('your app is running at port 8888');
});