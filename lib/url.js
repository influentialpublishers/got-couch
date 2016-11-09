
const R = require('ramda')


const Type = {
  AllDocs: '_all_docs'
, Find: '_find'
, Index: '_index'
}


const server = (config) => `${config.url}:${config.port}`


const bucket = R.curry((server_url, my_bucket, path) =>
  `${server_url}/${my_bucket}` + (null === path ? '' : `/${path}`)
)


const admin = R.curry((server_url, path) => `${server_url}/${path}`)


const of = R.curry((server_url, type, my_bucket) =>
  `${server_url}/${my_bucket}/${type}`
)


module.exports = { server, bucket, admin, of, Type }
