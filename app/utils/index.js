/**
 * 描述: 连接mysql模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/


const mysql = require('mysql');
const config = require('../db/dbConfig');
const moment = require('moment')
// 连接mysql
function connect() {
  const { host, user, password, database } = config;
  return mysql.createConnection({
    host,
    user,
    password,
    database
  })
}

// 新建查询连接
function querySql(sql,args) { 
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, args,(err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接
      conn.end();
    }
  })
}

// 查询一条语句
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(res => {
      console.log('res===',res)
      if (res && res.length > 0) {
        resolve(res[0]);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

// 记录日志
function setLog(menu1, menu2,menu3,phone,	ywKey) {
  const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  // 数据插入逻辑
  const query = `insert into sys_log
    (MENU1, MENU2, MENU3, YW_KEY, AUTHOR, CRT_DATE) values
    ('${menu1}', '${menu2}', '${menu3}', '${ywKey}', '${phone}', '${time}')`;
  querySql(query)
}

module.exports = {
  querySql,
  queryOne,
  setLog
  
}