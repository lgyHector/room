/**
 * 分页索引
 * @first 开头索引
 * @last 结束索引
 * @pageInfo 分页信息实体
 */
function PageIndex(first, last, pageInfo){
	this.firstIndex = first;
	this.lastIndex = last;
	this.pageInfo = pageInfo;
}

module.exports = PageIndex;