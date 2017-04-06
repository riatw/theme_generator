/*----------------------------------------------
 @disc	: タブ切り替え
 @param	: -
 @ret	: -
----------------------------------------------*/
moduleFunc.autoAnchor	= function ( options ) {
	var c = $.extend ( {
		Selector	: '.m-box-tab .nav'
	}, options );

	$(c.Selector).each(function() {
		var selector = $(this).data("selector");
		var units = $(this).parent();
		var target = $(this).nextUntil(".js-pnav").filter(selector);
		var template = $(this).find(".js-pnav-template").html();
		var view = $(this).find("ul");
		var stash = [];

		target.each(function() {
			var id = $(this).attr("id");
			var label = $(this).text();

			stash.push(
				template
				.replace("{{url}}", "#" + id)
				.replace("{{label}}", label)
			);
		});

		view.append(stash);
	});
}