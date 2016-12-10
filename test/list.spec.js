/*eslint-env es6*/
const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-list-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::list should list all of the documents in the ' +
'in the database by default', t =>

  couchdb.then((connection) => {

    Promise.all([

      connection.create(DB_NAME, 'my-foo1', { test: 'Test', moo: 'Elsie' })
    , connection.create(DB_NAME, 'my-foo2', { test: 'Test', moo: 'Clara' })

    ])

    .then(() => connection.list(DB_NAME, {}))

    .then((res) => res.body)

    .then((list) => {

      const expected_count = 2

      const expected_rows = [
        { id: 'my-foo1', test: 'Test', moo: 'Elsie' }
      , { id: 'my-foo2', test: 'Test', moo: 'Clara' }
      ]

      const actual_rows = list
        .rows
        .map((x) => ({ id: x.doc._id, test: x.doc.test, moo: x.doc.moo }))
        .filter((x) => 'Test' === x.test )

      t.is(actual_rows.length, expected_count, 'list count is not 2')
      t.deepEqual(actual_rows, expected_rows, 'list not what I expected')

    })

  }).catch((err) => {
    console.log(err)
    return err
  })
)
