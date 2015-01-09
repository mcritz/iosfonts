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
		var $versionEl = $('#os-version');
		var userText = '';
		
		var matchesQuery = function(query) {
			return 
		}
		
		var handleError = function($target, headline, message) {
			$target = $target || $el;
			headline = headline || 'Error';

			if (!$target) {
				alert('Critical error');
				return;
			}
			var errorString = '<div class="row error"'
				+ '<h2>' + headline + '</h2><p>'
				+ message
				+ '</p></div>';
			$target.html(errorString);
			throw(headline);
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

		var renderFontsForVersion = function(fontData, version) {
			if (!fontData) {
				var errorMessage = 'Please report this error to '
				+ '<a href="http://twitter.com/mike_critz">the developer</a>.';
				handleError(null, 'Server Error', errorMessage);
			}
			var availableFaces = 0;
			$(fontData).each(function(ii, fontDefinition) {
				$(fontDefinition.faces).each(function(jj, faceDefinition) {
					var facePlatforms = faceDefinition.platforms;
					for (var key in facePlatforms) {
						if (!facePlatforms[key]) { return; }
						
						if (facePlatforms[key].version > version
							|| facePlatforms[key].depricated <= version) {
							facePlatforms[key].isNotAvailable = true;
						} else {
							facePlatforms[key].isNotAvailable = false;
							availableFaces++;
						}
					}
				});
// 				this.isNotActive = availableFaces ? false : true;
			});
			renderFonts($el, fontData, userText);
		}

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
			$versionEl.on(
				'change', function() {
					renderFontsForVersion(allFonts, $(this).val());
				}
			);
		}
		
		/**
		 * itemizeValue
		 * @param value (number, string, object) : data to be parsed
		 * @param fontFamily (string) : display text to be rendered
		 * returns a DOM dictionary value of data
		 * converting non-text into pretty strings.
		 **/
		var itemizeValue = function(value, fontFamily) {
			var fontStyle = "";
			var elClass = "small-4 medium-2 columns";
			var fontAttributes = "";

			switch (typeof(value)) {
				case "number" :
					if (value % 1 == 0) {
						value = value + '.0';
					}
					break;
				case "string" :
					if (!fontFamily) { return; }
					elClass = "face-name small-12 medium-6 columns";
					fontAttributes = "title=" + fontFamily
						+ " style='font-family:" + fontFamily + ";'";
					break;
				case "object" :
					if (!value.version) { return; }
					if (value.isNotAvailable) {
						elClass += " unavailable";
					} else {
						elClass += " available";
					}
					value = value.version;
					break;
				default :
					return '<span class="' + elClass + '">—</span>';
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
				allFonts = data.fonts;
				renderFontsForVersion(allFonts, 8);
				initEvents();
			});
		};
				
		init($el);
	}
);
