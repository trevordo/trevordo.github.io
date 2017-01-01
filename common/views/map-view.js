(function () {

	// This is from the TODOmvc examples
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


	var MapViewModel = (function(){
	    var self = this;
        // call MapModel method
		this.mapviewModel =  new myApp.myModels.mapviewModel(),
		this.listviewModel = new myApp.myModels.listviewModel();

        // visibility options
        this.showMap = ko.observable(false);
        this.hideStart = ko.observable(true);

        this.toggleMapVisibility = function() {
            //var l = this.inputcity().trim();
            //if (l) {
            self.showMap(!self.showMap());
            self.hideStart(!self.hideStart());
			listviewModel.getLocations();
            //}
        }.bind(this);

		this.submitToGetList = function() {
			// another method
		}.bind(this);
		
	})();

	ko.applyBindings(MapViewModel)

}());

