/*----------------------------------------------
 @disc	: 拡張子ごとのアイコン表示
 @param	: -
 @ret	: -
----------------------------------------------*/
moduleFunc.addIcon	= function ( options ) {
	var c = $.extend ( {}, options );

	//WYSIWYGエリアにPDFアイコンを自動付与
	$("a[href$='.pdf']").each(function(){
		var childLength = $(this).find("img").length;

		$(this).addClass("m-icon-pdf");
	});

	//WYSIWYGエリアに外部リンクアイコンを自動付与
	$("a[href^='http']").each(function(){
		$(this).addClass("m-icon-blank");
	});
}