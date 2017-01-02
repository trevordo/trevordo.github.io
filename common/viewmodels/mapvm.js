var myMaps = myMaps || {};

myMaps = {

	mapviewModel: function () {
		var self = this;

		this.mapUrl = ko.observable("https://maps.googleapis.com/maps/api/js?");
		this.inputcity = ko.observable().publishOn("inputLocation");
		this.mapparams = ko.observable("&zoom=13&size=600x300&maptype=roadmap");
		this.APIKey = ko.observable("key=AIzaSyA7UXVPRZlqsTwxpp9d7HPQHakSNNGEK7s&callback=");

		this.fullUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
			return self.mapUrl() + self.APIKey() + self.getMap();
		}, self);

		//
		var params;

		function geocodeAddress() {
			var geocoder = new google.maps.Geocoder();
			var resultsMap = new google.maps.Map(document.getElementById('map_canvas'), {
				zoom: 12,
				center: { lat: -34.397, lng: 150.644 }
			});

			var address = self.inputcity();
			geocoder.geocode({ 'address': address }, function (results, status) {
				if (status === 'OK') {
					resultsMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: resultsMap,
						position: results[0].geometry.location
					});
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
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
			geocodeAddress();
		}
		//

		this.getMap = function () {
			// dom ready
			$(function () {

				//if (typeof google !== "undefined"){
				if (window.google && google.maps) {
					// Map script is already loaded
					//alert("Map script is already loaded. Initialising");
					initializeMap();
				} else {
					//alert("Lazy loading Google map...");
					lazyLoadGoogleMap();
				}

			});

			function lazyLoadGoogleMap() {
				var gsrc = "http://maps.google.com/maps/api/js?key=AIzaSyA7UXVPRZlqsTwxpp9d7HPQHakSNNGEK7s&callback=mapviewModel.initializeMap"

				$.getScript(gsrc)
					.done(function (script, textStatus) {
						//alert("Google map script loaded successfully");
					})
					.fail(function (jqxhr, settings, ex) {
						//alert("Could not load Google Map script: " + jqxhr);
					});
			};
		};
	},

}