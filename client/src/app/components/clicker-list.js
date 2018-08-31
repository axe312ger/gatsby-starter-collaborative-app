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

import ProgressIndicator from '../../components/progress-indicator'
import AppLayout from '../components/app-layout'

export default class ClickerList extends React.PureComponent {
  static propTypes = {
    connection: propTypes.object.isRequired,
    session: propTypes.object.isRequired,
    showPrivate: propTypes.bool
  }
  static defaultProps = {
    showPrivate: false
  }
  state = {
    error: null,
    clickers: null
  }
  constructor (props) {
    super(props)

    const { connection, session, showPrivate } = props

    const queryParams = {
      $sort: { private: 1, numClicks: -1 }
    }
    if (showPrivate) {
      queryParams.$or = [
        { private: false },
        showPrivate ? { ownerSub: session.sub } : undefined
      ]
    } else {
      queryParams.private = false
    }

    const query = connection.createFetchQuery('examples', queryParams)
    query.on('ready', () => this.setState({ clickers: query.results }))
    query.on('error', (error) => this.setState({ error }))
  }
  componentDidUpdate (prevProps) {
    if (this.state.error) {
      throw this.state.error
    }
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
    const Clickers = clickers.map((clickerDoc, index) => {
      const { id, data } = clickerDoc
      const { name, numClicks, private: prvt } = data
      return (
        <div key={clickerDoc.id}>
          <ListItem component={Link} to={`/app/clickers/${id}`}>
            <ListItemIcon>{prvt ? <LockIcon /> : <GroupIcon />}</ListItemIcon>
            <ListItemText>{`${name} with ${numClicks} clicks`}</ListItemText>
          </ListItem>
          {index < clickers.length - 1 && <Divider />}
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
