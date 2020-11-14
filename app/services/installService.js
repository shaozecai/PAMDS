
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne,setLog } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');


// 修改个人信息
function updUser(req, res, next) {
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
    let { userId, userName, email, sex } = req.body;
    // 数据插入逻辑
    const query = `UPDATE sys_user SET 
                  USER_NAME = '${userName}', 
                  EMAIL = '${email}',
                  SEX = '${sex}'
                  WHERE USER_ID = '${userId}'`;
    querySql(query).then(result => {
      if (!result || result.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '修改失败！'
        resData.data = null
        res.json(resData)
      } else {
        setLog('设置','设置','修改个人信息',tokenObj.phone,userId)
        resData.code = CODE_SUCCESS
        resData.msg = '修改成功！'
        resData.data = result
        res.json(resData)        
      }
    })
  }
}
module.exports = {
  updUser
}
