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
		var $previewEl = $('#live-preview');
		var $searchEl = $('#font-search');
		var userText = '';
		
		var matchesQuery = function(query) {
			return 
		}
		
		var getKeys = function(object) {
			var objectKeys = [];
			
			for (var key in object) {
				if (typeof(object[key]) == 'boolean') {
					break;
				};
				
				if (object.hasOwnProperty(key)) {
					objectKeys.push(key);
				}
			}
			return objectKeys;
		}


/*
		var renderFontsForVersion = function(fontData, version) {
			$(fontData).each(function(ii, fontDefinition) {
				$(fontDefinition.faces).each(function(jj, faceDefinition) {
					
				});
			});
		}
*/

		var renderFontsWithQuery = function(fontData, query) {
			var regexPattern = new RegExp(query, "gi");
			
			$(fontData).each(function(ii, fontDefinition) {
				var faceCount = fontDefinition.faces.count;
				var matchCount = 0;
				
				$(fontDefinition.faces).each(function(jj, faceDefinition) {
					var faceName = faceDefinition.font_face;

					if (faceName.match(regexPattern)) {
						faceDefinition.doesNotMatch = false;
						matchCount++;
					} else {
						faceDefinition.doesNotMatch = true;
					}
				});
				
				this.isNotActive = matchCount ? false : true;
			});
			
			renderFonts($el, fontData, userText);
		}
		
		var initEvents = function() {
			$previewEl.on(
				'keyup', function() {
					userText = $(this).val();
					renderFonts($el, allFonts, userText);
				}
			);
			$searchEl.on(
				'keyup change search', function() {
					renderFontsWithQuery(allFonts, $(this).val());
				}
			);
		}
		
		/**
		 * itemizeValue
		 * @param number : Number, String
		 * returns a dictionary value of display string or version number
		 * converting null and integers to pretty strings.
		 **/
		var itemizeValue = function(value, fontFamily) {
			var fontStyle = "";
			var elClass = "small-4 medium-2 columns";
			var fontAttributes = "";
			
			if (!value) return '<span class="' + elClass + '">—</span>';
			
			if (fontFamily && (typeof(value) != "number")) {
				elClass = "face-name small-12 medium-6 columns";
    			fontAttributes = "title=" + fontFamily
    			+ " style='font-family:" + fontFamily + "'; "
    			+ "clear: both;";
			}
			
			if (value % 1 == 0) {
				value = value + '.0';
			}
			
			return '<span class="' + elClass
				+ '" ' + fontAttributes + '>' + value + '</span>';
		}
		
		var listPlatforms = function(platforms) {
			var platformList = '';
			$(platforms).each( function(ll, platform) {
				for (key in platform) {
					platformList += itemizeValue( platform[key] );
				}
			});
			return platformList;
		}
		
		var renderFontFaces = function(faceData, displayText) {
			if (!faceData) return;
			
			var faces = '';
			
			$(faceData).each( function() {
				var faceClass = 'row';
				
				if (this.doesNotMatch) {
					faceClass += ' inactive';
				} else {
					faceClass += ' active';
				}
				
				faces += '<div class="' + faceClass + '">';
				var elText = displayText ? displayText : this.font_face;
				faces += itemizeValue(elText, this.font_face)
				+ listPlatforms(this.platforms)
				+ '</div>';
			});
			
			return faces;
		}
		
		var renderFonts = function($target, data, previewText) {
			
			var $list = $('<ul></ul>');
			var elClass = "small-4 medium-2 columns";

			$(data).each( function() {
				if (this.isNotActive) {
					return;
				}
				$list.append('<li><h4 class="row">'
				+ '<span class="font-name small-12 medium-6 columns">'
				+ this.family_name + '</span>'
				+ '<span class="' + elClass + '"><small>iPhone</small></span>'
				+ '<span class="' + elClass + '"><small>iPad</small></span>'
				+ '<span class="' + elClass + '"><small> WATCH</small></span>'
				+ '</h4>'
				+ renderFontFaces(this.faces, previewText)
				+ '</li>');
			});
			
			$list.append('</ul>');
			$target.html($list);
		};

		var init = function($targetEl) {
			$.ajax({
				url: "data/iosfonts.json",
				context: document.body
			}).done(function(data) {
				allFonts = data;
				renderFonts($targetEl, allFonts, userText);
				initEvents();
			});
		};
				
		init($el);
	}
);
