var myApp = myApp || {};

myApp.myModels = {

	

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



function initialize(params) {
        var myLatlng = new google.maps.Maps(52.872764, -6.496128);
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
        initialize(params);
		console.log("Hi");
    }
//




		this.getMap = function () {


    // dom ready
    $(function () {
        
        //if (typeof google !== "undefined"){
        if (window.google && google.maps) {
            // Map script is already loaded
            alert("Map script is already loaded. Initialising");
            initializeMap();
        } else {
            alert("Lazy loading Google map...");
            lazyLoadGoogleMap();            
        }     
   
    });

    

    function lazyLoadGoogleMap() {
        $.getScript("http://maps.google.com/maps/api/js?key=AIzaSyA7UXVPRZlqsTwxpp9d7HPQHakSNNGEK7s&callback=mapviewModel.initializeMap")
        .done(function (script, textStatus) {            
            //alert("Google map script loaded successfully");
        })
        .fail(function (jqxhr, settings, ex) {
            //alert("Could not load Google Map script: " + jqxhr);
        });
    }
   
    
		};

		

	},

	listviewModel: function () {
		var self = this;

		this.foursqURL = "https://api.foursquare.com/v2/venues/explore?near=";
		this.c = ko.observable().subscribeTo("inputLocation");
		this.listparams = "&limit=10&query=";
		this.q = ko.observable("");		
		this.clientID = "&client_id=QXZHPKM1KXHHQY02ZIBPMGYQ2QV1O5NUWBTDJWGESSS1GYF5";
		this.clientSE = "&client_secret=KSWZYUKZOHKYPINL4DSP1FRGOB44WOSWWE0RSCKT55OO40SO";
		this.v = "&v=20161228";		

		this.listUrl = ko.pureComputed(function () {
			// Knockout tracks dependencies automatically.
			// Returns the Foursquare URL for JSON API Venue Explore
			return self.foursqURL + self.c() + self.listparams + self.q() +self.clientID + self.clientSE + self.v;
		}, self);

		// observableArray
		this.listOfLocations = ko.observableArray();
		//  Get locations from Foursquare API as json 
		this.getLocations = function () {
			$.getJSON(self.listUrl(), function(data) {	
			// assign object from json Foursquare
			var JSONdataFromServer = data.response.groups[0].items;		
			// iterate through json
			for (var i=0; i<JSONdataFromServer.length; i++) {
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