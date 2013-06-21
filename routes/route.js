var User = require("../models/User");
var PicText = require("../models/PicText");
var Article = require("../models/Article");
var PostMsg = require("../models/PostMsg");
var Text = require("../models/Text");
var Logger = require('../models/Logger');
var DOMParser = require('xmldom').DOMParser;


exports.webChatGet = function(req, res){
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	Logger.debug("signature="+signature);
	Logger.debug("timestamp="+timestamp);
	Logger.debug("nonce="+nonce);
	Logger.debug("echostr="+echostr);
	res.send(echostr);
}
exports.webChatPost = function(req, res){
	Logger.debug("客户消息: "+req.body.xml);
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

exports.spider = function(req, res){
	res.render('spider', {title:'Spider'});
}

var Spider = require("../models/Spider");

exports.startSpider = function(req, res){
	var mainUrl = req.body.mainUrl;
	var cateUrl = req.body.cateUrl;
	var pageNum = req.body.pageNum;
	var cron = req.body.cron;
	var supervene = req.body.supervene;
	var sleep = req.body.sleep;
	var opt = {
			mainUrl : req.body.mainUrl,
			pageNum : req.body.pageNum,
			cateUrl : req.body.cateUrl,
			cron : req.body.cron,
			supervene : req.body.supervene,
			sleep : req.body.sleep
	};
	Spider.startSpider(opt);
	
	res.render('spider', {title:'Spider', model:opt});
}
