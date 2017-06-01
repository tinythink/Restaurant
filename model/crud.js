var mongoose = require('mongoose');

var CRUD = function() {
	var url = 'mongodb://hwaphon:hwaphon521@ds157971.mlab.com:57971/rest';
	mongoose.Promise = global.Promise;
	mongoose.connect(url);

	var Schema = mongoose.Schema;

	var IntroSchema = new Schema({
		content: String
	});

	var Intro = mongoose.model('Intro', IntroSchema);

	var updateIntro = function(intro, callback) {
		Intro.update({}, intro, function(err) {
			callback(err);
		});
	};

	var getIntro = function(callback) {
		Intro.find({}).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var SettingsSchema = new Schema({
		title: String,
		tel: String,
		tips: String
	});

	var Settings = mongoose.model('Setting', SettingsSchema);
	var addSettings = function(settings, callback) {
		new Settings(settings).save(function(err) {
			callback(err);
		});
	};

	var updateSettings = function(settings, callback) {
		Settings.update({}, settings, function(err) {
			callback(err);
		});
	};

	var getSettings = function(callback) {
		Settings.find({}).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var RootSchema = new Schema({
		username: String,
		password: String
	});

	var Root = mongoose.model('Root', RootSchema);

	var NewsSchema = new Schema({
		author: String,
		title: String,
		body: String,
		date: Number
	});

	var News = mongoose.model('News', NewsSchema);

	var FoodSchema = new Schema({
		fn: String,
		fd: String,
		cat: String,
		fp: String,
		date: Number
	});

	var Food = mongoose.model('Food', FoodSchema);

	var saveFood = function(food, callback) {
		new Food(food).save(function(error) {
			callback(error);
		});
	};

	var getFood = function(callback) {
		Food.find({}).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var getFoodByDate = function(date, callback) {
		Food.find({date: date}).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var updateFood = function(food, callback) {
		Food.update({date: food.date}, food, function(err) {
			callback(err);
		});
	};

	var deleteFood = function(date, callback) {
		Food.remove({date: date}, function(err) {
			callback(err);
		});
	};

	var saveNews = function(news, callback) {
		new News(news).save(function(error) {
			callback(error);
		});
	};

	var getNews = function(callback) {
		News.find({}).sort({date: -1}).limit(4).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var getAllNews = function(callback) {
		News.find({}).sort({date: -1}).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var getRoot = function(root, callback) {
		Root.find(root, function(err, doc) {
			callback(err, doc);
		});
	};

	var getNewsByDate = function(date, callback) {
		News.find({date: date}).limit(1).exec(function(err, doc) {
			callback(err, doc);
		});
	};

	var updateNewsByDate = function(news, callback) {
		News.update({date: news.date}, {title: news.title, author: news.author, body: news.body}, function(err) {
			callback(err);
		});
	};

	var deleteNewsByDate = function(date, callback) {
		News.remove({date: date}, function(err) {
			callback(err);
		});
	};

	return {
		saveFood: saveFood,
		getFood: getFood,
		getFoodByDate: getFoodByDate,
		updateFood: updateFood,
		deleteFood: deleteFood,
		saveNews: saveNews,
		getNews: getNews,
		getRoot: getRoot,
		getNewsByDate: getNewsByDate,
		updateNewsByDate: updateNewsByDate,
		getAllNews: getAllNews,
		deleteNewsByDate: deleteNewsByDate,
		addSettings: addSettings,
		updateSettings: updateSettings,
		getSettings: getSettings,
		updateIntro: updateIntro,
		getIntro: getIntro
	};
}

module.exports = CRUD;