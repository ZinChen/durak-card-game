$(function() {
	var $document = $(document);
	var $textarea = $('#message-text');
	$textarea.autoResize();

	var $submitMsgBnt = $('.send-message');
	var chatEnterPress = function(e) {
		if (e.keyCode !== 13) return;
		e.preventDefault();
		if ($textarea.val().length) {
			$submitMsgBnt.click();
			$textarea.val('');
		}
	};

	var flagPress = true;
	$textarea.on('keypress', chatEnterPress)
	.on('keydown', function(e) {
		if (e.keyCode !== 16) return;
		$textarea.off('keypress');
		$document.on('keydown', function(e) {
			if (e.keyCode == 13 && flagPress) {
				flagPress = false;
			} else {
				e.preventDefault();
			}
		})
		.on('keyup', function(e) {
			flagPress = true;
			if (e.keyCode === 16) {
				$document.off('keydown');
				$textarea.on('keypress', chatEnterPress);
			}
		});
	});
});