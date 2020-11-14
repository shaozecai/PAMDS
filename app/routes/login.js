/**
 * 描述: 登录路由模块
 * 作者: shaozecai
 * 日期: 2020-11-12
*/
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/loginService');

/**
 * 登录路由
 * vaildator 路由校验条件
 */
const loginVaild = [
  body('phone').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]
router.post('/login', loginVaild, service.login);

/**
 * 登录状态验证路由
 * vaildator 路由校验条件
 */
const statusVaild = [
  body('phone').isString().withMessage('手机号错误'),
  body('token').isString().withMessage('TOKEN类型错误')
]
router.post('/status', statusVaild, service.status);

/**
 * 用户注册路由
 * vaildator 路由校验条件
 */
const registerVaild = [
  body('phone').isString().withMessage('手机号错误'),
  body('token').isString().withMessage('TOKEN类型错误')
]
router.post('/register', registerVaild, service.register);

/**
 * 用户注册发送验证码
 */
router.post('/send', service.sendCode);




module.exports = router;

