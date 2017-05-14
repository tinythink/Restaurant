var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var root_name = "hwaphon";
var root_password = "hwaphon521?";

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res ) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/login.html', function( req, res ) {
	res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.post('/login', function(req, res) {

	if (req.body.name === root_name && req.body.password === root_password) {
		console.log('true');
		res.send({
			result: 'success',
			data: path.join(__dirname, 'views/index.html')
		});
	}
});

app.listen(process.env.PORT || 5000);