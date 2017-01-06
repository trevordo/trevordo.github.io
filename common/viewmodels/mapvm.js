var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		this.inputcity = ko.observable().publishOn("inputLocation");
		this.googleMap = ko.observable();
		this.testvar = ko.observable().subscribeTo("testvar");
		//
		var params;

		this.geocodeAddress = function() {
			this.geocoder = new google.maps.Geocoder();
			this.resultsMap = ko.observable(new google.maps.Map(document.getElementById('map_canvas'), {
				zoom: 12,
			}));
			this.testvar = ko.observable("Hi there").publishOn("testvar");
			var address = self.inputcity();

			self.geocoder.geocode({ 'address': address }, function (results, status) {
				if (status === 'OK') {
					self.resultsMap().setCenter(results[0].geometry.location);
					//var marker = new google.maps.Marker({
					//	map: self.resultsMap(),
					//	position: results[0].geometry.location
					//});
				} else {
					alert('Please check your internet connection, Geocode was not successful for the following reason: ' + status);
				}
			});
		};


		function initialize(params) {
			var myLatlng = new google.maps.LatLng(52.872764, -6.496128);
			var mapOptions = {
				center: myLatlng,
				zoom: 8,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				title: "Hello From Knockananna!!!"
			});
		}

		this.initializeMap = function () {
			//initialize(params);

		}
		//

	},

}