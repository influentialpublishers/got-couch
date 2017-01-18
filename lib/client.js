
const R        = require('ramda')
const Bluebird = require('bluebird')
const got      = require('got')
const debug    = require('debug')('got-couch')
const Response = require('./response.js')


const METHOD = {
  GET: 'get'
, HEAD: 'head'
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

const run = (method, headers, url, query, body) => {

  const information = {
      query: query
    , body: JSON.stringify(body)
    , headers: mergeHeaders(headers)
  }

  return new Bluebird((resolve, reject) => {
    got[method](url, information)
    .then((response) => {
      const parsedResponse = Response.parse(response)
      debug('RUN - METHOD: %s, URL: %s', method, url)
      debug('RUN - HEADERS: %o, QUERY: %o, BODY: %o', headers, query, body)
      debug('RUN - RESPONSE: %o', parsedResponse)
      resolve(parsedResponse)
    })
    .catch((err) => {
      debug('RUN - METHOD: %s, URL: %s', method, url)
      debug('RUN - HEADERS: %o, QUERY: %o, BODY: %o', headers, query, body)
      debug('RUN - ERROR: %o', err)
      reject(err)
    })
  })
}


const get = (headers, url, query) =>
  run(METHOD.GET, headers, url, query)


  const head = (headers, url, query) =>
    run(METHOD.HEAD, headers, url, query)


const post = (headers, url, body, query) =>
  run(METHOD.POST, headers, url, query, body)


const put = (headers, url, body, query) =>
  run(METHOD.PUT, headers, url, query, body)


const del = (headers, url, query) =>
  run(METHOD.DELETE, headers, url, query)

const ensureFullCommit = (headers, url) =>
  run(METHOD.POST, headers, url)

module.exports = {
  get
, head
, post
, put
, delete: del
, ensureFullCommit
}
