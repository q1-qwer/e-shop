module.exports = {
    // 起别名时可以借助webpack
    configureWebpack:{ //vue的配置文件中可以引入webpack
        resolve:{ // 设置别名使用此插件
            alias:{ // 起别名 @符代表src目录，解决目录层级很深的问题
                'assets':'@/assets', // 写完配置文件想生效需要重启服务
                'components':'@/components',
                'network':'@/network',
                'utils':'@/utils',
                'views':'@/views',
                
            }
        }
    },
    
    //设置项目目录为默认目录去打包出dist文件
    publicPath:'./', 

    // vue-cli3关闭eslint语法检测
    // lintOnSave: false,
    // devServer: {
    //   overlay: {
    //       warning: false,
    //       errors: false
    //   }
    // },

    // devServer: {
    //     proxy: 'http://localhost:8080'
    //   }
    // 设置代理服务器
    devServer:{
        proxy:{
            '/api':{
                target:'https://api.shop.eduwork.cn',
                secure:false,  // 设置支持https的代理
                ws: true, // ws 用于支持websocked
                changeOrigin:true,  // target是域名的话，需要设置这个参数
                pathRewrite:{"^/api":''}
            }
        }
    },
    
}

