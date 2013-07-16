var http = require('http'); 
var mysql = require('node-mysql-sexy-query-master');

var database = {
	"mysql-5.1" : [ {
		"name" : "lgy",
		"label" : "mysql-5.1",
		"plan" : "free",
		"tags" : [ "mysql", "mysql-5.1", "relational", "mysql-5.1", "mysql" ],
		"credentials" : {
			"name" : "d6939725959874f539be37f281625551d",
			"hostname" : "us01-user01.crtks9njytxu.us-east-1.rds.amazonaws.com",
			"host" : "us01-user01.crtks9njytxu.us-east-1.rds.amazonaws.com",
			"port" : 3306,
			"user" : "u09lnrZRAmBDe",
			"username" : "u09lnrZRAmBDe",
			"password" : "pPFlNo8gWlLLy"
		}
	} ]
}
	//var database = JSON.pares(process.env.VCAP_SERVICES);
	mysql.createClient({
		host : database['mysql-5.1'][0]['credentials']['hostname'],
		user : database['mysql-5.1'][0]['credentials']['user'],
		password : database['mysql-5.1'][0]['credentials']['password'],
		database : database['mysql-5.1'][0]['credentials']['name']
	});

var server = http.createServer(function(request, response){ 
	
	/*mysql.use('t_user').add({
		'name' : '小二',
		'age' : 27,
		'comment' : '我是小二...'
	}, function(id){
		console.log('id='+id);
	});*/
	mysql.use('t_user').where('id = ?', 4)
	.get(function(row){
		if(row){
			console.log('name = '+row.name);
			mysql.close();
			response.writeHead(200, {"Content-Type": "text/html;charset:utf-8"});
		    response.end("<html><head><meta http-equiv='content-type' content='text/html; charset=UTF-8' /></head><body>Hello AppFog 嘎嘎! name= "+row.name+"</body></html>"); 
		}
	});
}); 
server.listen(8888);

