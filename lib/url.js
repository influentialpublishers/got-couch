
const R = require('ramda')


const server = (config) => `${config.url}:${config.port}`


const bucket = R.curry((server_url, my_bucket, path) =>
  `${server_url}/${my_bucket}` + (null === path ? '' : `/${path}`)
)


const admin = R.curry((server_url, path) => `${server_url}/${path}`)


const all_docs = R.curry((server_url, my_bucket) =>
  `${server_url}/${my_bucket}/_all_docs`
)


module.exports = { server, bucket, admin, all_docs }
