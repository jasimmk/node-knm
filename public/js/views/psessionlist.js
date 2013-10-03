window.PsessionListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var psessions = this.model.models;
        var len = psessions.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new PsessionListItemView({model: psessions[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.PsessionListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
		var days = app.days[0];
		var venues = app.venues[0];
		var self=this;
		//console.log(self.model);
		
		
		var iDay = {id:self.model.attributes['day'],name:_.find(days,function(day){return day._id==self.model.attributes['day']}).name};
		var iVenue = {id:self.model.attributes['venue'],name:_.find(venues,function(venue){return venue._id==self.model.attributes['venue']}).name};
		//console.log(iDay);
		//console.log(iVenue);
		
        $(this.el).html(this.template(_.extend({},this.model.toJSON(),{iDay:iDay,iVenue:iVenue})));
		//$(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});