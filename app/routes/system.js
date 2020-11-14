/**
 * 描述: 系统管理模块路由
 * 作者: shaozecai
 * 日期: 2020-11-12
*/
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/systemService');

// 系统管理 - 用户管理查询
router.post('/userSearch', service.userSearch);
// 系统管理 - 日志管理查询
router.post('/jourSearch', service.jourSearch);

module.exports = router;

