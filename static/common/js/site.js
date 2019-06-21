$(function () {
	var defaultFields = [
		"タイトル（1行テキスト）",
		"本文",
		"カテゴリ（チェックボックス）",
		"タグ",
		"公開日"
	];

	var defaultFieldBasenames = {
		"タイトル（1行テキスト）": "title",
		"本文": "text",
		"タグ": "tags",
		"カテゴリ（チェックボックス）": "category"
	};

	var defaultFieldTagNames = {
		"タイトル（1行テキスト）": "entrytitle",
		"本文": "entrybody",
		"タグ": "entrytags"
	};

	var fieldTransDoc = {
		"タイトル": "タイトル",
		"1行テキスト": "text",
		"複数行テキスト": "textarea",
		"リッチテキスト": "editor_textarea",
		"チェックボックス": "checkbox",
		"日時選択": "datetime",
		"ドロップダウン": "select",
		"ラジオボタン": "radio",
		"ファイルアップロード": "file",
		"画像アップロード": "image",
		"GoogleMap": "googlemaps",
		"ユニットシステムセット": "textarea",
		"拡張フィールド": "textarea"
	}

	var excludeCustomFields = [
		"entryunit",
		"entryaltlink",
		"entryaltfilelink",
		"entryviewblank",
	];

	var excludeFields = [
		"entryaltlink",
		"entryaltfilelink",
		"entryviewblank",
	];

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
				data = readFile( reader.result.replace(/\r\n/gm,"\n") + "\n", file.name );

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

	function readFile(text, filename) {
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

		var fileExt = filename.split(".").pop();

		switch ( fileExt) {
			case "md":
			case "txt":
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
							label: currentLabel,
							basename: "",
							type: "",
							type_raw: ""
						};
					}

					// 第三階層（フィールドプロパティ）
					if ( row.match(/^\t-\s/ ) && row.indexOf(":") != -1 ) {
						if ( row.indexOf("type:") != -1 || row.indexOf("basename:") != -1 ) {
							var key = row.split(": ").shift().replace(/\s-\s/,"");
							var value = row.split(": ").pop();

							localBuff2[key] = value;
							localBuff2["type_raw"] = value;
						}
					}
				}
			break;

			case "csv":
				arr = Papa.parse(text).data;

				for ( var i = 0; i < arr.length; i++ ) {
					var row = arr[i];
					var rowBlogName = row[0];
					var rowFieldName = row[1];
					var rowFieldType = row[2];
					var rowFieldBasename = row[3];

					// 第一階層（ブログ名）
					if ( rowBlogName != currentBlog ) {
						var name = rowBlogName.split("_").shift();
						var basename = rowBlogName.split("_").pop();

						currentBlog = rowBlogName;

						if ( localBuff ) {
							buff.push(localBuff);
						}

						localBuff = {
							name: name,
							basename: basename,
							field: []
						};
					}

					localBuff.field.push({
						label: rowFieldName,
						type_raw: rowFieldType,
						type: fieldTransDoc[rowFieldType],
						basename: rowFieldBasename
					});
				}
			break;
		}

		// theme rendar
		var rendarBuff = buff;

		for ( var i = 0; i < rendarBuff.length; i++ ) {
			// 標準フィールドのベースネームを設定
			rendarBuff[i].field = $.grep(rendarBuff[i].field, function(value,key) {
				var basename;

				// ベースネーム設定
				if ( $.inArray(value.type_raw, defaultFieldTagNames) != -1 ) {
					value.basename = defaultFieldTagNames[value.type];
				}

				// フィールドの種類ごとのフラグ設定
				if ( value.type == "image" || value.type == "file" ) {
					value.is_asset = 1;
				}
				else if ( value.type == "checkbox" ) {
					value.is_checkbox = 1;
				}
				else if ( value.type == "カテゴリ（チェックボックス）" ) {
					value.is_category = 1;
				}
				else {
					value.is_normal = 1;
				}

				return true
			});

			console.log(rendarBuff[i]);

			// フィールド一覧を作成
			rendarBuff[i].fieldraw = $.map(rendarBuff[i].field, function(value,key) {
				var basename;

				if ( value.type_raw == "カテゴリ（チェックボックス）" ) {
					return;
				}

				if ( $.inArray(value.type_raw, defaultFields) == -1 && $.inArray(value.basename, excludeFields) == -1 ) {
					basename = "c:" + value.basename
				}
				else {
					basename = defaultFieldBasenames[value.type_raw];
				}

				return basename
			}).join(",");

			// カスタムフィールドを抽出
			rendarBuff[i].customfield = $.grep(rendarBuff[i].field, function(value,key) {
				console.log(value);

				// 使用オプションの洗い出し
				if ( value.type_raw ) {
					if ( value.type_raw.indexOf("カテゴリ") != -1 ) {
						rendarBuff[i].use_category = 1;
					}
					if ( value.type_raw == "拡張フィールド" ) {
						rendarBuff[i].use_extfield = 1;
					}
					if ( value.type_raw == "ユニットシステム" ) {
						rendarBuff[i].use_unit = 1;
					}
					if ( value.basename.indexOf("alt") != -1 ) {
						rendarBuff[i].use_altlink = 1;
					}
				}

				if ( $.inArray(value.type_raw, defaultFields) == -1 && $.inArray(value.basename, excludeCustomFields) == -1 ) {
					return true;
				}

				rendarBuff[i].blog_id = i + 2;
			});
		}

		return rendarBuff;
	}
});
