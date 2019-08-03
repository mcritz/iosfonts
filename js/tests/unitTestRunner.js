requirejs.config({
	"paths": {
		"jquery": "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min"
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});

if (!testSuite) {
	throw('Cannot run tests without *testSuite* variable defined');
}

requirejs([testSuite]);
