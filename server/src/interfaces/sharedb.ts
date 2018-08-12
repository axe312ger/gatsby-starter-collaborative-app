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

export interface IShareDbRequest {
  agent: any
  req: IWsRequest
}
