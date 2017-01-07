var myList = myList || {};

myList = {

	listviewModel: function () {
		var self = this;

		// Foursquare API params
		this.foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
		this.c = ko.observable().subscribeTo("inputLocation");
		this.listparams = "&limit=10&query=";
		this.q = ko.observable("");
		this.clientID = "&client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5";
		this.clientSE = "&client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO";
		this.v = "&v=20161228";

		// computed foursqure explore api
		this.listUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			// Returns the Foursquare URL for JSON API Venue Explore
			return self.foursqURL + self.c() + self.listparams + self.q() + self.clientID + self.clientSE + self.v;
		}, self);

		// observableArray
		this.listOfLocations = ko.observableArray();

		//  Get locations from Foursquare API as json 
		this.getLocations = function () {
			$.getJSON(self.listUrl(), function (data) {

				// assign object from json Foursquare
				var JSONdataFromServer = data.response.groups[0].items;
				
				// iterate through json
				for (var i = 0; i < JSONdataFromServer.length; i++) {

					// assign index [i] json property to object
					var arrayitem = JSONdataFromServer[i];

					// create an object literal and fill with array properties
					var result = {
						name: arrayitem.venue.name,
						lat: arrayitem.venue.location.lat,
						lng: arrayitem.venue.location.lng,
						category: arrayitem.venue.categories[0].name,
						rating: arrayitem.venue.rating,
						description: arrayitem.tips.text
					};
					// push the object literal to observableArray
					self.listOfLocations.push(result);
				};
			});

		};

	},

}