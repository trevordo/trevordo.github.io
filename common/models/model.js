function MapModel() {
	var self = this;

	this.mapUrl = ko.observable("https://maps.googleapis.com/maps/api/staticmap?center=");
	this.inputcity = ko.observable();
	this.params = ko.observable("&zoom=13&size=600x300&maptype=roadmap");
	this.APIKey = ko.observable("&key=AIzaSyBv6ZxK0eXeud-z6aZgAYu_H8XY9ESFvus");

	this.fullUrl = ko.pureComputed(function () {
		// Knockout tracks dependencies automatically.
		//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
		return self.mapUrl() + self.inputcity() + self.params() + self.APIKey();
	}, self);


};


function ListModel() {
	var self = this;

	var foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
	var clientID = "client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5&";
	var clientSE = "client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO&";
	var params = "&limit=2&query=";
	var v = "v=20161228"
	var q = ko.observable();

	this.listUrl = ko.pureComputed(function () {
		// Knockout tracks dependencies automatically.
		//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
		return self.foursqURL() + self.inputcity() + self.params() + self.clientID() + self.clientSE() + self.v();
	}, self);

	var JSONdataFromServer = '[]'

	var dataFromServer = ko.utils.parseJson(JSONdataFromServer);

};

