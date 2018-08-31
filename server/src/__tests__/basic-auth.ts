// This test is incomplete, feel free to create a PR to improve it.

import WebSocket from 'ws'

import startServer from '../server'

import _verifyToken from '../auth'
import _setupShareDB from '../sharedb'

const listenMock = jest.fn()

jest.mock('../auth')
jest.mock('../sharedb')

const verifyToken: jest.Mock = _verifyToken as any
const setupShareDB: jest.Mock = _setupShareDB as any

let stopServer

setupShareDB.mockImplementation(() => {
  return {
    listen: listenMock,
    close: (cb) => cb()
  }
})

beforeAll(async () => {
  stopServer = await startServer()
})

beforeEach(() => {
  listenMock.mockClear()
})

afterAll(async () => {
  await stopServer()
})

describe('Authentificate and open ShareDB connection', () => {
  test('missing data', (done) => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'auth' }))
    })

    ws.on('message', (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        error: 'Missing auth data'
      })
      expect(listenMock).not.toHaveBeenCalled()
      done()
    })

    ws.on('error', (err) => {
      throw err
    })
  })
  test('invalid token', (done) => {
    verifyToken.mockRejectedValueOnce(new Error('mocked token deny'))

    const ws = new WebSocket('ws://localhost:8080')

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'auth', data: { jwt: 'mockedJWT' } }))
    })

    ws.on('message', (msgBuffer) => {
      const message = JSON.parse(msgBuffer.toString())
      expect(message).toEqual({
        type: 'auth_error',
        message: 'mocked token deny'
      })
      expect(listenMock).not.toHaveBeenCalled()
      done()
    })

    ws.on('error', (err) => {
      throw err
    })
  })
  test('valid token', (done) => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'auth', data: { jwt: 'mockedJWT' } }))
    })

    ws.on('message', (msgBuffer) => {
      const message = JSON.parse(msgBuffer.toString())

      expect(message).toEqual({
        type: 'auth_success'
      })
      expect(listenMock).toHaveBeenCalledTimes(1)
      done()
    })

    ws.on('error', (err) => {
      throw err
    })
  })
})
