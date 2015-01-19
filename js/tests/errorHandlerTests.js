define([
	"jquery",
	"../ErrorHandler"
], function (
	$,
	errors
) {
	QUnit.test( "When asked to handleError", function(assert) {
		
		var message = 'Dead men tell no tales';
		var deadly = true;
		errors.handleError({
			'message' : message,
			'silent' : deadly
		});
		assert.equal($('.error.notice').length, 0, "silent errors not displayed");
		
		errors.handleError({
			'message' : message
			});
		assert.ok( $('.error.notice').length, "a notice is displayed" );
		assert.equal($('.error.notice').text(),
			message,
			"notice contains the message");
	});
	
	QUnit.test( "When handleError is called multiple times", function(assert) {
		errors.handleError({
			'message' : 'a second message'
		});
		assert.equal( $('.notice').length, 1, "Only one .alert-box is displayed.");
		assert.equal( $('.alert-box').length, 2, "Two .notices are displayed");
	});
});
