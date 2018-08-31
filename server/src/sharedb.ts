import ShareDB from 'sharedb'
import shareDbAccess from 'sharedb-access'
import sharedbMongo from 'sharedb-mongo'

import verifyToken from './auth'

import { ISession, IShareDbRequest } from './interfaces/sharedb'

interface IClicker {
  name: string
  slug: string
  numClicks: number
  ownerSub: string
  private: boolean
}

export default function setupShareDB() {
  const db = sharedbMongo(process.env.MONGODB_URI)
  const backend = new ShareDB({ db })
  shareDbAccess(backend)

  backend.allowCreate(
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

  backend.allowRead(
    'examples',
    async (docId: string, doc: IClicker, session: ISession) => {
      console.log('Read Clicker', docId, 'by user', session.token.sub)
      if (doc.private && doc.ownerSub !== session.token.sub) {
        return false
      }
      return true
    }
  )

  backend.allowUpdate(
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

  backend.allowDelete(
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

  backend.use('connect', (request: IShareDbRequest, next: () => void) => {
    const { token, jwt } = request.req
    request.agent.connectSession = { token, jwt }
    console.log('ShareDB connection established with user', token.sub)
    next()
  })

  backend.use('submit', (request: IShareDbRequest, next: () => void) => {
    const { op } = request
    if ('create' in op) {
      // Ensure owner is current user
      const { data } = request.op.create
      data.ownerSub = request.agent.connectSession.token.sub
    }
    next()
  })

  return backend
}
