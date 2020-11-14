/**
 * 描述: 个人中心路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/userCenterService');

// 待办
router.post('/needDo', service.needDo);

module.exports = router;

