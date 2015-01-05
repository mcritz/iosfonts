/*
 * iOS Fonts
 * A Happy Place for Typography
 * by @mike_critz and contributors
 * https://github.com/mcritz/iosfonts
 */

requirejs.config({
	"paths": {
		"jquery": "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min"
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});

requirejs(["main"]);
