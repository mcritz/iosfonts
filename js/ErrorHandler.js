
define(
	[
		"jquery"
	],
	function(
		$
	) {
	return {
		template : '<div data-alert class="alert-box">
// 			+ '<a href="#" class="close">&times;</a>'
			+ '</div>',
		makeErrorEl : function(content) {
			alert(content);
			return $(this.template).html(content);
		},
		handleError : function(options) {
				console.log(options);
				options = options || {};
				if (!options.$targetEl) {
					options.$targetEl = $('<div class="error notice"></div>');
					$('body').prepend(options.$targetEl);
				}
				options.message = options.message || 'Error';
				var displayEl = this.makeErrorEl(options.message);
				options.$targetEl.prepend(displayEl);
		}
	};
}