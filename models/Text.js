/**
 * 文字消息
 */
function Text(txt){
	this.toUserName = txt.toUserName;
	this.FromUserName = txt.fromUserName;
	this.createTime = txt.createTime;
	this.msgType = 'text';
	this.content = txt.content;
	this.funcFlag = 0;
}
module.exports = Text;

Text.createXml = function(postMsg, content){
	var xml = "<xml>";
		xml += "<ToUserName><![CDATA["+postMsg.fromUserName+"]]></ToUserName>";
		xml += "<FromUserName><![CDATA["+postMsg.toUserName+"]]></FromUserName>";
		xml += "<CreateTime>"+new Date().getTime()+"</CreateTime>";
		xml += "<MsgType><![CDATA[text]]></MsgType>";
		xml += "<Content><![CDATA["+content+"]]></Content>";
		xml += "<FuncFlag>0</FuncFlag>";
		xml += "</xml>";
	return xml;
}


