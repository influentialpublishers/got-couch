/*eslint-env es6*/
const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-del-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::del should delete a document with a given identifier from ' +
' the database.', t =>

  couchdb.then((connection) => {

    connection.insert(DB_NAME, { foo: 'bar2', baz: 'buzz2' })

    .then((result) => connection.get(DB_NAME, result.body.id))

    .then((result) => connection.del(
      DB_NAME, result.body._id, result.body._rev
    ))

    .then(() => connection.query(DB_NAME, {
      selector: { foo: 'bar2', baz: 'buzz2' }
    }, {}))

    .then((result) => {

      const expected_count = 0

      t.is(result.body.docs.length, expected_count, 'list count is not 0')

    })

  })
  .catch((err) => {
    console.log("DELETE: ", err)
    return err
  })
)
