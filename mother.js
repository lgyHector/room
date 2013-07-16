start();
function start(){
	console.log('守护进程运行中...');
	var ls = require('child_process').spawn('node', ['index.js']);
	ls.stdout.on('data', function(data){
		console.log(data.toString());
	});
	ls.stderr.on('data', function(data){
		console.log(data.toString());
	});
	ls.on('exit', function(code){
		console.log('子进程退出 代码:'+code);
		delete(ls);
		setTimeout(start, 5000);
	});
}