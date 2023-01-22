const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭esLint提示
  productionSourceMap: false, // 打包不生成map

  // 配置代理
  devServer: {
    proxy: {
      '/api': {     // 匹配所有以'/api' 开头的请求路径
        target: 'http://gmall-h5-api.atguigu.cn',   // 代理目标的基础路径
      }
    }
  }
})
