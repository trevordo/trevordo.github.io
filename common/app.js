(function () {

	// This is from the TODOmvc examples to get the enterkey working
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// A factory function we can use to create binding handlers for specific
	// keycodes.
	function keyhandlerBindingFactory(keyCode) {
		return {
			init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
				var wrappedHandler, newValueAccessor;

				// wrap the handler with a check for the enter key
				wrappedHandler = function (data, event) {
					if (event.keyCode === keyCode) {
						valueAccessor().call(this, data, event);
					}
				};

				// create a valueAccessor with the options that we would want to pass to the event binding
				newValueAccessor = function () {
					return {
						keyup: wrappedHandler
					};
				};

				// call the real event binding's init function
				ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
			}
		};
	}

	// a custom binding to handle the enter key
	ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

	// another custom binding, this time to handle the escape key
	ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

	// wrapper to hasFocus that also selects text and applies focus async
	ko.bindingHandlers.selectAndFocus = {
		init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
			ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
			ko.utils.registerEventHandler(element, 'focus', function () {
				element.focus();
			});
		},
		update: function (element, valueAccessor) {
			ko.utils.unwrapObservable(valueAccessor()); // for dependency
			// ensure that element is visible before trying to focus
			setTimeout(function () {
				ko.bindingHandlers.hasFocus.update(element, valueAccessor);
			}, 0);
		}
	};

	var MapViewModel = (function () {
		var self = this;

		// call MapModel method
		this.mapviewModel = new myMaps.mapviewModel();
		this.listviewModel = new myList.listviewModel();

		// set visibility options
		this.showMap = ko.observable(false);
		this.hideStart = ko.observable(true);
		this.showError = ko.observable(false);

		// visibility of DOM elements
		this.toggleMapVisibility = function () {

			// change visibility
			// show map
			self.showMap(!self.showMap());
			// hide welcome input
			self.hideStart(!self.hideStart());
		};

		// loads map
		this.loadMap = function () {

			// call method to get foursquare json
			mapviewModel.geocodeAddress();
			listviewModel.getLocations();

			// reset tiles count
			var tilesloadedcount = 0;

			google.maps.event.addListenerOnce(mapviewModel.resultsMap, 'tilesloaded', function () {

				// do something only the first time the map is loaded
				// add to the tilecount for map tiles loading
				tilesloadedcount++

				if (tilesloadedcount > 0) {
					window.setTimeout(function () {

						// place markers on map
						mapviewModel.setMarkers();
					}, 500);
				} else {
					// if internet is not working throw alert
					alert('Please Check your internet connection, map could not be loaded');
				};
			});
		};

		// event bindings
		// error message
		this.showerrorMsg = function () {

			// show error
			self.showError(!self.showError());
			// hide map
			self.showMap(!self.showMap());
		}.bind(this);

		// first input of Map
		this.startMap = function () {

			// toggleMapVisibility
			self.toggleMapVisibility();

			// load map and list
			self.loadMap();
		}.bind(this);

		// do a foursqaure query of specific categories
		this.queryList = function () {

			// get location with query param
			listviewModel.getLocations();

			// load markers after 500 ms because of lazyloading;
			window.setTimeout(function () {
				mapviewModel.setMarkers();
			}, 500);
		}.bind(this);

		// new search city
		this.newCity = function () {

			// clear observableArray
			listviewModel.listOfLocations.removeAll();

			// load map and list
			self.loadMap();
		}.bind(this);

		// click item on the list
		this.gotoMarker = function (thisMarker) {

			// get the id of the location and get the corresponding marker from the array
			var i = thisMarker.id
			var marker = mapviewModel.markerArray[i]

			// open the infowindow
			google.maps.event.trigger(marker, 'click');
		}.bind(this);

	})();

	ko.applyBindings(MapViewModel)

} ());

