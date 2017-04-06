/*
 @disc	: yuga.jsのrolloverメソッドを編集
 @param	: -
 @ret	: -

 Copyright (c) 2009 Kyosuke Nakamura (kyosuke.jp)
 Licensed under the MIT License:
 http://www.opensource.org/licenses/mit-license.php
*/
moduleFunc.rollover = function ( options ) {
	var c	= $.extend ( {
		hoverSelector	: '.imgover, .allimg img',
		groupSelector	: '.imggroup',
		filterSelector	: '.noOver',
		postfix			: '_on',
		current			: '_cr'
	}, options );

	var rolloverImgs	= $( c.hoverSelector ).filter( isNoRollover ).filter( isNotCurrent );
	rolloverImgs.each ( function () {
		this.originalSrc		= $(this).attr( 'src' );
		this.rolloverSrc		= this.originalSrc.replace ( new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + '$2' );
		this.rolloverImg		= new Image;
		this.rolloverImg.src	= this.rolloverSrc;
		this.currentSrc			= this.originalSrc.replace ( new RegExp('(' + c.current + ')?(\.gif|\.jpg|\.png)$'), c.current + '$2' );
	} );

	var groupingImgs	= $( c.groupSelector ).find('img').filter( isNoRollover ).filter( isRolloverImg );

	rolloverImgs.not( groupingImgs ).hover( function () {
		$(this).attr( 'src', this.rolloverSrc );
	},
	function () {
		$(this).attr( 'src', this.originalSrc );
	} );

	$( c.groupSelector ).hover( function () {
		$(this).filter( isNoRollover ).find( 'img' ).filter( isRolloverImg ).each( function () {
			$(this).attr( 'src', this.rolloverSrc );
		});
	}, function(){
		$(this).filter( isNoRollover ).find( 'img' ).filter( isRolloverImg ).each( function () {
			$(this).attr( 'src', this.originalSrc );
		});
	});

	//filter function
	function isNotCurrent(){
		return Boolean( ! this.currentSrc );
	}
	function isRolloverImg(){
		return Boolean( this.rolloverSrc );
	}

	function isNoRollover () {
		var str		= c.filterSelector.replace( new RegExp ( /[ |　]/g ), '' );
		var arr		= str.split(',');

		var loopNum		= arr.length;
		for ( var i = 0; i < loopNum; i ++ ) {

			if( $(this).is( $( arr[i] ) ) ) {
				return false;
				break;
			}
		}
		return true;
	}
}