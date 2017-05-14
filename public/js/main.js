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

	console.log($('#menubar').css('display') === 'none');
});