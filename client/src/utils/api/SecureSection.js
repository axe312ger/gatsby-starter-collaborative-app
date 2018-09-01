import React from 'react'
import propTypes from 'prop-types'
import { navigate } from 'gatsby'
import sharedb from 'sharedb/lib/client'

import ErrorBoundary from '../../components/ErrorBoundary'
import ProgressIndicator from '../../components/ProgressIndicator'
import { clearAccessToken, clearIdToken } from './auth-service'

import { SessionConsumer } from './session'

let socket = null

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
    const { jwt, children } = this.props
    return jwt ? children : null
  }
}

class WebsocketConnection extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired
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
      this.setState({ connecting: false, connected: true, socket })
    }
    socket.onclose = () => {
      this.setState({ connected: false })
    }
  }

  render () {
    const { children } = this.props
    const { connected, connecting } = this.state
    if (!connected) {
      if (connecting) {
        return <ProgressIndicator text='Preparing web socket connection...' />
      }
      return 'Not connected to web socket connection'
    }

    return children
  }
}

class ShareDBAuth extends React.PureComponent {
  static propTypes = {
    children: propTypes.func.isRequired,
    jwt: propTypes.string.isRequired,
    setJWT: propTypes.func.isRequired
  }
  state = {
    error: null,
    connection: null
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
        const connection = new sharedb.Connection(socket)
        this.setState({ connection })
        return
      }
      if (data.type === 'auth_error') {
        this.setState({ error: new Error(data.name), connection: null })
      }
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
    const { connection } = this.state
    const { children } = this.props
    return connection ? (
      children({ connection })
    ) : (
      <ProgressIndicator text='Logging you in...' />
    )
  }
}

export default class SecureSection extends React.PureComponent {
  static propTypes = {
    children: propTypes.func.isRequired
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
                <ShareDBAuth {...session}>
                  {({ connection }) => children({ connection })}
                </ShareDBAuth>
              </WebsocketConnection>
            </AccessCheck>
          </ErrorBoundary>
        )}
      </SessionConsumer>
    )
  }
}
