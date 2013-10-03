
window.Program = Backbone.Model.extend({

    urlRoot: "/programs",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter Speaker Name"};
        };
		
        this.validators.day = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Day"};
        };		
        this.validators.venue = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Venue"};
        };	
        this.validators.psession = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Session"};
        };		
        this.validators.subject = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Subject"};
        };		
        this.validators.rank = function (value) {
			if ($.isNumeric(value) && value.length >0){
				return {isValid: true}
			}
			else{
				return {isValid: false, message: "You must select a valid Rank"};
			}
        };			
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },
	
    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
	
    defaults: {
        _id: null,
        name: "",
        venue: "",
        day: "",
        psession: "",
        rank: "10",
        subject: "",
        name: ""
    }
	
});

window.ProgramCollection = Backbone.Collection.extend({

    model: Program,

    url: "/programs"

});
window.Psession = Backbone.Model.extend({

    urlRoot: "/psessions",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Session Name"};
        };
        this.validators.day = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Day"};
        };		
        this.validators.venue = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must select a Venue"};
        };		
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        day: "",
        venue: "",
    }
});

window.PsessionCollection = Backbone.Collection.extend({

    model: Psession,
    url: "/psessions"

});

window.Days = Backbone.Model.extend({

    urlRoot: "/days",
    idAttribute: "_id",
});

window.DaysCollection = Backbone.Collection.extend({

    model: Days,
    url: "/days"

});
window.Venues = Backbone.Model.extend({

    urlRoot: "/venues",
    idAttribute: "_id",
});

window.VenuesCollection = Backbone.Collection.extend({

    model: Venues,
    url: "/venues"

});
