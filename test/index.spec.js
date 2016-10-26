
import test from 'ava'
import CouchDbDriver from '../index.js'

const DB_NAME = 'couch-driver-test'
const CONFIG  = {
  usename: 'root'
, password: 'password'
}
let couchdb   = null


test.before(() =>
  CouchDbDriver(CONFIG).then((driver) => { couchdb = driver })
)


test.before(() => couchdb.db.delete(DB_NAME).catch(() => null))


test.before(() => couchdb.db.create(DB_NAME))


test.after(() => couchdb.db.delete(DB_NAME))


test('db::info should return information about the test that was ' +
'created using db::create', t =>
  couchdb.db.info(DB_NAME)

  .then((info) => t.is(info.body.db_name, DB_NAME))
)

