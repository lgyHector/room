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
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
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

/*-----------微信的应用-------------*/
app.get('/webChat', routes.webChatGet);
app.post('/webChat', routes.webChatPost);
app.get('/showDetail', routes.showDetail);
/*-----------奇怪的应用------------*/
app.get('/login', routes.login);
app.post('/logon', routes.logon);
app.get('/logout', routes.logout);
app.get('/room', routes.room);
/*-----------爬虫应用------------*/
app.get('/spider', routes.spider);	
app.post('/startSpider', routes.startSpider);
app.get('/clear', routes.clear);
app.post('/clear', routes.clear);
app.get('/closemysql', routes.closemysql);
/*-----------身份证图像------------*/
app.get('/idCards', routes.idCards);

//var io = require("socket.io").listen(server);
function start(){
	server.listen(8888);
	console.log("服务器启动..."+process.pid);
}
exports.start = start;

/***********************socket 服务*************************/
var socketMap = {};
var socketIdArr = {};

function socketStart(){
	io.sockets.on('connection', function(socket){
		console.log("连接 " + socket.id + " 建立.");
		
		socket.on('user_conn', function(user){
			socketMap[socket.id] = socket;
			socketIdArr[user.loginName] = socket.id;
			socket.emit('init_target', socketIdArr);
			socket.broadcast.emit('fresh_target', {conn:'on', loginName:user.loginName});//广播目标实体
		});
		socket.on('disconnect', function(){
			delete socketMap[socket.id];
			for(loginName in socketIdArr){
				if(socketIdArr[loginName] == socket.id){
					delete socketIdArr[loginName];
			        socket.broadcast.emit('fresh_target', {conn:'off', loginName:loginName});//广播目标实体
				}
				
			}
	        console.log("连接 " + socket.id + " 终止.");
	    });
		socket.on('tweet_msg', function(from){
			if(from.msg != ''){
				socket.broadcast.emit('launch_tween', from);
			}
			
		});
			
	
		/*socket.on('user_msg', function(from){
			//logger.debug("收到 "+from.from+" 的消息: "+from.msg);
			socket.emit('user_msg', from);
			//logger.debug(from.target != '');
			if(from.target == ''){
				socket.broadcast.emit('show_msg', from);
			}else{
				socketMap[from.target].emit('p2p_msg', from);
			}
		});*/
	});
}

exports.socketStart = socketStart;
