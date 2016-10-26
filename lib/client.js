
const R        = require('ramda')
const got      = require('got')
const Response = require('./response.js')


const METHOD = {
  GET: 'get'
, POST: 'post'
, PUT: 'put'
, DELETE: 'delete'
}


const DEFAULT_HTTP_HEADERS = {
  "Content-Type": "application/json"
, "Accept": "application/json"
}

const mergeHeaders = R.compose(
  R.merge(DEFAULT_HTTP_HEADERS)
, R.defaultTo({})
)


const run = (method, headers, url, query, body) => got[method](url, {
  query: query
, body: JSON.stringify(body)
, headers: mergeHeaders(headers)
})
.then(Response.parse)


const get = (headers, url, query) => run(METHOD.GET, headers, url, query)


const post = (headers, url, body, query) =>
  run(METHOD.POST, headers, url, query, body)


const put = (headers, url, body, query) =>
  run(METHOD.PUT, headers, url, query, body)


const del = (headers, url) => run(METHOD.DELETE, headers, url)


module.exports = {
  get
, post
, put
, delete: del
}
