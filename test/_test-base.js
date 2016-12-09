/*eslint-env es6*/
const test = require('ava')
const CouchDbDriver = require('../index.js')

const initCouchDb = (config) => CouchDbDriver(config)


const initTest = (couchdb, db_name) => {

  test.before(() => couchdb.then(
    (connection) => connection.db.delete(db_name).catch(() => null)
  ))

  test.before(() => couchdb.then(
    (connection) => connection.db.create(db_name)
  ))

  test.after(() => couchdb.then(
    (connection) => connection.db.delete(db_name)
  ))

  return test
}

module.exports = {
  initCouchDb
, initTest
}
