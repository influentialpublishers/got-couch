
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

  , get: (bucket, id) =>
      Client.get( DEFAULT_HEADERS, BucketUrl(bucket, id) )

  , insert: (bucket, doc) =>
      Client.put( DEFAULT_HEADERS, BucketUrl(bucket), doc )

  }

})
