moduleFunc = {};

function importJs ( param ) {
	var jsfiles		= param;

	function lastof ( pa ) {
		return pa[pa.length - 1];
	}

	function dirname ( path ) {
		return path.substring( 0, path.lastIndexOf('/') );
	}

	var prefix	= dirname ( lastof( document.getElementsByTagName('script') ).src ).replace("/common/js","");

	for( var i = 0; i < jsfiles.length; i ++ ) {
		document.write('<script src="' + prefix + '/' + jsfiles[i] + '"></script>');
	}
}

