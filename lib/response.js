
const R = require('ramda')


const success = R.applySpec({
  headers: R.prop('headers')
, body: R.compose(JSON.parse, R.prop('body'))
, raw: R.identity
})


const parse = R.cond([
  [ R.T, success ]
])


module.exports = { parse }
