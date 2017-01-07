var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		this.inputcity = ko.observable().publishOn("inputLocation");
		this.resultsMap = ko.observable();
		this.markerArray = [];
		//
		var params;

		this.geocodeAddress = function () {
			this.geocoder = new google.maps.Geocoder();
			this.resultsMap = new google.maps.Map(document.getElementById('map_canvas'), {
				zoom: 12,
			});
			// retrieve city from input
			var address = self.inputcity();

			self.geocoder.geocode({ 'address': address }, function (results, status) {
				if (status === 'OK') {
					self.resultsMap.setCenter(results[0].geometry.location);
				} else {
					alert('Please check your internet connection, Geocode was not successful for the following reason: ' + status);
				}
			});
		}, self.resultsMap;

		this.setMarkers = function () {
			self.markerclearAll();

			var infowindow = new google.maps.InfoWindow({
				content: ""
			});

			ko.utils.arrayForEach(listviewModel.listOfLocations(), function (item) {

				//var lat = item.lat
				//var lng = item.lng
				var myLatlng = new google.maps.LatLng(item.lat, item.lng);

				var myMarkerOptions = {
					position: myLatlng,
					map: null,
					title: item.name,
					animation: google.maps.Animation.DROP,
				}

				var contentString = '<b>' + item.name + '</b>' +
					'<br>' + 'Foursquare Rating: ' + item.rating +
					'<br><br>' + item.address;

				var marker = new google.maps.Marker(myMarkerOptions);

				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(contentString);
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function () {
						marker.setAnimation(null);
					}, 2000);
					infowindow.open(mapviewModel.resultsMap, this);
				});

				mapviewModel.markerArray.push(marker);

			})

			self.markershowAll();


		};

		// Sets the map on all markers in the array.
		this.markerclearAll = function () {
			for (var i = 0; i < self.markerArray.length; i++) {
				self.markerArray[i].setMap(null);
			}
			self.markerArray = [];
		};

		this.markershowAll = function () {
			for (var i = 0; i < self.markerArray.length; i++) {
				var timeout = i * 200;
				var marker = self.markerArray[i];
				// self.markerArray[i].setMap(self.resultsMap);
				self.markersetMap(marker, timeout);

			}

		};
		// change the map
		this.markersetMap = function (marker, timeout) {

			window.setTimeout(function () {
				marker.setMap(self.resultsMap);
			}, timeout);
		};

	},

}