$(function () {
	var defaultFields = [
		"タイトル",
		"本文",
		"カテゴリ",
		"タグ",
		"公開日"
	];

	var defaultFieldBasenames = {
		"タイトル": "title",
		"本文": "text",
		"タグ": "tags",
		"カテゴリ": "category"
	};

	var defaultFieldTagNames = {
		"タイトル": "entrytitle",
		"本文": "entrybody",
		"タグ": "entrytags"
	};

	var data;

	// event bind
	$("[data-file]").change(function(){
		if ( this.files.length > 0 ) {
			// 選択されたファイル情報を取得
			var file = this.files[0];

			// readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
			var reader = new FileReader();
			reader.readAsText(file);

			reader.onload = function() {
				// console.log(reader.result.replace(/\r\n/gm,"\n"));
				data = hoge( reader.result.replace(/\r\n/gm,"\n") + "\n" );

				for ( var i = 0; i < data.length; i++ ) {
					var option = $("<option />").val(i).text(data[i].name);
					$("[data-blog]").append(option);
				}
			}
		}
	});

	$("[data-blog]").change(function(){
		$(window).trigger("changeBlog", $(this).val() );
	});

	$(window).on("changeBlog", function(e,blog_id) {
		var temp = [];
		temp.push( data[blog_id] );
		rendar(temp);
	});

	function rendar(rendarBuff) {
		// theme
		var template = $("[data-input-theme]").html().replace(/^\n/,"").replace(/\n$/,"");
		var rendered = Mustache.render(template, {blogs: rendarBuff});

		$("[data-output-theme]").html(rendered);

		// userjs
		var template = $("[data-input-userjs]").html().replace(/^\n/,"").replace(/\n$/,"");
		var rendered = Mustache.render(template, {blogs: rendarBuff});

		$("[data-output-userjs]").html(rendered);

		// mtml sample
		var template = $("[data-input-mtml]").html().replace(/^\n/,"").replace(/\n$/,"");
		var rendered = Mustache.render(template, {blogs: rendarBuff}).replace(/\n\n/g,"\n");
		$("[data-output-mtml]").html(rendered);

		// zip download
		var zip = new JSZip();
		zip.file("theme.yaml", $("[data-output-theme]").val());

		zip.generateAsync({type:"blob"}).then(function(content) {
			$("[data-output-download]").attr("download", "theme_from_" + rendarBuff[0].basename + ".zip");
			$("[data-output-download]").attr("href", window.URL.createObjectURL(content));
		});
	}

	function hoge(text) {
		var arr;
		var buff = [];
		var localBuff;
		var localBuff2;
		var text = text;
		var currentLabel;
		var currentBlog;

		var flags = {
			title: 0,
			category: 0
		}

		arr = text.split("\n");

		for ( var i = 0; i < arr.length; i++ ) {
			var row = arr[i];

			// 第一階層（ブログ名）
			if ( row.match(/^#\s/ ) || i == arr.length -1 ) {
				var name = row.split("_").shift();
				var basename = row.split("_").pop();

				if ( localBuff ) {
					localBuff.field.push(localBuff2);
				}

				currentBlog = name.replace(/^# /,"");

				if ( localBuff ) {
					buff.push(localBuff);
				}

				localBuff = {
					name: currentBlog,
					basename: basename,
					field: []
				};

				localBuff2 = {};
			}

			// 第二階層（フィールド名）
			if ( row.match(/^-\s/ ) && row.indexOf(":") == -1 ) {
				currentLabel = row.replace(/-\s/,"");

				if ( localBuff2.type ) {
					localBuff.field.push(localBuff2);
				}

				localBuff2 = {
					label: currentLabel
				};
			}

			// 第三階層（フィールドプロパティ）
			if ( row.match(/^\t-\s/ ) && row.indexOf(":") != -1 ) {
				if ( row.indexOf("type:") != -1 || row.indexOf("basename:") != -1 ) {
					var key = row.split(": ").shift().replace(/\s-\s/,"");
					var value = row.split(": ").pop();

					localBuff2[key] = value;
				}
			}
		}

		// theme rendar
		var rendarBuff = buff;

		for ( var i = 0; i < rendarBuff.length; i++ ) {
			// カスタムフィールドを抽出
			rendarBuff[i].customfield = $.grep(rendarBuff[i].field, function(value,key) {
				if ( value.type == "カテゴリ" ) {
					rendarBuff[i].use_category = 1;
				}

				if ( $.inArray(value.type, defaultFields) == -1 ) {
					return true;
				}

				rendarBuff[i].blog_id = i + 2;
			});

			// 標準フィールドのベースネームを設定
			rendarBuff[i].field = $.grep(rendarBuff[i].field, function(value,key) {
				var basename;

				if ( $.inArray(value.type, defaultFields) != -1 ) {
					value.basename = defaultFieldTagNames[value.type];
				}

				return true
			});

			// 標準フィールドのベースネームを設定
			rendarBuff[i].field = $.grep(rendarBuff[i].field, function(value,key) {
				var basename;

				if ( value.type == "image" || value.type == "file" ) {
					value.is_asset = 1;
				}
				else if ( value.type == "checkbox" ) {
					value.is_checkbox = 1;
				}
				else if ( value.type == "カテゴリ" ) {
					value.is_category = 1;
				}
				else {
					value.is_normal = 1;
				}

				return true
			});

			// フィールド一覧を作成
			rendarBuff[i].fieldraw = $.map(rendarBuff[i].field, function(value,key) {
				var basename;

				if ( $.inArray(value.type, defaultFields) == -1 ) {
					basename = "c:" + value.basename
				}
				else {
					basename = defaultFieldBasenames[value.type];
				}

				if ( value.type != "カテゴリ" ) {
					return basename
				}
			}).join(",");
		}

		return rendarBuff;
	}
});
