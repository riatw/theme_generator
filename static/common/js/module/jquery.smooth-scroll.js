
/*----------------------------------------------
 @disc	: スムーススクロール
 @param	: -
 @ret	: -
----------------------------------------------*/
moduleFunc.smoothScroll = function ( options ) {
	var c	= $.extend ( {
		target: $( 'a[href^="#"]' ),
		speed: 300
	}, options );

	var $anchors = c.target;

	//html 要素でスクロールするか試す
	var isHtmlScroll = (function(){
		var html = $('html'), top = html.scrollTop();
		var el = $('<div/>').height(10000).prependTo('body');
		html.scrollTop(10000);
		var rs = !!html.scrollTop();
		html.scrollTop(top);
		el.remove();
		return rs;
	})();

	var $doc     = $(isHtmlScroll ? 'html' : 'body');

	$anchors.each( function () {
		var _this		= $(this);
		var anchorID	= _this.attr( 'href' );
		var $target;

		if ( anchorID !='#' ) {
			$target	= $( anchorID );
		}
		else {
			$target	= $('body');
		}

		_this.click( function (e) {
			var targetPositionTop	= $target.offset().top;

			$doc.stop().animate({
				scrollTop	: targetPositionTop
			},
			{
				duration	: c.speed,
				complete	: function () {
				}
			});

			return false;
		});
	});
}