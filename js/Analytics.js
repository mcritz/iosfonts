define (
	[ 
		"ErrorHandler"
	], function(
		errors
	) {
		return {
			init : function() {
				var _gaq = _gaq || [];
				_gaq.push(['_setAccount', 'UA-5874947-7']);
				_gaq.push(['_trackPageview']);
				
				try {
					(function() {
					  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
					  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
					})();
				} catch (err) {
					errors.handleError({
						'silent' : true,
						'message' : 'Error loading Google Analytics',
						'error' : err
					});
				}
			}
		}
});
