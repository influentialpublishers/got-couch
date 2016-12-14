/*eslint-env es6*/
const Bluebird                  = require('bluebird')

const CONFIG                    = require('./_config.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-find-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::find should query the database using the /{db}/_find endpoint',
t =>

  couchdb.then((connection) => {

    Bluebird.all([
      connection.create(DB_NAME, 'find-foo1', { test: 'FIND', moo: 'Elsie' })
    , connection.create(DB_NAME, 'find-foo2', { test: 'FIND', moo: 'Clara' })
    , connection.create(DB_NAME, 'find-foo3', { test: 'FIND', moo: 'Bessie' })
    , connection.create(DB_NAME, 'find-foo4', { test: 'FIND', moo: 'Babe' })
    ])

    .then(() => connection.find(DB_NAME, {

      selector: { test: "FIND", moo: "Clara" }

    }, {}))

    .then((result) => {

      const expected_count = 1

      const expected_rows = [
        { id: 'find-foo2', test: 'FIND', moo: 'Clara' }
      ]

      const actual_rows = result
        .body
        .docs
        .map((x) => ({ id: x._id, test: x.test, moo: x.moo }))

      t.is(actual_rows.length, expected_count, 'list count is not 1')
      t.deepEqual(actual_rows, expected_rows, 'list not what I expected')

    })

  })
  .catch((err) => {
    console.log("FIND: ", err)
    return err
  })
)
