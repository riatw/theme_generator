/*
	desc: ローナビ等のカレント処理を行う（完全一致）
*/
moduleFunc.lNavCurrent	= function ( options ) {
	var c	= $.extend ( {
		Selector	: '#lnav li a',
		addClass	: 'is-current',
		isImage		: false
	}, options );

	$(c.Selector).each(function () {
		var $a	= $(this);

		var newSrc, oriSrc;
		var s			= {};
		s.url			= location.pathname;
		s.href			= $a.attr( 'href' );
		s.paternHash	= new RegExp( '#.*$' );
		s.paternGet		= new RegExp( '\\?.*$' );
		s.paternPath	= new RegExp( /\.\.\//g );
		s.paternFile	= new RegExp( 'index\.(html|htm|php|jsp|asp)$' );
		s.paternSrc		= new RegExp( '(_on)?\.(jpg|jpeg|gif|png)$' );
		s.directoryIndex = "index.html";

		s.url			= s.url.split("/").join("/").replace( s.paternHash, '' ).replace( s.paternGet, '' );
		s.href			= s.href.replace( s.paternPath, '' );

		//directoryIndexが省略された際に、directoryIndexをつける
		if ( s.url.match(/\/$/)) {
			s.url = s.url + s.directoryIndex;
		}

		if ( s.href.indexOf( s.url ) != -1 ) {
			$a.addClass(c.addClass);
			return false;
		}
	});
}