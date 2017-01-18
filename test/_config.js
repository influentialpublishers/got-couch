const R = require('ramda')
const VPN = {
  usename: 'root'
, password: 'password'
, url: 'http://10.101.0.1'
, port: 20004
}

const LOCAL = {
  usename: 'root'
, password: 'password'
}

const CURRENT = R.has('VPN', process.env) ? VPN : LOCAL

module.exports = CURRENT
