import React from 'react'
import { Router } from '@reach/router'

import ClickerList from './clicker-list'
import Clicker from './clicker'
import ErrorBoundary from '../components/error-boundary'

import { BackendConnection } from '../components/session'

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
