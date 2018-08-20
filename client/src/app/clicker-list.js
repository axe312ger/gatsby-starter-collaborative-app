import React from 'react'
import propTypes from 'prop-types'
import { Link } from 'gatsby'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import LockIcon from '@material-ui/icons/Lock'
import GroupIcon from '@material-ui/icons/Group'

import ProgressIndicator from '../components/progress-indicator'
import AppLayout from './app-layout'

class ClickerList extends React.Component {
  static propTypes = {
    connection: propTypes.object.isRequired,
    session: propTypes.object.isRequired
  }
  state = {
    error: null,
    clickers: null
  }
  componentDidUpdate () {
    if (this.state.error) {
      throw this.state.error
    }
  }
  componentDidMount () {
    const { connection, session } = this.props
    const query = connection.createFetchQuery('examples', {
      $or: [{ private: false }, { ownerSub: session.sub }],
      $sort: { private: 1, numClicks: -1 }
    })
    query.on('ready', () => this.setState({ clickers: query.results }))
    query.on('error', error => this.setState({ error }))
  }
  render () {
    const { clickers } = this.state
    if (!clickers) {
      return (
        <AppLayout>
          <ProgressIndicator text='Loading Clickers...' />
        </AppLayout>
      )
    }
    const Clickers = clickers.map(clickerDoc => {
      const { id, data } = clickerDoc
      const { name, numClicks, private: prvt } = data
      return (
        <div key={clickerDoc.id}>
          <ListItem component={Link} to={`/app/clickers/${id}`}>
            <ListItemIcon>{prvt ? <LockIcon /> : <GroupIcon />}</ListItemIcon>
            <ListItemText>{`${name} with ${numClicks} clicks`}</ListItemText>
          </ListItem>
          <Divider />
        </div>
      )
    })
    return (
      <AppLayout>
        <List>{Clickers}</List>
      </AppLayout>
    )
  }
}

export default ClickerList
