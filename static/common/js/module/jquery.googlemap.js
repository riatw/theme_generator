/*----------------------------------------------
 @disc	: -
 @param	: -
 @ret	: -
----------------------------------------------*/
moduleFunc.googleMap = function ( options ) {
	var c	= $.extend ( {
		mapId		: 'gMaps',
		lat			: 0,
		lng			: 0,
		zoom		: 15
	}, options );

	if ( $( '#' + c.mapId ).length ) {

		var latLng	= new google.maps.LatLng ( c.lat, c.lng );
		var myOptions	= {
			zoom				: c.zoom,
			center				: latLng,
			mapTypeControl		: true,
			style				: google.maps.ZoomControlStyle.DEFAULT,
			zoomControl			: true,
			scaleControl		: true,
			mapTypeId			: google.maps.MapTypeId.ROADMAP
		};

		var map	= new google.maps.Map ( document.getElementById ( c.mapId ), myOptions );

		var marker	= new google.maps.Marker ( {
			position	: latLng,
			map			: map
		} );
	}
}