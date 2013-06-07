var DOMParser = require('xmldom').DOMParser;
/**
 * 用户消息
 */
function PostMsg(msg){
	//解析xml：xml
	//TODO: xmldom 的使用细节需要推敲一下
	var doc = new DOMParser().parseFromString(msg);
	var toUserName = doc.documentElement.getElementsByTagName('ToUserName');
	var fromUserName = doc.documentElement.getElementsByTagName('FromUserName');
	var createTime = doc.documentElement.getElementsByTagName('CreateTime');
	var msgType = doc.documentElement.getElementsByTagName('MsgType');
	var content = doc.documentElement.getElementsByTagName('Content');
	
	this.toUserName = toUserName[0].firstChild.data;
	this.fromUserName = fromUserName[0].firstChild.data;
	this.createTime = createTime[0].firstChild.data;
	this.msgType = msgType[0].firstChild.data;
	this.content = content[0].firstChild.data;
}
module.exports = PostMsg;


