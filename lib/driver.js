
const R   = require('ramda')
const Url = require('./url.js')

const DEFAULT_HEADERS = {}


module.exports = R.curry((server_url, Client) => {

  const BucketUrl = Url.bucket(server_url)
  const AdminUrl = Url.admin(server_url)


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

    // docName is the identifier given to the doc being inserted.
  , create: R.curry((bucket, docName, doc) =>
      Client.put( DEFAULT_HEADERS, BucketUrl(bucket, docName), doc )
    )
  }

})
