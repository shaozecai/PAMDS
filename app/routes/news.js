/**
 * 描述: 新闻路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/newService');

// 新闻新增
router.post('/add', service.add);
// 新闻列表
router.post('/list', service.list);
router.post('/del', service.del);
router.post('/getInfo', service.getInfo);
router.post('/update', service.update);
router.post('/search', service.search);
router.post('/stop', service.stop);
router.post('/reset', service.reset);

module.exports = router;

