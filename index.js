
const R          = require('ramda')
const Url        = require('./lib/url.js')
const Driver     = require('./lib/driver.js')
const AuthClient = require('./lib/authenticate.js')


const DEFAULT_OPTIONS = {
  url: 'http://localhost'
, port: 5984
, username: 'root'
, password: ''
}


module.exports = (options = {}) => {

  const config     = R.merge(DEFAULT_OPTIONS, options)
  const server_url = Url.server(config)

  return AuthClient(server_url, config.username, config.password)

  .then(Driver(server_url))

}
