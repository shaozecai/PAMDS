/**
 * 描述: 公共路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/publicService');

// 查询字典
router.post('/getDic', service.getDic);

module.exports = router;

