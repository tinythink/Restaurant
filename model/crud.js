var mongoose = require('mongoose');

var CRUD = function() {
	var url = 'mongodb://localhost:27017/restaurant';
	mongoose.Promise = global.Promise;
	mongoose.connect(url);

	var Schema = mongoose.Schema;

	var RootSchema = new Schema({
		username: String,
		password: String
	});
	var Root = mongoose.model('Root', RootSchema);

	var NewsSchema = new Schema({
		author: String,
		title: String,
		body: String,
		date: Date
	});

	var News = mongoose.model('News', NewsSchema);

	var FoodSchema = new Schema({
		name: String,
		pic: String
	});

	var Breakfast = mongoose.model('Breakfast', FoodSchema);
	var Lunch = mongoose.model('Lunch', FoodSchema);
	var Dinner = mongoose.model('Dinner', FoodSchema);

	var saveBreakfast = function(food) {
		new Breakfast(food).save(function(error) {
			if(error){
				console.log(error);
			}
		});
	};

	var saveLunch = function(food) {
		new Lunch(food).save(function(error) {
			if(error){
				console.log(error);
			}
		});
	};

	var saveDinner = function(food) {
		new Dinner(food).save(function(error) {
			if(error){
				console.log(error);
			}
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

	var getRoot = function(root, callback) {
		Root.find(root).exec(function(err, doc) {
			callback(err, doc);
		})
	}

	return {
		saveBreakfast: saveBreakfast,
		saveLunch: saveLunch,
		saveDinner: saveDinner,
		saveNews: saveNews,
		getNews: getNews,
		getRoot: getRoot
	}
}

module.exports = CRUD;