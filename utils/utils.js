function utils(){
	
}

module.exports = utils;

utils.trim = function(str){
	if(str != null){
		return str.replace(/(^\s*)|(\s*$)/g, '');
	}
	return str;
}