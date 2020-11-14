
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne,setLog } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 新增新闻
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
    let { title, status, des, content } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let newNum = 'N'+ moment(new Date()).format('YYYYMMDDss')
    // 数据插入逻辑
    const query = `insert into new_info
      (NUM, TITLE, STATUS, DES, CONTENT, AUTHOR, CRT_DATE, UPD_DATE) values
      ('${newNum}', '${title}', '${status}', '${des}', '${content}', '${tokenObj.phone}', '${time}', '${time}')`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '保存失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('新闻管理','新增新闻','新增新闻',tokenObj.phone,newNum)
        resData.code = CODE_SUCCESS
        resData.msg = '保存成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 新闻列表查询
function list(req, res, next) {
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
    let { bgnNum, pageSize } = req.body;
    // 数据
    let count = `SELECT 
                  COUNT(*) as count
                  FROM new_info n 
                  WHERE n.STATUS = '001001'
                  AND n.AUTHOR = '${tokenObj.phone}'`;
    let sql=`SELECT 
              n.ID AS id,
              n.NUM AS num,
              n.TITLE as title,              
              n.STATUS as status,
              (SELECT D.DIC_CODE_DES FROM dic_common D WHERE D.DIC_CODE = n.STATUS) as statusDesc,
              n.DES as des,
              r.USER_NAME as author,
              n.CRT_DATE as crtDate              
            FROM new_info n 
            LEFT JOIN sys_user r
            ON r.PHONE = n.AUTHOR
            WHERE n.STATUS = '001001'
            AND n.AUTHOR = '${tokenObj.phone}'
            LIMIT ${bgnNum},${pageSize}`;
    querySql(count,null).then(countRes=>{
      let countNum=countRes[0].count;
      querySql(sql,null).then(result => {
        if (!result) {
          resData.code = CODE_ERROR
          resData.msg = '查询失败！'
          resData.data = null
          res.json(resData)
        } else {
          setLog('新闻管理','新闻列表','新闻列表查询',tokenObj.phone,'')
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
// 删除新闻
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
    const query = `DELETE FROM new_info WHERE ID='${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '删除失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('新闻管理','新闻列表','新闻删除',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '删除成功！'
        resData.data = null
        res.json(resData)        
      }
    })
  }
}
// 查询单条新闻信息
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
    const query = `SELECT N.ID AS id, N.NUM AS num, N.TITLE AS title, N.STATUS AS status, N.DES AS des, N.CONTENT AS content
                  FROM new_info N
                  WHERE N.ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '查询失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('新闻管理','新闻列表','新闻查看',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '查询成功！'
        resData.data = result[0]
        res.json(resData)        
      }
    })
  }
}
// 修改新闻
function update(req, res, next) {
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
    let { id, title, status, des, content } = req.body;
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 数据插入逻辑
    const query = `UPDATE new_info SET 
                  TITLE = '${title}', 
                  STATUS = '${status}',
                  DES = '${des}',
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
        setLog('新闻管理','新闻列表','新闻修改',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '修改成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 新闻查询
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
    let { bgnNum, pageSize, num, title, des, status, crtDateBgn, crtDateEnd } = req.body;
    let count = `SELECT 
                  COUNT(*) as count
                  FROM new_info n 
                  WHERE n.STATUS <> '001001'`;
    let sql=`SELECT 
                  n.ID AS id,
                  n.NUM AS num,
                  n.TITLE as title,              
                  n.STATUS as status,
                  (SELECT D.DIC_CODE_DES FROM dic_common D WHERE D.DIC_CODE = n.STATUS) as statusDesc,
                  n.DES as des,
                  r.USER_NAME as author,
                  n.CRT_DATE as crtDate              
                FROM new_info n 
                LEFT JOIN sys_user r
                ON r.PHONE = n.AUTHOR
                WHERE n.STATUS <> '001001'`;
    if(num){
      count = count + ` AND n.NUM = '${num}'`
      sql = sql + ` AND n.NUM = '${num}'`
    }
    if(title){
      count = count + ` AND n.TITLE LIKE '%${title}%'`
      sql = sql + ` AND n.TITLE LIKE '%${title}%'`
    }
    if(des){
      count = count + ` AND n.DES LIKE '%${des}%'`
      sql = sql + ` AND n.DES LIKE '%${des}%'`
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
          setLog('新闻管理','新闻查询','新闻搜索',tokenObj.phone,'')
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
// 暂停新闻
function stop(req, res, next) {
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
    const query = `UPDATE new_info SET 
                  STATUS = '001004',
                  UPD_DATE = '${time}'
                  WHERE ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '暂停发布失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('新闻管理','新闻查询','暂停发布新闻',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '暂停发布成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
// 恢复新闻
function reset(req, res, next) {
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
    const query = `UPDATE new_info SET 
                  STATUS = '001003',
                  UPD_DATE = '${time}'
                  WHERE ID = '${id}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '发布失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('新闻管理','新闻列表','发布新闻',tokenObj.phone,id)
        resData.code = CODE_SUCCESS
        resData.msg = '发布成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}

module.exports = {
  add,
  list,
  del,
  getInfo,
  update,
  search,
  stop,
  reset
}
