var previousSelectedOS ='';
var selectedOS = '';
$(document).ready(function(){
/* 	$('hgroup').append('<p>jQuery is loaded.</p>'); */

/* $('nav .ios50').toggleClass('selected'); */
$('nav li').click(function(){
  $('nav li').removeClass('selected');
  selectedOS = $(this).attr('class');
  
  if (selectedOS == previousSelectedOS){
 	 $('tr').removeClass('unavailable');
 	 previousSelectedOS = '';
 	 return;
  } else {
	  $(this).toggleClass('selected');
	  $('tr').removeClass('unavailable');
	  // console.log('selectedOS: ' + selectedOS);
	  switch(selectedOS){
	    case 'ios30':
	      $('tbody .ios40' || 'tbody .ios50' || 'tbody .ios60').addClass('unavailable');
	      // $('.ios50').addClass('unavailable');
	      break;
	    case 'ios40':
	    	$('td:contains(5.0)').closest('tr').addClass('unavailable');
	    	$('td:contains(6.0)').closest('tr').addClass('unavailable');
			break;
	    case 'ios50':
	    	$('td:contains(6.0)').closest('tr').addClass('unavailable');
	    	break;
	    case 'ios60':
	    	$('td.dead').closest('tr').addClass('unavailable');
	    	break;
	    default:
	      alert('Oops. There was an error.');
	  }
	  previousSelectedOS = selectedOS;
  }
});


}); // end drf



// ga
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-5874947-7']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();