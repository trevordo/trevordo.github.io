var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		// set observable and arrays.  subscribe and publish for decoupled variable sync
		this.inputcity = ko.observable('Boston').publishOn("inputLocation");
		this.resultsMap = ko.observable();
		this.infowindow = ko.observable();
		// markerArray is to hold all the markers for the listOfLocations
		this.markerArray = ko.observableArray();

		// get the geocode of the input city
		this.geocodeAddress = function () {

			if (!window.google && !google.maps) {
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
			listviewModel.listOfLocations.removeAll()

			// clear the infowindow
			self.infowindow = new google.maps.InfoWindow({
				content: ''
			});

			// for each item in the forsquare array
			ko.utils.arrayForEach(array, function (item) {

				// set the position for the marker with each of the item lat and lng
				// prepare the content for the infowindow
				var myLatlng = new google.maps.LatLng(item.lat, item.lng);
				var html = '<b>' + item.name + '</b>' +
					'<br>' + 'Foursquare Rating: ' + item.rating +
					'<br><br>' + item.address;

				// populate the markerOptions for the marker
				var myMarkerOptions = {
					position: myLatlng,
					map: null,
					title: item.name,
					animation: google.maps.Animation.DROP,
					id: item.id,
					content: html,
				};

				// set the markerOptions to the map
				var marker = new google.maps.Marker(myMarkerOptions);

				// use a map listener to click the marker on the map and bounce
				google.maps.event.addListener(marker, 'click', function () {

					// call and create an infowindow, add animation and pan
					self.showInfo(marker);
				});

				// push the marker to the marker array and list
				// listOfLocations is active list with active filer
				listviewModel.listOfLocations.push(marker);
				// marker array is main marker list
				self.markerArray.push(marker);
			});

			// show the markers
			self.markershowAll();

		};

		// Clears the map on all markers in the array.
		this.markerclearAll = function () {
			for (var i = 0; i < listviewModel.listOfLocations().length; i++) {
				// set the map for the marker to null
				listviewModel.listOfLocations()[i].setMap(null);
			}

		};

		// show all the markers by dropping them on the map
		this.markershowAll = function () {

			// go through each of the markers and 
			for (var i = 0; i < listviewModel.listOfLocations().length; i++) {

				// set the timeout and go thorugh each marker
				var timeout = i * 100;
				var marker = listviewModel.listOfLocations()[i];

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

		this.showInfo = function (marker) {
			// set the content of the infowindow with the content string
			self.infowindow.setContent(marker.content);

			// add an animation to the marker
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				marker.setAnimation(null);
			}, 1400);

			// open the infowindow on click
			self.infowindow.open(self.resultsMap, marker);

			// pan to marker center
			self.resultsMap.panTo(marker.getPosition());
		};

	},
};