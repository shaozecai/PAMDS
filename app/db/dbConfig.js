/**
 * 描述: 数据库基础配置
 * 作者: Xi Xi
 * 日期: 2020-08-14
*/
const mysql = {
    host: '127.0.0.1', // 主机名称，一般是本机
	port: '3306', // 数据库的端口号，如果不设置，默认是3306
	user: 'root', // 创建数据库时设置用户名
	password: '******', // 创建数据库时设置的密码
	database: 'node_proj',  // 创建的数据库
	connectTimeout: 100000 // 连接超时
}

module.exports = mysql;