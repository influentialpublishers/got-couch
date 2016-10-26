
const R = require('ramda')


const server = (config) => `${config.url}:${config.port}`


const bucket = R.curry((server_url, my_bucket, path) =>
  `${server_url}/${my_bucket}/${path}`
)


const admin = R.curry((server_url, path) => `${server_url}/${path}`)


module.exports = { server, bucket, admin }
