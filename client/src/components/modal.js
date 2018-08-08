import React from 'react'
import propTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'

class ResponsiveDialog extends React.Component {
  static defaultProps = { buttonLabel: 'Continue', text: null }
  static propTypes = {
    fullScreen: propTypes.bool.isRequired,
    callback: propTypes.func,
    title: propTypes.string.isRequired,
    text: propTypes.string,
    buttonLabel: propTypes.string
  }
  state = {
    open: true
  }

  handleClose = () => {
    this.setState({ open: false })
    if (this.props.callback) {
      this.props.callback()
    }
  }

  render () {
    const { fullScreen, title, text, buttonLabel } = this.props
    const { open } = this.state

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={this.handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>{title}</DialogTitle>
        {text && (
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={this.handleClose} color='primary' autoFocus>
            {buttonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(ResponsiveDialog)
