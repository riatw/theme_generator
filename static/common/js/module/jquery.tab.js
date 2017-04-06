/*----------------------------------------------
 @disc	: タブ切り替え
 @param	: -
 @ret	: -
----------------------------------------------*/
moduleFunc.tabAction	= function ( options ) {
	var c	= $.extend ( {
		tabNaviSelector	: '.m-box-tab .nav',
		tabActiveClass	: 'active'
	}, options );

	$(c.tabNaviSelector).each(function(){
		_this = $(this);

		_this.find("li").first().addClass("active");
		_this.next().find("li").first().addClass("active");

		_this.find("li").click(function(){
			_index = $(this).index();
			_this.find("li").removeClass("active");
			_this.next().find("li").removeClass("active");

			$(this).addClass("active");
			_this.next().find("> li").eq(_index).addClass("active");
		})
	});
}