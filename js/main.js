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
		var allFonts = {};
		var $el = $('#iosfonts');
		var $previewEl = $('#live_preview');
		var userText = '';
		
		var initEvents = function() {
			$previewEl.on(
				'change', function() {
					alert('hi');
					renderFonts($el, allFonts, $(this).val());
				}
			)
		}
		
		/**
		 * itemizeValue
		 * @param number : Number, String
		 * returns a dictionary value of display string or version number
		 * converting null and integers to pretty strings.
		 **/
		var itemizeValue = function(value) {
			var fontStyle = "";
			var elClass = "small-4 medium-2 columns";
			
			if (!value) return '<span class="small-4 medium-2 columns">—</span>';
			
			if ((typeof value) != "number") {
				elClass = "face-name small-12 medium-6 columns";
    			fontStyle = "style='font-family: " + value + "'; clear:'both'";
			}
			
			if (value % 1 == 0) {
				value = value + '.0';
			}
			
			return '<span class="' + elClass + '" ' + fontStyle + '>' + value + '</span>';
		}
		
		var renderFontFaces = function(faceData, displayText) {
			if (!faceData) return;
			
			var faces = '';
			
			$(faceData).each( function() {
				faces += '<div class="row">';
				var elText = displayText ? displayText : this.font_face;
				faces += itemizeValue(elText)
				+ itemizeValue(this.iphone)
				+ itemizeValue(this.ipad)
				+ itemizeValue(this.watch)
				+ '</div>'
			});
			
			return faces;
		}
		
		var renderFonts = function($target, data, previewText) {
			var $list = $('<ul></ul>');
			
			$(data).each( function() {
					$list.append('<li><h4 class="row">'
					+ '<span class="font-name small-12 medium-6 columns">'
					+ this.family_name + '</span>'
					+ '<span class="small-4 medium-2 columns"><small>iPhone</small></span>'
					+ '<span class="small-4 medium-2 columns"><small>iPad</small></span>'
					+ '<span class="small-4 medium-2 columns"><small> WATCH</small></span>'
					+ '</h4>'
					+ renderFontFaces(this.faces, previewText)
					+ '</li>');
				}
			);
			$list.append('</ul>');
			$target.html($list);
		};

		var init = function($el) {
			$.ajax({
				url: "data/iosfonts.json",
				context: document.body
			}).done(function(data) {
				allFonts = data;
				renderFonts($el, allFonts, userText);
				initEvents();
			});
		};
				
		init($el);
	}
);
