/*eslint-env es6*/
const R                         = require('ramda')
const debug                     = require('debug')('got-couch')

const CONFIG                    = require('./config/_index.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-bulk-upsert-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('::bulk_upsert should update a list of documents in the database ' +
'based on the _id and _rev keys. If these two keys don\'t exist, create ' +
'the documents in the database', t =>

    couchdb.then((connection) => {

      connection.create(DB_NAME, '1', { first: 'matt', last: 'c' })

      .then((res) =>

        connection.bulk_upsert(DB_NAME, [
          { _id   : res.body.id
          , _rev  : res.body.rev
          , first : 'matt'
          , last  : 'chuang'
          , test  : 'bulk_upsert'
          }
        , { _id   : '2', first: 'jon', last: 'lee', test: 'bulk_upsert' }
        ])
      )

      .then(() => connection.list(DB_NAME, {}))

      .then((res) => res.body)

      .then((list) => {

        const expected_count = 2
        const map = {}

        R.compose(
          R.forEach((x) => { map[x.id] = x.doc })
        , R.filter((x) => 'bulk_upsert' === x.doc.test)
        )(list.rows)

        t.is(expected_count, Object.keys(map).length)
        t.is(map['1'].last, 'chuang')
        t.is(map['2'].last, 'lee')

      })
      .catch((err) => {
        t.fail(err)
      })

    })
    .catch((err) => {
      debug("BULK UPSERT: %o", err)
      t.fail(err)
      throw err
    })
)
