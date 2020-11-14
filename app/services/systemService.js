
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne, setLog } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 用户管理列表查询
function userSearch(req, res, next) {
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
    let { bgnNum, pageSize, userName, roles, crtDateBgn, crtDateEnd } = req.body;
    let count = `SELECT 
                  COUNT(*) as count
                  FROM sys_user n
                  WHERE n.PHONE IS NOT NULL`;
    let sql=`SELECT 
                  n.USER_ID AS userId,
                  n.USER_NAME as userName,  
                  (select group_concat(r.ROLE_ID) 
                   from user_role_rel r
                   WHERE r.USER_ID = n.USER_ID 
                   group by r.USER_ID ASC) as rolesId, 
                   (select group_concat(d.DIC_CODE_DES) 
                   from user_role_rel r 
                   left join dic_common d
                   on d.DIC_CODE = r.ROLE_ID
                   WHERE r.USER_ID = n.USER_ID 
                   group by r.USER_ID ASC) as rolesName, 
                  n.PHONE as phone,
                  n.EMAIL as email,
                  n.CRT_DATE as crtDate
                FROM sys_user n 
                WHERE n.PHONE IS NOT NULL`;
    if(userName){
      count = count + ` AND n.USER_NAME LIKE '%${userName}%'`
      sql = sql + ` AND n.USER_NAME LIKE '%${userName}%'`
    }
    if(roles){
      count = count + ` AND n.USER_ID IN (SELECT U.USER_ID FROM user_role_rel U WHERE U.ROLE_ID = '${roles}')`
      sql = sql + ` AND n.USER_ID IN (SELECT U.USER_ID FROM user_role_rel U WHERE U.ROLE_ID = '${roles}')`
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
          setLog('系统管理','用户管理','查询用户列表',tokenObj.phone,'')
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
// 日志管理列表查询
function jourSearch(req, res, next) {
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
    let { bgnNum, pageSize, userName, roles, crtDateBgn, crtDateEnd } = req.body;
    let count = `SELECT 
                  COUNT(*) as count
                  FROM sys_log l
                  WHERE l.AUTHOR IS NOT NULL`;

    let sql=`SELECT 
                  (select u.USER_ID from sys_user u where u.PHONE = l.AUTHOR) AS userId,
                  (select u.USER_NAME from sys_user u where u.PHONE = l.AUTHOR) AS userName,
                  (select group_concat(r.ROLE_ID) 
                  from user_role_rel r
                   WHERE r.USER_ID IN (select u.USER_id from sys_user u where u.PHONE = l.AUTHOR)
                   group by r.USER_ID ASC) as rolesId, 
                   (select group_concat(d.DIC_CODE_DES) 
                   from user_role_rel r 
                   left join dic_common d
                   on d.DIC_CODE = r.ROLE_ID
                   WHERE r.USER_ID IN (select u.USER_id from sys_user u where u.PHONE = l.AUTHOR)
                   group by r.USER_ID ASC) as rolesName, 
                   l.MENU1 as menu1,
                   l.MENU2 as menu2,
                   l.MENU3 as menu3,
                   l.YW_KEY as ywKey,
                   l.CRT_DATE as crtDate
                FROM sys_log l 
                WHERE l.AUTHOR IS NOT NULL`;

                
    if(userName){
      count = count + ` AND l.AUTHOR IN (SELECT U.PHONE FROM sys_user U WHERE U.USER_NAME LIKE '%${userName}%')`
      sql = sql + ` AND l.AUTHOR IN (SELECT U.PHONE FROM sys_user U WHERE U.USER_NAME LIKE '%${userName}%')`
    }
    if(roles){
      count = count + ` AND l.AUTHOR IN (SELECT US.PHONE FROM sys_user US WHERE US.USER_ID IN(SELECT U.USER_ID FROM user_role_rel U WHERE U.ROLE_ID = '${roles}'))`
      sql = sql + ` AND l.AUTHOR IN (SELECT US.PHONE FROM sys_user US WHERE US.USER_ID IN(SELECT U.USER_ID FROM user_role_rel U WHERE U.ROLE_ID = '${roles}'))`
    }
    if(crtDateBgn){
      count = count + ` AND l.CRT_DATE >= '${crtDateBgn}'`
      sql = sql + ` AND l.CRT_DATE >= '${crtDateBgn}'`
    }
    if(crtDateEnd){
      count = count + ` AND l.CRT_DATE <= '${crtDateEnd}'`
      sql = sql + ` AND l.CRT_DATE <= '${crtDateEnd}'`
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
          // setLog('系统管理','日志管理','查询日志列表',tokenObj.phone,'')
          // 处理时间
          result.forEach((li,index) => {
            li.rn = bgnNum+index+1
            li.crtDate = moment(li.crtDate,moment.ISO_8601).format("YYYY-MM-DD HH:mm:ss") 
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

module.exports = {
  userSearch,
  jourSearch
}
