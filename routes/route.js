var User = require("../models/User");
var PicText = require("../models/PicText");
var Article = require("../models/Article");
var PostMsg = require("../models/PostMsg");
var Text = require("../models/Text");
var dateformat = require('dateformat');
var DOMParser = require('xmldom').DOMParser;
var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('./system.log'), 'system');
var logger = log4js.getLogger('system');//'system'
	logger.setLevel('DEBUG');


exports.webChatGet = function(req, res){
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	logger.debug("signature="+signature);
	logger.debug("timestamp="+timestamp);
	logger.debug("nonce="+nonce);
	logger.debug("echostr="+echostr);
	res.send(echostr);
}
exports.webChatPost = function(req, res){
	logger.debug("客户消息: "+req.body.xml);
	var postMsg = new PostMsg(req.body.xml);
	//用户的文字消息
	if(postMsg.msgType == 'text'){
		PicText.createXml(postMsg, function(resXml){
			if(resXml != ''){
				res.send(resXml);
			}else{
				res.send(Text.createXml(postMsg, '没有记录~'));
			}
		});
	}else{
		res.send(Text.createXml(postMsg, '再试试吧~'));
	}
	
}
exports.showDetail = function(req, res){
	//http://42.121.97.131:8888/showDetail?uid=asdfajkdgkasjdnfaksf
	var uid = req.query.uid;
	console.log(uid);
	Article.getArticleDetail(uid, function(row){
		res.render('showDetail', { title: 'Detail', info:row});
	});
}
/*------------------------------------------*/
exports.login = function(req, res){
	res.render('login', { title: '用户登陆'});
};

exports.logout = function(req, res){
	req.session.user=null;
	res.redirect('/login');
};

exports.logon = function(req, res){
	var name = req.body.name;
	var pass = req.body.password;
	console.log("Post 请求"+name+"==="+pass);
	var user = new User({name:name, pass:pass});
	user.get(user, req, res, function(rows){
		if(rows){
			req.session.user = rows;
			res.redirect('/room');
		}else{
			req.flash('message', '请登录!');
			res.redirect('/login');
		}
	});
}

exports.home = function(req, res){
	res.render('home', {title:'Home'});
}

exports.room = function(req, res){
	res.render('room', {title:'Room'});
}
/*exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.doLogin = function(req, res){
	var user={
		username:'admin',
		password:'admin'
	}

	if(req.body.username===user.username && req.body.password===user.password){
		req.session.user=user;
	    return res.redirect('/home');
	} else {
		req.session.error='用户名或密码不正确';
		return res.redirect('/login');
	}
	
};

exports.home = function(req, res){
  	res.render('home', { title: 'Home'});
};*/