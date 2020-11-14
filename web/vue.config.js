/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
module.exports = {
    publicPath:process.env.NODE_ENV==='production' ? './web/dist/':'/',
    devServer: {
        disableHostCheck: true,
        port: 8080,
        proxy: {
          '/api': {
            target: 'http://localhost:9080',    
            changeOrigin: true,
            ws: false,
            // pathRewrite:{
            //     '^/api':'/pamds/api'
            // }
          }
        }
    },
    configureWebpack: {        
        output: {            
            path: path.join(__dirname, './dist'), 
        }
    },
    chainWebpack: config => {
      config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use('url-loader')
      .loader('url-loader')
      .tap(() => {
        return undefined
      });

      // 自定义路径
      config.resolve.alias
      .set('@', path.join(__dirname, './src'))
      
     }
};