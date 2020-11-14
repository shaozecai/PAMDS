
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 查询字典
function getDic(req, res, next) {
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
    let { phone, dicType } = req.body;
    // 数据查询逻辑
    const query = ` SELECT  D.DIC_TYPE AS dicType,
                        D.DIC_TYPE_DES AS dicTypeDes,
                        D.DIC_CODE AS dicCode,
                        D.DIC_CODE_DES AS dicCodeDes,
                        D.SUP_DIC_CODE AS supDicCode
                    FROM dic_common D
                    WHERE D.DIC_TYPE = '${dicType}'
                    AND  D.BGN_DATE<=NOW() 
                    AND D.END_DATE >= NOW()`;
    querySql(query).then(dics => {
      if (!dics || dics.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '查询失败！'
        resData.data = null
        res.json(resData)
      } else {
        resData.code = CODE_SUCCESS
        resData.msg = '保存成功！'
        resData.data = dics
        res.json(resData)        
      }
    })
  }
}

module.exports = {
  getDic

}
