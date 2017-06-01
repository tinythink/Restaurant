var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var MongoHelper = require('./model/crud.js')();
var fs = require('fs');

var app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	MongoHelper.getSettings(function(err, doc) {
		if (err) {
			return next(err);
		}
		res.render('home', doc[0]);
	});
});

app.get('/food', function(req, res) {
	MongoHelper.getSettings(function(err, doc) {
		if (err) {
			return next(err);
		}

		MongoHelper.getFood(function(err, result) {
			if (err) {
				return next(err);
			}

			var breakfast = result.filter(function(value) {
				return value.cat === 'breakfast';
			});

			var lunch = result.filter(function(value) {
				return value.cat === 'lunch';
			});

			var dinner = result.filter(function(value) {
				return value.cat === 'dinner';
			});

			res.render('front-foods', {
				title: doc[0].title,
				tel: doc[0].tel,
				tips: doc[0].tips,
				breakfast: breakfast,
				lunch: lunch,
				dinner: dinner
			});
		});
	});
});

app.get('/intro', function(req, res) {
	MongoHelper.getSettings(function(err, doc) {
		if (err) {
			return next(err);
		}

		MongoHelper.getIntro(function(err, result) {
			if (err) {
				return next(err);
			}

			res.render('front-intro', {
				title: doc[0].title,
				tel: doc[0].tel,
				tips: doc[0].tips,
				content: result[0].content.split('\n')
			});
		});
	});
});

app.get('/getintro', function(req, res) {
	MongoHelper.getIntro(function(err, doc) {
		if (err) {
			return next(err);
		}
		res.send(doc);
	});
});

app.post('/updateintro', function(req, res) {
	MongoHelper.updateIntro(req.body, function(err) {
		if (err) {
			return next(err);
		}
		res.send(true);
	});
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
		var newsArray = news.body.split('\n');

		MongoHelper.getSettings(function(err, doc) {
			if (err) {
				return next(err);
			}
			res.render('news-display', {
				atitle: news.title,
				body: newsArray,
				date: dateString,
				author: news.author,
				title: doc[0].title,
				tel: doc[0].tel,
				tips: doc[0].tips
			});
		});

	});
});

app.get('/news', function(req, res) {
	MongoHelper.getSettings(function(err, doc) {
		if (err) {
			return next(err);
		}
		res.render('front-news', doc[0]);
	});
});

app.get('/login.html', function(req, res) {
	res.render('login', {
		failed: false
	});
});

app.post('/manager', function(req, res) {
	MongoHelper.getRoot({
		username: req.body.username,
		password: req.body.password
	}, function(err, result) {
		if (err) {
			return next(err);
		}
		if (result.length > 0) {
			res.render('end-home');
		} else {
			res.render('login', {
				failed: true
			});
		}
	});
});

app.post('/manager-control', function(req, res) {
	res.render(req.body.name);
});

app.post('/addnews', function(req, res) {
	MongoHelper.saveNews(req.body, function(error) {
		if (error) {
			return next(error);
		}
		res.send(true);
	});
});

app.post('/updatesettings', function(req, res) {
	MongoHelper.updateSettings(req.body, function(err) {
		if (err) {
			return next(err);
		}
		res.send(true);
	})
});

app.get('/getsettings', function(req, res) {
	MongoHelper.getSettings(function(err, doc) {
		if (err) {
			return next(err);
		}
		res.send(doc[0]);
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
		res.send(true);
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
			res.send({
				result: true
			});
		}
	})
});

app.post('/savefood', function(req, res) {
	MongoHelper.saveFood(req.body, function(error) {
		if (error) {
			return next(error);
		}
		res.send(true);
	});
});

app.get('/getfood', function(req, res) {
	MongoHelper.getFood(function(err, doc) {
		if (err) {
			return next(err);
		}
		res.send(doc);
	})
});

app.post('/gfbd', function(req, res) {
	MongoHelper.getFoodByDate(req.body.date, function(err, doc) {
		if (err) {
			return next(err);
		}
		res.send(doc);
	});
});

app.post('/ufbd', function(req, res) {
	MongoHelper.updateFood(req.body, function(err) {
		if (err) {
			return next(err);
		}
		res.send(true);
	});
});

app.post('/dfbd', function(req, res) {
	MongoHelper.deleteFood(req.body.date, function(err) {
		if (err) {
			return next(err);
		}
		res.send(true);
	})
});

app.listen(process.env.PORT || 5000);