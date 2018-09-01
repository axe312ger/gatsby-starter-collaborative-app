import React from 'react'
import { Router } from '@reach/router'

import ErrorBoundary from '../components/ErrorBoundary'
import { SessionConsumer, BackendConnection } from '../components/session'

import ClickersPublic from './routes/ClickersPublic'
import ClickersPrivate from './routes/ClickersPrivate'
import Clicker from './routes/Clicker'
import ClickerForm from './routes/ClickerForm'

export default class App extends React.PureComponent {
  render () {
    return (
      <SessionConsumer>
        {(session) => (
          <BackendConnection>
            {({ connection }) => (
              <ErrorBoundary title={'Something went wrong 🤕'}>
                <Router basepath='/app'>
                  <ClickersPrivate
                    path='/private/*'
                    connection={connection}
                    session={session}
                  />
                  <ClickersPublic
                    path='/*'
                    connection={connection}
                    session={session}
                  />
                  <Clicker path='/clickers/:docId' connection={connection} />
                </Router>
                <Router basepath='/app'>
                  <ClickerForm path='/add' connection={connection} />
                  <ClickerForm
                    path='/private/add'
                    createPrivate
                    connection={connection}
                  />
                </Router>
              </ErrorBoundary>
            )}
          </BackendConnection>
        )}
      </SessionConsumer>
    )
  }
}
