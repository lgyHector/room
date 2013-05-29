
var express = require('express')
  , routes = require('./routes/route')
  , flash = require('connect-flash')
  , http = require('http')
  , ejs = require('ejs');

var app = express();
var server = http.createServer(app);

//pp.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); 
app.use(express.cookieSession({secret : 'lgyCookies'}));
app.use(express.session({ secret : 'lgySession' }));
// 使用flash插件
app.use(flash());
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  /*var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';*/
  next();
});
app.use(app.router);
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));

// 开发模式
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/login', routes.login);
//app.get('/logout', routes.logout);
//app.post('/logon', routes.logon);
//app.get('/home', routes.home);
app.get('/room', routes.room);

var io = require("socket.io").listen(server);
function start(){
	server.listen(8888);
	console.log("服务器启动...");
}
exports.start = start;

/***********************socket 服务*************************/
var socketMap = {};
var socketIdArr = {};

function socketStart(){
	io.sockets.on('connection', function(socket){
		console.log("连接 " + socket.id + " 建立.");
		socket.on('user_conn', function(user){
			//logger.debug(user +"==="+socket.id);
			socketMap[socket.id] = socket;
			socketIdArr[user] = socket.id;
			socket.emit('user_conn', socketIdArr);
			socket.broadcast.emit('fresh_users', socketIdArr);
		});
		socket.on('disconnect', function(){
			delete socketMap[socket.id];
			for(obj in socketIdArr){
				if(socketIdArr[obj] == socket.id)
					delete socketIdArr[obj];
			}
	        console.log("连接 " + socket.id + " 终止.");
	    });
		socket.on('user_msg', function(from){
			//logger.debug("收到 "+from.from+" 的消息: "+from.msg);
			socket.emit('user_msg', from);
			//logger.debug(from.target != '');
			if(from.target == ''){
				socket.broadcast.emit('show_msg', from);
			}else{
				socketMap[from.target].emit('p2p_msg', from);
			}
		});
	});
}

exports.socketStart = socketStart;