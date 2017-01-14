var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		// set observable and arrays.  subscribe and publish for decoupled variable sync
		this.inputcity = ko.observable('Boston').publishOn("inputLocation");
		this.resultsMap = ko.observable();
		this.markerArray = ko.observableArray();

		// get the geocode of the input city
		this.geocodeAddress = function () {

			if (window.google === undefined) {
				// Map script is not loaded
				alert("Please check your connection google maps could not be loaded...");
			}


			self.geocoder = new google.maps.Geocoder();
			self.resultsMap = new google.maps.Map(document.getElementById('map_canvas'), {
				zoom: 12,
			});

			// retrieve city from input
			var address = self.inputcity();

			// check the input for entry
			if (address === undefined) {
				alert('Please enter a city');
			}

			// get a list of locations
			listviewModel.getLocations();

			// get geocode
			self.geocoder.geocode({ 'address': address }, function (results, status) {

				//check if the status is okay
				if (status === 'OK') {

					// center the map on the lat lng result of the geocode
					self.resultsMap.setCenter(results[0].geometry.location);
				} else {

					// give warning if status failed
					alert('Please check your internet connection, Geocode was not successful for the following reason: ' + status);
				}
			});
		};

		// push each marker from the Foursquare observablearray to the marker array
		this.setMarkers = function (array) {

			// clear the markers on the map
			self.markerArray.removeAll();

			// clear the infowindow
			var infowindow = new google.maps.InfoWindow({
				content: ""
			});
			// assign arry to arry variable
			//var array = listviewModel.listOfLocations();

			// for each item in the forsquare array
			ko.utils.arrayForEach(array, function (item) {

				// set the position for the marker with each of the item lat and lng
				// prepare the content for the infowindow
				var myLatlng = new google.maps.LatLng(item.lat, item.lng);
				var contentString = '<b>' + item.name + '</b>' +
					'<br>' + 'Foursquare Rating: ' + item.rating +
					'<br><br>' + item.address;

				// populate the markerOptions for the marker
				var myMarkerOptions = {
					position: myLatlng,
					map: null,
					title: item.name,
					animation: google.maps.Animation.DROP,

				};

				// set the markerOptions to the map
				var marker = new google.maps.Marker(myMarkerOptions);

				// use a map listener to click the marker on the map and bounce
				google.maps.event.addListener(marker, 'click', function () {

					// set the content of the infowindow with the content string
					infowindow.setContent(contentString);

					// add an animation to the marker
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function () {
						marker.setAnimation(null);
					}, 1400);

					// open the infowindow on click
					infowindow.open(mapviewModel.resultsMap, this);
				});

				// push the marker to the marker array
				mapviewModel.markerArray.push(marker);
			});

			// show the markers
			self.markershowAll();

		};

		// Clears the map on all markers in the array.
		this.markerclearAll = function () {
			for (var i = 0; i < self.markerArray().length; i++) {
				// set the map for the marker to null
				self.markerArray()[i].setMap(null);
			}

			// and erase everything in the markerArray
			self.markerArray.removeAll();
		};

		// show all the markers by dropping them on the map
		this.markershowAll = function () {

			// go through each of the markers and 
			for (var i = 0; i < self.markerArray().length; i++) {

				// set the timeout and go thorugh each marker
				var timeout = i * 200;
				var marker = self.markerArray()[i];

				// call the marker timer setup
				self.markersetMap(marker, timeout);
			}
		};

		// set the marker to the maps with a timer
		this.markersetMap = function (marker, timeout) {

			// each marker will drop at different times
			window.setTimeout(function () {

				// set the map to the loaded map
				marker.setMap(self.resultsMap);
			}, timeout);
		};
	},
};