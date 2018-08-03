import React from 'react'
import propTypes from 'prop-types'
import { push } from 'gatsby-link'
import sharedb from 'sharedb/lib/client'

import { getAccessToken, clearAccessToken } from '../utils/AuthService'

export const SessionContext = React.createContext()

let socket = null
let connection = false
let sessionContextData = {
  jwt: null
}

export class SessionProvider extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired
  }
  constructor (props) {
    super(props)

    const jwt = getAccessToken()
    sessionContextData.jwt = jwt

    this.setJWT = this.setJWT.bind(this)
    this.state = {
      jwt
    }
  }
  setJWT (newToken) {
    sessionContextData.jwt = newToken
    this.setState(state => ({
      jwt: newToken
    }))
  }
  render () {
    const { children } = this.props
    const contextValue = {
      jwt: this.state.jwt,
      setJWT: this.setJWT
    }

    return (
      <SessionContext.Provider value={contextValue}>
        {children}
      </SessionContext.Provider>
    )
  }
}

export const SessionConsumer = SessionContext.Consumer

class AccessCheck extends React.PureComponent {
  static propTypes = {
    jwt: propTypes.string,
    children: propTypes.node.isRequired
  }
  componentDidMount () {
    const { jwt } = this.props

    // @todo consider validation token expiration in client
    if (!jwt) {
      console.log('Access error - you should be logged in to see this page')
      push('/')
    }
  }
  render () {
    return this.props.jwt ? this.props.children : null
  }
}

class WebsocketConnection extends React.PureComponent {
  static propTypes = {
    children: propTypes.func.isRequired
  }
  constructor (props) {
    super(props)

    this.state = {
      connecting: false,
      connected: socket ? socket.readyState === 1 : false,
      socket: socket
    }
  }

  componentDidMount () {
    if (!socket || socket.readyState === 3) {
      this.connect()
    }
  }

  connect () {
    socket = new WebSocket(process.env.WEBSOCKET_URI)

    this.setState({ connecting: true })

    socket.onopen = () => {
      this.setState({ connecting: false, connected: true, socket, connection })
    }
    socket.onclose = () => {
      this.setState({ connected: false })
    }
  }

  render () {
    if (!this.state.connected) {
      if (this.state.connecting) {
        return 'Connecting to web socket connection'
      }
      return 'Not connected to web socket connection'
    }

    return this.props.children(this.state)
  }
}

class ShareDBAuth extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired,
    jwt: propTypes.string.isRequired,
    setJWT: propTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    const { jwt, setJWT } = props

    socket.send(
      JSON.stringify({
        type: 'auth',
        data: { jwt }
      })
    )

    socket.onmessage = message => {
      const data = JSON.parse(message.data)
      if (data.type === 'auth_success') {
        console.log('Authentificated successfully via web sockets')
        connection = new sharedb.Connection(socket)
        this.setState({ authentificated: true })
        return
      }
      if (data.type === 'auth_error') {
        console.log('Authentificated failed via web sockets')
        alert('Authentification failed. Please log in again.')
        clearAccessToken()
        setJWT(null)
        push('/')
      }
    }

    this.state = {
      authentificated: false
    }
  }
  render () {
    return this.state.authentificated ? this.props.children : null
  }
}

export class SecureSection extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired
  }
  render () {
    const { children } = this.props
    return (
      <SessionConsumer>
        {session => (
          <AccessCheck jwt={session.jwt}>
            <WebsocketConnection>
              {() => <ShareDBAuth {...session}>{children}</ShareDBAuth>}
            </WebsocketConnection>
          </AccessCheck>
        )}
      </SessionConsumer>
    )
  }
}

export class BackendConnection extends React.PureComponent {
  static propTypes = {
    children: propTypes.func.isRequired
  }
  render () {
    const { children } = this.props
    return children({ connection })
  }
}
