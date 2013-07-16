var User = require("../models/User");
var PicText = require("../models/PicText");
var Article = require("../models/Article");
var PostMsg = require("../models/PostMsg");
var Text = require("../models/Text");
var Logger = require('../models/Logger');
var Spider = require("../models/Spider");
var Info = require("../models/Info");
var Image = require("../models/Image");
var DOMParser = require('xmldom').DOMParser;
var request = require('request');
var fs = require("fs");

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
		if(postMsg.content != '' && postMsg.content.split(':')[0] == 'ktfw'){
			Image.saveWeiUser(postMsg, function(id){
				console.log(id);
				if(id){
					if(id == -1){
						res.send(Text.createXml(postMsg, '已经开通服务，勿要重复操作~'));
					}else{
						res.send(Text.createXml(postMsg, '成功开通身份证上传服务~'));
					}
				}else{
					res.send(Text.createXml(postMsg, '您还未在【速来网】系统中注册~'));
				}
			})
		}else{
			PicText.createXml(postMsg, function(resXml){
				if(resXml != ''){
					res.send(resXml);
				}else{
					res.send(Text.createXml(postMsg, '您好我是速来招工助手，回复【1】返回名企招工信息，【2】返回人力信息，或拨打010-57118484咨询用工信息，招工就上【速来网】www.sulai24.com'));
				}
			});
		}
	}else if(postMsg.msgType == 'image'){
		Logger.debug("图片:"+postMsg.picUrl);
		Image.save(postMsg, function(id, filename){
			if(id){
				//C:\Sulai\webapp\upload\idcard
				request(postMsg.picUrl).pipe(fs.createWriteStream('C://Sulai//webapp//upload//idcard//'+filename+'.jpg'))
				res.send(Text.createXml(postMsg, '保存完毕~'));
			}else{
				res.send(Text.createXml(postMsg, '您是未登记的非法用户，无权使用此功能!'));
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

exports.startSpider = function(req, res){
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

exports.clear = function(req, res){
	var begintime = req.body.begint;
	var endtime = req.body.endt;
	if(begintime){
		if(req.body.flag == 'del'){
			Info.del({begint:begintime+':01', endt:endtime+':01'}, function(){
				res.render('clear', {title:'清理', countArr:new Array(), begin:begintime, end:endtime});
			});
		}else{
			Info.queryByTimeCate({begint:begintime+':01', endt:endtime+':01'}, function(list){
				res.render('clear', {title:'清理', countArr:list, begin:begintime, end:endtime});
			});
		}
	}else{
		res.render('clear', {title:'清理', countArr:new Array(), begin:'', end:''});
	}
	
}

exports.closemysql = function(req, res){
	//C:\Sulai\webapp\upload\idcard
	request('http://mmsns.qpic.cn/mmsns/p6kDlZYdotNiarfduUIrEbpyaicbJnQVUjWkkiaHwB6DXnTTH1yclhMKA/0').pipe(fs.createWriteStream('D://0.jpg'))
}

exports.idCards = function(req, res){
	Image.getIdCards({begin:'2013-07-12 00:00:01', end:'2013-07-12 12:00:01', author:'oLV7Fjq-eznBVZz7RnskJJEun12s'}, function(rows, pageInfo){
		console.log(rows);
		console.log(pageInfo);
		res.render('clear', {title:'身份证', idcards:rows, begin:'2013-07-12 00:00:01', end:'2013-07-12 12:00:01'});
	})
}
