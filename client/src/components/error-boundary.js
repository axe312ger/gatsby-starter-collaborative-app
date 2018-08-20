import React from 'react'
import propTypes from 'prop-types'
import Modal from '../components/modal'

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    title: propTypes.string,
    text: propTypes.string,
    callback: propTypes.func
  }
  static defaultProps = {
    title: 'Oh snap! Something went wrong 😱',
    callback: () => location.reload()
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
    const { children, title, text, callback } = this.props

    if (error) {
      const message = text ? `${text} (${error.message})` : error.message

      return (
        <Modal
          title={title}
          text={message}
          buttonLabel='Reload and 🤞'
          callback={callback}
        />
      )
    }
    return children
  }
}

export default ErrorBoundary
