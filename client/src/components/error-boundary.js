import React from 'react'
import propTypes from 'prop-types'
import Modal from '../components/modal'

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
        <>
          {children}
          <Modal
            title='Oh snap! Something went wrong 😱'
            text={error.message}
            buttonLabel='Reload and 🤞'
            callback={() => location.reload()}
          />
        </>
      )
    }
    return children
  }
}

export default ErrorBoundary
