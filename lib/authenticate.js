
const R      = require('ramda')
const cookie = require('cookie')
const Client = require('./client.js')

const PARAM_FIRST = 0


const sessionUrl = (server_url) => `${server_url}/_session`


const authBody = (username, password) => ({ name: username, password: password })


const authHeaders = (token) =>
  R.merge({ "Cookie": `AuthSession=${token}` })


const authClientMethod = R.curry((token, fn) => R.unapply(R.compose(
  R.apply(fn)
, R.adjust(authHeaders(token), PARAM_FIRST)
)))


const getToken = R.compose(
  R.prop('AuthSession')
, cookie.parse
, R.path(['headers','set-cookie', PARAM_FIRST])
)


function AuthenticatedClient(server_url, usename, password) {
  return Client.post(
    {}
  , sessionUrl(server_url)
  , authBody(usename, password)
  )

  .then(getToken)

  .then((token) => R.map(authClientMethod(token), Client))

}


module.exports = AuthenticatedClient
