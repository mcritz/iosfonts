define(
	[
		"jquery"
	],
	function(
		$
	) {
	return {
		template : '<div data-alert class="alert-box alert">'
			+ '<a href="#" class="close">&times;</a>'
			+ '</div>',
		makeErrorEl : function(content) {
			return $(this.template).html(content);
		},
		fatalError : function(options) {
			var message = options.message || 'Server error\nIt’s not your fault.';
			alert(message);
			throw(options.error);
		},
		/**
		 * handleError : deal with errors
		 * @param options (object)
		 * @param options.$targetEl (jQuery DOM object) : element to render error in
		 * @param options.message (string) : user-facing message
		 * @param options.silent (boolean) : 'true' should log errors silently
		 **/
		handleError : function(options) {
			if (!options) {
				this.fatalError({
					'message' : 'Server Error'
				});
			}
			
			options.message = options.message || 'Error';
			
			if (options.silent == true) {
				console.log('Error:\n');
				console.log(options);
				return;
			}
			
			if (!options.$targetEl) {
				options.$targetEl = $('<div class="error notice"></div>');
				$('body').prepend(options.$targetEl);
			}
			
			var displayEl = this.makeErrorEl(options.message);
			options.$targetEl.prepend(displayEl);
			if (options.error) {
				console.log(options.error);
			}
		}
	};
});
