var mysql = require('node-mysql-sexy-query-master');
var dateformat = require('dateformat');
var fs = require("fs");

	mysql.createClient({
		host : 'localhost',
		user : 'root',
		password : 'sqs',
		database : 'nodejs'
	});
/**
 * 记录实体
 */
function Record(vo){
	this.id = vo.id;
	this.name = vo.name;
	this.cellphone = vo.cellphone;
	this.email = vo.email;
	this.comment = vo.comment;
	this.status = vo.status;
	this.time = dateformat(vo.time, 'yyyy-mm-dd h:MM:ss');
}
module.exports = Record;
/**
 * 根据用户名、密码获得用户
 * @user 用户参数
 */
Record.prototype.page = function (record, pageModel, callback){
	mysql.use('record').where('status = ?', record.status)
					.select('*')
					.page(pageModel.pageNo, pageModel.pageSize)
					.query(function(rows, pageInfo){
						callback(rows, pageInfo);
					});
}

