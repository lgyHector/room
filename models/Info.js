var Spider = require('../models/Spider'); 
var EventProxy = require('eventproxy');
var mysql = require('node-mysql-sexy-query-master');
var config = require('../config').config;
	mysql.createClient(config.db_opt);
/**
 * 信息实体
 */
function Info(info){
	this.time = info.time;
	this.title = info.title;
	this.posinfo = info.posinfo;
	this.company = info.company;
	this.gongsiInfo = info.gongsiInfo;
	this.number = info.number;
	this.cate = info.cate; 
}

module.exports = Info;

/**
 * 保存数据
 */
Info.prototype.save = function(callback){
	var info = this;
	mysql.use("info_company").where('name = ?', info.company)
							.get(function(row){
								var comid;
								if(row){
									comid = row.id;
								}else{
									mysql.use('info_company').add({'name' : info.company}, function(id){
										comid = id;
									})
								}
								mysql.use("info").where('title = ?', info.title)
												.where('cate = ?', info.cate)
												.where('company = ?', info.company)
												.count(function(count){
													if(count == 0){
														mysql.use("info").add({
															'title' : info.title,
															'time' : info.time,
															'posinfo' : info.posinfo,
															'company' : info.company,
															'gongsiInfo' : info.gongsiInfo,
															'number' : info.number,
															'cate' : info.cate,
															'info_company_id' : comid
														}, function(id){
															if(false == id)
																console.log("添加失败");
															//console.log("保存id :"+id); 
															//callback(null, id);
														});
													}
												});
							});

}
/**
 * 删除数据
 */
Info.del = function(condition, callback){
	mysql.use('info').where('time between ? and ?', condition.begint, condition.endt)
					 .delete(function(affectedRows){
						if(affectedRows == 0){
							console.log("没有数据可以删除");
						}else{
							console.log("删除成功");
							callback();
						}
						mysql.close();
					});
}

var ep = new EventProxy();
/**
 * 根据时间范围、类别统计数量
 */
Info.queryByTimeCate = function(condition, callback){
	ep.after('getCounts', Spider.default_cates.length, function(list){
		callback(list);
	});
	for(var i=0; i<Spider.default_cates.length; i++){
		(function(index){
			mysql.use('info').where('time between ? and ?', condition.begint, condition.endt)
							.where('cate = ?', Spider.default_cates[index].key)
							.count(function(count){
								mysql.close();// ???
								ep.emit('getCounts', {name:Spider.default_cates[index].name, num: count});
							});
		})(i);
	}
}

Info.getTotalCount = function(callback){
	if(mysql){
		console.log("mysql");
		mysql.close();
	}else{
		console.log("no mysql");
	}
}