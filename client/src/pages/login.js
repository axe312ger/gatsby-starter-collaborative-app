import React from 'react'
import { push } from 'gatsby'
import propTypes from 'prop-types'

import { SessionConsumer } from '../components/session'
import { login } from '../utils/AuthService'
import Layout from '../components/layout'

class LoginHandler extends React.PureComponent {
  static propTypes = {
    jwt: propTypes.string
  }
  componentDidMount () {
    this.redirectIfNoToken()
  }
  redirectIfNoToken () {
    const { jwt } = this.props
    if (!jwt) {
      return login()
    }
    return push('/app')
  }
  componentWillUpdate () {
    this.redirectIfNoToken()
  }
  render () {
    return null
  }
}

export default class LoginPage extends React.PureComponent {
  render () {
    return (
      <Layout>
        <SessionConsumer>
          {({ jwt }) => <LoginHandler jwt={jwt} />}
        </SessionConsumer>
      </Layout>
    )
  }
}
