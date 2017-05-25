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