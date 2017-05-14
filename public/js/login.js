$(function() {
	$('#login').on('click', function(event) {
		event.preventDefault();

		$.ajax({
			url: '/login',
			type: 'POST',
			dataType: 'json',
			data: {
				name: $('input[type="text"]').val().toString().trim(),
				password: $('input[type="password"]').val().toString().trim()
			},
			success: function(data) {
				if (data.result === 'success') {
					location.href = data.data;
				}
			}
		});
	});
});