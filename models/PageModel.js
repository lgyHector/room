/**
 * 分页参数
 */
function PageModel(page){
	this.pageNo = page.pageNo;
	this.pageSize = page.pageSize?page.pageSize:2;
}

module.exports = PageModel;