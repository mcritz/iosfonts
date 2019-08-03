/*
 * iOS Fonts
 * A Happy Place for Typography
 * by @mike_critz and contributors
 * https://github.com/mcritz/iosfonts
 */

define(
	[
		"jquery",
		"ErrorHandler",
		"bower_components/amd-google-analytics/ga",
		"IosFonts"
	],
	function(
		$,
		ErrorHandler,
		analytics,
		fnt_iosfonts
	) {
		var allFontData = fnt_iosfonts;
		var allFonts = {};
		var $el = $('#iosfonts');
		var $filterEl = $('#filters');
		var $previewEl;
		var $searchEl;
		var $versionEl;
		
		var fontFaceClass = 'font-face';
		var clickedFaceClass = 'large';
		var userText = '';
				
		var getKeys = function(object) {
			var objectKeys = [];
			
			for (var key in object) {
				if (typeof(object[key]) == 'boolean') {
					break;
				}
				
				if (object.hasOwnProperty(key)) {
					objectKeys.push(key);
				}
			}
			return objectKeys;
		}

		var renderFontsForVersion = function(fontData, version) {
			if (!fontData) {
				var errorMessage = 'Please <a href="http://twitter.com/mike_critz">'
					+ 'report this error</a> to '
					+ 'the developer.';
				ErrorHandler.handleError(
				{
					'headline' : 'Server Error: renderFontsForVersion',
					'message' : errorMessage
				});
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
			});
			renderFonts($el, fontData, userText);
		}
		
		var createRegexWithString = function(string) {
			if (typeof(string) != "string") {
				ErrorHandler.handleError({
					'headline' : 'Error creating regex from ' + typeof(string),
					'message' : 'Please report this error to the developer'
				});
				return new RegExp("","gi");
			}
			string = string.replace(' ', '');
			var newRegex = new RegExp(string, "gi");
			return newRegex;
		}

		var renderFontsWithQuery = function(fontData, query) {
			
			var regexPattern = createRegexWithString(query);
			
			var countOfActive = 0;
			
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
				if (!this.isNotActive) {
					countOfActive++;
				}
			});
			fontData.hasNoMatches = countOfActive ? false : true;
			renderFonts($el, fontData, userText);
		}
		
		var initEvents = function() {
			$previewEl.on(
				'keyup', function() {
					var userText = $(this).val();

					// TODO: renderFonts is too slow.
					// using direct jQuery
					// this should be configurable parameter
					if (userText != '') {
						$('.face-name').text(userText);
					} else {
						renderFonts($el, allFonts, userText);
					} 
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
			$el.on(
				'click',
				'.' + fontFaceClass,
				function(e) {
					// TODO: remove data-in-the-DOM
					if ($(this).hasClass(clickedFaceClass)) {
						$(this).removeClass(clickedFaceClass);
						return;
					};
					$(this).addClass(clickedFaceClass);
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
			var elClass = "small-3 medium-2 large-1 columns";
			var fontAttributes = "";

			if (!value) {
				return '<span class="' + elClass
				+ '" ' + fontAttributes + '>' + "—" + '&nbsp;</span>';
			}

			switch (typeof(value)) {
				case "number" :
					if (value % 1 == 0) {
						value = value + '.0';
					}
					break;
				case "string" :
					if (!fontFamily) { return; }
					elClass = "face-name small-12 medium-4 large-8 columns";
					fontAttributes = "title=" + fontFamily
						+ " style='font-family:" + fontFamily + ";'";
					break;
				case "object" :
					if (!value) {
						elClass += " unavailable";
						value = "-";
					}
					if (value.isNotAvailable) {
						elClass += " unavailable";
					} else {
						elClass += " available";
					}
					value = (value.depricated) ?
						'☠ ' + value.depricated : value.version;
					break;
				default :
					return '<span class="' + elClass + '">—</span>';
			}
			return '<span class="' + elClass
				+ '" ' + fontAttributes + '>' + value + '&nbsp;</span>';
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
				var faceClass = fontFaceClass;
				faceClass += ' row';
				
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
			if (!data) {
				ErrorHandler.handleError({
					'headline' : 'Javascript error',
					'message' : 'Please report this error to the developer'
				});
				return;
			}
			if (data.hasNoMatches) {
				var template = '<ul><li><h4 class="row">'
					+ '<span class="font-name small-12 medium-4 large-8 columns">'
					+ 'No Matches'
					+ '</span></h4></li></ul>';
				$target.html(template);
				return;
			}
			var $list = $('<ul></ul>');
			var elClass = "small-3 medium-2 large-1 columns";

			$(data).each( function() {
				if (this.isNotActive) {
					return;
				}
				$list.append('<li><h4 class="row">'
				+ '<span class="font-name small-12 medium-4 large-8 columns">'
				+ this.family_name + '</span>'
				+ '<span class="' + elClass + '"><small>iPhone</small></span>'
				+ '<span class="' + elClass + '"><small>iPad</small></span>'
				+ '<span class="' + elClass + '"><small>&nbsp;WATCH</small></span>'
				+ '<span class="' + elClass + '"><small>&nbsp;TV</small></span>'
				+ '</h4>'
				+ renderFontFaces(this.faces, previewText)
				+ '</li>');
			});
			
			$list.append('</ul>');
			$target.html($list);
		};
		
		var itemizeVersions = function(versions) {
			var choices = '';
			var optionAttr = '';
			for (var vv = 0; vv < versions.length; vv++) {
				var ver = versions[vv].version;
				if (vv+1 == versions.length) {
					optionAttr = ' selected';
				}
				choices += '<option value="' + ver + '" '
					+ optionAttr
					+ '>Installed since iOS SDK ' + ver
					+ '</option>';
			}
			return choices;
		};
		
		var renderControls = function($element, versionData) {
			var template = 	'<div class="target small-12 medium-4 columns">'
				+ '<label for="os-version">&nbsp;</label>'
				+ '<select id="os-version">'
					+ itemizeVersions(versionData.ios)
				+ '</select>'
				+ '</div>'
				
				+ '<div class="small-12 medium-4 columns">'
				+	'<label for="font-search">&nbsp;</label>'
				+ '<input id="font-search" type="search" placeholder="Search Fonts"'
						+ 'results="5" autosave=iosfonts_cached_search_query />'
				+ '</div>'

				+ '<div class="small-12 columns">'
				+	'<textarea id="live-preview" type="text" placeholder="Preview">'
					+ '</textarea>'
				+ '</div>';
			$element.html(template);
			
			$previewEl = $('#live-preview');
			$searchEl = $('#font-search');
			$versionEl = $('#os-version');
		};
		
		var haltProgress = function() {
			if (progressTimer) {
				clearInterval(progressTimer);
			}
		}

		/**
		 *	getLatestVersion
		 *	@param fontData (object)
		 * 	Returns the latest version of the first platform (ios) in the data file
		 **/
		var getLatestVersion = function(metaData) {
			if (!metaData.platforms || !metaData.versions) {
				var errorHeader = 'Error loading data file'
				ErrorHandler.handleError(null, errorHeader, 'Sorry. It’s not your fault');
			}
			var oldestPlatform = getKeys(metaData.platforms)[0];				// "iphone"
			var allIosVersions = metaData.versions.ios; 								// [3..9]
			return allIosVersions[(allIosVersions.length - 1)].version; // 9
		};
		
		var fetchFontData = function() {
			$.ajax({
				url: "data/iosfonts.json",
				context: document.body,
				crossDomain: true
			}).done(function(data) {
				try {
					haltProgress();
				} catch(e) {
					ErrorHandler.handleError(
						{
							'silent' : true,
							'message' : 'haltProgress failed from fetchFontData'
						}
					)
				}

				allFonts = data.fonts;
				
				var latestVersion = getLatestVersion(data);
				renderFontsForVersion(allFonts, latestVersion);
				renderControls($filterEl, data.versions);
				initEvents();
			});
		}
		
		var init = function($targetEl) {
			if (!allFontData) {
				fetchFontData();
				return;
			}
			haltProgress();
			var latestVersion = getLatestVersion(allFontData);
			allFonts = allFontData.fonts;
			renderFontsForVersion(allFonts, latestVersion);
			renderControls($filterEl, allFontData.versions);
			initEvents();

			analytics('send', 'pageview');
		};
				
		init($el);
	}
);
