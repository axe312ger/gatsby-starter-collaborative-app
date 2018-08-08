import React from 'react'
import { Redirect } from 'react-router-dom'
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
      login()
    }
  }
  componentWillUpdate () {
    this.redirectIfNoToken()
  }
  render () {
    if (!this.props.jwt) {
      return null
    }
    return <Redirect to='/app' />
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
