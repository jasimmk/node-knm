window.ActiveDayView = Backbone.View.extend({

    initialize: function () {		
        this.render()		
    },

    render: function () {
		var self=this;
		$.getJSON('/activeday',function(data){
			$(self.el).html(self.template(_.extend({},{'days':app.days[0],activeday:data})));
		})
        return this;
    },

    events: {
        "click .save"   : "beforeSave",
    },
    beforeSave: function () {
		$.post('/activeday',{day:$('#day').val()},function(data){
			if (data==true){
				utils.showAlert('Success!', 'Active Day Changed successfully', 'alert-success');
			}
			else{
				utils.showAlert('Fail!', 'Active Day Change failed', 'alert-warning');
			}

		}).error(function(data){
			utils.showAlert('Fail!', 'Active Day Change failed', 'alert-warning');
		});
    },


});