$(function() {

	const collapseLength = 4;

	var index = 0, timeId;
	function collapseControl() {

		index = ++index >= collapseLength ? 0 : index;
		activeIndex(index);
		timeId = setTimeout(collapseControl, 5000);
	}

	function activeIndex(index) {
		$('.collapse-item').removeClass('show');
		$('div.dot span').removeClass('checked');

		$('.collapse-item').get(index).classList.add('show');
		$('div.dot span').get(index).classList.add('checked');
	}

	timeId = setTimeout(collapseControl, 5000);

	$('div.dot span').on('mouseenter', function() {
		clearTimeout(timeId);
		var thisIndex = parseInt($(this).data('id'));
		index = thisIndex;
		activeIndex(thisIndex);
	});

	$('div.dot span').on('mouseleave', function() {
		timeId = setTimeout(collapseControl, 5000);
	});

	/* AJAX GET NEWS */
	$.ajax({
		url: '/getnews',
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			setNews(result);
		}
	});

	/* AJAX GET FOODS */
	$.ajax({
		url: '/getfood',
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			controlFoods(result);
		}
	});

	function controlFoods(result) {
		var foods = result.reverse();
		var breakfast = foods.filter(function(value, index) {
			if (value.cat === 'breakfast') {
				return value;
			}
		});

		var lunch = foods.filter(function(value, index) {
			if (value.cat === 'lunch') {
				return value;
			}
		});

		var dinner = foods.filter(function(value, index) {
			if (value.cat === 'dinner') {
				return value;
			}
		});

		setFoods(breakfast.slice(0, 6), '.breakfast');
		setFoods(lunch.slice(0, 6), '.lunch');
		setFoods(dinner.slice(0, 6), '.dinner');
	}

	function setFoods(foodsArr, cat) {
		var length = foodsArr.length;
		for(var i = 0; i < length; i++) {
			var $foods = $(cat + ' .foods figure').eq(i);
			var img = new Image();
			img.onload = (function(j) {	
				$foods.find('img').attr('alt', foodsArr[j].fd);
				$foods.find('img').attr('src', foodsArr[j].fp);
				$foods.find('figcaption').text(foodsArr[j].fn);
			})(i);
			img.src= foodsArr[i].fp;
		}
	}

	function setNews(newsArr) {
		if (newsArr) {
			newsArr.forEach(function(value, index) {
				var $item = $('.newsitem').eq(index);
				var title = value.title;
				title = title.length >= 12 ? title.slice(0,12) + '...' : title;
				$item.data('id', value.date);
				$item.find('.header').text(title);
				$item.find('.newscontent p').text(value.body);
			});
		}
	}

	$('button').on('click', function(e) {
		var id = $(this).parents('.newsitem').data('id');
		if (id !== undefined) {
			$.ajax({
				url: '/newsitem',
				type: 'POST',
				data: {
					date: id
				},
				success: function(result) {
					window.open(result);
				}
			});
		}
	});
});