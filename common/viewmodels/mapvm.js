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

			ko.utils.arrayForEach(listviewModel.listOfLocations(), function (item) {

				//var lat = item.lat
				//var lng = item.lng
				var myLatlng = new google.maps.LatLng(item.lat, item.lng);

				var myMarkerOptions = {
					position: myLatlng,
					map: mapviewModel.resultsMap,
					title: "There"
				}
				var marker = new google.maps.Marker(myMarkerOptions);

				mapviewModel.markerArray.push(marker);

			})
		};

		// Sets the map on all markers in the array.
		this.markerclearAll = function () {
			for (var i = 0; i < self.markerArray.length; i++) {
				self.markerArray[i].setMap(null);
			}
			self.markerArray = [];
		};

	},

}