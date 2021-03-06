
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const moment = require('moment')
const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const { decode } = require('../utils/user-jwt');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

// 
var QcloudSms = require("qcloudsms_js");
// 短信应用 SDK AppID
var appid = 1400410183;  // SDK AppID 以1400开头
// 短信应用 SDK AppKey
var appkey = "8f778cd6a7e0cc3a08ac618936fdeb30";
// 需要发送短信的手机号码
var phoneNumbers = ["18121232326", "18715080216"];
// 短信模板 ID，需要在短信控制台中申请
var templateId = 683671;  // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
// 签名
var smsSign = "邵则财技术分享";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
// 实例化 QcloudSms
var qcloudsms = QcloudSms(appid, appkey);


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    let { phone, password } = req.body;
    // md5加密
    password = md5(password);
    // 判断当前手机号是否已注册
    const query = `select * from sys_user where PHONE='${phone}'`;
    querySql(query).then(user => {
      if(!user || user.length === 0) {
        res.json({ 
        	code: CODE_ERROR, 
        	msg: '手机号未注册，请先注册！', 
        	data: null 
        })
      }else{
        // 判断登录密码是否正确
        const query = `select * from sys_user where PHONE='${phone}' and PASSWORD='${password}'`;
        querySql(query).then(user => {
          if (!user || user.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '密码错误！', 
              data: null 
            })
          } else {
            // 查询用户的角色
            const rolesql = `select r.ROLE_ID as roleId ,d.DIC_CODE_DES as roleName
                            from user_role_rel r 
                            left join dic_common d
                            on d.DIC_CODE = r.ROLE_ID
                            where r.USER_ID in (select u.USER_ID from sys_user u where u.PHONE='${phone}')
                            and r.BGN_DATE <= now()
                            and r.END_DATE >= now()
                            and r.IS_VALID = '1'
                            order by d.DIC_CODE asc`;
            querySql(rolesql).then(roles => {
              // 登录成功，签发一个token并返回给前端 
              const token = jwt.sign(
                // payload：签发的 token 里面要包含的一些数据。
                { phone },
                // 私钥
                PRIVATE_KEY,
                // 设置过期时间
                { expiresIn: JWT_EXPIRED }
              )
              let userData = {
                userId: user[0].USER_ID,
                userName: user[0].USER_NAME,
                phone:user[0].PHONE,
                email: user[0].EMAIL,
                sex: user[0].SEX,
                roleList: roles
              };
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '登录成功', 
                data: { 
                  token,
                  userData
                } 
              })
            })
          }
        })
      }
    })
  }
}
// 验证登录状态
function status(req, res, next) {
    const err = validationResult(req);
  // 验证错误，获取错误信息
  if (!err.isEmpty()) {    
    const [{ msg }] = err.errors;    
    next(boom.badRequest(msg));
  }else{
    let { phone, token } = req.body;  
    
    const tokenInfo = jwt.verify(token, PRIVATE_KEY)
    let now = parseInt(Date.now()/1000)
    console.log(now,tokenInfo.exp,tokenInfo.exp - now)
    // token 5分钟后过期 重新签发TOKEN
    if(tokenInfo.exp && (tokenInfo.exp - now) < 60*5){
        // 签发一个token并返回给前端 
        const newToken = jwt.sign(
            // payload：签发的 token 里面要包含的一些数据。
            { phone },
            // 私钥
            PRIVATE_KEY,
            // 设置过期时间
            { expiresIn: JWT_EXPIRED }
        )
        res.json({ 
            code: CODE_SUCCESS, 
            msg: '重新签发TOKEN', 
            data: { 
                newToken
            } 
        })
        return
    }else{
        res.json({ 
            code: CODE_SUCCESS, 
            msg: 'token未到期，无需签发', 
            data: null
        })
        return
    }
  }
}
// 注册
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { phone, phoneCode, password } = req.body;
    // 验证手机号是否已被注册
    const query = `select USER_ID, USER_NAME, PHONE from sys_user where PHONE='${phone}'`;
    queryOne(query).then(data => {
  		if (data) {
  			res.json({ 
	      	code: CODE_ERROR,  
	      	msg: '该手机号已被注册！',     
	      	data: null 
	      })
  		}else{
        // 验证验证码
        if(req.session[phone] && req.session[phone][0] && req.session[phone][0] === phoneCode){ 
          // 验证码超时
          if((Date.parse(new Date()) - req.session[phone][1])/1000 > 60){
            res.json({ 
              code: CODE_ERROR, 
              msg: '验证码超时', 
              data: null 
            })
            return //res end以后记得return 否则就报错了
          }else{
            password = md5(password);
            const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            // 插入新用户信息
            const query = `insert into sys_user(PHONE, PASSWORD, USER_NAME, NICK_NAME, SEX, CRT_DATE) values('${phone}', '${password}', '', '', '', '${time}')`;
            querySql(query).then(result => {
              if (!result || result.length === 0) {
                res.json({ 
                  code: CODE_ERROR, 
                  msg: '注册失败', 
                  data: null 
                })
              }else{
                // 注册成功 返回注册用户信息
                const queryUser = `select * from sys_user where PHONE='${phone}' and PASSWORD='${password}'`;
                querySql(queryUser).then(user => {
                  const token = jwt.sign(
                    { phone },
                    PRIVATE_KEY,
                    { expiresIn: JWT_EXPIRED }
                  )
                  let userData = {
                    userId: user[0].id,
                    userName: user[0].USER_NAME,
                    phone:user[0].PHONE,
                    email: user[0].NICK_NAME,
                    sex: user[0].SEX
                  };
                  res.json({ 
                    code: CODE_SUCCESS, 
                    msg: '注册成功', 
                    data: { 
                      token,
                      userData
                    } 
                  })
                })
              }
            })
          }
        }else{
          res.json({ 
            code: CODE_ERROR, 
            msg: '验证码错误', 
            data: null 
          })
        }
  		}
  	})
   
  }
}
// 发送验证码
function sendCode(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    // 生成验证码
    function MathRand(len){
      let Num="";
      for(let i=0;i<len;i++){
        Num+=Math.floor(Math.random()*10);
      }
      return Num
    }
    let { phone } = req.body;
    if(phone === ''){
      res.json({ 
        code: CODE_ERROR, 
        msg: '手机号不能为空', 
        data: null 
      })
      return //res end以后记得return 否则就报错了
    }
    let romStr; //声明随机变量
    if(req.session[phone]){ //判断session里面是否存在phone(电话号码，为变量)这个key
        if((Date.parse(new Date()) - req.session[phone][1])/1000 > 60){
            romStr = MathRand(6);
            req.session[phone] = [romStr,Date.parse(new Date())];//存储session
        }else{
            res.json({ 
              code: CODE_ERROR, 
              msg: '60s内只能发送一次！', 
              data: null 
            })
            return //res end以后记得return 否则就报错了
        }
    }else{
        romStr = MathRand(6);
        req.session[phone] = [romStr,Date.parse(new Date())]; 
    };
    // 验证手机号是否已被注册
    const query = `select USER_ID, USER_NAME, PHONE from sys_user where PHONE='${phone}'`;
    queryOne(query).then(data => {
  		if (data) {
  			res.json({ 
	      	code: CODE_ERROR, 
	      	msg: '该手机号已被注册！', 
	      	data: null 
	      })
  		}else{
        var ssender = qcloudsms.SmsSingleSender();
        var params = [romStr,'1'];
        ssender.sendWithParam("86", phone, templateId, params, smsSign, "", "", (err,req,resData)=>{
          res.json({ 
            code: CODE_SUCCESS, 
            msg: '验证码已发送！', 
            data: null 
          })
        }); 
  		}
  	})
  }
}


module.exports = {
  login,
  status,
  register,
  sendCode
}
