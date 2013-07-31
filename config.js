//var database = JSON.parse(process.env.VCAP_SERVICES);
//var sitehost = process.env.SITE_HOST;
exports.config = {
		//数据库
		db_opt : {
			host : 'localhost',
			user : 'root',
			password : 'root',
			database : 'sulai-new'
		},
		//地址
		site_host : 'http://www.sulai24.com',
		//site_host : sitehost,
		site_port : '8888'
		
};