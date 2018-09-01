import React from 'react'
import propTypes from 'prop-types'

import ClickerList from '../components/ClickerList'

export default class ClickersPublic extends React.PureComponent {
  static propTypes = {
    connection: propTypes.object.isRequired,
    session: propTypes.object.isRequired
  }
  render () {
    const { connection, session } = this.props
    return <ClickerList connection={connection} session={session} />
  }
}
