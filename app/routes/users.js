/**
 * 描述: 用户登录注册路由
 * 作者: Xi Xi
 * 日期: 2020-08-14
*/
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/userService');

// 登录/注册校验
const vaildator = [
  body('phone').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

// 用户登录路由
router.post('/login', vaildator, service.login);

// 用户注册路由
router.post('/register', vaildator, service.register);

// 用户注册路由
router.post('/send', service.sendCode);


// 用户注册路由
router.get('/test', function (req, res) {
	res.send('你好，这是一个get方式的测试接口哦!');
});

module.exports = router;

