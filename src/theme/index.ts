const themes = {}

// 获取目录下的主题颜色配置
const themeFiles = require.context('./modules', true, /\.ts$/)
themeFiles.keys().forEach(modulePath => {
  const themeName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  themes[themeName] = themeFiles(modulePath).default;
  return themes;
})


//更改body中的style样式
const changeStyle = obj => {
  if (!obj) return;
  Object.keys(obj).forEach(key => {
    document.getElementsByTagName('body')[0].style.setProperty(`--${key}`, obj[key]);
  });
};


export const setThemeStyle = theme => {
  localStorage.setItem('theme', theme);
  const isHasTheme = Object.keys(themes).includes(theme);
  if (isHasTheme) {
    const themeConfig = themes[theme];
    Object.keys(themeConfig).forEach(key => localStorage.setItem(key, themeConfig[key]));
    changeStyle(themeConfig);
  } 
}