import React from 'react'
import propTypes from 'prop-types'

import ClickerList from '../components/clicker-list'

export default class ClickersPrivate extends React.PureComponent {
  static propTypes = {
    connection: propTypes.object.isRequired,
    session: propTypes.object.isRequired
  }
  render () {
    const { connection, session } = this.props
    return <ClickerList showPrivate connection={connection} session={session} />
  }
}
