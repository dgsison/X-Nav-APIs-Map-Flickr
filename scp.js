var map = L.map('map').setView([40.2838, -3.8215], 16);
var feature;

function load_map() {
	map = new L.Map('map', {zoomControl: true});
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
	map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
}

function chooseAddr(lat, lng, type) {
	var location = new L.LatLng(lat, lng);
	map.panTo(location);

	if (type == 'city' || type == 'administrative') {
	map.setZoom(11);
	} else {
	map.setZoom(13);
	}
	var tag = $("#addr").val();	

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
	$.getJSON(flickerAPI, {
		tags: tag,
		tagmode: "any",
		format: "json"
	}) 
		.done(function(data) {
		$("#images").empty();
			$.each(data.items, function(i, item) {
				$("<img>").attr("src", item.media.m).appendTo("#images");
				if (i === 5) {
					return false;
				}
			});
		});
}

function addr_search() {
	var inp = document.getElementById("addr");
	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
		var items = [];
		$.each(data, function(key, val) {
			bb = val.boundingbox;
			items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3] + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
		});
			$('#results').empty();
		if (items.length != 0) {
			$('<p>', { html: "Search results:" }).appendTo('#results');
			$('<ul/>', {
				'class': 'my-new-list',
				html: items.join('')
			}).appendTo('#results');
		} else {
			$('<p>', { html: "No results found" }).appendTo('#results');
		}
	});
}


$(document).ready(function() {
	// create a map in the "map" div, set the view to a given place and zoom
	//var map = L.map('map').setView([40.2838, -3.8215], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add a marker in the given location, attach some popup content to it and open the popup
	// L.marker([40.2838, -3.8215]).addTo(map)
	//     .bindPopup('Aquí estoy estudiendo. <br>')
	//     .openPopup();

	


	/*var popup = L.popup();

	function onMapClick(e) {
		alert(e.latlng.toString());
    	popup
	        .setLatLng(e.latlng)
	        .setContent("Coordenadas chacho: " + e.latlng.toString())
	        .openOn(map);
	}*/

	map.on('click', onMapClick);

	// var circle = L.circle([40.2837, -3.8216], 30, {
	//     color: 'blue',
	//     fillColor: 'blue',
	//     fillOpacity: 0.5
	// }).addTo(map);

	map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
	    var radius = e.accuracy / 2;

	    L.marker(e.latlng).addTo(map)
	        .bindPopup("You are within " + radius + " meters from this point").openPopup();

	    L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
	    alert(e.message);
	}

	map.on('locationerror', onLocationError);

});