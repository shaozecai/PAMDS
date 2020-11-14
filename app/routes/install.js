/**
 * 描述: 用户路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/installService');

// 修改个人信息
router.post('/updUser', service.updUser);

module.exports = router;

