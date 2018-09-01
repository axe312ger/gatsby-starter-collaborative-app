import React from 'react'
import propTypes from 'prop-types'

import { getAccessToken, getUserSub } from './auth-service'

export const SessionContext = React.createContext()

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
