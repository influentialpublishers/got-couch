
const R = require('ramda')


const Type = {
  AllDocs: '_all_docs'
, Find: '_find'
, Index: '_index'
, EnsureFullCommit: '_ensure_full_commit'
}


const server = (config) => `${config.url}:${config.port}`


const bucket = R.curry((server_url, my_bucket, path) =>
  `${server_url}/${my_bucket}` + (null === path ? '' : `/${path}`)
)


const admin = R.curry((server_url, path) => `${server_url}/${path}`)


const of = R.curry((server_url, type, my_bucket) =>
  `${server_url}/${my_bucket}/${type}`
)

const deleteIndex = R.curry((server_url, my_bucket, index) =>
  `${server_url}/${my_bucket}/${Type.Index}/${index.ddoc}/${index.type}/${index.name}`
)

module.exports = {
  server,
  bucket,
  admin,
  of,
  Type,
  deleteIndex
}
