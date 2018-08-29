import React from 'react'
import { Router } from '@reach/router'

import ErrorBoundary from '../components/error-boundary'
import { SessionConsumer, BackendConnection } from '../components/session'

import ClickersPublic from './routes/clickers-public'
import ClickersPrivate from './routes/clickers-private'
import Clicker from './routes/clicker'
import ClickerForm from './routes/clicker-form'

export default class App extends React.PureComponent {
  render () {
    return (
      <SessionConsumer>
        {session => (
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
