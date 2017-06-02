var mLab = require('mongolab-data-api')('z3fKC_Ykx5H3ljE28vTaNY0QSzYba6Sb');

var CRUD = function() {
	var updateIntro = function(intro, callback) {
		var options = {
			database: 'rest',
			collectionName: 'intros',
			data: intro,
			allDocuments: true
		};

		mLab.updateDocuments(options, callback);
	};

	var getIntro = function(callback) {
		var options = {
			database: 'rest',
			collectionName: 'intros',
		};

		mLab.listDocuments(options, callback);
	};

	var updateSettings = function(settings, callback) {
		var options = {
			database: 'rest',
			collectionName: 'settings',
			data: settings,
			allDocuments: true
		};

		mLab.updateDocuments(options, callback);
	};

	var getSettings = function(callback) {
		var options = {
			database: 'rest',
			collectionName: 'settings',
		};

		mLab.listDocuments(options, callback);
	};

	var saveFood = function(food, callback) {
		var options = {
			database: 'rest',
			collectionName: 'foods',
			documents: food
		};

		mLab.insertDocuments(options, callback);
	};

	var getFood = function(callback) {
		var options = {
			database: 'rest',
			collectionName: 'foods',
		};

		mLab.listDocuments(options, callback);
	};

	var getFoodByDate = function(date, callback) {
		var options = {
			database: 'rest',
			collectionName: 'foods',
			query: '{ "date": ' + date + ' }',
		};

		mLab.listDocuments(options, callback);
	};

	var updateFood = function(food, callback) {
		var options = {
			database: 'rest',
			collectionName: 'foods',
			query: '{ "date": ' + food.date + ' }',
			data: food
		};

		mLab.updateDocuments(options, callback);
	};

	var deleteFood = function(date, callback) {
		var options = {
			database: 'rest',
			collectionName: 'foods',
			query: '{ "date": "' + date + '" }',
		};

		mLab.deleteDocuments(options, callback);
	};

	var saveNews = function(news, callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			documents: news
		};

		mLab.insertDocuments(options, callback);
	};

	var getNews = function(callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			limit: 4,
			sortOrder: '{ "date": -1 }'
		};

		mLab.listDocuments(options, callback);
	};

	var getAllNews = function(callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			sortOrder: '{ "date": -1 }'
		};

		mLab.listDocuments(options, callback);
	};

	var getRoot = function(root, callback) {
		var name = root.username,
			password = root.password;

		var options = {
			database: 'rest',
			collectionName: 'roots',
			query: '{ "username": "' + name + '", "password": "' + password + '"}'
		};

		mLab.listDocuments(options, callback);
	};

	var getNewsByDate = function(date, callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			query: '{ "date": "' + date + '" }'
		};

		mLab.listDocuments(options, callback);
	};

	var updateNewsByDate = function(news, callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			query: '{ "date": "' + news.date + '" }',
			data: news
		};

		mLab.updateDocuments(options, callback);
	};

	var deleteNewsByDate = function(date, callback) {
		var options = {
			database: 'rest',
			collectionName: 'news',
			query: '{ "date": "' + date + '" }'
		};

		mLab.deleteDocuments(options, callback);
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
		updateSettings: updateSettings,
		getSettings: getSettings,
		updateIntro: updateIntro,
		getIntro: getIntro
	};
}

module.exports = CRUD;