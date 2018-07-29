import React from 'react'
import { Route, Switch } from 'react-router-dom'
import propTypes from 'prop-types'
import { Link } from 'gatsby'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import TouchAppIcon from '@material-ui/icons/TouchApp'

import Counter from './counter'

import { BackendConnection } from '../components/session'

class CounterList extends React.Component {
  static propTypes = {
    connection: propTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = { counters: [] }
  }
  componentDidMount () {
    const { connection } = this.props
    const query = connection.createFetchQuery('examples', {
      // numClicks: 137 @todo scope by subscription
    })
    query.on('ready', () => this.setState({ counters: query.results }))
    query.on('error', err => alert(err.message))
  }
  render () {
    const counters = this.state.counters.map(counterDoc => {
      return (
        <div key={counterDoc.id}>
          <ListItem component={Link} to={`/app/counters/${counterDoc.id}`}>
            <ListItemIcon>
              <TouchAppIcon />
            </ListItemIcon>
            <ListItemText>
              {`${counterDoc.id} with ${counterDoc.data.numClicks} clicks`}
            </ListItemText>
          </ListItem>
          <Divider />
        </div>
      )
    })
    return (
      <>
        <h1>Your Counters:</h1>
        <List>{counters}</List>
      </>
    )
  }
}

export default class App extends React.Component {
  render () {
    return (
      <BackendConnection>
        {({ connection }) => (
          <Switch>
            <Route
              path='/app/counters/:docId'
              render={route => (
                <Counter
                  connection={connection}
                  docId={route.match.params.docId}
                />
              )}
            />
            <Route
              path='/app'
              render={() => <CounterList connection={connection} />}
            />
          </Switch>
        )}
      </BackendConnection>
    )
  }
}
