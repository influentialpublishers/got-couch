const nconf        = require('nconf')
const base_dir     = __dirname


nconf.argv()
  .env('__')
  .file('local', { file: `${base_dir}/_environment.json` })
  .file('default', { file: `${base_dir}/_default.json` })

module.exports = nconf.get()
