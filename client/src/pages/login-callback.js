import React from 'react'
import propTypes from 'prop-types'
import { navigate } from 'gatsby'

import { SessionProvider, SessionConsumer } from '../components/session'
import {
  getAccessToken,
  setAccessToken,
  setIdToken
} from '../utils/auth-service'

class LoginCallbackHandler extends React.PureComponent {
  static propTypes = {
    jwt: propTypes.string.isRequired,
    setJWT: propTypes.func.isRequired
  }
  componentDidMount () {
    const { setJWT, jwt } = this.props
    setJWT(jwt)
    navigate('/app')
  }
  render () {
    return null
  }
}

export default class LoginCallback extends React.PureComponent {
  state = {}
  componentDidMount () {
    if (!/[#&]access_token=([^&]+)/.test(window.location.hash)) {
      navigate('/')
    }

    setAccessToken()
    setIdToken()

    const jwt = getAccessToken()

    this.setState({
      jwt
    })
  }
  render () {
    const { jwt } = this.state
    if (!jwt) {
      return null
    }
    return (
      <SessionProvider>
        <SessionConsumer>
          {({ setJWT }) =>
            jwt && <LoginCallbackHandler jwt={jwt} setJWT={setJWT} />
          }
        </SessionConsumer>
      </SessionProvider>
    )
  }
}
