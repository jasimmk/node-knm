var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    program = require('./routes/programs');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser())
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app);
/*
io = io.listen(server);


io.configure(function () {
    io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });
});

*/
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var userauth = express.basicAuth(function(user, pass) {     
   return (user == "user" && pass == "admin123") ? true : false;
},'Super duper secret area');

var superauth = express.basicAuth(function(user, pass) {     
   return (user == "root" && pass == "athlon123") ? true : false;
},'Super duper secret area');

app.get('/', userauth, function(req, res){
  console.log("hi");
  res.render('index2', {
    title: 'Express'
  });
});
app.get('/programs', program.programAll);

app.get('/programs/:id', program.programById);
app.get('/programs/:day/:venue', program.programByDayVenue);
app.post('/programs', program.addProgram);
app.put('/programs/:id', program.updateProgram);
app.delete('/programs/:id', program.deleteProgram);


app.get('/activeday', program.activeDay);
app.post('/activeday', program.addActiveDay);

app.post('/liveprogram', program.liveSet);


app.get('/psessions', program.psessionAll);
app.get('/psessions/:id', program.psessionById);
app.post('/psessions', program.addPsession);
app.put('/psessions/:id', program.updatePsession);
app.delete('/psessions/:id', program.deletePsession);

/* Misc */
app.get('/days', program.daysAll);
app.get('/venues', program.venuesAll);

/*
io.sockets.on('connection', function (socket) {

    socket.on('message', function (message) {
        console.log("Got message: " + message);
        ip = socket.handshake.address.address;
        url = message;
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });

});
*/