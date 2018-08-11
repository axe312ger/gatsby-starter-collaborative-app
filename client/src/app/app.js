import React from 'react'
import { Router } from '@reach/router'

import ErrorBoundary from '../components/error-boundary'

import ClickerList from './clicker-list'
import Clicker from './clicker'
import ClickerForm from './clicker-form'

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
              <ClickerForm path='/add' connection={connection} />
            </Router>
          </ErrorBoundary>
        )}
      </BackendConnection>
    )
  }
}
