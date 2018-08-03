import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import * as util from 'util'

import express from 'express'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import ShareDB from 'sharedb'
import shareDbAccess from 'sharedb-access'
import sharedbMongo from 'sharedb-mongo'
import WebSocketJSONStream from 'websocket-json-stream'
import WebSocket from 'ws'

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const jwtVerify = util.promisify(jwt.verify)

const USES_SSL = process.env.SSL_KEY && process.env.SSL_CERT
const SSL_KEY = process.env.SSL_KEY || '' // @todo remove hacky typecasting to make typescript happy
const SSL_CERT = process.env.SSL_CERT || '' // @todo remove hacky typecasting to make typescript happy

const db = sharedbMongo(process.env.MONGODB_URI)
const shareDbBackend = new ShareDB({ db })
shareDbAccess(shareDbBackend)

shareDbBackend.allowCreate(
  'examples',
  (docId: string, doc: ShareDbDoc, session: Session) => {
    console.log('create example', docId, 'by user', session.token.sub)
    return verifyToken(session.jwt)
  }
)

shareDbBackend.allowRead(
  'examples',
  async (docId: string, doc: ShareDbDoc, session: Session) => {
    console.log('read example', docId, 'by user', session.token.sub)
    return verifyToken(session.jwt)
  }
)

shareDbBackend.allowUpdate(
  'examples',
  (
    docId: string,
    oldDoc: ShareDbDoc,
    newDoc: ShareDbDoc,
    ops: Array<ShareDbOp>,
    session: Session
  ) => {
    console.log('update example', docId, 'by user', session.token.sub)
    return verifyToken(session.jwt)
  }
)

shareDbBackend.allowDelete(
  'examples',
  (
    docId: string,
    oldDoc: ShareDbDoc,
    newDoc: ShareDbDoc,
    ops: Array<ShareDbOp>,
    session: Session
  ) => {
    console.log('delete example', docId, 'by user', session.token.sub)
    return verifyToken(session.jwt)
  }
)

shareDbBackend.use('connect', (request: ShareDbRequest, next: Function) => {
  const { token, jwt } = request.req
  request.agent.connectSession = { token, jwt }
  console.log('ShareDB connection established with user', token.sub)
  next()
})

startServer()

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express()

  app.get('/', function(req, res) {
    res.send('This is an API. You should not be here. Go away! :trollface:')
  })
  let server
  if (USES_SSL) {
    server = https.createServer(
      {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT)
      },
      app
    )
  } else {
    server = http.createServer(app)
  }

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server: server })
  wss.on('connection', function(ws, req: Request) {
    const stream = new WebSocketJSONStream(ws)

    console.log('new websocket connection')

    ws.on('message', async function incoming(raw: Buffer) {
      const message: WsMessage = JSON.parse(raw.toString())

      const { type, data } = message
      if (type === 'auth') {
        const { jwt } = data
        console.log('login: verifying token')

        let decodedJwt
        try {
          decodedJwt = await verifyToken(jwt)

          console.log('login: token verified')
          ws.send(JSON.stringify({ type: 'auth_success' }))

          // TODO: do we need req here? Don't think so
          shareDbBackend.listen(stream, { jwt, token: decodedJwt })
        } catch (e) {
          console.log('login: token denied')
          ws.send(JSON.stringify({ type: 'auth_error' }))
          console.error(e)
        }
      }
    })
  })

  server.listen(process.env.PORT)
  const url = `localhost:${process.env.PORT}`

  console.log(
    [
      `Listening on:`,
      `${USES_SSL ? 'https' : 'http'}://${url}`,
      `${USES_SSL ? 'wss' : 'ws'}://${url}`
    ].join('\n')
  )
}

async function verifyToken(token: string) {
  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      'https://gatsby-starter-collaborative-app.eu.auth0.com/.well-known/jwks.json'
  })

  function getKey(header: any, callback: Function) {
    client.getSigningKey(header.kid, function(err, key) {
      if (err) {
        console.error(err)
      }
      try {
        const signingKey = key.publicKey || key.rsaPublicKey
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
