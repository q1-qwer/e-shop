module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  // babel插件 babel-plugin-import：会在编译过程中将import的写法自动转换为按需引入的方式
  // 即，装上这个插件之后，不用在每个页面中一个一个导入了，可以一次导入
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
