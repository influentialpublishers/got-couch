/*eslint-env es6*/
const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-get-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::create should store a document in the database with your ' +
'provided identifier and then ::get should be able to retrieve your ' +
'document by that identifier', t =>

  couchdb.then((connection) => {
    connection.create(DB_NAME, 'my-foo', { boo: 'Casper', moo: 'Elsie' })

    .then((res) => t.is(res.body.id, 'my-foo'))

    .then(() => connection.get(DB_NAME, 'my-foo'))

    .then((res) => res.body)

    .then((doc) => {

      t.is(doc.boo, 'Casper')
      t.is(doc.moo, 'Elsie')

    })

  })
  .catch((err) => {
    console.log(err)
    return err
  })
)
