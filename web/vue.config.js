const path = require('path');

module.exports = {
    publicPath:process.env.NODE_ENV==='production' ? './web/dist/':'./',
    devServer: {
        disableHostCheck: true,
        port: 8080,
        proxy: {
          '/api': {
            target: 'http://localhost:9080',    
            changeOrigin: true,
            ws: false,
            // pathRewrite: {
            //   "^/api": "/api"
            // }
          }
        }
    },
    configureWebpack: {        
        output: {            
            path: path.join(__dirname, './dist'), //出口（打包后）文件路径
        }
    },
    chainWebpack: config => {
      config.module
       .rule('fonts')
       .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
       .use('url-loader')
        .loader('url-loader')
        .tap(options => {
         // 修改它的选项...        
         return undefined
        })
     }
};