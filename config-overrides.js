const {
  override,
  fixBabelImports
} = require('customize-cra')
const setGlobalObject = value => config => {
  if (config.mode === "production") {
    config.output.publicPath = '/tools/'
  }

  return config
}
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  setGlobalObject()
)