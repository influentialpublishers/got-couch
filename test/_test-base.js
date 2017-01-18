/*eslint-env es6*/
const test  = require('ava')
const debug = require('debug')('got-couch')

process.on('unhandledRejection', (reason, p) => {
  debug("Unhandled Rejected: %o", reason)
})

const CouchDbDriver = require('../index.js')

const initCouchDb = (config) => CouchDbDriver(config)

const deleteAndThenCreate = (connection, db_name) => {
  connection.db.delete(db_name)
  .then(() => connection.db.create(db_name))
  .catch(() => connection.db.create(db_name))
}

const initTest = (couchdb, db_name) => {

  test.before(t => couchdb.then(
    (connection) => deleteAndThenCreate(connection, db_name)
  ).catch((err) => {
    t.fail()
    throw err
  }))

  test.after.always('cleanup', t => couchdb.then(
    (connection) =>
      connection.db.delete(db_name)
      .catch(() => {})
  ).catch(() => {})
  )

  return test
}

module.exports = {
  initCouchDb
, initTest
}
