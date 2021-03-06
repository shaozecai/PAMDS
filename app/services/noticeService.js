
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne, setLog } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 新增公告
function add(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { title, status, content } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 数据插入逻辑
    const query = `insert into notice_info
      (TITLE, STATUS, CONTENT, AUTHOR, CRT_DATE, UPD_DATE) values
      ('${title}', '${status}', '${content}', '${tokenObj.phone}', '${time}', '${time}')`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '保存失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','新增公告',tokenObj.phone,'')
        resData.code = CODE_SUCCESS
        resData.msg = '保存成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 公告查询
function search(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { bgnNum, pageSize, title, author, status, crtDateBgn, crtDateEnd } = req.body;
    let count = `SELECT 
                  COUNT(*) as count
                  FROM notice_info n
                  WHERE n.STATUS <> '001001'`;
    let sql=`SELECT 
                  n.ID AS id,
                  n.TITLE as title,              
                  n.STATUS as status,
                  (SELECT D.DIC_CODE_DES FROM dic_common D WHERE D.DIC_CODE = n.STATUS) as statusDesc,
                  r.USER_NAME as author,
                  n.CRT_DATE as crtDate              
                FROM notice_info n 
                LEFT JOIN sys_user r
                ON r.PHONE = n.AUTHOR
                WHERE n.STATUS <> '001001'`;
    if(title){
      count = count + ` AND n.TITLE LIKE '%${title}%'`
      sql = sql + ` AND n.TITLE LIKE '%${title}%'`
    }
    if(author){
      count = count + ` AND n.AUTHOR IN (SELECT U.PHONE FROM sys_user U WHERE U.USER_NAME = '${author}')`
      sql = sql + ` AND n.AUTHOR IN (SELECT U.PHONE FROM sys_user U WHERE U.USER_NAME = '${author}')`
    }
    if(status){
      count = count + ` AND n.STATUS = '${status}'`
      sql = sql + ` AND n.STATUS = '${status}'`
    }
    if(crtDateBgn){
      count = count + ` AND n.CRT_DATE >= '${crtDateBgn}'`
      sql = sql + ` AND n.CRT_DATE >= '${crtDateBgn}'`
    }
    if(crtDateEnd){
      count = count + ` AND n.CRT_DATE <= '${crtDateEnd}'`
      sql = sql + ` AND n.CRT_DATE <= '${crtDateEnd}'`
    }
    sql = sql +  ` LIMIT ${bgnNum},${pageSize}`;

    querySql(count,null).then(countRes=>{
      let countNum=countRes[0].count;
      querySql(sql,null).then(result => {
        if (!result) {
          resData.code = CODE_ERROR
          resData.msg = '查询失败！'
          resData.data = null
          res.json(resData)
        } else {
          setLog('公告管理','公告管理','查询公告',tokenObj.phone,'')
          // 处理时间
          result.forEach((li,index) => {
            li.rn = bgnNum+index+1
            li.crtDate = moment(li.crtDate,moment.ISO_8601).format("YYYY-MM-DD HH:mm") 
          });
          resData.code = CODE_SUCCESS
          resData.msg = '查询成功！'
          resData.data = {
            datas:result,
            total:countNum
          }
          res.json(resData)        
        }
      })
    })
  }
}
// 删除公告
function del(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { id } = req.body;
    // 数据删除逻辑
    const query = `DELETE FROM notice_info WHERE ID='${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '删除失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','删除公告',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '删除成功！'
        resData.data = null
        res.json(resData)        
      }
    })
  }
}
// 发布公告
function release(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { id } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 数据插入逻辑
    const query = `UPDATE notice_info SET 
                  STATUS = '002002',
                  UPD_DATE = '${time}'
                  WHERE ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '发布失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','发布公告',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '发布成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 取消发布公告
function unrelease(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { id } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 数据插入逻辑
    const query = `UPDATE notice_info SET 
                  STATUS = '002003',
                  UPD_DATE = '${time}'
                  WHERE ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '取消发布失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','取消发布公告',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '取消发布成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 查询单条公告信息
function getInfo(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { id } = req.body;
    // 数据删除逻辑
    const query = `SELECT N.ID AS id, N.TITLE AS title, N.STATUS AS status, N.CONTENT AS content
                  FROM notice_info N
                  WHERE N.ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '查询失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','查看公告',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '查询成功！'
        resData.data = result[0]
        res.json(resData)        
      }
    })
  }
}
// 修改公告
function upd(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 定义出参
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 获取入参
    let tokenObj = decode(req)
    let { id, title, status, content } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 数据插入逻辑
    const query = `UPDATE notice_info SET 
                  TITLE = '${title}', 
                  STATUS = '${status}',
                  CONTENT = '${content}',
                  UPD_DATE = '${time}'
                  WHERE ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '修改失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('公告管理','公告管理','修改公告',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '修改成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}


module.exports = {
  add,
  search,
  del,
  release,
  unrelease,
  getInfo,
  upd
}
