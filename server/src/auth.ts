import * as util from 'util'

import { verify } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const jwtVerify = util.promisify(verify)

export default async function verifyToken(token: string) {
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
