var express = require('express'),
    path = require('path'),
    http = require('http'),
    program = require('./routes/programs');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/programs', program.findAll);
app.get('/programs/:id', program.findById);
app.post('/programs', program.addProgram);
app.put('/programs/:id', program.updateProgram);
app.delete('/programs/:id', program.deleteProgram);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
