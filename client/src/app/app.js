import React from 'react'
import { Router } from '@reach/router'

import ErrorBoundary from '../components/error-boundary'
import { SessionConsumer, BackendConnection } from '../components/session'

import ClickerList from './routes/clicker-list'
import Clicker from './routes/clicker'
import ClickerForm from './routes/clicker-form'

export default class App extends React.Component {
  render () {
    return (
      <SessionConsumer>
        {session => (
          <BackendConnection>
            {({ connection }) => (
              <ErrorBoundary title={'Something went wrong 🤕'}>
                <Router basepath='/app' style={{ display: 'flex', flex: 1 }}>
                  <ClickerList
                    path='/'
                    connection={connection}
                    session={session}
                  />
                  <Clicker path='/clickers/:docId' connection={connection} />
                  <ClickerList
                    path='/private'
                    showPrivate
                    connection={connection}
                    session={session}
                  />
                  <ClickerForm path='/add' connection={connection} />
                </Router>
              </ErrorBoundary>
            )}
          </BackendConnection>
        )}
      </SessionConsumer>
    )
  }
}
