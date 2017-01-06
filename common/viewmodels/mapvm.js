var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		this.inputcity = ko.observable().publishOn("inputLocation");
		this.resultsMap = ko.observable();
		this.testvar = ko.observable();
		//
		var params;

		this.geocodeAddress = function() {
			this.geocoder = new google.maps.Geocoder();
			this.resultsMap = new google.maps.Map(document.getElementById('map_canvas'), {
				zoom: 12,
			});
			this.testvar = "Hi there";
			var address = self.inputcity();

			self.geocoder.geocode({ 'address': address }, function (results, status) {
				if (status === 'OK') {
					self.resultsMap.setCenter(results[0].geometry.location);
				} else {
					alert('Please check your internet connection, Geocode was not successful for the following reason: ' + status);
				}
			});
		},self.resultsMap;

	},

}