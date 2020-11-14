
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// user
function user(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    let { phone, userId, userName, email } = req.body;

    // 插入新用户信息
    const query = `UPDATE sys_user SET 
                  USER_NAME = '${userName}', 
                  EMAIL = '${email}',
                  WHERE PHONE = '${phone}'
                  AND USER_ID = '${userId}'`;
    querySql(query).then(user => {
      if (!user || user.length === 0) {
        res.json({ 
          code: CODE_ERROR, 
          msg: '保存失败！', 
          data: null 
        })
      } else {
        res.json({ 
          code: CODE_SUCCESS, 
          msg: '保存成功', 
          data: null 
        })
      }
    })
  }
}
// 查询菜单信息
function getMenu(req, res, next){
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 返回变量
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 入参
    let { phone } = req.body;
    // 查询菜单语句
    let query = `select u.MENU_ID as menuId,
                        u.MENU_NAME as menuName,
                        u.PARENT_ID as parentId,
                        u.ITEM_ID as itemId,
                        t.ITEM_URL as itemUrl
                from (select m.MENU_ID,m.MENU_NAME,m.PARENT_ID,m.MENU_SEQ,r.ITEM_ID
                from sys_menu_info m
                left join sys_menu_item_rel r
                on m.MENU_ID=r.MENU_ID) u
                left join sys_item_info t
                on u.ITEM_ID = t.ITEM_ID
                ORDER BY u.MENU_SEQ ASC;
                `;
    querySql(query).then(memuList => {
      if (!memuList || memuList.length === 0) {
        resData.code = CODE_ERROR
        resData.msg = '查询失败！'
        resData.data = null
        res.json(resData)
      } else {
        // 菜单处理逻辑
        const newMenus = []
        memuList.forEach(item => {
          if(item.parentId){
            memuList.forEach(item2 => {
              if(item2.menuId === item.parentId){
                if(item2.children){
                  item2.children.push(item)
                }else{
                  item2.children = [item]
                }
              }
            });
          }else{
            newMenus.push(item)
          }
        });
        resData.code = CODE_SUCCESS
        resData.msg = '查询成功'
        resData.data = newMenus
        res.json(resData)
      }
    })
  }
}
/**
 * 查询用户列表
 */
function getUserList(req, res, next){
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    // 返回变量
    let resData = {}
    req.newToken ? resData.token = req.newToken : ''
    // 入参
    let { phone } = req.body;
    // 数据查询逻辑
    const query = `SELECT t.USER_ID as userId,t.USER_NAME as userName,t.NICK_NAME as nickName,t.PHONE as phone,t.EMAIL as email,t.CRT_DATE as crtDate FROM sys_user t`;
    
    querySql(query).then(lists => {
      if (lists && lists.length > 0) {
        // 处理时间
        lists.forEach(li => {
          li.key = li.userId
          li.crtDate = moment(li.crtDate,moment.ISO_8601).format("YYYY-MM-DD HH:mm") 
        });
        resData.code = CODE_SUCCESS
        resData.msg = '用户列表查询成功'
        resData.data = lists
        res.json(resData)
      } else {
        resData.code = CODE_ERROR
        resData.msg = '用户列表查询失败！'
        resData.data = null
        res.json(resData)
      }
    })
  }
}

module.exports = {
  user,
  getMenu,
  getUserList
}
