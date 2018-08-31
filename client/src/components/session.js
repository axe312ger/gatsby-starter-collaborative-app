import React from 'react'
import propTypes from 'prop-types'
import { navigate } from 'gatsby'
import sharedb from 'sharedb/lib/client'

import ErrorBoundary from './error-boundary'
import ProgressIndicator from './progress-indicator'
import {
  getAccessToken,
  clearAccessToken,
  clearIdToken,
  getUserSub
} from '../utils/AuthService'

export const SessionContext = React.createContext()

let socket = null
let connection = false

export class SessionProvider extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired
  }

  state = {
    jwt: null,
    sub: null,
    drawerOpen: false
  }

  constructor (props) {
    super(props)

    this.setJWT = this.setJWT.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)

    this.state.jwt = getAccessToken()
    this.state.sub = getUserSub()
  }
  setJWT (jwt) {
    const sub = getUserSub()
    this.setState({
      jwt,
      sub
    })
  }
  toggleDrawer () {
    this.setState((state) => ({
      drawerOpen: !state.drawerOpen
    }))
  }
  render () {
    const { children } = this.props
    const contextValue = {
      ...this.state,
      setJWT: this.setJWT,
      toggleDrawer: this.toggleDrawer
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
      throw new Error('You are not logged in')
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
        return <ProgressIndicator text='Preparing web socket connection...' />
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
  state = {
    error: null
  }
  constructor (props) {
    super(props)
    const { jwt } = props

    socket.send(
      JSON.stringify({
        type: 'auth',
        data: { jwt }
      })
    )

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.type === 'auth_success') {
        connection = new sharedb.Connection(socket)
        this.setState({ authentificated: true })
        return
      }
      if (data.type === 'auth_error') {
        this.setState({ error: new Error(data.name) })
      }
    }

    this.state = {
      authentificated: false
    }
  }
  componentDidUpdate () {
    const { setJWT } = this.props
    if (this.state.error) {
      clearAccessToken()
      clearIdToken()
      setJWT(null)
      throw this.state.error
    }
  }
  render () {
    return this.state.authentificated ? (
      this.props.children
    ) : (
      <ProgressIndicator text='Logging you in...' />
    )
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
        {(session) => (
          <ErrorBoundary
            title='Oh snap! Login failed 😱'
            text={
              'Something went wrong with your login, probably your session is just expired. We will try to log you in again.'
            }
            buttonLabel='Login again'
            callback={() => navigate('/login')}
          >
            <AccessCheck jwt={session.jwt}>
              <WebsocketConnection>
                {() => <ShareDBAuth {...session}>{children}</ShareDBAuth>}
              </WebsocketConnection>
            </AccessCheck>
          </ErrorBoundary>
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
