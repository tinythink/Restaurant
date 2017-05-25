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
	res.render('home');
});

app.post('/newsitem', function(req, res) {
	res.send(path.join('/newsitem/' + req.body.date));
});

app.get('/newsitem/:newsid', function(req, res) {
	MongoHelper.getNewsByDate(req.params.newsid, function(err, result) {
		if (err) {
			return next(err);
		}

		var news = result[0],
			date = new Date(news.date),
			dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		res.render('news-display', {title: news.title, body: news.body, date: dateString, author: news.author});
	});
});

app.get('/news', function(req, res) {
	res.render('front-news');
});

app.get('/login.html', function( req, res ) {
	res.render('login');
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
		console.log(result);
		if (result) {
			res.redirect('/manager');
		}
	});
});

app.get('/manager', function(req, res) {
	res.render('news');
});

app.post('/addnews', function(req, res) {
	MongoHelper.saveNews(req.body, function(error) {
		if (error) {
			return next(error);
		}
		res.send('true');
	});
});

app.post('/getnewsbydate', function(req, res) {
	MongoHelper.getNewsByDate(req.body.date, function(err, result) {
		if (err) {
			return next(err);
		}
		res.send(result);
	});
});

app.post('/updatenews', function(req, res) {
	MongoHelper.updateNewsByDate(req.body, function(err) {
		if (err) {
			return next(err);
		}
	});
});

app.get('/getnews', function(req, res) {
	MongoHelper.getNews(function(err, result) {
		if (err) {
			return next(err);
		}
		res.send(result);
	});
});

app.get('/getallnews', function(req, res) {
	MongoHelper.getAllNews(function(err, result) {
		if (err) {
			return next(err);
		}
		res.send(result);
	});
});

app.post('/deletenews', function(req, res) {
	MongoHelper.deleteNewsByDate(req.body.date, function(err) {
		if (err) {
			return next(err);
		} else {
			res.send({result: true});
		}
	})
});


app.listen(process.env.PORT || 5000);