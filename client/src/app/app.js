import React from 'react'
import propTypes from 'prop-types'
import { Router } from '@reach/router'

import { withStyles } from '@material-ui/core/styles'

import ErrorBoundary from '../components/error-boundary'
import { BackendConnection } from '../components/session'

import AppLayout from './app-layout'
import ClickerList from './clicker-list'
import Clicker from './clicker'
import ClickerForm from './clicker-form'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

class App extends React.Component {
  static propTypes = {
    classes: propTypes.object.isRequired
  }
  render () {
    const { classes } = this.props

    return (
      <BackendConnection>
        {({ connection }) => (
          <ErrorBoundary>
            <AppLayout>
              <div className={classes.root}>
                <Router basepath='/app'>
                  <Clicker path='/clickers/:docId' connection={connection} />
                  <ClickerList path='/' connection={connection} />
                  <ClickerForm path='/add' connection={connection} />
                </Router>
              </div>
            </AppLayout>
          </ErrorBoundary>
        )}
      </BackendConnection>
    )
  }
}

export default withStyles(styles)(App)
