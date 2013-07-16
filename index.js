var app = require('./app');
var Logger = require('./models/Logger');
	
/*process.on('uncaughtException', function(err){
	Logger.error('UnCaughtException:'+err);
});
*/

app.start();
//app.socketStart();