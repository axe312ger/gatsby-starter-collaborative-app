import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as util from 'util'

import dotenv from 'dotenv'
import express from 'express'
import { verify } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import ShareDB from 'sharedb'
import shareDbAccess from 'sharedb-access'
import sharedbMongo from 'sharedb-mongo'
import WebSocketJSONStream from 'websocket-json-stream'
import WebSocket from 'ws'

import { ISession, IShareDbRequest } from './interfaces/sharedb'

interface IClicker {
  name: string
  slug: string
  numClicks: number
  ownerSub: string
  private: boolean
}

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const jwtVerify = util.promisify(verify)

const USES_SSL = process.env.SSL_KEY && process.env.SSL_CERT
const SSL_KEY = process.env.SSL_KEY || '' // @todo remove hacky typecasting to make typescript happy
const SSL_CERT = process.env.SSL_CERT || '' // @todo remove hacky typecasting to make typescript happy

const db = sharedbMongo(process.env.MONGODB_URI)
const shareDbBackend = new ShareDB({ db })
shareDbAccess(shareDbBackend)

shareDbBackend.allowCreate(
  'examples',
  (docId: string, doc: IClicker, session: ISession) => {
    console.log(
      `Create Clicker ${doc.name} (slug: ${doc.slug}, id: ${docId}) by ${
        doc.ownerSub
      }`
    )
    const { jwt } = session
    const { sub } = session.token
    const { ownerSub } = doc

    // Ensure users can only create Clickers for their own
    if (ownerSub !== sub) {
      return false
    }

    return verifyToken(jwt)
  }
)

shareDbBackend.allowRead(
  'examples',
  async (docId: string, doc: IClicker, session: ISession) => {
    console.log('Read Clicker', docId, 'by user', session.token.sub)
    if (doc.private && doc.ownerSub !== session.token.sub) {
      return false
    }
    return true
  }
)

shareDbBackend.allowUpdate(
  'examples',
  (
    docId: string,
    oldDoc: IClicker,
    newDoc: IClicker,
    ops: [],
    session: ISession
  ) => {
    console.log('Update clicker', docId, 'by user', session.token.sub)
    // Private Clickers can only be updated by the owner
    if (oldDoc.private && oldDoc.ownerSub !== session.token.sub) {
      return false
    }
    return true
  }
)

shareDbBackend.allowDelete(
  'examples',
  (
    docId: string,
    oldDoc: IClicker,
    newDoc: IClicker,
    ops: [],
    session: ISession
  ) => {
    console.log('Delete Clicker', docId, 'by user', session.token.sub)
    // Deletions should only be possible for the owner
    if (oldDoc.ownerSub !== session.token.sub) {
      return false
    }
    return verifyToken(session.jwt)
  }
)

shareDbBackend.use('connect', (request: IShareDbRequest, next: () => void) => {
  const { token, jwt } = request.req
  request.agent.connectSession = { token, jwt }
  console.log('ShareDB connection established with user', token.sub)
  next()
})

shareDbBackend.use('submit', (request: IShareDbRequest, next: () => void) => {
  const { op } = request
  if ('create' in op) {
    // Ensure owner is current user
    const { data } = request.op.create
    data.ownerSub = request.agent.connectSession.token.sub
  }
  next()
})

startServer()

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express()

  app.get('/', (req, res) => {
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
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws, req) => {
    const stream = new WebSocketJSONStream(ws)

    console.log('new websocket connection')

    ws.on('message', async function incoming(raw: Buffer) {
      const message = JSON.parse(raw.toString())
      const { type, data } = message

      if (type === 'auth') {
        const { jwt } = data
        console.log('login: verifying token')

        try {
          const decodedJwt = await verifyToken(jwt)

          console.log('login: token verified')
          ws.send(JSON.stringify({ type: 'auth_success' }))

          // Init shareDB backend for this user
          shareDbBackend.listen(stream, { jwt, token: decodedJwt })
        } catch (e) {
          console.log('login: token denied')
          console.error(e)
          const { name } = e
          ws.send(JSON.stringify({ type: 'auth_error', name }))
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

  function getKey(
    header: any,
    callback: (err: Error | null, signingKey?: string) => void
  ) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        console.error(err)
      }
      try {
        const signingKey = key.publicKey || key.rsaPublicKey
        if (!signingKey) {
          callback(new Error('Unable to extract key'))
        }
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
