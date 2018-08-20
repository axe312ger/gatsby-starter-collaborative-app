import React from 'react'
import { Router } from '@reach/router'

import ErrorBoundary from '../components/error-boundary'
import { BackendConnection } from '../components/session'

import ClickerList from './clicker-list'
import Clicker from './clicker'
import ClickerForm from './clicker-form'

export default class App extends React.Component {
  render () {
    return (
      <BackendConnection>
        {({ connection }) => (
          <ErrorBoundary title={'Something went wrong 🤕'}>
            <Router basepath='/app' style={{ display: 'flex', flex: 1 }}>
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
