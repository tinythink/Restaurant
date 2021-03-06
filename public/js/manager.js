$(function() {
	var initNewsPage = function() {
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
			setNews(cache.slice(index * pageCount, index * pageCount + count));
		}

		function setNews(result) {
			$('.news-list').empty();
			if (result) {
				result.forEach(function(value, index) {
					addNewsToDom(value.title, parseInt(value.date));
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
					url: '/getnewsbydate',
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
			var itemDOM = $('<div></div').addClass('list-item news-item').data('id', date).append(titleDOM, dateDOM, divDOM);
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
			event.preventDefault();
			$.ajax({
				url: '/updatenews',
				type: 'POST',
				data: {
					author: $('input[name="edit-news-author"]').val().toString(),
					title: $('input[name="edit-news-title"]').val().toString(),
					body: $('textarea[name="edit-news-body"]').val().toString(),
					date: $('.model-edit').data('id')
				},
				success: function() {
					$('.model-edit').removeClass('show');
					initNewsPage();
				}
			});
		});

		$('.delete-ok').on('click', function(event) {
			event.preventDefault();
			var id = $(this).parents('.model-delete').data('id');
			$.ajax({
				url: '/deletenews',
				type: 'POST',
				dataType: 'json',
				data: {
					date: id
				},
				success: function(result) {
					$('.model-delete').removeClass('show');
					if (result.result) {
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

			$.ajax({
				url: '/addnews',
				type: 'POST',
				data: news,
				success: function(result) {
					window.location.reload();
				}
			});
		});

		$('span.next-page-control').on('click', function(event) {
			event.preventDefault();
			pageIndex = pageIndex < Math.floor(length / pageCount) ? pageIndex + 1 : pageIndex;
			displayNewsByPageIndex(pageIndex);
		});

		$('span.pre-page-control').on('click', function(event) {
			event.preventDefault();
			pageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
			displayNewsByPageIndex(pageIndex);
		});
	}

	var initSettingsPage = function() {
		$.ajax({
			url: '/getsettings',
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				setDefault(result);
			}
		});

		$.ajax({
			url: '/getintro',
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				$('textarea[name="intro-body"]').val(result[0].content);
			}
		});

		function setDefault(setting) {
			$('input[name="setting-title"]').val(setting.title);
			$('input[name="setting-tel"]').val(setting.tel);
			$('input[name="setting-tips"]').val(setting.tips);
		}

		$('#intro-save').on('click', function(e) {
			e.preventDefault();
			var intro = {
				content: $('textarea[name="intro-body"]').val()
			};

			$.ajax({
				url: '/updateintro',
				type: 'POST',
				data: intro,
				success: function() {
					$('textarea[name="intro-body"]').val(intro.content);
					spanToggle();
				}
			});

			function spanToggle() {
				$('.intro span').remove();
				var span = $('<span></span>').text('保存成功');
				$('.intro').append(span);
				setTimeout(function() {
					$('.intro span').remove();
				}, 3000);
			}
		})

		$('#setting-save').on('click', function(e) {
			e.preventDefault();
			var settings = {
				title: $('input[name="setting-title"]').val().toString(),
				tel: $('input[name="setting-tel"]').val().toString(),
				tips: $('input[name="setting-tips"]').val().toString()
			};
			$.ajax({
				url: '/updatesettings',
				type: 'POST',
				data: settings,
				success: function() {
					setDefault(settings);
					spanToggle();
				}
			});

			function spanToggle() {
				$('.basic span').remove();
				var span = $('<span></span>').text('保存成功');
				$('.basic').append(span);
				setTimeout(function() {
					$('.basic span').remove();
				}, 3000);
			}
		});


	};

	var initFoodPage = function() {

		var foods,
			pageIndex = 0,
			pageCount = 10;

		$('#add-food').on('click',function(e) {
			$.ajax({
				url: '/savefood',
				type: 'POST',
				data: getFormValue()
			}).done(function() {
				window.location.reload();
			});
		});


	function emptyForm() {
		$('input[name="food-name"]').val('');
		$('input[name="food-des"]').val('');
		$('input[name="food-pic"]').val('');
	}

	function getFormValue() {
		var fn = $('input[name="food-name"]').val();
		var fd = $('input[name="food-des"]').val();
		var fc = $('select[name="food-cat"]').find('option:selected').val();
		var fp = $('input[name="food-pic"]').val();

		return {
			fn: fn,
			fd: fd,
			cat: fc,
			fp: fp,
			date: new Date().getTime()
		};
	}

	function load() {
		$.ajax({
			url: '/getfood',
			type: 'GET',
			success: function(result) {
				foods = result.reverse();
				displayFoodsByPageIndex(pageIndex);
			}
		});
	}
	load();

	function addFoodToDOM(food) {
		var titleDOM = '<span class="title">' + food.fn + '</span>';
		var catDOM = '<span class=".cat">' + food.cat + '</span>';
		var divDOM = '<div class="control"><span class="edit"></span><span class="delete"></span></div>';
		var itemDOM = $('<div></div').addClass('list-item foods-item').data('id', food.date).append(titleDOM, catDOM, divDOM);
		$('.food-list').append(itemDOM);
	}

	function addClickHandler() {
		$('.edit').on('click', function(e) {
			var id = $(this).parents('.foods-item').data('id');
			$('.model-edit').addClass('show');
			$('.model-edit').data('id', id);
			$.ajax({
				url: '/gfbd',
				type: 'POST',
				dataType: 'json',
				data: {
					date: id
				},
				success: function(result) {
					addFoodToEditDOM(result[0]);
					displayFoodsByPageIndex(pageIndex);
				}
			});
		});
	}


	function addDeleteHandler() {
		$('span.delete').on('click', function(event) {
			var id = $(this).parents('.foods-item').data('id');
			$('.model-delete').addClass('show').data('id', id);
		});
	}

	$('.edit-cancel').on('click', function(event) {
		event.preventDefault();
		$('.model-edit').removeClass('show');
	});

	$('#edit-submit').on('click', function(event) {
		event.preventDefault();
		var food = {
			fn: $('input[name="edit-food-name"]').val(),
			fd: $('textarea[name="edit-food-des"]').val(),
			cat: $('select[name="edit-food-cat"]').find('option:selected').val(),
			fp: $('input[name="edit-food-pic"]').val(),
			date: $('.model-edit').data('id')
		};
		$.ajax({
			url: '/ufbd',
			type: 'POST',
			data: food,
			success: function() {
				$('.model-edit').removeClass('show');
				$('.food-list').empty();
				initFoodPage();
			}
		});
	});

	$('.delete-ok').on('click', function(event) {
		event.preventDefault();
		var id = $(this).parents('.model-delete').data('id');
		$.ajax({
			url: '/dfbd',
			type: 'POST',
			dataType: 'json',
			data: {
				date: id
			},
			success: function(result) {
				$('.model-delete').removeClass('show');
				$('.food-list').empty();
				initFoodPage();
			}
		});
	});

	$('.delete-cancel').on('click', function(event) {
		event.preventDefault();
		$('.model-delete').removeClass('show');
	});

	function addFoodToEditDOM(food) {
		$('input[name="edit-food-name"]').val(food.fn);
		$('textarea[name="edit-food-des"]').val(food.fd);
		$('input[name="edit-food-pic"]').val(food.fp);
		$('select[name="edit-food-cat"]').val(food.cat);
	}

	$('span.next-page-control').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex < Math.floor(foods.length / pageCount) ? pageIndex + 1 : pageIndex;
		displayFoodsByPageIndex(pageIndex);
	});

	$('span.pre-page-control').on('click', function(event) {
		event.preventDefault();
		pageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
		displayFoodsByPageIndex(pageIndex);
	});

	function displayFoodsByPageIndex(index) {
		var total = Math.ceil(foods.length / pageCount),
			count = index === total ? foods.length - index * pageCount : pageCount;
		setFoods(foods.slice(index * pageCount, index * pageCount + count));
		addClickHandler();
		addDeleteHandler();
	}

	function setFoods(foodsArr) {
		$('.food-list').empty();
		foodsArr.forEach(function(value, index) {
			addFoodToDOM(value);
		});
	}
}

initNewsPage();

$('a.end-control').on('click', function(e) {
	e.preventDefault();
	var name = $(this).attr('name');
	$.ajax({
		url: '/manager-control',
		type: 'POST',
		data: {
			name: name
		},
		success: function(result) {
			$('.container').html(result);

			if (name === 'end-news') {
				initNewsPage();
			} else if (name === 'end-settings') {
				initSettingsPage();
			} else if (name = "end-foods") {
				initFoodPage();
			}
		}
	});
});
});