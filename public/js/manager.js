$(function() {

	$('a').on('click', function(event) {
		event.preventDefault();
	});

	// 判断是否支持 sessionStorage, 如果支持就提取本地缓存的 news，如果尚未缓存就先赋值为一个数组
	var cache = window.sessionStorage && (JSON.parse(sessionStorage.getItem('cachenews')) || []),
		pageIndex = 0,
		pageCount = 10,
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
			result.forEach(function(value, index) {
				addNewsToDom(value.title, value.date);
				setClickHanlderForEdit();
				setClickHanlderForDelete();
			});
		}
	}

	function setClickHanlderForEdit() {
		$('span.edit').on('click', function(event) {
			var id = $(this).parents('.news-item').data('id');
			$('.model-edit').addClass('show');
			$.ajax({
				url:'/getnewsbydate',
				type: 'POST',
				dataType: 'json',
				data: {
					date: id
				},
				success: function(result) {
					initEditForm(result);
				}
			});
		});
	}

	function setClickHanlderForDelete() {
		$('span.delete').on('click', function(event) {
			var id = $(this).parents('.news-item').data('id');
			$('.model-delete').addClass('show').data('id', id);
		});
	}

	function initEditForm(result) {
		var news = result[0];
		$('.model-edit').data('id', news.date);
		$('input[name="edit-news-title"]').val(news.title);
		$('input[name="edit-news-author"]').val(news.author);
		$('textarea[name="edit-news-body"]').val(news.body);
	}
 
	function addNewsToDom(title, date) {
		var titleDOM = '<span class="title">' + title + '</span>';
		var dateDOM = '<span class="date">' + getFormatDate(date) + '</span>';
		var divDOM = '<div class="control"><span class="edit"></span><span class="delete"></span></div>';
		var itemDOM = $('<div></div').addClass('news-item').data('id', date).append(titleDOM, dateDOM, divDOM);
		$('.news-list').append(itemDOM);
	}

	function getFormatDate(date) {
		var date = new Date(date);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}

	$('.edit-cancel').on('click', function(event) {
		event.preventDefault();
		$('.model-edit').removeClass('show');
	});

	$('#edit-submit').on('click', function(event) {
		if (document.forms["edit-form"].checkValidity()) {
			$.ajax({
				url: '/updatenews',
				type: 'POST',
				dataType: 'json',
				data: {
					author: $('input[name="edit-news-author"]').val().toString(),
					title: $('input[name="edit-news-title"]').val().toString(),
					body: $('textarea[name="edit-news-body"]').val().toString(),
					date: $('.model-edit').data('id')
				},
				success: function() {
					$('.model-edit').removeClass('show');
				}
			});
		}
	});

	$('.delete-ok').on('click', function(event) {
		event.preventDefault();
		var id = $(this).parents('.model-delete').data('id');
		$.ajax({
			url:'/deletenews',
			type: 'POST',
			dataType: 'json',
			data: {
				date: id
			},
			success: function(result) {
				$('.model-delete').removeClass('show');
				if(result.result) {
					cache.forEach(function(value, index) {
						if (value.date === id) {
							cache.splice(index, 1);
						}
					});
					sessionStorage.setItem('cachenews', JSON.stringify(cache));
					displayNewsByPageIndex(pageIndex);
				}
			}
		});
	});

	$('.delete-cancel').on('click', function(event) {
		event.preventDefault();
		$('.model-delete').removeClass('show');
	});

	$('#add').on('click', function(event) {

		var news = {
			author: $('input[name="news-author"]').val().toString(),
			title: $('input[name="news-title"]').val().toString(),
			body: $('textarea[name="news-body"]').val().toString(),
			date: new Date().getTime()
		};

		cache.unshift(news);
		if (window.sessionStorage) {
			sessionStorage.setItem('cachenews', JSON.stringify(cache));
		}

		if (document.newsform.checkValidity()) {
			$.ajax({
				url: '/addnews',
				type: 'POST',
				dataType:'json',
				data: news,
				success: function(result) {
					
				}
			});
		}
	});

	$('span.next-page-control').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex < Math.ceil(length / pageCount) ? pageIndex + 1 : pageIndex;
		displayNewsByPageIndex(pageIndex);
	});

	$('span.pre-page-control').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
		displayNewsByPageIndex(pageIndex);
	});

});