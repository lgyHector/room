var Article = require("../models/Article");
/**
 * 图文消息实体
 */
function PicText(pt){
	this.toUserName = pt.toUserName;
	this.fromUserName = pt.fromUserName;
	this.createTime = pt.createTime;
	this.msgType = pt.msgType;
	this.articleCount = pt.articleCount;
}
module.exports = PicText;
/**
 * 根据用户名、密码获得用户
 * @user 用户参数
 */
PicText.createXml = function (postMsg, callback){
	
	Article.getArticles({area:postMsg.content}, function(articles){
		var xml = '';
		if(articles.length > 0){
			xml = "<xml>";
			xml += "<ToUserName>"+postMsg.fromUserName+"</ToUserName>";
			xml += "<FromUserName>"+postMsg.toUserName+"</FromUserName>";
			xml += "<CreateTime>"+new Date().getTime()+"</CreateTime>";
			xml += "<MsgType>news</MsgType>";
			xml += "<ArticleCount>"+articles.length+"</ArticleCount>";
			xml += "<Articles>";
			for(var i=0 ;i<articles.length;i++){
				xml += "<item>";
				xml += "<Title>"+articles[i].title+"</Title>";
				xml += "<Description>"+articles[i].title+"</Description>";
				xml += "<PicUrl>http://www.sulai24.com/upload/enterprice_zg/"+articles[i].picUrl+"</PicUrl>";
				xml += "<Url>http://42.121.97.131:8888/showDetail?uid="+articles[i].url+"</Url>";
				xml += "</item>";
			}
			xml += "</Articles>";
			xml += "<FuncFlag>1</FuncFlag>";
			xml += "</xml>";
		}
		//console.log(xml);
		callback(xml);
	});
		
}
/**
 * 返回3个招工信息
 */
PicText.get3Articles = function (postMsg, callback){
	var xml='';
	Article.get3Articles(3, function(articles){
		if(articles.length > 0){
			xml = "<xml>";
			xml += "<ToUserName>"+postMsg.fromUserName+"</ToUserName>";
			xml += "<FromUserName>"+postMsg.toUserName+"</FromUserName>";
			xml += "<CreateTime>"+new Date().getTime()+"</CreateTime>";
			xml += "<MsgType>news</MsgType>";
			xml += "<ArticleCount>"+articles.length+"</ArticleCount>";
			xml += "<Articles>";
			for(var i=0 ;i<articles.length;i++){
				xml += "<item>";
				xml += "<Title>"+articles[i].title+"</Title>";
				xml += "<Description>"+articles[i].title+"</Description>";
				xml += "<PicUrl>http://www.sulai24.com/upload/enterprice_zg/"+articles[i].picUrl+"</PicUrl>";
				xml += "<Url>http://42.121.97.131:8888/showDetail?uid="+articles[i].url+"</Url>";
				xml += "</item>";
			}
			xml += "</Articles>";
			xml += "<FuncFlag>1</FuncFlag>";
			xml += "</xml>";
		}
		callback(xml);
	});
}

