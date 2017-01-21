/*eslint-env es6*/
const debug                     = require('debug')('got-couch')
const CONFIG                    = require('./config/_index.js')
const { initCouchDb, initTest } = require('./_test-base.js')

const DB_NAME = 'couch-create-test'

const couchdb = initCouchDb(CONFIG)
const test    = initTest(couchdb, DB_NAME)


test('db::info should return information about the test that was ' +
'created using db::create', t =>

  couchdb.then((connection) => {
    connection.db.info(DB_NAME)

    .then((info) => t.is(info.body.db_name, DB_NAME))

    .catch ((err) => t.fail(err))

  })
  .catch((err) => {
    debug("CREATE: %o", err)
    t.fail(err)
    throw err
  })
)
