$(document).ready(function(){
    MSIE8 = ($.browser.msie) && ($.browser.version == 8),
	$.fn.ajaxJSSwitch({
		topMargin: 282,//mandatory property for decktop
		bottomMargin: 198,//mandatory property for decktop
		topMarginMobileDevices: 282,//mandatory property for mobile devices
		bottomMarginMobileDevices: 198,//mandatory property for mobile devices
        delaySubMenuHide: 300,
        bodyMinHeight: 1050,
		menuInit:function (classMenu, classSubMenu){
		},
		buttonOver:function (item){
		},
		buttonOut:function (item){
		},
		subMenuButtonOver:function (item){
		},
		subMenuButtonOut:function (item){
		},
		subMenuShow:function(subMenu){
        	subMenu.stop(true,true).animate({"opacity":"show"}, 400, "easeOutCubic");
		},
		subMenuHide:function(subMenu){
        	subMenu.stop(true,true).animate({"opacity":"hide"}, 500, "easeOutCubic");
		},
		pageInit:function (pages){
		},
		currPageAnimate:function (page){
			setTimeout(function (){
				$('#inner a').eq(1).trigger('click');
			},500);

            page.css({"left":$(window).width()}).stop(true).delay(300).animate({"left":0}, 500, "easeOutCubic");
		},
		prevPageAnimate:function (page){
            page.stop(true).animate({"display":"block", "left":-$(window).outerWidth()*2}, 700, "easeInCubic");
		},
		backToSplash:function (){
			setTimeout(function (){
				$('#inner a').eq(0).trigger('click');
			},0);
		},
		pageLoadComplete:function (){
			$('.list2>li>div>a')
				.attr('rel','appendix')
				.prepend('<span class="sitem_over"><strong></strong></span>')
				.fancybox();

			$('#bookingForm, #bookingForm2, #bookingForm3').bookingForm({
				ownerEmail: '#'
			});

			$( ".tabs" ).tabs({
				beforeActivate: function(e, ui) {
					ui.newPanel.find('form').trigger('reset');
				}
			});
        }
	});
})
$(window).load(function(){
    setTimeout(function (){ $(window).trigger('resize') },600);
	
    $("#galleryHolder").gallerySplash({
        autoPlayState:'false',
        paginationDisplay:'true',
        autoPlayTime: 12,
        alignIMG: 'center'
    });

	$("#webSiteLoader").delay(500).animate({opacity:0}, 600, "easeInCubic", function(){$("#webSiteLoader").remove()});
});