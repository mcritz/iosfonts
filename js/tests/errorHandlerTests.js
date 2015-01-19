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
		assert.equal($('.error.notice').text(), message, "notice contains the message");
	});
});
