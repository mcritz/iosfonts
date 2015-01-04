/*
 * iOS Fonts
 * A Happy Place for Typography
 * by @mike_critz and contributors
 * https://github.com/mcritz/iosfonts
 */

define(
	[
		"jquery"
	],
	function(
		$
	) {
		var $section = $('#iosfonts');

		var getIntOrNull = function(val) {
			return val || 'null';
		};

		var getFacesArray = function($el) {
			var face = '';
			$el.map(function() {
				face += '\n\t\t\t\t{';
				face +=	'\n\t\t\t\t\t"font_face" 	: "' + $(this).find('.font_face').text() + '",';
				face +=	'\n\t\t\t\t\t"iphone" 		: ' + getIntOrNull( $(this).find('.iphone').text() ) + ",";
				face +=	'\n\t\t\t\t\t"ipad"			: ' + getIntOrNull( $(this).find('.ipad').text() ) + ",";
				face += '\n\t\t\t\t\t"watch"			: null';
				face += '\n\t\t\t\t},';
			});
			return face;
		};

		var data = '[';

		var familynames = $('dt').map(function() {
			data += '\n\t{ "family_name" : "' + $(this).text() + '",';
			data += '\n\t\t';
			data += '"faces" : [';
			data += '\n\t\t\t';
			data += getFacesArray( $(this).nextUntil('dt','dd') );
			data += '\n\t]},';
		});
		data += "]";

		console.log(data);
	}
);
