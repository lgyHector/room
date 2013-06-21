var app = require('./app');
var Logger = require('./models/Logger');
	
process.on('uncaughtException', function(err){
	Logger.error(err);
});


app.start();
//app.socketStart();