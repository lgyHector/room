var mysql = require('node-mysql-sexy-query-master');
var config = require('../config').config;
var fs = require("fs");
var uuid = require('uuid');
	mysql.createClient(config.db_opt);
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
/**
 * 创建职介账户
 * @user 用户参数
 */
User.createSupplier = function (user, callback){
	
	mysql.use('user').where('LOGIN_NAME = ?', user.cellphone)
	.get(function(row){
		if(row){
			mysql.close();
			callback(-1);
		}else{
			var user_id, org_id;
			mysql.use('user').add({//user
				'UUID' : uuid.v1(),
				'AVAILABLE' : false,
				'CELLPHONE' : user.cellphone,
				'GENDER' : 'SIR',
				'LOGIN_NAME' : user.cellphone,
				'NAME' : user.name,
				'PASSWORD' : '46f94c8de14fb36680850768ff1b7f2a',
				'REG_TIME' : user.registTime,
				'USER_ROLE' : 'ORG_SUPPLIER'
			}, function(id){
				user_id = id;
				mysql.use('organization').add({//organization
					'UUID' : uuid.v1(),
					'ORG_NAME' : user.name,
					'ORG_TYPE' : 'SELF_EMPLOYED',
					'VISIBLE' : false
				}, function(id){
					org_id = id;
					mysql.use('org_users').add({
						'USER_ID' : user_id,
						'ORG_ID' : org_id
					}, function(id){
						mysql.close();
						callback(1);
					});
				});
			});
		}
	});
}

