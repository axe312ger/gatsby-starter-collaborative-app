import React from 'react'
import { push } from 'gatsby'
import propTypes from 'prop-types'

import Layout from '../components/Layout'

import { login } from '../utils/api/auth-service'
import { SessionConsumer } from '../utils/api/session'

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
