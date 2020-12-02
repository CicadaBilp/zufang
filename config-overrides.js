//配置按需加载ant-d的组件并且自动加载需要的组件样式

const { injectBabelPlugin } = require('react-app-rewired');
  module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
    return config;
  };