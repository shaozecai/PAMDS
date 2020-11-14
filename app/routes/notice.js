/**
 * 描述: 公告模块路由
 * 作者: shaozecai
 * 日期: 2020-11-12
*/
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/noticeService');

// 公告新增
router.post('/add', service.add);
// 新闻列表
router.post('/del', service.del);
router.post('/search', service.search);
router.post('/release', service.release);
router.post('/unrelease', service.unrelease);
router.post('/getInfo', service.getInfo);
router.post('/upd', service.upd);
module.exports = router;

