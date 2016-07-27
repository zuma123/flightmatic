include('request_url.js');
//----jquery-plagins----
include('jquery-1.8.3.min.js');
include('jquery.ba-resize.min.js');
include('jquery.easing.js');
include('jquery.fancybox.pack.js');
include('gallery.js');
include('../booking/js/booking.js');
//----bootstrap----
//----All-Scripts----
include('forms.js');
include('jquery.mobilemenu.js');
include('scroll_to_top.js');
include('ajax.js.switch.js');
include('script.js');
//----Include-Function----
function include(url, link){
	if (!link) { 
  		document.write('<script type="text/javascript" src="js/'+ url + '"></script>'); 
  	} else {
		document.write('<link rel="stylesheet" href="css/'+ url + '">'); 
  	}
  return false;
}