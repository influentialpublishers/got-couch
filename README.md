[![Build Status](https://travis-ci.org/influentialpublishers/got-couch.svg?branch=master)](https://travis-ci.org/influentialpublishers/got-couch)

# got-couch
A got based couch driver/interface


# Usage

```javascript

const GotCouch = require('got-couch')

const CONFIG = {
  url: 'http://localhost'
, port: 5984
, username: 'root'
, password: 'password'
}


const DB_NAME = 'my-test'


GotCouch(CONFIG).then((couchdb) => {

  // create a database
  //http://docs.couchdb.org/en/2.0.0/api/database/common.html#put--db
  couchdb.db.create(DB_NAME).then((response) => { /* ... */ })


  // get information about a database
  // http://docs.couchdb.org/en/2.0.0/api/database/common.html#get--db
  couchdb.db.info(DB_NAME).then((response) => { /* ... */})


  // delete a database
  // http://docs.couchdb.org/en/2.0.0/api/database/common.html#delete--db
  couchdb.db.delete(DB_NAME).then((response) => { /* ... */})


  // insert a document with a generated identifier
  // http://docs.couchdb.org/en/2.0.0/api/database/common.html#post--db
  couchdb.insert(DB_NAME, { test: 'stuff' /* ... */ })

  .then((response) => { /* ... */ })


  // insert a document with a specified identifier (`docid`)
  // http://docs.couchdb.org/en/2.0.0/api/document/common.html#put--db-docid
  couchdb.create(DB_NAME, 'docid', { test: 'stuff' /* ... */ })

  .then((response) => { /* ... */ })


  // retrieve a document by its identifier (`docid`).
  // http://docs.couchdb.org/en/2.0.0/api/document/common.html#get--db-docid
  couchdb.get(DB_NAME, 'docid').then((response) => { /* ... */ })

})

```

## Response Object

```javascript
{
  headers: { /* document headers */ }
, body: { /* body of the stored document */ }
, raw: { /* raw response object from couchdb */ }
}
```

