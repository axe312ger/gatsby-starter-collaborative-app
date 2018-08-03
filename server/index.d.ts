declare module 'jsonwebtoken'
declare module 'sharedb'
declare module 'sharedb-access'
declare module 'sharedb-mongo'
declare module 'websocket-json-stream'

interface ShareDbRequest extends Request {
  req: Session
  agent: any
}

interface ShareDbDoc {
  connection: any
  collection: any
  id: any
  version: any
  type: any
  data: any
  inflightFetch: any
  inflightSubscribe: any
  inflightUnsubscribe: any
  pendingFetch: any
  subscribed: any
  wantSubscribe: any
  inflightOp: any
  pendingOps: any
  paused: any
  applyStack: any
  preventCompose: any
}

interface ShareDbOp {}

interface Token {
  sub: string
}
interface Session {
  jwt: string
  token: Token
}

interface WsMessage {
  type: string
  data: any
}
