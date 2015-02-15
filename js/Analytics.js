define (
	[ 
		"ErrorHandler"
	], function(
		errorHandler
	) {
		return {
			init : function() {
				var _gaq = _gaq || [];
				_gaq.push(['_setAccount', 'UA-5874947-7']);
				_gaq.push(['_trackPageview']);
				
				try {
				  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
				} catch (err) {
					errorHandler.handleError({
						'silent' : true,
						'message' : 'Error loading Google Analytics',
						'error' : err
					});
				}
			}
		}
});
