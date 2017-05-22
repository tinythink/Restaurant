var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var MongoHelper = require('./model/crud.js')();

var app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res ) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/login.html', function( req, res ) {
	res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/getnews', function(req, res) {
	MongoHelper.getNews(function(err, result) {
		if (err) {
			return next(err);
		}
		res.send(result);
	});
});

app.get('/test', function(req, res) {
	MongoHelper.saveNews({
		author: 'hwaphon',
		title: 'This is my first news',
		body: 'This is first news content',
		date: new Date().getTime()
	});

	res.send('Hello Mongoose');
});

app.post('/login', function(req, res) {
	MongoHelper.getRoot(req.body.username, function(err, result) {
		if (err) {
			return next(err);
		}

		if (result) {
			res.render('news');
		}
	});
});

app.post('/addnews', function(req, res) {
	MongoHelper.saveNews(req.body, function(error) {
		if (error) {
			return next(error);
		}

		res.send(true);
	});
});


app.listen(process.env.PORT || 5000);