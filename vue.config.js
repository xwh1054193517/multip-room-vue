const path = require('path');
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = defineConfig({
  publicPath: '/chat/',
  transpileDependencies: true,
  lintOnSave:false,
  productionSourceMap: false,
  configureWebpack:{
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack:config=>{
    config.module.rule('svg').exclude.add(resolve('src/assets/icons/svg')).end();
    config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/assets/icons/svg'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end();
  }
})

