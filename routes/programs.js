var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('knmdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'knmdb' database");
        db.collection('days', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'days' collection doesn't exist. Creating it with sample data...");
                populateDays();
            }
        });
        db.collection('venues', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'venues' collection doesn't exist. Creating it with sample data...");
                populateVenues();
            }
        });
		/*
        db.collection('psessions', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'psession' collection doesn't exist. Creating it with sample data...");
                populatePsessions();
            }
        });	
        db.collection('programs', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'Programs' collection doesn't exist. Creating it with sample data...");
                populatePrograms();
            }
        });	
		*/
    }
});

exports.programById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving Program: ' + id);
    db.collection('programs', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.activeDay = function(req, res) {
    db.collection('days', function(err, collection) {
        collection.find({live:true},{'_id':1}).toArray(function(err, items) {
			if (items){
				res.send(items);
			}else{
				res.send(false);
			}
        });
    });
};
exports.addActiveDay = function(req, res) {
	var day = req.body.day;
	if (day){
		db.collection('days', function(err, collection) {
			console.log('outputting');
			collection.update({},{$set:{live:false}},{w: 1, multi:true},function(err,noUpdated){
				console.log('updated');
				collection.update({'_id':new BSON.ObjectID(day)},{$set:{live:true}},{w: 1, multi:true},function(err, noTwoupdated) {
					console.log('upd live');
					res.send(true);
				});
			});
		});
	}else{
		res.send(false);
	}
};
exports.programAll = function(req, res) {
    db.collection('programs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.programByDayVenueSession = function(req, res) {
	var day = req.params.day;
	var venue = req.params.venue;
	var psession = req.params.psession;
	if (!day && !venue && !psession){
		db.collection('programs', function(err, collection) {
			collection.find().toArray(function(err, items) {
				res.send(items);
			});
		});
	}
	else if (day && !venue && !psession){
		db.collection('day', function(err, collection) {
			collection.findOne({'tag':day}).toArray(function(err, items) {
				res.send(items);
			});
		});
	}
};
exports.programByDayVenue = function(req, res) {
	var day = req.params.day;
	var venue = req.params.venue;
	console.log(day);
	console.log('day variable');
	if (day && venue){
		db.collection('psessions', function(err, collection) {
			collection.find({day:new BSON.ObjectID(day),venue:new BSON.ObjectID(venue)},{name:1}).toArray(function(err, items) {
				res.send(items);
			});
		});
	}
};
exports.addProgram = function(req, res) {
    var program = req.body;
    console.log('Adding program: ' + JSON.stringify(program));
    db.collection('programs', function(err, collection) {
        collection.insert(program, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
exports.liveSet = function(req, res) {
	var id = req.body.id;
	var live = req.body.live
	if (id && live==1){
		db.collection('programs', function(err, collection) {
			console.log('outputting');
			collection.update({},{$set:{live:false}},{w: 1, multi:true},function(err,noUpdated){
				console.log('updated');
				collection.update({'_id':new BSON.ObjectID(id)},{$set:{live:true}},{w: 1, multi:true},function(err, noTwoupdated) {
					console.log('upd live');
					res.send(true);
				});
			});
		});
		
	}
	else if(id && live==0){
		db.collection('programs', function(err, collection) {
			console.log('outputting');
			collection.update({},{$set:{live:false}},{w: 1, multi:true},function(err,noUpdated){
				console.log('updated');
				collection.update({'_id':new BSON.ObjectID(id)},{$set:{live:false}},{w: 1, multi:true},function(err, noTwoupdated) {
					console.log('upd live');
					res.send(true);
				});
			});
		});	
	}
	else{
		res.send(false);
	}
};

exports.updateProgram = function(req, res) {
    var id = req.params.id;
    var program = req.body;
    delete program._id;
    console.log('Updating Program: ' + id);
    console.log(JSON.stringify(program));
    db.collection('programs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, program, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating program: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(program);
            }
        });
    });
};

exports.deleteProgram = function(req, res) {
    var id = req.params.id;
    console.log('Deleting program: ' + id);
    db.collection('programs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*-------------------------------- Days & Venues ----------------------- */
exports.daysAll = function(req, res) {
    db.collection('days', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
exports.venuesAll = function(req, res) {
    db.collection('venues', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
/*---------------------------------psessionS ---------------------------------------------------------------*/
exports.psessionById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving psession: ' + id);
    db.collection('psessions', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.psessionAll = function(req, res) {
    db.collection('psessions', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addPsession = function(req, res) {
    var psession = req.body;
    console.log('Adding psession: ' + JSON.stringify(psession));
    db.collection('psessions', function(err, collection) {
        collection.insert(psession, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updatePsession = function(req, res) {
    var id = req.params.id;
    var psession = req.body;
	//console.log(psession.venue);
	psession.day = new BSON.ObjectID(psession.day);
	psession.venue = new BSON.ObjectID(psession.venue);
	//console.log(psession);
    delete psession._id;
    console.log('Updating psession: ' + id);
    console.log(JSON.stringify(psession));
    db.collection('psessions', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, psession, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating psession: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(psession);
            }
        });
    });
}

exports.deletePsession = function(req, res) {
    var id = req.params.id;
    console.log('Deleting psession: ' + id);
    db.collection('psessions', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDays = function() {
	var days =[
	{
		name: "Day 1",
		tag:  'day1',
		pr:1,
		date: new Date("2012",'12','27'),
		live:false
	},
	{
		name: "Day 2",
		tag:  'day2',
		pr:2,
		date:  new Date("2012",'12','28'),
		live:false
	},
	{
		name: "Day 3",
		tag:  'day3',
		pr:3,
		date:  new Date("2012",'12','29'),
		live:false
	},
	{
		name: "Day 4",
		tag:  'day4',
		pr:4,
		date:  new Date("2012",'12','30'),
		live:false
	}];
    db.collection('days', function(err, collection) {
        collection.insert(days, {safe:true}, function(err, result) {});
    });	
};
var populateVenues = function(){	
    var venues = [
    {
        name: "VENUE 1",
		tag:'venue1',
        live: false,
		pr:1,
		status: false
    },
    {
        name: "VENUE 2",
		tag:'venue2',
        live: false,
		pr:2,
		status: false
    }, 
     {
        name: "VENUE 3",
		tag:'venue3',
        live: false,
		pr:3,
		status: false
    },
    {
        name: "VENUE 4",
		tag:'venue4',
        live: false,
		pr:4,
		status: false
    },
    {
        name: "VENUE 5",
		tag:'venue5',
        live: false,
		pr:5,
		status: false
    },
    {
        name: "VENUE 6",
		tag:'venue6',
        live: false,
		status: false
    },
    {
        name: "VENUE 7",
		tag:'venue7',
        live: false,
		status: false
    }];
	

    db.collection('venues', function(err, collection) {
        collection.insert(venues, {safe:true}, function(err, result) {});
    });

};
/*
var populatePsessions = function(){	
    var psessions = [
    {
        name: "Renaissance Conference",
        live: false,

    },
    {
        name: "Ladies Conference",
        live: false,
    }, 
    {
        name: "Students Conference",
        live: false,
    },

    }];

    db.collection('psessions', function(err, collection) {
        collection.insert(psessions, {safe:true}, function(err, result) {});
    });

};

var populatePrograms = function(){	
    var programs = [
    {
        name: "Inaguration",
        live: false,
		speaker:"Luise Bullock",
		priority:10
    },
    {
        name: "Welcome",
        live: false,
		speaker:"Anas Moulavi",
		priority:5
    }, 
    {
        name: "Presedium",
        live: false,
		speaker:"MM Akbar",
		priority:20
    },

    }];

    db.collection('programs', function(err, collection) {
        collection.insert(programs, {safe:true}, function(err, result) {});
    });

};
*/