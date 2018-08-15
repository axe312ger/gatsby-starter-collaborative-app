import React from 'react'
import propTypes from 'prop-types'
import Modal from '../components/modal'

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    title: propTypes.string
  }
  static defaultProps = {
    title: 'Oh snap! Something went wrong 😱'
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
    const { children, title } = this.props
    if (error) {
      return (
        <>
          {children}
          <Modal
            title={title}
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
