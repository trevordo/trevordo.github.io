/*
2017-01-08
my spa uses the Foursquare explore venue api
*/

var myList = myList || {};

myList = {

	listviewModel: function () {
		var self = this;

		// Foursquare API params
		this.foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
		this.c = ko.observable('Boston').subscribeTo("inputLocation");
		this.listparams = "&limit=15";
		this.q = ko.observable('');
		this.clientID = "&client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5";
		this.clientSE = "&client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO";
		this.v = "&v=20161228";

		// computed foursqure explore api
		this.listUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			// Returns the Foursquare URL for JSON API Venue Explore
			return self.foursqURL + self.c() + self.listparams + self.clientID + self.clientSE + self.v;
		}, self);

		// observableArray
		this.listOfLocations = ko.observableArray().subscribeTo("filteredList");
		this.locationFilter = ko.observableArray(self.locationArray);
		this.locationArray = [];


		this.justCategories = ko.computed(function () {
			var categories = ko.utils.arrayMap(self.locationArray, function (item) {
				return item.category;
			});
			return categories.sort();
		}, self);

		this.uniqueCategories = ko.dependentObservable(function () {
			return ko.utils.arrayGetDistinctValues(self.justCategories()).sort();
		}, self);

		//  Get locations from Foursquare API as json 
		this.getLocations = function () {
			$.getJSON(self.listUrl(), function (data) {

				// clear observableArray
				//self.locationArray.removeAll();
				self.locationArray = [];

				// assign object from json Foursquare
				var JSONdataFromServer = data.response.groups[0].items;

				// iterate through json
				for (var i = 0; i < JSONdataFromServer.length; i++) {

					// assign index [i] json property to object
					var arrayitem = JSONdataFromServer[i];

					// create an object literal and fill with array properties
					var result = {
						id: i,
						name: arrayitem.venue.name,
						lat: arrayitem.venue.location.lat,
						lng: arrayitem.venue.location.lng,
						category: arrayitem.venue.categories[0].name,
						rating: arrayitem.venue.rating,
						address: arrayitem.venue.location.formattedAddress
					};
					// push the object literal to observableArray
					self.locationArray.push(result);
				}
			}).fail(function (jqXHR, textStatus, errorThrown) {
				alert("error loading Foursquare search: " + textStatus);
				console.log("incoming Text " + jqXHR.responseText);
			}).always(function () {
				// once foursqure is done run setMarkers to create markers from JSON request
				mapviewModel.setMarkers(self.listOfLocations());
			});

			// clear query observable if a query was performed

		};



		this.filteredLocations = function () {
			
			// self.listOfLocations.removeAll();
			var filter = self.q().toLowerCase();
			console.log(filter);
			var array = self.locationArray;
			console.log(array);

			for(var x in array) {
				console.log(array[x].name);
				console.log(array[x].name.toLowerCase());
				console.log(filter.toLowerCase());
				console.log(array[x].name.toLowerCase().indexOf(filter.toLowerCase()));
				if (array[x].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
					self.listOfLocations.push(array[x]);
				}
			}

		};


	}
};