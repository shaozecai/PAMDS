/**
 * 描述: 初始化路由信息，自定义全局异常处理
 * 作者: shaozecai
 * 日期: 2020-11-12
*/
const express = require('express');
const jwt = require('jsonwebtoken'); // 引入验证jsonwebtoken模块
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant'); // 引入自定义的jwt密钥
// const boom = require('boom'); // 引入boom模块，处理程序异常状态
const loginRouter = require('./login'); // 引入user路由模块
const publicRouter = require('./public'); // 引入公共路由模块
const userRouter = require('./users'); // 引入user路由模块
const newRouter = require('./news'); // 引入新闻路由模块
const noticeRouter = require('./notice'); // 引入公告路由模块
const systemRouter = require('./system'); // 引入系统管理路由模块
const installRouter = require('./install'); // 引入设置路由模块
const userCenterRouter = require('./userCenter'); // 引入个人中心路由模块
const { jwtAuth, decode } = require('../utils/user-jwt'); // 引入jwt认证函数
const router = express.Router(); // 注册路由 

// 全局中间件
router.all('*',function(req, res, next) {
  console.log('全局中间件---')
  const token = req.get('Authorization')
  if(token){
    const jwtObj = jwt.verify(token, PRIVATE_KEY);
    const phone = jwtObj.phone
    let time = parseInt(Date.now()/1000)
    // token剩余5分钟到期，重新签发
    if((jwtObj.exp - time) < 60*5){
      //每次请求都重新签发token 
      const newToken = jwt.sign(
        { phone },
        // 私钥
        PRIVATE_KEY,
        // 设置过期时间
        { expiresIn: JWT_EXPIRED }
      )
      req.newToken = newToken
    }
  }
  next();
});

router.use(jwtAuth); // 注入认证模块
router.use('/api/login', loginRouter); // 注入登录注册路由模块
router.use('/api/user', userRouter); // 注入用户路由模块
router.use('/api/public', publicRouter); // 注入用户路由模块
router.use('/api/news', newRouter); // 引入新闻路由模块
router.use('/api/notice', noticeRouter); // 引入公告路由模块
router.use('/api/system', systemRouter); // 注入系统管理路由模块
router.use('/api/install', installRouter); // 注入设置路由模块
router.use('/api/userCenter', userCenterRouter); // 注入个人中心路由模块
// 错误处理中间件
router.use((err, req, res, next) => {
  console.log('错误处理中间件---',err)
  // 请求报错
  if(err){
    //jwt 验证错误
    if(err.name && err.name === 'UnauthorizedError' || err.name && err.name === 'TokenExpiredError'){
      const { message } = err
      res.status('401').json({
        code: '401',
        msg: message
      })
    // 其他错误
    }else{
      // 错误码和错误信息
      const { output } = err || {};      
      const errCode = (output && output.statusCode) || 500;
      const errMsg = (output && output.payload && output.payload.error) || err.message;
      res.status(errCode).json({
        code: errCode,
        msg: errMsg
      })
    }
  }
})

module.exports = router;