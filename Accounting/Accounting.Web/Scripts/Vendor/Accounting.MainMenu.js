
// Creating this JS file for some new UI of menu bar 
$(function () {
	$(window).on('scroll', function () {

		try {
			var opacity = $(document).scrollTop();
			opacity = (opacity > 100 ? 100 : opacity) / 100;
			$('#navigationContainer').css('box-shadow', '0 5px 15px rgba(0, 0, 0, ' + opacity + ')'); // this will highlight when scroll down in the condition of many data in board

			// scroll left will work even position fixed condition of top menu bar
			var mainNavBackGround = $("#mainNavBackGround");
			mainNavBackGround.css("left", -$(window).scrollLeft() + 0) // 0 is initial top position
		} catch (e) {

		}
	
	});
});