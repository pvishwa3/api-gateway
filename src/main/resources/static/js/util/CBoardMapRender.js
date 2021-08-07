/**
 * Created by Fine on 2016/12/13.
 */
var CBoardMapRender = function (jqContainer, options, drill) {
	this.options = options;
	this.tall;
	this.jqContainer = jqContainer;
	this.drill = drill;
	var _this = this;
	$(jqContainer).html("<div class='map_wrapper' id= 'map_wrapper' style='height:500px;width:100%'></div>");

	mapboxgl.accessToken = 'pk.eyJ1IjoicHZpc2h3YTMiLCJhIjoiY2pqN2o3ZmhuMjA3djNxbGtpeGlzeG0wMCJ9.VJAx4hLRQcRYHlkrmmBIXQ';

	var tempData = options.data;

	var chartData = [];

	var headerData = options.data[0];


	var googleMapsJson = [
		{
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#1d2c4d"
				}
				]
		},
		{
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#8ec3b9"
				}
				]
		},
		{
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#1a3646"
				}
				]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "off"
				}
				]
		},
		{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#4b6878"
				}
				]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#64779e"
				}
				]
		},
		{
			"featureType": "administrative.province",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#4b6878"
				}
				]
		},
		{
			"featureType": "landscape.man_made",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#334e87"
				}
				]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#023e58"
				}
				]
		},
		{
			"featureType": "poi",
			"stylers": [
				{
					"visibility": "off"
				}
				]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#283d6a"
				}
				]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#6f9ba5"
				}
				]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#1d2c4d"
				}
				]
		},
		{
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#023e58"
				}
				]
		},
		{
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#3C7680"
				}
				]
		},
		{
			"featureType": "road",
			"stylers": [
				{
					"visibility": "off"
				}
				]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#304a7d"
				}
				]
		},
		{
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
				]
		},
		{
			"featureType": "road",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#98a5be"
				}
				]
		},
		{
			"featureType": "road",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#1d2c4d"
				}
				]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#2c6675"
				}
				]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#255763"
				}
				]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#b0d5ce"
				}
				]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#023e58"
				}
				]
		},
		{
			"featureType": "transit",
			"stylers": [
				{
					"visibility": "off"
				}
				]
		},
		{
			"featureType": "transit",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#98a5be"
				}
				]
		},
		{
			"featureType": "transit",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#1d2c4d"
				}
				]
		},
		{
			"featureType": "transit.line",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#283d6a"
				}
				]
		},
		{
			"featureType": "transit.station",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#3a4762"
				}
				]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#0e1626"
				}
				]
		},
		{
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#4e6d70"
				}
				]
		}
		];

	var id = $(jqContainer)[0].id








	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var locations = [];

	for(var i=1;i<tempData.length;i++){
		var cordinates =[];
		var feedTrustScore = 0;
		for(var j=0;j<headerData.length;j++){

			if(tempData[i][j].data != "-999" &&  (headerData[j].data === 'longitude' || headerData[j].data === 'latitude')){
				cordinates.push(parseFloat(tempData[i][j].data));



			}
			if(tempData[i][j].data != "-999" && tempData[i][j].property === 'data'){
				feedTrustScore = parseFloat(tempData[i][j].data);
			}



		}
		if(cordinates.length!=0){
			locations.push({lat: cordinates[0], lng: cordinates[1],data:feedTrustScore});

		}



	}
	
	var centerLocaiton= {
        lat: locations[0].lng,
        lng: locations[0].lat
      }

	var map = new google.maps.Map(
			document.getElementById(id),
			{center: centerLocaiton, zoom: 2,
				styles: googleMapsJson,

				zoomControl: false,
				mapTypeControl: false,
				scaleControl: true,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false

			}

	);
	
	var infowindow = new google.maps.InfoWindow();

	var markers = [];
	for (var i = 0; i < locations.length; i++) {
		var dataPhoto = locations[i];
		if(!Number.isNaN(dataPhoto.lat) && !Number.isNaN(dataPhoto.lng)){
			var latLng = new google.maps.LatLng(
					dataPhoto.lng,
					dataPhoto.lat
			);
			var marker = new google.maps.Marker({
				position: latLng,
				label:'',
				title:'',
				info:"<span style = 'color:black' > Count :  "+dataPhoto.data +"</span>"
			});
			
			marker.addListener('click', function() {
				infowindow.setContent(this.info);     
			    infowindow.open(map, this);
			});
			
			markers.push(marker);
		}
		
	}
	
	
	
	

	var markerCluster = new MarkerClusterer(map, markers,
			{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});









};
