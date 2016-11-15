
const R   = require('ramda')
const Url = require('./url.js')

const DEFAULT_HEADERS = {}

const DEFAULT_LIST_OPTIONS = {
  include_docs: true
}


module.exports = R.curry((server_url, Client) => {

  const BucketUrl  = Url.bucket(server_url)
  const AdminUrl   = Url.admin(server_url)
  const TypeUrl    = Url.of(server_url)

  const find       = R.curry((bucket, query, options) =>
    Client.post(
      DEFAULT_HEADERS
    , TypeUrl(Url.Type.Find, bucket)
    , query
    , options
    )
  )

  return {

    db: {

      create: (name) =>
        Client.put( DEFAULT_HEADERS, AdminUrl(name) )

    , info: (name) =>
        Client.get( DEFAULT_HEADERS, AdminUrl(name) )

    , delete: (name) =>
        Client.delete( DEFAULT_HEADERS, AdminUrl(name) )

    }

  , get: R.curry((bucket, id) =>
      Client.get( DEFAULT_HEADERS, BucketUrl(bucket, id) )
    )

    // CouchDB will generate a document identifier when adding a
    // document using this method.
  , insert: R.curry((bucket, doc) =>
      Client.post( DEFAULT_HEADERS, BucketUrl(bucket, null), doc )
    )

    // docid is the identifier given to the doc being inserted.
  , create: R.curry((bucket, docid, doc) =>
      Client.put( DEFAULT_HEADERS, BucketUrl(bucket, docid), doc )
    )

    // revid is the latest revision id needed to update an existing document
  , upsert: R.curry((bucket, docid, revid, doc) =>
      Client.put( DEFAULT_HEADERS, BucketUrl(bucket, docid, revid), doc )
    )

  , list: R.curry((bucket, query_params) =>
      Client.get(
        DEFAULT_HEADERS
      , TypeUrl(Url.Type.AllDocs, bucket)
      , R.merge(DEFAULT_LIST_OPTIONS, query_params)
      )
    )

  , addIndex: R.curry((bucket, index_config, options) =>
      Client.post(
        DEFAULT_HEADERS
      , TypeUrl(Url.Type.Index, bucket)
      , index_config
      , options
      )
    )

  , find: find

  , query: find

  }

})
