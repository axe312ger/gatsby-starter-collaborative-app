import decode from 'jwt-decode'
import { push } from 'gatsby-link'
import auth0 from 'auth0-js'

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'

const CLIENT_ID = 'iPozGDTy27fkBDAsdeMFOx5Dd8YWCm1E'
const CLIENT_DOMAIN = 'gatsby-starter-collaborative-app.eu.auth0.com'
const REDIRECT = `${typeof window !== 'undefined' &&
  window.location.protocol}//${typeof window !== 'undefined' &&
  window.location.host}/login-callback`

const SCOPE = 'openid profile email'
const AUDIENCE = 'https://gatsby-starter-collaborative-app.eu.auth0.com/api/v2/'

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
})

export function login () {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  })
}

export function logout () {
  clearIdToken()
  clearAccessToken()
  push('/')
}

export function getAccessToken () {
  if (typeof localStorage === 'undefined') {
    return null
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearAccessToken () {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function getIdToken () {
  if (typeof localStorage === 'undefined') {
    return null
  }
  return localStorage.getItem(ID_TOKEN_KEY)
}

export function clearIdToken () {
  localStorage.removeItem(ID_TOKEN_KEY)
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName (name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

// Get and store access_token in local storage
export function setAccessToken () {
  let accessToken = getParameterByName('access_token')
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

// Get and store id_token in local storage
export function setIdToken () {
  let idToken = getParameterByName('id_token')
  localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export function isLoggedIn () {
  const idToken = getIdToken()
  return !!idToken && !isTokenExpired(idToken)
}

function getTokenExpirationDate (encodedToken) {
  const token = decode(encodedToken)
  if (!token.exp) {
    return null
  }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired (token) {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}

export function getUserSub () {
  const idToken = getIdToken()
  if (!idToken) {
    return false
  }
  const payload = decode(idToken)
  return payload.sub
}
