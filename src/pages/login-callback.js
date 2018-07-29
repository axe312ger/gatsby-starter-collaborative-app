import React from 'react'
import propTypes from 'prop-types'
import { push } from 'gatsby-link'

import { SessionProvider, SessionConsumer } from '../components/session'
import { getAccessToken, setAccessToken } from '../utils/AuthService'

class LoginCallbackHandler extends React.PureComponent {
  static propTypes = {
    jwt: propTypes.string.isRequired,
    setJWT: propTypes.func.isRequired
  }
  componentDidMount () {
    const { setJWT, jwt } = this.props
    setJWT(jwt)
    push('/login')
  }
  render () {
    return null
  }
}

export default class LoginCallback extends React.PureComponent {
  state = {}
  componentDidMount () {
    if (!/[#&]access_token=([^&]+)/.test(window.location.hash)) {
      push('/')
    }

    setAccessToken()
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
