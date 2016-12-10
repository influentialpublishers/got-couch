/*eslint-env es6*/
const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-add-index-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::addIndex should create an index that is used when a query is ' +
'executed by the ::query (find) function', t =>

  couchdb.then((connection) => {

    Promise.all([
      connection.create(DB_NAME, 'index1', { test: 'INDEX', moo: 'Elsie' })
    , connection.create(DB_NAME, 'index2', { test: 'INDEX', moo: 'Clara' })
    , connection.create(DB_NAME, 'index3', { test: 'INDEX', moo: 'Bessie' })
    , connection.create(DB_NAME, 'index4', { test: 'INDEX', moo: 'Babe' })
    ])

    .then(() => connection.addIndex(DB_NAME, {
      index: { fields: ["test", "moo"] }
    , name: "test-moo-index"
    }, {}))

    .then(() => connection.query(DB_NAME, {
      selector: { test: 'INDEX', moo: 'Babe' }
    }, {}))

    .then((result) => {

      const expected_count = 1

      const expected_rows = [
        { id: 'index4', test: 'INDEX', moo: 'Babe' }
      ]

      const actual_rows = result
        .body
        .docs
        .map((x) => ({ id: x._id, test: x.test, moo: x.moo }))

      const has_warning = result.body.hasOwnProperty('warning')

      t.is(actual_rows.length, expected_count, 'list count is not 1')
      t.deepEqual(actual_rows, expected_rows, 'list not what I expected')
      t.falsy(has_warning, 'query generated an unexpected warning message')

    })

  })
  .catch((err) => {
    console.log(err)
    return err
  })

)
