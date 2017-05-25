$(function() {
	// 判断是否支持 sessionStorage, 如果支持就提取本地缓存的 news，如果尚未缓存就先赋值为一个数组
	var cache = window.sessionStorage && (JSON.parse(sessionStorage.getItem('cachenews')) || []),
		pageIndex = 0,
		pageCount = 15,
		length = cache.length;

	// 如果尚未缓存，利用 AJAX 向后台发送请求获取数据
	if (length === 0) {
		$.ajax({
			url: '/getallnews',
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				cacheNews(result);
				displayNewsByPageIndex(pageIndex);
			}
		});
	} else {
		displayNewsByPageIndex(pageIndex);
	}

	function cacheNews(result) {
		cache = result;
		length = cache.length;
		sessionStorage.setItem('cachenews', JSON.stringify(result));
	}

	function displayNewsByPageIndex(index) {
		var total = Math.ceil(length / pageCount),
			count = index === total ? length - index * pageCount : pageCount;
		setNews(cache.slice(index*pageCount, index*pageCount + count));
	}

	function setNews(result) {
		$('.news-list').empty();
		if (result) {
			addNewsToDom(result);
			setClickHandlerForNews();
		}
	}

	function setClickHandlerForNews() {
		$('div.news-item').on('click', function(event) {
			event.preventDefault();
			var id = $(this).data('id');
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
		})
	}

	function addNewsToDom(result) {
		var resultString = "";
		for(var i = 0; i < result.length; i++) {
			var spanDOM = $('<span></span>').text(pageIndex*pageCount + (i + 1));
			var pDOM = $('<p></p>').text(result[i].title);
			var spanTimeDOM = $('<span></span>').addClass('date').text(getFormatDate(result[i].date));
			var divDOM = $('<div></div>').
				addClass('news-item').
				data('id', result[i].date).
				append(spanDOM, pDOM,spanTimeDOM);

			$('.news-list').append(divDOM);
		}
	}

	function getFormatDate(date) {
		var date = new Date(date);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}

	$('span.next').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex < Math.floor(length / pageCount) ? pageIndex + 1 : pageIndex;
		displayNewsByPageIndex(pageIndex);
	});

	$('span.pre').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
		displayNewsByPageIndex(pageIndex);
	});
});