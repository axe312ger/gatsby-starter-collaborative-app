import React from 'react'
import { Router } from '@reach/router'
import propTypes from 'prop-types'
import { Link } from 'gatsby'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import TouchAppIcon from '@material-ui/icons/TouchApp'

import Clicker from './clicker'

import { BackendConnection } from '../components/session'
import Modal from '../components/modal'

class ClickerList extends React.Component {
  static propTypes = {
    connection: propTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = { clickers: [] }
  }
  componentDidMount () {
    const { connection } = this.props
    const query = connection.createFetchQuery('examples', {
      // numClicks: 137 @todo scope by subscription
    })
    query.on('ready', () => this.setState({ clickers: query.results }))
    query.on('error', err => alert(err.message))
  }
  render () {
    const clickers = this.state.clickers.map(clickerDoc => {
      return (
        <div key={clickerDoc.id}>
          <ListItem component={Link} to={`/app/clickers/${clickerDoc.id}`}>
            <ListItemIcon>
              <TouchAppIcon />
            </ListItemIcon>
            <ListItemText>
              {`${clickerDoc.id} with ${clickerDoc.data.numClicks} clicks`}
            </ListItemText>
          </ListItem>
          <Divider />
        </div>
      )
    })
    return (
      <>
        <h1>Your Clickers:</h1>
        <List>{clickers}</List>
      </>
    )
  }
}

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired
  }
  state = {
    error: null,
    info: null
  }
  componentDidCatch (error, info) {
    this.setState({ error, info })
  }
  shouldComponentUpdate (newProps, newState) {
    if (
      newProps.children !== this.props.children ||
      newState.error !== this.state.error
    ) {
      return true
    }
    return false
  }
  render () {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      return (
        <Modal
          title='Oh snap! Something went wrong 😱'
          text={error.message}
          buttonLabel='Reload and 🤞'
          callback={() => location.reload()}
        />
      )
    }
    return children
  }
}

export default class App extends React.Component {
  render () {
    return (
      <BackendConnection>
        {({ connection }) => (
          <ErrorBoundary>
            <Router basepath='/app'>
              <Clicker path='/clickers/:docId' connection={connection} />
              <ClickerList path='/' connection={connection} />
            </Router>
          </ErrorBoundary>
        )}
      </BackendConnection>
    )
  }
}
