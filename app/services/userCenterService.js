
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 待办
function needDo(req, res, next) {
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
    let count = `select count(1) as count from (
                  SELECT 
                              'NEWS' as type,
                              '新闻' as typeDesc,
                              n.ID as id,
                              n.NUM as num,
                              n.STATUS as status,
                              n.TITLE as title,
                              n.UPD_DATE as updDate 
                              FROM new_info n 
                              where n.STATUS = '001001' 
                              or n.STATUS = '001002'
                          UNION ALL
                          SELECT 
                              'NOTICE' as type,
                              '公告' as typeDesc,
                              t.ID as id,
                              '' as num,
                              t.STATUS as status,
                              t.TITLE as title,
                              t.UPD_DATE as updDate 
                          FROM notice_info t 
                          where t.STATUS = '002001'
                ) as needTable`;
    let sql=`select * from (
              SELECT 
                      'NEWS' as type,
                      '新闻' as typeDesc,
                      n.ID as id,
                      n.NUM as num,
                      n.STATUS as status,
                      (select d.DIC_CODE_DES from dic_common d where d.DIC_CODE =  n.STATUS) as statusDesc,
                      n.TITLE as title,
                      n.UPD_DATE as updDate 
                      FROM new_info n 
                      where n.STATUS = '001001' 
                      or n.STATUS = '001002'
                  UNION ALL
                  SELECT 
                      'NOTICE' as type,
                      '公告' as typeDesc,
                      t.ID as id,
                      '' as num,
                      t.STATUS as status,
                      (select d.DIC_CODE_DES from dic_common d where d.DIC_CODE =  t.STATUS) as statusDesc,
                      t.TITLE as title,
                      t.UPD_DATE as updDate 
                  FROM notice_info t 
                  where t.STATUS = '002001'
            ) as needTable
            LIMIT ${bgnNum},${pageSize}`;
    querySql(count,null).then(countRes=>{
      let countNum=countRes[0].count;
      querySql(sql,null).then(result => {
        let countNum=countRes[0].count;
        if (!result || result.length === 0) {
          resData.code = CODE_ERROR
          resData.msg = '查询失败！'
          resData.data = null
          res.json(resData)
        } else {
          // 处理时间
          result.forEach((li,index) => {
            li.rn = bgnNum+index+1
            li.updDate = moment(li.updDate,moment.ISO_8601).format("YYYY-MM-DD HH:mm:ss") 
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
  needDo
}
