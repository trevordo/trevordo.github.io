var myApp = myApp || {};

myApp.myModels = {

	mapviewModel: function () {
		var self = this;

		this.mapUrl = ko.observable("https://maps.googleapis.com/maps/api/staticmap?center=");
		this.inputcity = ko.observable().publishOn("inputLocation");
		this.mapparams = ko.observable("&zoom=13&size=600x300&maptype=roadmap");
		this.APIKey = ko.observable("&key=AIzaSyBv6ZxK0eXeud-z6aZgAYu_H8XY9ESFvus");

		this.fullUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
			return self.mapUrl() + self.inputcity() + self.mapparams() + self.APIKey();
		}, self);
	},

	listviewModel: function () {
		var self = this;

		this.foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
		this.clientID = "&client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5";
		this.clientSE = "&client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO";
		this.listparams = "&limit=2&query=";
		this.v = "&v=20161228";
		this.c = ko.observable().subscribeTo("inputLocation");

		this.listUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
			return self.foursqURL + self.c() + self.listparams + self.clientID + self.clientSE + self.v;
		}, self);

		//TESTING
		this.anotherObservableArray = ko.observableArray([
    { name: "Bungle", type: "Bear" },
    { name: "George", type: "Hippo" },
    { name: "Zippy", type: "Unknown" }
	]);
//TESTING

		// this.JSONdataFromServer = '';
		var mappedToArray = [];
		this.listOfLocations = ko.observableArray(mappedToArray);
		 
		this.getLocations = function () {
		$.getJSON(self.listUrl(), function(data) {	

		var JSONdataFromServer = data.response.groups[0].items;
        
		// console.log(JSONdataFromServer);
		// dataFromServer = ko.mapping.fromJS(JSONdataFromServer);
		// self.listOfLocations = ko.mapping.fromJS(JSONdataFromServer, {}, self.listOfLocations);
		// console.log(dataFromServer);
        // var arrayOut = dataFromServer;
		// console.log(arrayOut);
        // self.listOfLocations(JSONdataFromServer);

		for (var i=0; i<JSONdataFromServer.length; i++) {
            var arrayitem = JSONdataFromServer[i];

			var result = {
				name: arrayitem.venue.name,
				lat: arrayitem.venue.location.lat,
				lng: arrayitem.venue.location.lng,
				category: arrayitem.venue.categories[0].name
			};

			//self.listOfLocations = ko.mapping.fromJS(result, {}, self.listOfLocations);
			mappedToArray.push(result);
        };

        
		}); 


		};
		// this.dataFromServer = ko.utils.parseJson(JSONdataFromServer);
	},

}