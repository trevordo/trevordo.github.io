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


