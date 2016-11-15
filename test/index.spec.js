/*eslint-env es6*/
import test from 'ava'
import CouchDbDriver from '../index.js'

const DB_NAME = 'couch-driver-test'
const CONFIG  = {
  usename: 'root'
, password: 'password'
}
let couchdb   = null

let rev_id = ''

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


test('::create should store a document in the database with your ' +
'provided identifier and then ::get should be able to retrieve your ' +
'document by that identifier', t =>

  couchdb.create(DB_NAME, 'my-foo', { boo: 'Casper', moo: 'Elsie' })

  .then((res) => t.is(res.body.id, 'my-foo'))

  .then(() => couchdb.get(DB_NAME, 'my-foo'))

  .then((res) => res.body)

  .then((doc) => {

    t.is(doc.boo, 'Casper')
    t.is(doc.moo, 'Elsie')

  })
)


test('::upsert without a rev_id should store a document in the database ' +
' and with rev_id should update the existing document', t =>

  couchdb.upsert(DB_NAME, 'my-boo', null, { boo: 'Casper', moo: 'Troy'})

  .then((res) => t.is(res.body.id, 'my-boo'))

  .then(() => couchdb.get(DB_NAME, 'my-boo'))

  .then((res) => {

    rev_id = res.body._rev

    t.is(res.body.boo, 'Casper')
    t.is(res.body.moo, 'Troy')

  })

  .then(() => couchdb.upsert(DB_NAME, 'my-boo', rev_id,
    { koo: 'Bob', moo: 'Troy'})
  )

  .then(() => couchdb.get(DB_NAME, 'my-boo'))

  .then((res) => {

    t.is(res.body.moo, 'Troy')
    t.is(res.body.koo, 'Bob')
    t.is(res.body.boo, undefined)

  })
)


test('::list should list all of the documents in the ' +
'in the database by default', t =>

  Promise.all([

    couchdb.create(DB_NAME, 'my-foo1', { test: 'Test', moo: 'Elsie' })
  , couchdb.create(DB_NAME, 'my-foo2', { test: 'Test', moo: 'Clara' })

  ])

  .then(() => couchdb.list(DB_NAME, {}))

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

)


test('::find should query the database using the /{db}/_find endpoint',
t =>

  Promise.all([

    couchdb.create(DB_NAME, 'find-foo1', { test: 'FIND', moo: 'Elsie' })
  , couchdb.create(DB_NAME, 'find-foo2', { test: 'FIND', moo: 'Clara' })
  , couchdb.create(DB_NAME, 'find-foo3', { test: 'FIND', moo: 'Bessie' })
  , couchdb.create(DB_NAME, 'find-foo4', { test: 'FIND', moo: 'Babe' })

  ])


  .then(() => couchdb.find(DB_NAME, {

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

    const has_warning = result.body.warning

    t.is(actual_rows.length, expected_count, 'list count is not 1')
    t.deepEqual(actual_rows, expected_rows, 'list not what I expected')

  })

)


test('::addIndex should create an index that is used when a query is ' +
'executed by the ::query (find) function', t =>

  Promise.all([

    couchdb.create(DB_NAME, 'index1', { test: 'INDEX', moo: 'Elsie' })
  , couchdb.create(DB_NAME, 'index2', { test: 'INDEX', moo: 'Clara' })
  , couchdb.create(DB_NAME, 'index3', { test: 'INDEX', moo: 'Bessie' })
  , couchdb.create(DB_NAME, 'index4', { test: 'INDEX', moo: 'Babe' })

  ])


  .then(() => couchdb.addIndex(DB_NAME, {
    index: { fields: ["test", "moo"] }
  , name: "test-moo-index"
  }, {}))


  .then(() => couchdb.query(DB_NAME, {
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

)
