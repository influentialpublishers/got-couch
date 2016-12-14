/*eslint-env es6*/
const test = require('ava')

process.on('unhandledRejection', (reason, p) => {
  console.log("Oh the NOES: ", reason)
})

const CouchDbDriver = require('../index.js')

const initCouchDb = (config) => CouchDbDriver(config)

const deleteAndThenCreate = (connection, db_name) => {
  return connection.db.delete(db_name)
  .then(() => connection.db.create(db_name))
  .catch(() => connection.db.create(db_name))
}

const initTest = (couchdb, db_name) => {

  test.before(() => couchdb.then(
    (connection) => deleteAndThenCreate(connection, db_name)
  ).catch((err) => {
    console.log("BEFORE (CREATE): ", err)
    throw err
  }))

  test.after(() => couchdb.then(
    (connection) => connection.ensureFullCommit(db_name)
  ).catch((err) => {
    console.log("AFTER (FULL COMMIT): ", err)
    throw err
  }))

  test.after.always(() => couchdb.then(
    (connection) => connection.db.delete(db_name)
  ).catch((err) => {
    console.log("AFTER ALWAYS (DELETE): ", err)
    throw err
  }))

  return test
}

module.exports = {
  initCouchDb
, initTest
}
