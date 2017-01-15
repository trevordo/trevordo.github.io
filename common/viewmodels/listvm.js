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
		// listOfLocations is the active and filtered list
		this.listOfLocations = ko.observableArray();
		// locationArray is to be populated by the Foursquare
		this.locationArray = [];

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
						id: i,
						name: arrayitem.venue.name,
						lat: arrayitem.venue.location.lat,
						lng: arrayitem.venue.location.lng,
						address: arrayitem.venue.location.formattedAddress,
						//get rating and check to see if data is available
						rating: !!arrayitem.venue.rating ?
							rating = arrayitem.venue.rating : 'No rating available'
					};
					// push the object literal to observableArray
					self.locationArray.push(result);
				}
			}).fail(function (jqXHR, textStatus, errorThrown) {
				alert("error loading Foursquare search: " + textStatus);
				console.log("incoming Text " + jqXHR.responseText);
			}).always(function () {

				// once foursqure is done run setMarkers to create markers from JSON request
				mapviewModel.setMarkers(self.locationArray);
			});
		};

		// syncronize arrays; Foursquare Data to listOfLocations
		this.syncArrays = function () {
			var array = self.locationArray;

			// push all values from locationArray into listOfLocations
			for (var i = 0; i < array.length; i++) {
				self.listOfLocations.push(array[i]);
			}
		};

		// subscribe to q for query and look for changes, if change pass filter
		self.q.subscribe(function (filter) {

			// clear query observable if a query was performed and remove markers
			mapviewModel.markerclearAll();
			self.listOfLocations.removeAll();

			// assign array 
			var array = mapviewModel.markerArray();

			// loop through each array index and find the query that matches the index of item.
			// if a match push to listOfLocations 
			for (var x in array) {

				// match query to index of array item
				if (array[x].title.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {

					// setmap and push array item if it's a match to listOfLocations
					array[x].setMap(mapviewModel.resultsMap);
					self.listOfLocations.push(array[x]);
				}
			}

			// Set markers on the map
			//mapviewModel.setMarkers(self.listOfLocations());
		});
	}
};