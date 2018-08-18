export interface IShareDbDoc {
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

interface IWsRequest {
  token: any
  jwt: any
}

interface IShareDbOpM {
  ts: number
}

interface IShareDbOpData {
  type: string
  data: any
}

interface IShareDbOp {
  src: string
  seq: number
  v: number
  create?: IShareDbOpData
  m: IShareDbOpM
}

interface IToken {
  sub: string
}
export interface ISession {
  jwt: string
  token: IToken
}

interface IShareDbAgent {
  connectSession: ISession
}

export interface IShareDbRequest {
  agent: IShareDbAgent
  req: IWsRequest
  op?: IShareDbOp
}
