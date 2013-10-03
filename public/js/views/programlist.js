window.ProgramListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },
	
    events: {
        //"change"        : "change",
        "click .livebutton"   : "liveButton",
        "click .breakbutton" : "breakButton"
    },
	liveButton: function(event){
		var target = event.target;
		var id = $(target).attr('id').split('_')[1];
		
		$.post('/liveprogram',{id:id,'live':1},function(data){
			utils.showAlert('Success!', 'Live changed', 'alert-success');
		}).error(function(data){
			utils.showAlert('Warning!', 'Failed', 'alert-warning');
		});
	},
	breakButton: function(event){
		var target = event.target;
		var id = $(target).attr('id').split('_')[1];
		
		$.post('/liveprogram',{id:id,'live':0},function(data){
			utils.showAlert('Success!', 'Breaked Event', 'alert-success');
		}).error(function(data){
			utils.showAlert('Warning!', 'Failed', 'alert-warning');
		});
	},
    render: function () {
        var programs = this.model.models;
		var psessions = this.options.psessions[0]
		
        var len = programs.length;
        var startPos = (this.options.page - 1) * 50;
        var endPos = Math.min(startPos + 50, len);

        $(this.el).html('<table class="table table-stripped"></table>');

        for (var i = startPos; i < endPos; i++) {
            $('.table', this.el).append(new ProgramListItemView({model: programs[i],psession:psessions}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.ProgramListItemView = Backbone.View.extend({

    tagName: "tr",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
		var days = app.days[0];
		var venues = app.venues[0];
		var psessions = this.options.psession;
		var self=this;
		//console.log(self.model);
		
		var iDay = {id:self.model.attributes['day'],name:_.find(days,function(day){return day._id==self.model.attributes['day']}).name};
		var iVenue = {id:self.model.attributes['venue'],name:_.find(venues,function(venue){return venue._id==self.model.attributes['venue']}).name};
		var iPsession = {id:self.model.attributes['psession'],name:_.find(psessions,function(psession){return psession._id==self.model.attributes['psession']}).name};
		//console.log(iDay);
		//console.log(iVenue);
		
        $(this.el).html(this.template(_.extend({},this.model.toJSON(),{iDay:iDay,iVenue:iVenue,iPsession:iPsession})));
		//$(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});