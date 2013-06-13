var mysql = require('node-mysql-sexy-query-master');
var fs = require("fs");
	mysql.createClient({
		host : 'localhost',
		user : 'root',
		password : 'sqs',//root
		database : 'sulai_new_2' //sulai-new
	});
/**
 * 图文内容实体
 */
function Article(art){
	this.title = art.title;
	this.description = art.description;
	this.picUrl = art.picUrl;
	this.url = art.url;
}
module.exports = Article;

/**
 * 查询
 * @condition 条件参数
 */
Article.getArticles = function(condition, callback){
	mysql.use('requirement_info').where('image != ?' , 'NULL')
					.where('worklocation like ?','%'+condition.area+'%')
					.select('*')
					.get(10, function(rows){
						var arr = new Array();
						for(var i=0 ;i<rows.length ;i++){
							arr.push(new Article({title:rows[i].TITLE, picUrl:rows[i].IMAGE, url:rows[i].UUID}));
						}
						callback(arr);
					});
}
/**
 * 详细内容链接
 * @uid uuid
 */
Article.getArticleDetail = function(uid, callback){
	mysql.use('requirement_info').where('uuid = ?', uid)
								.get(function(row){
									callback(row);
								});
}


