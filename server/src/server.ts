import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as util from 'util'

import dotenv from 'dotenv'
import express from 'express'
import WebSocketJSONStream from 'websocket-json-stream'
import WebSocket from 'ws'

import verifyToken from './auth'
import setupShareDB from './sharedb'

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const USES_SSL = process.env.SSL_KEY && process.env.SSL_CERT
const SSL_KEY = process.env.SSL_KEY
const SSL_CERT = process.env.SSL_CERT

const shareDbBackend = setupShareDB()

export default function startServer() {
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
        if (!data) {
          ws.send(JSON.stringify({ error: 'Missing auth data' }))
          return
        }
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
          ws.send(JSON.stringify({ type: 'auth_error', message: e.message }))
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

  // Return async function to gracefully stop the server
  return async () => {
    console.log('Stopping server...')
    await util.promisify(shareDbBackend.close).bind(shareDbBackend)()
    await util.promisify(wss.close).bind(wss)()
    await util.promisify(server.close).bind(server)()
    console.log('Server stopped...')
  }
}
