/*eslint-env es6*/
const debug                     = require('debug')('got-couch')

const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-insert-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::insert should store a document in the database and you ' +
'be able to use ::get to retrieve the document by identifier.', t =>

  couchdb.then( (connection) => {

    connection.insert(DB_NAME, { foo: 'bar', baz: 'buzz' })

    .then((res) => res.body.id)

    .then(connection.get(DB_NAME))

    .then((res) => res.body)

    .then((doc) => {
      t.is(doc.foo, 'bar')
      t.is(doc.baz, 'buzz')
    })
    .catch((err) => {
      t.fail(err)
    })

  })
  .catch((err) => {
    debug("INSERT: %o", err)
    t.fail(err)
    throw err
  })
)
