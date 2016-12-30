
var mapviewModel = function(){
	var self = this;

	this.mapUrl = ko.observable("https://maps.googleapis.com/maps/api/staticmap?center=");
	this.inputcity = ko.observable();
	this.mapparams = ko.observable("&zoom=13&size=600x300&maptype=roadmap");
	this.APIKey = ko.observable("&key=AIzaSyBv6ZxK0eXeud-z6aZgAYu_H8XY9ESFvus");

	this.fullUrl = ko.pureComputed(function () {
		// Knockout tracks dependencies automatically.
		//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
		return self.mapUrl() + self.inputcity() + self.mapparams() + self.APIKey();
	}, self);
};

var listviewModel = function(mvm){
	var self = this;

	this.foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
	this.clientID = "client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5&";
	this.clientSE = "client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO&";
	this.listparams = "&limit=2&query=";
	this.v = "v=20161228";
	this.c = ko.observable(mvm.inputcity());

	this.listUrl = ko.pureComputed(function () {
		// Knockout tracks dependencies automatically.
		//It knows that fullUrl depends on all params, because these get called when evaluating fullRul.
		return self.foursqURL + self.c() + self.listparams + self.clientID + self.clientSE + self.v;
	}, self);

	// this.JSONdataFromServer = '';

	// this.dataFromServer = ko.utils.parseJson(JSONdataFromServer);
};

