
const R        = require('ramda')
const Bluebird = require('bluebird')
const got      = require('got')
const debug    = require('debug')('got-couch')
const Response = require('./response.js')


const JSON_MIME_TYPE = 'application/json'

const METHOD = {
  GET: 'get'
, HEAD: 'head'
, POST: 'post'
, PUT: 'put'
, DELETE: 'delete'
, COPY: 'copy'
}


const DEFAULT_HTTP_HEADERS = {
  "Content-Type": JSON_MIME_TYPE
, "Accept": JSON_MIME_TYPE
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

  const _debugCommon = () => {
    debug('RUN - METHOD: %s, URL: %s', method, url)
    debug('RUN - HEADERS: %o, QUERY: %o, BODY: %o', headers, query, body)
  }

  return Bluebird.resolve(got[method](url, information))
  .then((response) => {
      const parsedResponse = Response.parse(response)
      _debugCommon()
      debug('RUN - RESPONSE: %o', parsedResponse)
      return parsedResponse
  })
  .catch((err) => {
      _debugCommon()
      debug('RUN - ERROR: %o', err)
      throw err
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
