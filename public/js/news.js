$(function() {
	$('#add').on('click', function(event) {
		event.preventDefault();

		$.ajax({
			url: '/addnews',
			type: 'POST',
			dataType:'json',
			data: {
				author: $('input[name="news-author"]').val().toString(),
				title: $('input[name="news-title"]').val().toString(),
				body: $('textarea[name="news-body"]').val().toString(),
				date: Date.now()
			},
			success: function(result) {
				console.log(result);
			}
		});
	})
});