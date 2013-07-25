var mysql = require('node-mysql-sexy-query-master');
var fs = require("fs");
	mysql.createClient({
		host : 'localhost',
		user : 'root',
		password : 'sqs',
		database : 'nodejs'
	});
/**
 * 用户实体
 */
function User(user){
	this.id = user.id;
	this.name = user.name;
	this.pass = user.pass;
}
module.exports = User;
/**
 * 根据用户名、密码获得用户
 * @user 用户参数
 */
User.prototype.get = function (user, res, req, callback){
	var sql = mysql.use('user').where('name = ?' , user.name)
	.where('pass = ?',user.pass)
	.select('*').sql();
	mysql.use('user').where('name = ?' , user.name)
					//.where('pass = ?',user.pass)
					.select('*')
					.get(function(rows){
						console.log(rows);
						callback(rows);
					});
}
/**
 * 保存用户
 * @user 用户参数
 */
User.prototype.save = function (user, res, req, callback){
	mysql.use('user').add({name:user.name, pass:user.pass},function(id){
		callback(id);
	});
}

