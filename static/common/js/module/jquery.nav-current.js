/*
	desc: グロナビ等のカレント処理を行う

	/about/ → about以下のページでマッチ
	/about/delete.html → 完全一致でマッチ

	前方一致、または完全一致でマッチ。完全一致の場合を優先する
*/
moduleFunc.gNavCurrent	= function ( options ) {
	var c	= $.extend ( {
		Selector	: '#gNav li a',
		addClass	: 'is-current',
		isImage		: false
	}, options );

	var matchElem;

	$(c.Selector).each(function(){
		var url = location.pathname;
		var href = $(this).attr( 'href' );

		var paternHash	= new RegExp( '#.*$' );
		var paternGet		= new RegExp( '\\?.*$' );
		var paternPath	= new RegExp( /\.\.\//g );
		var paternFile	= new RegExp( 'index\.(html|htm|php|jsp|asp)$' );

		//aタグのhref
		href　= href.replace( paternPath, '' );

		//表示中のページURL
		url　= url.replace( paternHash, '' ).replace( paternGet, '');

		//表示中のページの最上位ディレクトリ
		directory　= "/" + url.replace( paternHash, '' ).replace( paternGet, '' ).replace( paternFile, '' ).split("/")[1] + "/";

		// debug code
		// console.log('url:' + url);
		// console.log('href:' + href);
		// console.log('directory:' + directory);

		//ディレクトリと前方一致するかどうか
		if ( directory == href ) {
			matchElem = $(this);
		}

		//URLと完全一致するかどうか
		if ( url == href ) {
			matchElem = $(this);

			//URLと完全一致したら離脱
			return false;
		}
	});

	//いずれかに一致していたらクラスを付与する
	if ( matchElem ) {
		matchElem.addClass("current");
	}
}