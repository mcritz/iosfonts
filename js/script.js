var previousSelectedOS ='';
var selectedOS = '';
var searchActive = false;
var previewActive = false;

// Extend :contains() method to :containsi, a case-insensitive version of :contains()
$.extend($.expr[':'], {
  'containsi': function(elem, i, match, array)
  {
    return (elem.textContent || elem.innerText || '').toLowerCase()
    .indexOf((match[3] || "").toLowerCase()) >= 0;
  }
});


$(document).ready(function(){
setup();
// Live text preview

$('nav').on('keyup', '#live_preview', function(){
	previewActive = true;
	if($(this).val() == ''){
		$('.font_face').each(function(){
			$(this).text($(this).attr('style').split(':')[1]);
		});
		previewActive = false;
	}else {
		$('.font_face').text($(this).val());
	}			
});

// TODO: add Font-Family count
// <div class="font_families">Families: <b></b></div>

$('nav select').change(function(){
  // $('nav li').removeClass('selected');
  selectedOS = $(this).val();
  // console.log('selectedOS: ' + selectedOS);
  if (selectedOS == previousSelectedOS){
 	 $('tr').removeClass('unavailable');
 	 previousSelectedOS = '';
 	 countFonts();
 	 return;
  } else {
	  // $(this).toggleClass('selected');
	  $('tr').removeClass('unavailable');
	  // console.log('selectedOS: ' + selectedOS);
	  switch(selectedOS){
	    case 'iOS 3':
	      $('tbody .ios40' || 'tbody .ios50' || 'tbody .ios60').addClass('unavailable');
	      // $('.ios50').addClass('unavailable');
	      break;
	    case 'iOS 4':
	    	$('td:contains(5.0)').closest('tr').addClass('unavailable');
	    	$('td:contains(6.0)').closest('tr').addClass('unavailable');
			break;
	    case 'iOS 5':
	    	$('td:contains(6.0)').closest('tr').addClass('unavailable');
	    	break;
	    case 'iOS 6':
	    	$('td.dead').closest('tr').addClass('unavailable');
	    	break;
	    default:
	     	$('tr').removeClass('unavailable');
	  }
	  previousSelectedOS = selectedOS;
	  countFonts();
  }
});

// search
$('input[type="search"]').keyup(function(){
	if(previewActive == true) {
		$('#live_preview').val('');
		$('.font_face').each(function(){
			$(this).text($(this).attr('style').split(':')[1]);
		});
	}
	theSearch = $('input[type="search"]').val();
	// console.log('theSearch: ' + theSearch);
	searchPage(theSearch);
	searchActive = true;
	countFonts();
});
// clear search
$('input[type="search"]').on("search", function(e){
	//alert('hi')}
	clearSearch();
});

// Large fonts
$('.font_face').click(function(){
	$(this).toggleClass('preview');
});

}); // end drf

function setup(){
	$('header#main').append('<div class="count"><div class="font_faces">Faces: <b>260</b></div></div>');
	$('nav select').val('iOS 6');
}


function searchPage(searchTerm){
  if(searchTerm.length == 0){
    clearSearch();
   //  $('.btn_clear_search').fadeOut(200);
  } else if(searchTerm.length > 0){
    $('tr:containsi("' + searchTerm + '")').fadeIn(150);
    $('tr:not(:containsi("' + searchTerm + '"))').fadeOut(250);
    //	$('tr:visible').prevUntil('tr.section_header').show();
  } else {
    clearSearch();
  }
}

function clearSearch() {
  $('input[type="search"]').val('');
  $('tr').fadeIn(250);
  searchActive = false;
  countFonts();
}

function countFonts() {
	numberOfFontFamilies = $('td.rowheader').filter(':visible').length;
	numberOfFontFaces = $('tr').not('.unavailable').has('td').not('.rowheader').filter(':visible').length; // .has(!$('td.rowheader')).filter(':visible').
	// console.log(' numberOfFontFamilies: ' + numberOfFontFamilies + '\n numberOfFontFaces: ' + numberOfFontFaces);
	$('.count .font_families b').html(numberOfFontFamilies);
	$('.count .font_faces b').html(numberOfFontFaces);
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-5874947-7']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();