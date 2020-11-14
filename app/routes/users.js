/**
 * 描述: 用户路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/userService');

// 修改用户信息
router.post('/user', service.user);

// 查询菜单信息
router.post('/getMenu', service.getMenu);

// 查询用户列表信息
router.post('/list', service.getUserList);

module.exports = router;

