import React from 'react'
import propTypes from 'prop-types'
import { push } from 'gatsby-link'
import sharedb from 'sharedb/lib/client'

import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

import Modal from './modal'
import { getAccessToken, clearAccessToken } from '../utils/AuthService'

export const SessionContext = React.createContext()

const styles = {
  progress: {
    textAlign: 'center',
    marginTop: '30vh'
  }
}

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
      throw new Error('You are not logged in')
    }
  }
  render () {
    return this.props.jwt ? this.props.children : null
  }
}

class WebsocketConnection extends React.PureComponent {
  static propTypes = {
    children: propTypes.func.isRequired,
    classes: propTypes.object.isRequired
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
    const { progress } = this.props.classes
    if (!this.state.connected) {
      if (this.state.connecting) {
        return (
          <div className={progress}>
            <CircularProgress />
            <p>Preparing web socket connection...</p>
          </div>
        )
      }
      return 'Not connected to web socket connection'
    }

    return this.props.children(this.state)
  }
}

const WebsocketConnectionWithStyles = withStyles(styles)(WebsocketConnection)

class ShareDBAuth extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired,
    jwt: propTypes.string.isRequired,
    setJWT: propTypes.func.isRequired,
    classes: propTypes.object.isRequired
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

    socket.onmessage = message => {
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
      setJWT(null)
      throw this.state.error
    }
  }
  render () {
    const { progress } = this.props.classes
    return this.state.authentificated ? (
      this.props.children
    ) : (
      <>
        <div className={progress}>
          <CircularProgress />
          <p>Preparing login...</p>
        </div>
      </>
    )
  }
}

const ShareDBAuthWithStyles = withStyles(styles)(ShareDBAuth)

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired
  }
  state = {
    error: null,
    info: null
  }
  componentDidCatch (error, info) {
    this.setState({ error, info })
  }
  shouldComponentUpdate (newProps, newState) {
    if (
      newProps.children !== this.props.children ||
      newState.error !== this.state.error
    ) {
      return true
    }
    return false
  }
  render () {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      return (
        <Modal
          title='Oh snap! Login failed 😱'
          text={`Something went wrong with your login, probably your session is just expired. We will try to log you in again. (${
            error.message
          })`}
          callback={() => push('/login')}
        />
      )
    }
    return children
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
          <ErrorBoundary>
            <AccessCheck jwt={session.jwt}>
              <WebsocketConnectionWithStyles>
                {() => (
                  <ShareDBAuthWithStyles {...session}>
                    {children}
                  </ShareDBAuthWithStyles>
                )}
              </WebsocketConnectionWithStyles>
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
