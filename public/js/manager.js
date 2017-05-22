$(function() {

	$('a').on('click', function(event) {
		event.preventDefault();

		console.log(this['name']);
	});

	$.ajax({
		url: '/getnews',
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			setNews(result);
		}
	});

	function setNews(result) {
		if (result) {
			result.forEach(function(value, index) {
				addNewsToDom(value.title, value.date);
			});

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
		$('.news-list').prepend(itemDOM);
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
				}
			});
		}
	});

	$('#add').on('click', function(event) {
		if (document.newsform.checkValidity()) {
			$.ajax({
				url: '/addnews',
				type: 'POST',
				dataType:'json',
				data: {
					author: $('input[name="news-author"]').val().toString(),
					title: $('input[name="news-title"]').val().toString(),
					body: $('textarea[name="news-body"]').val().toString(),
					date: new Date().getTime()
				},
				success: function(result) {
					
				}
			});
		}
	});


});