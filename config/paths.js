const path = require('path')

const resolve = (...args) => path.join(process.cwd(), ...args)

module.exports = {
    srcPath: resolve('src'),
    distPath: resolve('dist'),
    vendorPath: resolve('vendor'),
    publicPath: resolve('public')
}