var Info = require("../models/Info"),
 	async = require('async'),
 	request = require('request'),
 	cheerio = require('cheerio'),
 	cronJob = require('cron').CronJob,
 	dateformat = require('dateformat'),
 	utils = require('../utils/utils'),
 	Logger = require('../models/Logger'); 

var mainUrl, 
	pageNo, 
	cates, 
	cron, 
	supervene, 
	sleep;
	
exports.startSpider = function(opt){
		//参数初始化
		mainUrl = opt.mainUrl == ''?'bj.58.com' : opt.mainUrl;
		pageNo = opt.pageNum == ''?15 : opt.pageNum;
		cates = opt.cateUrl==''?['zpshengchankaifa','zpqiche','chaoshishangye','xiaofeipin','zpfangchanjianzhu','zpjixieyiqi','zpyiyuanyiliao'] : opt.cateUrl.split(',');
		cron = opt.cron==''?'00 10 08 * * 1-5' : opt.cron;//每天早8:10
		supervene = opt.supervene==''?1 : opt.supervene;
		sleep = opt.sleep==''?5000:opt.sleep;
		
		//定时器
		var job = new cronJob({
			cronTime:cron, //周1~5 晚上 22:10:00执行
			onTick :function(){
				Logger.debug("定时器执行..."); 
				async.series([
				       //
				       function(callback){
				    	   fetchListUrl(callback);
					   },
					    //
					    function(callback){
					    	Logger.debug("完成任务!");
					    	callback(null, 'OK');
					    } 
				], function(err, values){
					if(err)
						Logger.error(err.message);
				});
			},
			start:false
		});
		job.start();
		Logger.debug("任务开启");
}


function fetchListUrl(callback){
	 var urlArr = new Array();
	 var q = async.queue(function(task, callback) {
		 	console.log(task.name);
	        task.run(callback);
	 }, 1);
	    q.drain = function() {
	       Logger.debug("页面队列完成!");
	       callback(null, urlArr);// 主流程回调
	    }
    
    for(var c=0; c<cates.length; c++){
		 for(var i=1; i<=pageNo; i++){
			 (function(c, p){
			     q.push({name:'请求 '+cates[c]+' 第'+p+'页', run:function(callback){
			    	 (function(i){
			    		 setTimeout(function(){
							 request("http://"+mainUrl+"/"+cates[c]+"/pn"+i+"/", function (error, response, body) {
								 	  var arr = new Array();// 临时数组
									  if (!error && response.statusCode == 200) {
										    var $ = cheerio.load(body);
										    if($('#infolist').length > 0){
											    $('dl').each(function(){
											    	var title = utils.trim($(this).find('.t').html());//标题
											    	if(null != title){
											    		var info = new Info({
															time : dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'), 
															title : utils.trim(title),
															company : utils.trim($(this).find('h2').html()),//公司名称
															posinfo : utils.trim($(this).find('p').html()),//具体信息
															number : $(this).find('li:contains("招聘人数")').text(),//招工人数
															cate : cates[c]
														});
												    		info.save(callback);
											    	}
											    });
										    }else{
										    	Logger.debug("抓取失败..."+"http://"+mainUrl+"/"+cates[c]+"/pn"+i+"/");
										    }
									  }
									 callback(null, arr);
									}).on('error', function(e) {
									    Logger.error("发生错误: "+e.message);
									});
			    		 }, sleep);
					 })(p);
	
			     }}, function(err, results){
				    	 if(err)
				    	 	Logger.error(err.message);
				    	 for(var j=0; j<results.length; j++){
				    	 	urlArr.push(results[j]);
				    	 }
			     });
			 })(c, i);
		 }
    }
}