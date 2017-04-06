/*
 * fixHeight - jQuery Plugin
 * http://www.starryworks.co.jp/blog/tips/javascript/fixheightjs.html
 *
 * Author Koji Kimura @ STARRYWORKS inc.
 * http://www.starryworks.co.jp/
 *
 * Licensed under the MIT License
 *
 */
(function($){

	var parents = [];		      	// 親要素
	var isInitialized = false;	// 初期化済みフラグ
	var textHeight = 0;	    		// 文字のサイズ
	var $fontSizeDiv;		      	// 文字のサイズ取得用div

	//------------------------------------------------------------
	// jQuery プラグイン
	//------------------------------------------------------------
	$.fn.fixHeight = function( i_force ) {
		init();

		this.each(function(){
			var childrenGroups = getChildren( this );
			var children = childrenGroups.shift() || [];

			//$childrenのY座標が同じものは同じ高さに
			var rows = [[]];
			var top = 0;
			var c=0;
			var $c;

			for ( c=0; c<children.length; c++ ) {
				$c = $(children[c]);
				var i;
				if ( top != $c.offset().top ) {
					for ( i=0; i<rows.length; i++ ) if ( !$(rows[i]).data("fixedHeight") || i_force ) $(rows[i]).sameHeight().data("fixedHeight",true);
					rows = [[]];
					top = $c.offset().top;
					for ( i=0; i<childrenGroups.length; i++ ) rows.push([]);
				}
				rows[0].push(children[c]);
				for ( i=0; i<childrenGroups.length; i++ ) {
					rows[i+1].push(childrenGroups[i][c]);
				}
			}
			if ( rows[0] && rows[0].length ) for ( i=0; i<rows.length; i++ ) $(rows[i]).sameHeight();

			parents.push( $(this) );
		});

		return this;
	};

	//------------------------------------------------------------
	// 同じ高さに揃えるjQueryプラグイン
	//------------------------------------------------------------
	$.fn.sameHeight = function() {
		var maxHeight = 0;
		this.css("height","auto");
		this.each(function(){
			if ( $(this).height() > maxHeight ) maxHeight = $(this).height();
		});
		return this.height(maxHeight);
	};

	//------------------------------------------------------------
	// フォントサイズの変更時やウィンドウのリサイズ時に高さを揃える処理を実行
	//------------------------------------------------------------
	$.checkFixHeight = function( i_force ) {
		if ( $fontSizeDiv.height() == textHeight && i_force !== true ) return;
		textHeight = $fontSizeDiv.height();
		if ( parents.length ) $(parents).fixHeight( i_force );
	}

	//------------------------------------------------------------
	// [private] フォントサイズ確認用のDIV追加とタイマーセット
	//------------------------------------------------------------
	function init() {
		if ( isInitialized ) return;
		isInitialized = true;
		$fontSizeDiv = $('body').append('<div style="position:absolute;left:-9999px;top:-9999px;">s</div>');
		setInterval($.checkFixHeight,1000);
		$.checkFixHeight();
		$(window).on("resize",$.checkFixHeight);
		$(window).on("load",$.checkFixHeight);
	}

	//------------------------------------------------------------
	// [private] 処理すべき子要素のグループを取得
	//------------------------------------------------------------
	function getChildren( i_parent ) {
		var $parent = $( i_parent );

		//既にデータが存在すればそれを返す
		//if ( $parent.data("fixHeightChildrenGroups") ) return $parent.data("fixHeightChildrenGroups");

		//子グループを格納する配列
		var childrenGroups = [];

		//fixHeightChildクラスを持つ子要素を取得
		var $children = $parent.find(".fixHeightChild");
		if ( $children.length ) childrenGroups.push( $children );

		//fixHeightChildXXXクラスを持つ子要素を取得
		var $groupedChildren = $parent.find("*[class*='fixHeightChild']:not(.fixHeightChild)");
		if ( $groupedChildren.length ) {
			var classNames = {};
			$groupedChildren.each(function(){
				var a = $(this).attr("class").split(" ");
				var i;
				var l = a.length;
				var c;
				for ( i=0; i<l; i++ ) {
					c = a[i].match(/fixHeightChild[a-z0-9_-]+/i);
					if ( !c ) continue;
					c = c.toString();
					if ( c ) classNames[c] = c;
				}
			});
			for ( var c in classNames ) childrenGroups.push( $parent.find("."+c) );
		}

		//子要素の指定がない場合は直属の子を取得
		if ( !childrenGroups.length ) {
			$children = $parent.children();
			if ( $children.length ) childrenGroups.push( $children );
		}

		return childrenGroups;
	}

})(jQuery);