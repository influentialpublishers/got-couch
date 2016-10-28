
import R from 'ramda'
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


test('::insert should store a document in the database and you ' +
'be able to use ::get to retrieve the document by identifier.', t =>

  couchdb.insert(DB_NAME, { foo: 'bar', baz: 'buzz' })

  .then((res) => res.body.id)

  .then(couchdb.get(DB_NAME))

  .then((res) => res.body)

  .then((doc) => {

    t.is(doc.foo, 'bar')
    t.is(doc.baz, 'buzz')

  })

)
