var mysql = require('node-mysql-sexy-query-master');
	mysql.createClient({
		host : 'localhost',
		user : 'root',
		password : 'sqs',//root
		database : 'sulai_new_2' //sulai-new
	});
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
Info.del = function(status){
	mysql.use('info').where('status = ?', status)
					.delete(function(affectedRows){
						if(affectedRows == 0){
							console.log("没有数据可以删除");
						}else{
							console.log("删除成功");
						}
						mysql.close();
					});
}

