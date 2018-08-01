const http = require('http')
const https = require('https')
const fs = require('fs')

const express = require('express')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
const ShareDB = require('sharedb')
const shareDbAccess = require('sharedb-access')
const sharedbMongo = require('sharedb-mongo')
const WebSocketJSONStream = require('websocket-json-stream')
const WebSocket = require('ws')
const util = require('util')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const USES_SSL = process.env.SSL_KEY && process.env.SSL_CERT

const db = sharedbMongo(process.env.MONGODB_URI)
const jwtVerify = util.promisify(jwt.verify)

async function verifyToken (token) {
  var client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      'https://gatsby-starter-collaborative-app.eu.auth0.com/.well-known/jwks.json'
  })

  function getKey (header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        console.error(err)
      }
      try {
        var signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
      } catch (err) {
        console.error(err)
      }
    })
  }

  return jwtVerify(token, getKey, {
    audience: 'https://gatsby-starter-collaborative-app.eu.auth0.com/api/v2/',
    issuer: 'https://gatsby-starter-collaborative-app.eu.auth0.com/',
    algorithms: ['RS256']
  })
}

const backend = new ShareDB({ db })
shareDbAccess(backend)

backend.allowCreate('examples', (docId, doc, session) => {
  console.log('create example', docId, 'by user', session.token.sub)
  return verifyToken(session.jwt)
})

backend.allowRead('examples', async (docId, doc, session) => {
  console.log('read example', docId, 'by user', session.token.sub)
  return verifyToken(session.jwt)
})

backend.allowUpdate('examples', (docId, oldDoc, newDoc, ops, session) => {
  console.log('update example', docId, 'by user', session.token.sub)
  return verifyToken(session.jwt)
})

backend.allowDelete('examples', (docId, oldDoc, newDoc, ops, session) => {
  console.log('delete example', docId, 'by user', session.token.sub)
  return verifyToken(session.jwt)
})

backend.use('connect', (request, next) => {
  const { token, jwt } = request.req
  request.agent.connectSession = { token, jwt }
  console.log('ShareDB connection established with user', token.sub)
  next()
})

startServer()

function startServer () {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express()
  // @todo do we need static? we deploy to netlify
  app.use(express.static('static'))
  app.get('/', function (req, res) {
    res.send('This is an API. You should not be here. Go away! :trollface:')
  })
  let server
  if (USES_SSL) {
    server = https.createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
      },
      app
    )
  } else {
    server = http.createServer(app)
  }

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server: server })
  wss.on('connection', function (ws, req) {
    const stream = new WebSocketJSONStream(ws)

    console.log('new websocket connection')

    ws.on('message', async function incoming (raw) {
      const data = JSON.parse(raw)

      const { type } = data
      if (type === 'auth') {
        const { jwt } = data
        console.log('login: verifying token')

        let decodedJwt
        try {
          decodedJwt = await verifyToken(jwt)

          console.log('login: token verified')
          ws.send(JSON.stringify({ type: 'auth_success' }))

          // TODO: do we need req here? Don't think so
          backend.listen(stream, { jwt, token: decodedJwt })
        } catch (e) {
          console.log('login: token denied')
          ws.send(JSON.stringify({ type: 'auth_error' }))
          console.error(e)
        }
      }
    })
  })

  server.listen(process.env.PORT)
  console.log(
    `Listening on ${
      USES_SSL ? 'https' : 'http'
    }://localhost:${process.env.PORT}`
  )
}
