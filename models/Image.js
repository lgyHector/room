var mysql = require('node-mysql-sexy-query-master');
var request = require('request');
var fs = require('fs');
var dateformat = require('dateformat');
var config = require('../config').config;
	mysql.createClient(config.db_opt);
/**
 * 图片消息
 */
function Image(img){
	this.toUserName = img.toUserName;
	this.fromUserName = img.fromUserName;
	this.createTime = img.createTime;
	this.msgType = img.msgType;
	this.picUrl = img.picUrl;
}
module.exports = Image;

Image.save = function(img, callback){
	mysql.use('wei_user').where('AUTHOR = ?', img.fromUserName)
	.get(function(row){
		if(row){
			var filename = img.picUrl.split('/')[4];
			mysql.use('idcard_img').add({
				'PICURL' : filename,
				'USER_ID' : row.USER_ID,
				'DEL' : false,
				'TIME' : dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
				'AUTHOR' : img.fromUserName,
				'URL' : img.picUrl
			}, function(id){
				mysql.close();
				callback(id, filename);
			});
		}else{
			//插入wei_user
			mysql.close();
			callback(false);
		}
	});
	
	
	
}

Image.saveWeiUser = function(postMsg, callback){
	var loginname = postMsg.content.split(':')[1];
	mysql.use('user').where('LOGIN_NAME = ?', loginname)
	.get(function(row){
		if(row){
			mysql.use('wei_user')
			//.where('USER_ID = ?', row.ID)
			.where('AUTHOR = ?', postMsg.fromUserName)
			.get(function(user){
				if(user){
					mysql.close();
					callback(-1);//已经开通服务了
				}else{
					mysql.use('wei_user').add({
						'AUTHOR' : postMsg.fromUserName,
						'USER_ID' : row.ID
					}, function(id){
						mysql.close();
						callback(id);//完成开通
					});
				}
			});
		}else{//系统中无此账号
			mysql.close();
			callback(row);
		}
	});
}

Image.getIdCards = function(param, callback){
	mysql.use('idcard_img').where('time between ? and ?', param.begin, param.end)
	.where('author = ?', param.author)
	.page(param.pageNo, 15)
	.query(function(rows, pageInfo){
		mysql.close();
		callback(rows, pageInfo);
	});
}