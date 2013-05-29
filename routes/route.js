var User = require("../models/User");

exports.login = function(req, res){
	res.render('login', { title: '用户登陆'});
};

exports.logout = function(req, res){
	req.session.user=null;
	res.redirect('/login');
};

exports.logon = function(req, res){
	var name = req.body.name;
	var pass = req.body.password;
	console.log(name+"==="+pass);
	var user = new User({name:name, pass:pass});
	user.get(user, req, res, function(rows){
		if(rows){
			req.session.user = rows;
			res.redirect('/home');
		}else{
			req.flash('message', '请登录!');
			res.redirect('/login');
		}
	});
}

exports.home = function(req, res){
	res.render('home', {title:'Home'});
}

exports.room = function(req, res){
	res.render('room', {title:'Room'});
}
/*exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.doLogin = function(req, res){
	var user={
		username:'admin',
		password:'admin'
	}

	if(req.body.username===user.username && req.body.password===user.password){
		req.session.user=user;
	    return res.redirect('/home');
	} else {
		req.session.error='用户名或密码不正确';
		return res.redirect('/login');
	}
	
};

exports.home = function(req, res){
  	res.render('home', { title: 'Home'});
};*/