var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  	: "home",
		"actday"				: "actdayView",
        "programs"				: "programList",
        "programs/page/:page"	: "programList",
        "programs/add"         	: "addPrograms",//"addWine",
        "programs/:id"         	: "programsDetails",//"wineDetails",
		
        "psessions"				: "psessionList",
        "psessions/page/:page"	: "psessionList",
        "psessions/add"         : "addPsession",
        "psessions/:id"         : "psessionDetails",		
        "about"             	: "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
		
		utils.hideAlert();
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	programList: function(page) {
		utils.hideAlert();
		var psessionList = new PsessionCollection();
        var p = page ? parseInt(page, 10) : 1;
        var programList = new ProgramCollection();
        $.when(programList.fetch(),psessionList.fetch()).done(function(a,b){
            $("#content").html(new ProgramListView({model: programList,psessions:b, page: p}).el);
        });
        this.headerView.selectMenuItem('home-menu');
    },

    programDetails: function (id) {
		utils.hideAlert();
        var program = new Program({_id: id});
        program.fetch({success: function(){
            $("#content").html(new ProgramView({model: program}).el);
        }});
        this.headerView.selectMenuItem();
    },
	actdayView:function (id) {
		//console.log("HI actDay");
		utils.hideAlert();
		
        $("#content").html(new ActiveDayView().el);
        
        this.headerView.selectMenuItem();
    },
	addPrograms: function() {
		utils.hideAlert();
        var program = new Program();
        $('#content').html(new ProgramView({model: program}).el);
		console.log('Add Programs');
        this.headerView.selectMenuItem('add-menu');
	},
	
	psessionList: function(page) {
		utils.hideAlert();
        var p = page ? parseInt(page, 10) : 1;
        var psessionList = new PsessionCollection();
	
        $.when(psessionList.fetch()).done(function(psessionListVar){
            $("#content").html(new PsessionListView({model: psessionList, page: p}).el);
        });
        this.headerView.selectMenuItem('home-menu');
    },

    psessionDetails: function (id) {
		utils.hideAlert();
        var psession = new Psession({_id: id});
		$.when(psession.fetch()).done(function(pSession){
			$('#content').html(new PsessionView({model: psession}).el);
		}).then(function(){/*success*/
		},function(){
			utils.showAlert('Error!', 'Error loading Data', 'alert-error');
		});
		
        this.headerView.selectMenuItem();
    },

	addPsession: function() {
		utils.hideAlert();
        var psession = new Psession();
		//console.log('psession');
		$('#content').html(new PsessionView({model: psession}).el);

        this.headerView.selectMenuItem('add-menu');
	},	

    about: function () {
		utils.hideAlert();
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView','ActiveDayView', 'PsessionView', 'PsessionListItemView','ProgramView','ProgramListItemView', 'AboutView',], function() {
	var days = new Days();
	var venues = new Venues();
	$.when(days.fetch(),venues.fetch()).done(function(dRes,vRes){
		app = new AppRouter();
		app.days = dRes;
		app.venues = vRes;		
		Backbone.history.start();
	}).then(function(){/*success*/
	},function(){
		utils.showAlert('Error!', 'Error loading Data', 'alert-error');
	});
    

});